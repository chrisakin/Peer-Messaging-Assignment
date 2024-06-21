<script setup lang="ts">
import { ref } from 'vue';
import { useField, useForm, type GenericObject, type SubmissionHandler } from 'vee-validate';
import * as yup from 'yup';
import http from "@/services/axios.interceptor";
import { useRouter } from 'vue-router';

const router = useRouter();
// Define validation schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
});

// Setup form with validation schema
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

// Define form fields
const { value: name, errorMessage: nameError } = useField('name');
const { value: email, errorMessage: emailError } = useField('email');
const { value: phone, errorMessage: phoneError } = useField('phone');

// Define signup function
const signup = async (values: { name: string; email: string; phone: string }) => {
  try {
    const response = await http.post('/auth/signup', values);
    const token = response.data.token;
    const userId = response.data.id
    sessionStorage.setItem('gett', window.btoa(encodeURIComponent(token)))
    sessionStorage.setItem('uid', window.btoa(encodeURIComponent(userId)))
    router.push("/");
    // Handle successful signup
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};
const onSubmit = handleSubmit(signup as unknown as SubmissionHandler<GenericObject, GenericObject, Promise<void>>);

</script>


<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-200">
    <div class="bg-white rounded-lg shadow-lg lg:w-[520px] w-full h-[549px] relative">
      <div class="flex justify-end m-[-18px] top-0">
        <img src="@/assets/images/Dotted-Shape.svg" alt="Dotted Shape">
      </div>
      <div class="px-14">
        <div class="mb-5 text-center lg:mt-[51px]">
          <img src="@/assets/images/logo.svg" alt="Chat Logo" class="mx-auto mb-4">
        </div>
        <form @submit="onSubmit" class="mt-[36px]">
          <div :class="nameError ? 'mb-2' : 'mb-6'">
            <input
              type="text"
              v-model="name"
              placeholder="Name"
              class="text-[#000000] w-full px-3 h-[50px] border border-gray-300 focus:border-[#6E80A4] hover:border-[#6E80A4] rounded-lg focus:outline-none"
            />
            <span v-if="nameError" class="text-red-500 text-xs">{{ nameError }}</span>
          </div>
          <div :class="emailError ? 'mb-2' : 'mb-6'">
            <input
              type="email"
              v-model="email"
              placeholder="Email"
              class="text-[#000000] w-full px-3 h-[50px] border border-gray-300 focus:border-[#6E80A4] hover:border-[#6E80A4] rounded-lg focus:outline-none"
            />
            <span v-if="emailError" class="text-red-500 text-xs">{{ emailError }}</span>
          </div>
          <div :class="phoneError ? 'mb-2' : 'mb-6'">
            <input
              type="text"
              v-model="phone"
              placeholder="Phone Number"
              class="text-[#000000] w-full px-3 h-[50px] border border-gray-300 focus:border-[#6E80A4] hover:border-[#6E80A4] rounded-lg focus:outline-none"
            />
            <span v-if="phoneError" class="text-red-500 text-xs">{{ phoneError }}</span>
          </div>
          <button type="submit" class="w-full md:mb-9 mb-20 bg-signup-button text-white text-[16px] h-[50px] rounded-[6px] hover:bg-signup-button">
            Sign Up
          </button>
        </form>
      </div>
      <div class="absolute bottom-0 ml-1 mb-1">
        <img src="@/assets/images/Dotted-Shape.svg" alt="Dotted Shape">
      </div>
    </div>
  </div>
</template>

