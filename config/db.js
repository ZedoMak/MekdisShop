const {MongoClient, ServerApiVersion} = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/MekdisShop";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    
    }
});

async function connectDB(){
    try{
        await client.connect();
        await client.db("admin").command({ ping: 1});
        console.log("pinged successfully to MongoDB server");
        return client.db();
    } catch (err) {
        console.error("Failed to connect to mongoDB", err);
        process.exit(1);
    }
}

async function closeDB(){
    try{
        await client.close();
        console.log("mongoDB connection closed.")
    } catch(err){
        console.error("Failed to close MongoDB connection", err);
    }
}

module.exports = {connectDB, closeDB, client };