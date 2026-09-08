import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/digital-adoption-simulator/', // הוסיפי שורה זו עם שם המאגר שלך
})
