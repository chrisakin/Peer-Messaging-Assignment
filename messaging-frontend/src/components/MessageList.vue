<!-- MessageList.vue -->
<script lang="ts" setup>
import type { UsersData } from '@/types/message.types'; // Import type definition for UsersData
import { checkTodaysDate, checkYesterdaysDate } from '../utils/general'; // Import utility functions
const props = defineProps<{ messages: Array<any>, selectedUser: UsersData }>(); // Define props for messages and selectedUser

const decodeString = (chat: string) => {
  return decodeURIComponent(window.atob(chat)); // Function to decode base64 encoded string
}

const userId = sessionStorage.getItem('uid') ? decodeString(sessionStorage.getItem('uid') as string) : ''; // Decode and get userId from sessionStorage
</script>

<template>
  <!-- Container for the message list -->
  <div ref="chatbody" class="flex flex-col-reverse w-full h-full overflow-y-auto overscroll-none bg-[#F6F6F6]">
    <!-- Check if there are messages -->
    <div v-if="messages.length > 0">
      <!-- Loop through each chat message -->
      <div v-for="chat in messages" class="relative w-full py-[32px]">
        <!-- Date separator section -->
        <div class="absolute w-full flex justify-center">
          <!-- Display date separators based on date check -->
          <p v-if="checkYesterdaysDate(chat._id) == false && checkTodaysDate(chat._id) == false" class="bg-white text-sm text-gray-700 font-semibold px-4 rounded-[12px] text-[#838A95]">{{ chat._id }}</p>
          <p v-if="checkYesterdaysDate(chat._id) == true" class="bg-white text-sm text-gray-700 font-semibold px-4 rounded-[12px] text-[#838A95]">Yesterday</p>
          <p v-if="checkTodaysDate(chat._id) == true" class="bg-white text-sm text-gray-700 font-semibold px-4 rounded-[12px] text-[#838A95]">Today</p>
        </div>

        <!-- Messages section -->
        <div v-for="index in chat.chats" class="py-[10px] mt-9">
          <!-- Sender's message -->
          <div class="mr-auto ml-0 flex space-x-3" v-if="index.sender != userId">
            <div>
              <div class="flex flex-col items-end text-[16px] bg-[#FFFFFF] text-[#011627] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] px-[14px] py-[10px]">
                <span style="white-space: pre-wrap;">{{ decodeString(index.content) }}</span> <!-- Display decoded content -->
                <p class="text-[11px] text-[#011627] ml-auto mr-0 font-[400]"> {{ index.timestamp == '....' ? '....' : new Date(index.timestamp).toLocaleTimeString('en-US').toLowerCase()}} </p> <!-- Display timestamp -->
              </div>
            </div>
          </div>
          <!-- Receiver's message -->
          <div class="ml-auto mr-0 flex justify-end space-x-3" v-else>
            <div>
              <div class="flex flex-col items-end text-[16px] bg-[#DEE9FF] text-[#011627] rounded-tl-[12px] rounded-br-[12px] rounded-bl-[12px] px-[14px] py-[10px]">
                <span style="white-space: pre-wrap;">{{ decodeString(index.content) }}</span> <!-- Display decoded content -->
                <p class="text-[11px] text-[#011627] ml-auto mr-0 font-[400]"> {{ index.timestamp == '....' ? '....' : new Date(index.timestamp).toLocaleTimeString('en-US').toLowerCase()}}</p> <!-- Display timestamp -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
