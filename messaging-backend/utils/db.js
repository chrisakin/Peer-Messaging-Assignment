import mongoose from 'mongoose';
import { MONGODB_URI } from '../config.js';
//Connect the application to mongodb database using mongoose with retry functionality
const { connect } = mongoose;

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

let retries = 0;

const connectWithRetry = () => {
  return new Promise((resolve, reject) => {
    const attemptConnection = () => {
      console.log('Attempting to connect to MongoDB...');
      connect(MONGODB_URI)
        .then(() => {
          console.log('MongoDB connected');
          resolve();
        })
        .catch(err => {
          console.error(`MongoDB connection error: ${err.message}`);
          retries += 1;
          if (retries >= MAX_RETRIES) {
            console.error('Max retries reached. Exiting...');
            reject(new Error('Max retries reached'));
          } else {
            console.log(`Retrying connection in ${RETRY_INTERVAL / 1000} seconds...`);
            setTimeout(attemptConnection, RETRY_INTERVAL);
          }
        });
    };
    attemptConnection();
  });
};

export default connectWithRetry;
