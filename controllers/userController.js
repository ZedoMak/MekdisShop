const { client } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb'); 

const dbName = process.env.MONGODB_DATABASE || 'MekdisShopDB'; 
const usersCollectionName = 'users';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Please provide a valid email' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const db = client.db(dbName);
    const usersCollection = db.collection(usersCollectionName);

    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); 

    const newUser = {
      name,
      email: email.toLowerCase(), 
      password: hashedPassword,
      isAdmin: false, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    if (result.acknowledged && result.insertedId) {
      const token = generateToken(result.insertedId.toString());
      res.status(201).json({
        _id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: token,
      });
    } else {
      throw new Error('User registration failed during database insertion.');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error during user registration' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const db = client.db(dbName);
    const usersCollection = db.collection(usersCollectionName);
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id.toString());
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: token,
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error during user login' });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};


exports.getAllUsers = async (req, res) => {
    try {
        const db = client.db(dbName);
        const users = await db.collection(usersCollectionName)
                              .find({}, { projection: { password: 0 } })
                              .toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


