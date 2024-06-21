<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import socketService from '../services/socket'; // Importing socket service

import UserList from '../components/UserList.vue'; // Importing UserList component
import ChatHeader from '../components/ChatHeader.vue'; // Importing ChatHeader component
import MessageList from '../components/MessageList.vue'; // Importing MessageList component
import MessageInput from '../components/MessageInput.vue'; // Importing MessageInput component
import UserDrawer from '../components/UserDrawer.vue'; // Importing UserDrawer component

import { useMessageStore } from '../stores/message.store'; // Importing Vuex-like store
import type { UsersData } from '@/types/message.types'; // Importing UsersData type definition

const searchUser = ref<string>(''); // Reactive reference for search input
const messageStore = useMessageStore(); // Using custom store (Vuex-like)
const users = ref<UsersData[]>([]); // Reactive reference for users list

// Fetch all users' data initially
messageStore.getAllUsersData('').then(() => {
  users.value = messageStore.$state.userData; // Setting users data from store
});

// Function to search all users based on input
const searchAllUser = () => {
  messageStore.getAllUsersData(searchUser.value).then(() => {
    users.value = messageStore.$state.userData; // Updating users based on search result
  });
};

const selectedUser = ref<UsersData>(); // Reactive reference for selected user

const newMessage = ref<string>(''); // Reactive reference for new message
const messages = ref<Array<any>>([]); // Reactive reference for messages
const drawerOpen = ref<boolean>(false); // Reactive reference for drawer open state

const isConnected = ref(false); // Reactive reference for socket connection state

// Lifecycle hook: runs when component is mounted
onMounted(() => {
  // Fetching token from session storage for socket connection
  const token = sessionStorage.getItem('gett') ? decodeURIComponent(window.atob(sessionStorage.getItem('gett') as string)) : '';
  socketService.connect(token); // Connecting to socket service with token

  // Event listener: handles incoming messages
  socketService.onMessage((message) => {
    console.log(message, selectedUser.value)
    if (selectedUser.value && selectedUser.value._id == message.receiver || selectedUser.value && selectedUser.value._id == message.sender) {
      messages.value.push(message); // Pushing message to messages array
      messageStore.$state.chatData.push(message); // Pushing message to store's chat data
    }
    messageStore.$state.newChatData = messageStore.groupChats(messageStore.$state.chatData); // Grouping chats in store
    messageStore.getAllUsersData('').then(() => {
      users.value = messageStore.$state.userData; // Updating users data from store
    });

    if (selectedUser.value) {
      socketService.readMessage(selectedUser.value as UsersData); // Marking message as read in socket service
      messageStore.$state.userData.forEach((data: UsersData) => {
        if (data._id == (selectedUser.value as UsersData)._id) {
          data.unreadMessagesCount = 0; // Resetting unread messages count
        }
      });
    }
  });

  // Event listener: handles socket connection
  socketService.onConnect(() => {
    isConnected.value = true; // Updating socket connection state
  });

  // Event listener: handles socket disconnection
  socketService.onDisconnect(() => {
    isConnected.value = false; // Updating socket connection state
  });

  // Event listener: handles new user online
  socketService.onNewUser((newUser) => {
    users.value.push(newUser); // Adding new user to users list
    messageStore.$state.userData.push(newUser); // Adding new user to store's user data
  });

  // Event listener: handles user going online
  socketService.online((user: string) => {
    messageStore.$state.userData.forEach((data: UsersData) => {
      if (data._id == user) {
        data.online = true; // Updating user's online status
      }
    });
  });

  // Event listener: handles user going offline
  socketService.offline((user) => {
    messageStore.$state.userData.forEach((data: UsersData) => {
      if (data._id == user) {
        data.online = false; // Updating user's online status
      }
    });
  });
});

// Lifecycle hook: runs when component is unmounted
onUnmounted(() => {
  socketService.disconnect(); // Disconnecting from socket service
});

// Function to send a new message
const sendMessage = (message: string) => {
  if (message.trim()) {
    const receiverId = selectedUser.value?._id; // Extracting receiver ID
    socketService.sendMessage({
      receiverId: receiverId as string, // Casting receiver ID to string
      content: window.btoa(encodeURIComponent(message)), // Encoding message content
    });
  }
};

