import { Schema, model } from 'mongoose';
//Mongodb schema to store users
const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  online: { type: Boolean, default: true },
  createdAt: { type: Date, default: new Date() },
  lastMessageDate: { type: Date, default: new Date() },
  lastMessage: { type: String },
  socketId: { type: String }
});

// Add indexes for faster query of the database
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

export default model('User', userSchema);
