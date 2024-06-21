<!-- UserList.vue -->
<script lang="ts" setup>
import type { UsersData } from '../types/message.types'; // Importing types for user data
import { initials, checkTodaysDate, checkYesterdaysDate } from '../utils/general'; // Importing utility functions
import { ref } from 'vue'; // Importing ref from Vue

const props = defineProps<{ users: UsersData[] }>(); // Defining props for users array
const emit = defineEmits(['selectUser']); // Defining custom event to select a user
const selectedUser = ref<UsersData>(); // Reactive reference for the selected user

// Method to select a user
const selectUser = (user: UsersData) => {
  selectedUser.value = user; // Setting the selectedUser ref to the clicked user
  emit('selectUser', user); // Emitting selectUser event with the selected user
};

// Function to decode a string (assuming it's base64 encoded)
const decodeString = (chat: string) => {
  return decodeURIComponent(window.atob(chat)); // Decoding the string
};
</script>

<template>
  <div class="overflow-y-auto flex-grow">
    <!-- Loop through each user -->
    <div
      v-for="user in users"
      :key="user._id"
      class="flex items-center justify-between p-4 hover:bg-[#F5F5F5] cursor-pointer"
      :class="selectedUser?._id === user._id ? 'bg-[#F5F5F5]' : ''" 
      @click="selectUser(user)"
    >
      <!-- User information -->
      <div class="flex items-center relative">
        <!-- User avatar with initials -->
        <div class="w-10 h-10 bg-[#6E80A4] rounded-full flex items-center justify-center text-white font-[500] text-[16px]">
          {{ initials(user.name) }} <!-- Display user initials -->
        </div>
        <!-- Online indicator dot -->
        <div v-if="user.online" class="absolute top-1 left-8 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        <div class="ml-4">
          <h2 class="text-[16px] font-[600] text-[#011627]">{{ user.name }}</h2> <!-- User's name -->
          <p class="text-[#707991] text-[14px] font-[400]">{{ user.lastMessage ? decodeString(user.lastMessage).slice(0, 20) + `${decodeString(user.lastMessage).length > 20 ? '...' : ''}` : '' }}</p> <!-- Last message preview -->
        </div>
      </div>
      <!-- Last message time and unread messages count -->
      <div class="flex flex-col items-end space-x-2">
        <div class="text-right text-[#707991] text-[14px] font-[400]">
          <!-- Display last message time based on date comparison -->
          <p v-if="checkYesterdaysDate(user.lastMessageDate as unknown as string) == false && checkTodaysDate(user.lastMessageDate as unknown as string) == false">{{ user.lastMessageDate ? new Date(user.lastMessageDate).toLocaleTimeString('en-US').toLowerCase() : '' }}</p>
          <p v-if="checkYesterdaysDate(user.lastMessageDate as unknown as string) == true">Yesterday</p>
          <p v-if="checkTodaysDate(user.lastMessageDate as unknown as string) == true">Today</p>
        </div>
        <!-- Display unread messages count badge -->
        <div v-if="user.unreadMessagesCount > 0" class="w-[18px] h-[18px] bg-[#3758F9] text-white text-[10px] font-[400] flex items-center justify-center rounded-full text-center">{{ user.unreadMessagesCount }}</div>
      </div>
    </div>
  </div>
</template>