// Function to select a user
const selectUser = (user: UsersData) => {
  selectedUser.value = user; // Setting selected user
  drawerOpen.value = false; // Closing drawer
  messageStore.$state.newChatData = []; // Clearing new chat data
  messageStore.getUsersMessages(user._id); // Fetching user's messages
  socketService.readMessage(user); // Marking message as read in socket service
  messageStore.$state.userData.forEach((data: UsersData) => {
    if (data._id == user._id) {
      data.unreadMessagesCount = 0; // Resetting unread messages count for selected user
    }
  });
};

// Function to toggle drawer
const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value; // Toggling drawer open state
};
</script>


<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden" :class="drawerOpen ? 'w-3/4': 'w-full'">
    <!-- Sidebar with user list -->
    <aside class="xl:w-[380px] md:w-[300px] bg-white border-r border-[#D9DCE0] flex flex-col">
      <div class="p-4">
        <img src="@/assets/images/logo.svg" alt="Chat Logo" class="h-[42px] w-[112px]">
        <!-- Search input -->
        <div class="relative w-full mt-4">
          <input
            type="text"
            placeholder="Search"
            @input="searchAllUser"
            v-model="searchUser"
            class="w-full h-[40px] pl-10 pr-4 py-2 rounded-full bg-[#F5F5F5] text-[#000000] focus:outline-none placeholder-custom"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.99997 0.5C9.39795 0.499944 10.7681 0.890614 11.9559 1.62792C13.1436 2.36523 14.1016 3.41983 14.7218 4.6727C15.342 5.92558 15.5997 7.32686 15.4658 8.71841C15.3319 10.11 14.8117 11.4364 13.964 12.548L18.707 17.293C18.8863 17.473 18.9904 17.7144 18.9982 17.9684C19.006 18.2223 18.9168 18.4697 18.7487 18.6603C18.5807 18.8508 18.3464 18.9703 18.0935 18.9944C17.8406 19.0185 17.588 18.9454 17.387 18.79L17.293 18.707L12.548 13.964C11.601 14.6861 10.4956 15.1723 9.32341 15.3824C8.15119 15.5925 6.9458 15.5204 5.80697 15.1721C4.66814 14.8238 3.62862 14.2094 2.77443 13.3795C1.92023 12.5497 1.27592 11.5285 0.894799 10.4002C0.513683 9.27192 0.406722 8.06912 0.582766 6.89131C0.75881 5.7135 1.2128 4.59454 1.90717 3.62703C2.60153 2.65951 3.51631 1.87126 4.57581 1.32749C5.63532 0.783715 6.80908 0.500063 7.99997 0.5ZM7.99997 2.5C6.54128 2.5 5.14233 3.07946 4.11088 4.11091C3.07943 5.14236 2.49997 6.54131 2.49997 8C2.49997 9.45869 3.07943 10.8576 4.11088 11.8891C5.14233 12.9205 6.54128 13.5 7.99997 13.5C9.45866 13.5 10.8576 12.9205 11.8891 11.8891C12.9205 10.8576 13.5 9.45869 13.5 8C13.5 6.54131 12.9205 5.14236 11.8891 4.11091C10.8576 3.07946 9.45866 2.5 7.99997 2.5Z" fill="#707991"/>
          </svg>
        </div>
      </div>
      <!-- User list component -->
      <UserList :users="messageStore.$state.userData" @selectUser="selectUser" />
    </aside>

    <!-- Main chat area -->
    <main v-if="selectedUser" class="w-3/4 flex-1 flex flex-col relative transition-all duration-300 ease-in-out">
      <!-- Chat header component -->
      <ChatHeader :selectedUser="selectedUser" @toggleDrawer="toggleDrawer" />
      <!-- Message list component -->
      <MessageList :messages="messageStore.$state.newChatData" :selectedUser="selectedUser" class="px-16" />
      <!-- Message input component -->
      <MessageInput @sendMessage="sendMessage" class="px-16" /> 
    </main>
  </div>
  
  <!-- User drawer component -->
  <div class="transition-all duration-300 ease-in-out">
    <UserDrawer :drawerOpen="drawerOpen" :selectedUser="selectedUser" @toggleDrawer="toggleDrawer" />
  </div>
</template>




<style scoped>
.placeholder-custom::placeholder {
  color: #707991 !important; /* Tailwind's gray-500 color */
  font-size: 16px !important; /* Tailwind's text-sm size */
}
</style>


