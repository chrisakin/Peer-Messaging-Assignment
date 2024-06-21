/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "400px",
        "2sm": "560px",
        "2lg": "1289px",
        "2xl": "1511px",
        "3xl": "1600px",
        "4xl": "1920px",
        "5xl": "2560px",
      },
      colors: {
        "signup-button": "#6E80A4",
        "signup-bg-color": "#E5E5E5",
        "a-icon-bg-color": "rgba(84, 84, 212, 0.1)",
        "font-deep-dark": "#0A193F",
        "simplified-bg-green": "#00AD1B",
        "simplified-disabled-state": "#F2F4F7",
        "simplified-light-grey": "#DBDCDE",
        "simplified-soft-grey": '#404A5A',
        "vtd-primary": colors.green,
        "gray-700": "#404A5A",
        "gray-100": "#F2F4F7",
        "gray-200": "#EAECF0",
        "gray-900": "#101828",
        "primary-btn-hover": "#0BCF2A",
        "primary-btn-focus": "#489955",
        "success-50": "#ECFDF3",
        "border-hover": "#98A2B3",

        border: {
          disabled: "#DBDCDE",
        },

        base: {
          "light-blue": "#F1F5F9"
        }
      },

      textColor: {
        "simplified-text-dark": "#101828",
        "dark-simplified-text": "#8483938",
        "font-deep-dark": "#0A193F",
        "deep-dark": "#0A193F",
        "simplified-text-green": "#00AD1B",
        "light-text": "#475467",
        "soft-grey":"#667085",
        "text-disabled": "#D0D5DD"  
      },
      boxShadow:{
        "simplified-shadow":"0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        maintheme: {
          primary: "#00AEF8",
          secondary: "#040C21",
          "primary-content": "#ffffff",
        },
      },
    ],
  },
};
