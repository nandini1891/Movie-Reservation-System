/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core CinéVault palette — dark theatre background, gold accent.
        ink: {
          950: "#0a0a0c", // page background
          900: "#101012", // panel / card background
          800: "#18181b", // input / hover surface
          700: "#232327", // borders
          600: "#2e2e33",
        },
        gold: {
          400: "#f0b955",
          500: "#e2a53c", // primary accent (buttons, active states)
          600: "#c98d2a",
        },
        ivory: "#f5f1e8", // headline text
        muted: "#8b8b94", // secondary text / labels
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.08em",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
