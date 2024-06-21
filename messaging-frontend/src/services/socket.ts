import type { UsersData } from '@/types/message.types';
import { io, Socket } from 'socket.io-client';

// Fetching WebSocket server URL from environment variables
const URL = import.meta.env.VITE_APP_API_URL;
let socket: Socket; // Socket instance

// Function to connect to WebSocket server
const connect = (token: string): void => {
  try {
    // Initializing socket connection with specified options
    socket = io(URL, {
      auth: { token }, // Passing authentication token
      autoConnect: false, // Delaying connection until explicitly called
      transports: ['websocket'] // Using WebSocket transport
    });

    // Event listener for connection errors
    socket.on('connect_error', (err: Error) => {
      console.error('Connection error:', err);
    });

    // Initiating connection to server
    socket.connect();
  } catch (error) {
    console.error('Error while connecting to socket:', error);
  }
};

// Function to disconnect from WebSocket server
const disconnect = (): void => {
  try {
    if (socket && socket.connected) {
      socket.disconnect(); // Closing socket connection if connected
    }
  } catch (error) {
    console.error('Error while disconnecting from socket:', error);
  }
};

// Function to send a message via WebSocket
const sendMessage = (message: { receiverId: string, content: string }): void => {
  try {
    socket.emit('sendMessage', message); // Emitting 'sendMessage' event with message data
  } catch (error) {
    console.error('Error while sending message:', error);
  }
};

// Function to mark a message as read via WebSocket
const readMessage = (user: UsersData): void => {
  try {
    socket.emit('readMessage', user); // Emitting 'readMessage' event with user data
  } catch (error) {
    console.error('Error while marking message as read:', error);
  }
};

// Event listener for receiving messages via WebSocket
const onMessage = (callback: (message: any) => void): void => {
  try {
    socket.on('receiveMessage', callback); // Listening for 'receiveMessage' event and invoking callback
  } catch (error) {
    console.error('Error while receiving message:', error);
  }
};

// Event listener for detecting new users via WebSocket
const onNewUser = (callback: (user: any) => void): void => {
  try {
    socket.on('newUser', callback); // Listening for 'newUser' event and invoking callback
  } catch (error) {
    console.error('Error while detecting new user:', error);
  }
};

// Event listener for connection established via WebSocket
const onConnect = (callback: () => void): void => {
  try {
    socket.on('connect', callback); // Listening for 'connect' event and invoking callback
  } catch (error) {
    console.error('Error while connecting:', error);
  }
};

// Event listener for disconnection via WebSocket
const onDisconnect = (callback: () => void): void => {
  try {
    socket.on('disconnect', callback); // Listening for 'disconnect' event and invoking callback
  } catch (error) {
    console.error('Error while disconnecting:', error);
  }
};

// Event listener for user online status via WebSocket
const online = (callback: (message: any) => void): void => {
  try {
    socket.on('userOnline', callback); // Listening for 'userOnline' event and invoking callback
  } catch (error) {
    console.error('Error while handling user online:', error);
  }
};

// Event listener for user offline status via WebSocket
const offline = (callback: (message: any) => void): void => {
  try {
    socket.on('userOffline', callback); // Listening for 'userOffline' event and invoking callback
  } catch (error) {
    console.error('Error while handling user offline:', error);
  }
};

// Exporting socketService functions as an object
export default {
  connect,
  disconnect,
  sendMessage,
  onMessage,
  onConnect,
  onDisconnect,
  onNewUser,
  online,
  offline,
  readMessage
};
