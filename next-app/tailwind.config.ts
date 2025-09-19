import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "battle-ring": {
          "0%, 100%": { transform: "scale(0.95)", opacity: "0.6" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
        },
        "battle-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.65" },
        },
      },
      animation: {
        float: "float 3.5s ease-in-out infinite",
        "battle-ring": "battle-ring 2.4s ease-in-out infinite",
        "battle-glow": "battle-glow 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
