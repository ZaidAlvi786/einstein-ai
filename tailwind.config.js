/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        xl: "calc(100vw - 400px)",
        mlg: "calc(100vw - 20px)",
        "calc-310px": "calc(100% - 310px)",
        "calc-295px": "calc(100% - 295px)",
      },
      height: {
        "calc-230px": "calc(100vh - 230px)",
        "calc-180px": "calc(100vh - 180px)",
        "calc-310px": "calc(100% - 310px)",
        "calc-65px": "calc(100% - 100px)",
        "calc-120px":"calc(100vh - 90px)",
        "calc-30px":"calc(100% - 30px)",
      },
      colors: {
        white: "#F8F8F8",
        black: "#171717",
        success: "#50AE24"
      },
      boxShadow: {
        modal: '-5px 5px 44px 0px rgba(0, 0, 0, 0.38)',
        billingCard: '-3px 3px 8px 0px #0000001A',
        groupMenu: '0px 2px 4px 0px #0000001A',
        trendingCard: '-3px 3px 8px 0px #0000001A',
        'custom-light': '-2.658px 2.658px 7.089px 0px rgba(0, 0, 0, 0.10)',
        '4k-custom': '-6px 6px 16px 0px rgba(0, 0, 0, 0.10)',
        'custom': '0px 9.252px 9.252px 0px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "custom-gradient": 
          'linear-gradient(155deg, rgba(255, 255, 255, 0.03) -2.13%, rgba(255, 255, 255, 0.09) 136.58%)',
        "radial-gradient":
          "radial-gradient(101.33% 101.33% at 50% 50%, #6F6F6F 0%, rgba(93, 93, 93, 0.15) 100%)",
          'card-gradient': 'linear-gradient(155deg, #272727 -2.13%, #161616 136.58%)',
      },
      backdropBlur: {
        'Blurcustom': '2px',
        'custom': '1.7722222805023193px',
        '4k-custom': '3.999999761581421px'
      },
      fontFamily: {
        nasalization: ["var(--font-nasalization)"],
        helvetica: ["var(--font-helvetica)"],
        helvetica_neue: ["var(--font-helvetica_neue)"],
        montserrat: ["var(--font-montserrat)"],
        inter: ["var(--font-inter)"],
        roboto: ['Roboto', 'sans-serif'],
        worksans: ["var(--font-worksans)"]
      },
      screens: {
        msm: "500px",
        sm: "641px",
        md: "769px",
        mlg: "961px",
        lg: "1024px",
        mxl: "1441px",
        xl: "1280px",
        mxl: "1441px",
        "2xl": "1536px",
        lxl: "1710px",
        '2k':{min:'1920px', max:'2559px'},
        '4k': {min:'2560px'}
      },
      aspectRatio: {
        "1/1": "1 / 1",
        "3/2": "3 / 2",
        "16/9": "16 / 9",
        "21/9": "21 / 9",
        "3/1": "3 / 1",
        "4/1": "4 / 1",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
        "9/21": "9 / 21",
        "1/3": "1 / 3",
        "1/4": "1 / 4",
      },
    },
    animation: {
      'shade-in': 'opacity-kf 500ms linear',
    },
    keyframes: {
      'opacity-kf': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      }
    }
  },
  darkMode: "class",
  plugins: [
    nextui({ defaultTheme: "dark" }),
  ],
};