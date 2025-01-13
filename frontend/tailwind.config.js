import forms from "@tailwindcss/forms";
import scrollbar from "tailwind-scrollbar";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [forms(), scrollbar({ nocompatible: true })],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
