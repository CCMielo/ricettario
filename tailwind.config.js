// Configurazione Tailwind (v3) — stessa che prima stava dentro index.html.
// Per rigenerare tailwind.css:  tools/tailwindcss.exe -i tailwind.input.css -o tailwind.css --minify
module.exports = {
  content: ['./index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      }
    }
  }
}
