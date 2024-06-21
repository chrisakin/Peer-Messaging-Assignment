import User from '../models/User.js'; // Import User model for database operations
import { Types } from 'mongoose'; // Import Types from mongoose for handling ObjectId

export async function getAllUsers(req, res) {
  try {
    const userId = req.user.userId; // Get the authenticated user's ID from the request
    const { search } = req.query; // Get the search query parameter

    let matchCriteria = { _id: { $ne: new Types.ObjectId(userId) } }; // Initial match criteria to exclude the logged-in user

    if (search) {
      matchCriteria = {
        $and: [
          { _id: { $ne: new Types.ObjectId(userId) } }, // Exclude the logged-in user
          {
            $or: [
              { phone: { $regex: new RegExp(search, 'i') } }, // Match phone with search query (case-insensitive)
              { email: { $regex: new RegExp(search, 'i') } }, // Match email with search query (case-insensitive)
            ],
          },
        ],
      }; // Update match criteria if search query is provided
    }

    const users = await User.aggregate([
      { $match: matchCriteria }, // Match all users except the logged-in user

      // Lookup the last message exchanged with the logged-in user
      {
        $lookup: {
          from: 'messages', // From messages collection
          let: { userId: '$_id' }, // Let variable to use in pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $and: [{ $eq: ['$sender', new Types.ObjectId(userId)] }, { $eq: ['$receiver', '$$userId'] }] }, // Match messages from logged-in user to the current user
                    { $and: [{ $eq: ['$sender', '$$userId'] }, { $eq: ['$receiver', new Types.ObjectId(userId)] }] } // Match messages from current user to the logged-in user
                  ]
                }
              }
            },
            { $sort: { timestamp: -1 } }, // Sort messages by timestamp in descending order
            { $limit: 1 } // Limit to the last message
          ],
          as: 'lastMessage' // Output as lastMessage field
        }
      },

      { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } }, // Unwind the lastMessage array

      // Lookup the count of unread messages from the logged-in user as receiver
      {
        $lookup: {
          from: 'messages', // From messages collection
          let: { userId: '$_id', loggedInUserId: new Types.ObjectId(userId) }, // Let variables to use in pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$receiver', '$$loggedInUserId'] }, // Match messages where logged-in user is the receiver
                    { $eq: ['$sender', '$$userId'] }, // Match messages from the current user
                    { $eq: ['$read', false] } // Match unread messages
                  ]
                }
              }
            },
            { $count: 'unreadCount' } // Count unread messages
          ],
          as: 'unreadMessages' // Output as unreadMessages field
        }
      },

      { $unwind: { path: '$unreadMessages', preserveNullAndEmptyArrays: true } }, // Unwind the unreadMessages array

      // Project the required fields
      {
        $project: {
          _id: 1,
          email: 1,
          phone: 1,
          name: 1,
          online: 1,
          lastMessage: '$lastMessage.content', // Project lastMessage content
          lastMessageDate: '$lastMessage.timestamp', // Project lastMessage timestamp
          unreadMessagesCount: { $cond: { if: '$unreadMessages', then: '$unreadMessages.unreadCount', else: 0 } } // Conditionally set unreadMessagesCount
        }
      },

      { $sort: { lastMessageDate: -1, createdAt: -1 } } // Sort by lastMessageDate or createdAt if no message exists
    ]);

    res.json({ data: { users } }); // Return the fetched users
  } catch (error) {
    console.error(error); // Log any errors that occur
    res.status(500).json({ error: 'Server error' }); // Return server error response
  }
}
