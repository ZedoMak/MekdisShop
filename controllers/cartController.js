const { client } = require('../config/db');
const { ObjectId } = require('mongodb');

const dbName = process.env.MONGODB_DATABASE || 'MekdisShopDB';
const cartsCollectionName = 'carts';
const productsCollectionName = 'products';

exports.getCart = async (req, res) => {
    try {
        const db = client.db(dbName);
        const cart = await db.collection(cartsCollectionName).findOne({ userId: req.user._id });

        if (!cart) {
            
            return res.status(200).json({
                _id: null,
                userId: req.user._id,
                items: [],
                totalPrice: 0
            });
        }

      
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const db = client.db(dbName);

        // 1. Get the product details from the products collection
        const product = await db.collection(productsCollectionName).findOne({ _id: new ObjectId(productId) });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 2. Find the user's cart
        let cart = await db.collection(cartsCollectionName).findOne({ userId: userId });

        if (cart) {
            // Cart exists, check if product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                // Product exists in cart, update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Product does not exist in cart, add new item
                cart.items.push({
                    productId: new ObjectId(productId),
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    imageUrl: product.imageUrl
                });
            }

            // Update the cart in the database
            await db.collection(cartsCollectionName).updateOne(
                { _id: cart._id },
                { $set: { items: cart.items, updatedAt: new Date() } }
            );

        } else {
            // No cart for user, create a new one
            const newCart = {
                userId: userId,
                items: [{
                    productId: new ObjectId(productId),
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    imageUrl: product.imageUrl
                }],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            cart = (await db.collection(cartsCollectionName).insertOne(newCart)).ops[0];
        }

        // Fetch the final state of the cart to return
        const updatedCart = await db.collection(cartsCollectionName).findOne({ userId: userId });
        updatedCart.totalPrice = updatedCart.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        res.status(200).json(updatedCart);

    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};