import {
    type UsersData,
    type ChatData
  } from "@/types/message.types";
  import { defineStore } from "pinia";
  import http from "@/services/axios.interceptor";
  import router from "@/router";

  interface State {
    usersData: UsersData[],
    chatData: ChatData[]
    newChatData: any[]
  }

  
  interface GroupedChats {
    _id: string;
    chats: ChatData[];
  }

  // const accessToken = getAccessTokenFromCookie();
  export const useMessageStore = defineStore("message", {
    state: () => ({
      userData: [] as UsersData[],
      chatData: [] as ChatData[],
      newChatData: [] as any[]
    }),
    actions: {
      //get all users function
      async getAllUsersData(search: string) {
        const query = search != '' ? `/users/all-users?search=${search}` : `/users/all-users`
        http.get(`${query}`).then((response: any) => {
            this.userData = response.data.users
        })
      },
      //get one user messages
      async getUsersMessages(receiverId: string) {
        http.get(`/messages/${receiverId}`).then((response: any) => {
            this.chatData = response.data.messages
          this.newChatData = this.groupChats(this.chatData)
        })
      },
      
      // group the messages by their date so it would be easy to style
       groupChats(data: ChatData[]): GroupedChats[] {
        // Step 1: Group the chats by date
        const groups = data.reduce((groups: Record<string, ChatData[]>, chat: ChatData) => {
          const date = new Date(chat.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(chat);
          return groups;
        }, {});
      
        // Step 2: Sort each group's chats by timestamp in ascending order
        for (const date in groups) {
          groups[date].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }
      
        // Step 3: Convert the grouped object into an array
        const groupArrays: GroupedChats[] = Object.keys(groups).map((date) => {
          return {
            _id: date,
            chats: groups[date]
          };
        });
      
        // Step 4: Sort the groups by date in ascending order (oldest date first)
        groupArrays.sort((a, b) => new Date(a._id).getTime() - new Date(b._id).getTime());
      
        // Step 5: Reverse the final array to have the newest group at the bottom
        return groupArrays;
      }
      
    },
  });
  