const { client } = require('../config/db');
const { ObjectId } = require('mongodb');

const dbName = process.env.MONGODB_DATABASE || 'MekdisShopDB';
const ordersCollectionName = 'orders';
const cartsCollectionName = 'carts';


exports.createOrder = async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body; // paymentMethod is for future use
    const userId = req.user._id;

    try {
        const db = client.db(dbName);

        // 1. Get the user's cart
        const cart = await db.collection(cartsCollectionName).findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot create order from an empty cart.' });
        }

        // 2. Calculate total amount
        const totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        // 3. Create the order object
        const order = {
            userId,
            items: cart.items, 
            totalAmount,
            shippingAddress,
            status: 'pending',
            paymentMethod: paymentMethod || 'Simulated Card',
            paymentResult: { 
                id: new ObjectId().toString(),
                status: 'succeeded',
                update_time: new Date().toISOString(),
                email_address: req.user.email
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const createdOrder = await db.collection(ordersCollectionName).insertOne(order);

        await db.collection(cartsCollectionName).updateOne(
            { userId },
            { $set: { items: [], updatedAt: new Date() } }
        );

        res.status(201).json(order);

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const db = client.db(dbName);
        const orders = await db.collection(ordersCollectionName)
                               .find({ userId: req.user._id })
                               .sort({ createdAt: -1 }) 
                               .toArray();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting user orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};