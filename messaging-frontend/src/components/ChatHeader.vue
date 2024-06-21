<!-- ChatHeader.vue -->
<script lang="ts" setup>
import type { UsersData } from '@/types/message.types'; // Import the UsersData type
import { initials } from '../utils/general'; // Import the initials utility function

const props = defineProps<{ selectedUser: UsersData }>(); // Define props with TypeScript, expecting selectedUser of type UsersData
const emit = defineEmits(['toggleDrawer']); // Define emit for custom event 'toggleDrawer'

const toggleDrawer = () => {
  emit('toggleDrawer'); // Emit the 'toggleDrawer' event
};
</script>

<template>
  <!-- Header section with padding, border, flexbox, and background styles, click event to toggle drawer -->
  <header class="p-3 border-b border-[#D9DCE0] flex items-center bg-white justify-between cursor-pointer" @click="toggleDrawer">
    <div class="flex items-center">
      <!-- User initials displayed inside a styled circle -->
      <div class="w-[40px] h-[40px] bg-[#6E80A4] rounded-full flex items-center justify-center text-white font-[500] text-[16px]">
        {{ initials(selectedUser.name) }} <!-- Generate initials from the selected user's name -->
      </div>
      <!-- User name displayed next to the initials -->
      <div class="ml-2">
        <h2 class="text-xl font-semibold text-[#011627] text-[16px] font-[600]">{{ selectedUser.name }}</h2>
      </div>
    </div>
  </header>
</template>
