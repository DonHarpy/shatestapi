// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Configure bodyParser middleware to parse JSON
app.use(bodyParser.json());

// Connect to MongoDB database using Mongoose
mongoose.connect('mongodb://localhost:27017/login_demo', {
// useNewUrlParser: true,
// useUnifiedTopology: true,
});

// Define User schema
const UserSchema = new mongoose.Schema({
username: String,
password: String,
});

// Define User model
const User = mongoose.model('User', UserSchema);

// POST endpoint for user registration
app.post('/register', async (req, res) => {
try {
    const { username, password } = req.body;
    // Check if the username is already registered
    const existingUser = await User.findOne({ username });
    if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
    }
    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}
});

// POST endpoint for user login
app.post('/login', async (req, res) => {
try {
    const { username, password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
    // Check if the password is correct
    if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid password' });
    }
    // If both username and password are correct, return success
    res.status(200).json({ message: 'Login successful' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`);
});
