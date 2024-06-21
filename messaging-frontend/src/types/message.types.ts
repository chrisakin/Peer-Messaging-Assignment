export interface UsersData {
    name: string;
    _id: string;
    lastMessage: string;
    time: Date;
    online: boolean
    numberOfPendingMessages: number,
    lastMessageDate: Date,
    unreadMessagesCount: number
  }

  export interface ChatData {
    sender: string;
    receiver: string;
    content: string;
    timestamp: Date;
    delivered: boolean
    read: boolean
  }