import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // ✅ funciona en local y producción sin path.resolve
    },
  },
  server: {
    port: 5173, // ✅ para desarrollo local (opcional)
  },
  build: {
    outDir: 'dist', // ✅ requerido por Vercel
  },
});
