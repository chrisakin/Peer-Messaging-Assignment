import express from 'express'; // Import Express framework
import http from 'http'; // Import HTTP module
import { Server as socketio } from 'socket.io'; // Import Socket.IO
import bodyParser from 'body-parser'; // Import body-parser for parsing request bodies
import connectWithRetry from './utils/db.js'; // Import the database connection function
import authRoutes from './routes/authRoutes.js'; // Import authentication routes
import messageRoutes from './routes/messageRoutes.js'; // Import message routes
import usersRoutes from './routes/usersRoutes.js'; // Import user routes
import { initializeSocket } from './utils/socket.js'; // Import socket initialization function
import jwtAuthMiddleWare from './middleware/jwt.js'; // Import JWT authentication middleware
import { PORT } from './config.js'; // Import the server port from configuration
import cors from 'cors'; // Import CORS middleware

const app = express(); // Create an Express application
const server = http.createServer(app); // Create an HTTP server with the Express app
const io = new socketio(server, {
  cors: {
    origin: '*', // Allow all origins (replace with your frontend URL in production)
    methods: ['GET', 'POST'], // Allow GET and POST methods
    allowedHeaders: ['Content-Type'], // Allow Content-Type header
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }
});

app.use(cors()); // Enable CORS for all routes
initializeSocket(io); // Initialize Socket.IO with the server

app.use(bodyParser.json()); // Use body-parser middleware to parse JSON request bodies
app.use('/api/auth', authRoutes); // Use authentication routes under /api/auth
app.use('/api/messages', jwtAuthMiddleWare, messageRoutes); // Use message routes under /api/messages with JWT middleware
app.use('/api/users', jwtAuthMiddleWare, usersRoutes); // Use user routes under /api/users with JWT middleware

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log server start
  });
};

connectWithRetry()
  .then(startServer) // Start the server if the database connection is successful
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message); // Log any database connection errors
    process.exit(1); // Exit the process with a failure code
  });

export default app; // Export the Express app
