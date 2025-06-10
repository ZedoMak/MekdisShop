const jwt = require('jsonwebtoken');
const { client } = require('../config/db');
const { ObjectId } = require('mongodb');

const dbName = process.env.MONGODB_DATABASE || 'MekdisShopDB';
const usersCollectionName = 'users';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const db = client.db(dbName);

      req.user = await db.collection(usersCollectionName).findOne(
        { _id: new ObjectId(decoded.id) },
        { projection: { password: 0 } } 
      );

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


const admin = (req, res, next) => {
    
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
