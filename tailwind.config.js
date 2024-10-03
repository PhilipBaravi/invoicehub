module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Ensure it matches the file extensions you're using.
  ],
  theme: {
    extend: {
      colors: {
        brightBlue: '#4169E1',
      },
      fontFamily: {
        georgian: ['"Noto Serif Georgian"', 'serif'],
      },
    },
  },
  plugins: [],
};
