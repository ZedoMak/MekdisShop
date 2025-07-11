const {client} = require('../config/db.js');
const {ObjectId} = require('mongodb');

const dbName = 'MekdisShopDB';
const collectionName = 'products';

exports.createProduct = async (req, res) => {
    try{
        const {name, description, price, category, stockQuantity } = req.body;

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/images/sample.jpg';

        if(!name || !price || !category || !stockQuantity){
            return res.status(400).json({error: 'Please provide name, price, category, and stock quantity'});
        }

        const newProduct = {
            name,
            description,
            price: parseFloat(price),
            category,
            stockQuantity: parseInt(stockQuantity, 10),
            imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const db = client.db(dbName);
        const result = await db.collection(collectionName).insertOne(newProduct);

        if(result.acknowledged){
            res.status(201).json({
                ...newProduct, _id: result.insertedId });
        }
    } catch (error){
        console.error("Error creating product", error);
        res.status(500).json({ message: 'Server error while creating product' });
    }
}

exports.getAllProducts = async (req, res) => {
    try{
        const db = client.db(dbName);
        const products = await db.collection(collectionName).find({}).toArray();
        res.status(200).json(products);
    } catch(error){
        console.error("Error fetching products", error);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try{
        const db = client.db(dbName);
        const productId = req.params.id;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await db.collection(collectionName).findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);


    } catch (error) {
        console.error("Error fetching product by ID", error);
        res.status(500).json({ message: 'Server error while fetching product' });
    }
}


exports.updateProduct = async (req, res) => {
    try {
        const db = client.db(dbName);
        const productId = req.params.id;
        const updateData = req.body; 

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        updateData.updatedAt = new Date();

        if (updateData.price) updateData.price = parseFloat(updateData.price);
        if (updateData.stockQuantity) updateData.stockQuantity = parseInt(updateData.stockQuantity, 10);

        const result = await db.collection(collectionName).updateOne(
            { _id: new ObjectId(productId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await db.collection(collectionName).findOne({ _id: new ObjectId(productId) });
        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error while updating product' });
    }
};


exports.deleteProduct = async (req, res) => {
    try{
        const db = client.db(dbName);
        const productId = req.params.id;

        if(!ObjectId.isValid(productId)){
            return res.status(400).json({ message: 'Invalid Product Id Format' });
        }

        const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(productId) });
        if(result.deletedCount === 0){
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });

    }catch(error){
        console.error("Error deleting product", error);
        res.status(500).json({ message: 'Server error while deleting product' });
    } 
}
 