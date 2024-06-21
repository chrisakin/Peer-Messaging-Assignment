import { Server } from 'socket.io'; // Import Socket.IO Server
import jwt from 'jsonwebtoken'; // Import JWT library for token verification
import User from '../models/User.js'; // Import User model for database operations
import Message from '../models/Message.js'; // Import Message model for database operations
import { JWT_SECRET } from '../config.js'; // Import JWT secret from configuration

let io; // Declare a variable to hold the Socket.IO instance

export function initializeSocket(server) {
  io = server; // Assign the server instance to the io variable

  io.use((socket, next) => {
    const token = socket.handshake.auth.token; // Get the token from socket handshake authentication
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decoded) => { // Verify the token using the secret key
        if (err) {
          console.log(err);
          return next(new Error('Authentication error')); // Return error if token verification fails
        }
        socket.user = decoded; // Attach the decoded user information to the socket object
        next(); // Proceed to the next middleware
      });
    } else {
      next(new Error('Authentication error')); // Return error if no token is provided
    }
  });

  io.on('connection', async (socket) => {
    console.log('New client connected:', socket.id); // Log new client connection

    const user = await User.findByIdAndUpdate(socket.user.userId, { online: true, socketId: socket.id }); // Update user status to online and save socket ID
    if (user) {
      io.emit('userOnline', user._id); // Emit userOnline event to all connected clients
    }

    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id); // Log client disconnection
      const user = await User.findOneAndUpdate({ socketId: socket.id }, { online: false }); // Update user status to offline
      if (user) {
        io.emit('userOffline', user._id); // Emit userOffline event to all connected clients
      }
    });

    socket.on('sendMessage', async ({ receiverId, content }) => {
      const message = new Message({
        sender: socket.user.userId,
        receiver: receiverId,
        content,
        timestamp: new Date()
      }); // Create a new message with the provided details
      await message.save(); // Save the new message to the database

      const receiver = await User.findById(receiverId); // Find the receiver user
      if (receiver && receiver.online && receiver.socketId) {
        io.to(receiver.socketId).emit('receiveMessage', message); // Emit receiveMessage event to the receiver
      }
      const sender = await User.findById(socket.user.userId); // Find the sender user
      if (sender && sender.online && sender.socketId) {
        io.to(sender.socketId).emit('receiveMessage', message); // Emit receiveMessage event to the sender
      }
    });

    socket.on('readMessage', async (user) => {
      const filter = {
        sender: user._id,
        receiver: socket.user.userId,
        read: false
      }; // Filter to find unread messages

      const update = {
        $set: {
          read: true
        }
      }; // Update to set messages as read
      const result = await Message.updateMany(filter, update); // Update messages in the database
      result.modifiedCount; // Log the number of modified messages
    });
  });

  return io; // Return the io instance
}

export const getIoInstance = () => io; // Export function to get the io instance
