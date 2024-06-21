import jwt from 'jsonwebtoken'; // Import JWT library for token verification
import { JWT_SECRET } from '../config.js'; // Import JWT secret from configuration

const jwtAuthMiddleWare = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Get the token from the request header
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from the header
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' }); // Return 401 if no token is provided
  }

  try {
    const secretKey = JWT_SECRET; // Define the secret key for JWT verification
    const decoded = jwt.verify(token, secretKey); // Verify the token using the secret key

    req.user = decoded; // Attach the decoded user information to the request object

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' }); // Return 400 if token verification fails
  }
};

export default jwtAuthMiddleWare; // Export the middleware function
