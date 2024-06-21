import Message from '../models/Message.js'; // Import Message model for database operations

export async function sendMessage(req, res) {
  const { senderId, receiverId, content } = req.body; // Destructure request body to get message details

  try {
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    }); // Create a new message with the provided details

    await message.save(); // Save the new message to the database

    res.status(201).json({ message }); // Return the saved message
  } catch (error) {
    console.error(error); // Log any errors that occur
    res.status(500).json({ error: 'Server error' }); // Return server error response
  }
}

export async function getMessages(req, res) {
  const { userId } = req.params; // Get userId from request parameters

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, receiver: userId }, // Find messages sent by the authenticated user to the specified user
        { sender: userId, receiver: req.user.userId } // Find messages sent by the specified user to the authenticated user
      ]
    }); // Fetch messages between the authenticated user and the specified user

    res.json({ data: { messages: messages } }); // Return the fetched messages
  } catch (error) {
    console.error(error); // Log any errors that occur
    res.status(500).json({ error: 'Server error' }); // Return server error response
  }
}
