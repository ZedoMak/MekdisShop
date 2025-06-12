require('dotenv').config();
const path = require('path');

const express = require('express');
const {connectDB, closeDB} = require('./config/db.js');
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static('public'));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


async function startServer(){
    try{

        await connectDB();

        app.use('/api/products', productRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/cart', cartRoutes);
        app.use('/api/orders', orderRoutes);
        app.get('/api', (req, res) => {
            res.send('Hello world from MekdisShop API');
        });

        const server = app.listen(port, ()=>{
            console.log(`MekdisShop server listening at http://localhost:${port}`)
        });

        process.on('SIGINT', async()=> {
            console.log('SIGINT signal received: closing HTTP server and DB connection');
            server.close(async ()=> {
                console.log('HTTP server closed');
                await closeDB();
                process.exit(0);
            });
        });

    } catch(error){
        console.log('Failed to start server', error);
        process.exit(1);
    }
}  

startServer();