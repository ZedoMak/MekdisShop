require('dotenv').config();

const express = require('express');
const {connectDB, closeDB} = require('./config/db.js');
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


async function startServer(){
    try{

        await connectDB();

        app.use('/api/products', productRoutes);
        app.use('/api/users', userRoutes);
        app.get('/', (req, res) => {
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