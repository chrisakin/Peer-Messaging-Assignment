import jwt from 'jsonwebtoken'; // Import JWT library for token creation
import User from '../models/User.js'; // Import User model for database operations
import { JWT_SECRET } from '../config.js'; // Import JWT secret from configuration
import { getIoInstance } from '../utils/socket.js'; // Import function to get the shared Socket.IO instance

export const signup = async (req, res) => {
  const { email, phone, name } = req.body; // Destructure request body to get user details

  try {
    let user = await User.findOne({ email }); // Check if a user with the given email already exists
    if (user) {
      if(user.email == email && user.phone == phone && user.name == name) { // Check if the user details match exactly
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '5h' }); // Generate JWT token for the existing user
        return res.status(201).json({data: {token: token, id: user._id} }); // Return token and user ID
      } else {
        return res.status(400).json({ error: 'User already exists' }); // Return error if user details do not match
      }
    }

    user = new User({
      email,
      phone,
      name,
    }); // Create a new user with the provided details

    await user.save(); // Save the new user to the database
    

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '5h' }); // Generate JWT token for the new user
    const io = getIoInstance(); // Get the shared io instance
    if (io) {
      io.emit('newUser', { id: user._id, email: user.email, phone: user.phone, name: user.name, online: user.online }); // Emit event to notify about the new user
    }

    res.status(201).json({ data: {token: token, id: user._id} }); // Return token and new user ID
  } catch (error) {
    console.error(error); // Log any errors that occur
    res.status(500).json({ error: 'Server error' }); // Return server error response
  }
};
