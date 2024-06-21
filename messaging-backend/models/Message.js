import { Schema, model } from 'mongoose';
//Mongodb schema to store messages
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false },
  read: { type: Boolean, default: false }
});

// Add indexes for faster query of the database
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ timestamp: -1 });

export default model('Message', messageSchema);
