<!-- UserDrawer.vue -->
<script lang="ts" setup>
import { initials } from '../utils/general'; // Import function to get user initials

const props = defineProps<{ drawerOpen: boolean, selectedUser: any }>(); // Define props for drawerOpen and selectedUser
const emit = defineEmits(['toggleDrawer']); // Define custom event to toggle drawer

const toggleDrawer = () => {
  emit('toggleDrawer'); // Method to emit toggleDrawer event
};
</script>

<template>
  <!-- Transition wrapper with slide-fade animation -->
  <transition name="slide-fade">
    <!-- Conditional rendering based on drawerOpen prop -->
    <div v-if="drawerOpen" class="absolute right-0 top-0 h-full w-1/4 bg-white border-l border-[#D9DCE0] p-4 flex flex-col items-center">
      <!-- Button to close the drawer -->
      <button @click="toggleDrawer" class="self-start">
        <!-- Close icon SVG -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.33325 1.33334L14.6666 14.6667M1.33325 14.6667L14.6666 1.33334" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <!-- User avatar circle -->
      <div class="flex-shrink-0 w-24 h-24 bg-[#6E80A4] rounded-full mt-4 flex items-center justify-center text-white font-[500] text-[35px]">
        {{ initials(selectedUser.name) }} <!-- Display user initials -->
      </div>
      <!-- User details -->
      <div class="mt-4 text-center">
        <h2 class="text-[#011627] font-[600] text-[16px]">{{ selectedUser.name }}</h2> <!-- User's name -->
        <p class="text-[#707991] mt-2 text-[14px] font-[400]">{{ selectedUser.phone }}</p> <!-- User's phone number -->
        <p class="text-[#707991] text-[14px] font-[400] mt-1">{{ selectedUser.email }}</p> <!-- User's email -->
      </div>
      <!-- Divider line -->
      <div class="border border-t-[#D4D4D4] w-full m-8 w-[90%]"></div>
    </div>
  </transition>
</template>

