/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'Roboto', 'sans-serif'], // Replaces default sans fonts
      serif: ['Merriweather', 'serif'], // Replaces default serif fonts
      mono: ['Fira Code', 'monospace'], // Replaces default monospace fonts
    },
  },
  plugins: [require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["dark"],
        }
      }
    ]
  }
}