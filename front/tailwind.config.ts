import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      padding: {
        '10%': '10%',
        '8%': '8%',
      },
      width: {
        '50%': '50%',
        '95%': '95%',
        '46%': '46%',
      },
      height: {
        '50%': '50%',
        '95%': '95%',
        '100%': '100%',
      },
    },
  },
  plugins: [],
};
export default config;
