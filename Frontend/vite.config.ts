import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [qwikCity(), qwikVite(), tsconfigPaths(), svgr()],
  server: {
    port: 3000, // Cambia el puerto predeterminado de 5173 a 3000
    host: true, // Permite acceder desde otras máquinas en la red
    open: true, // Abre automáticamente el navegador al iniciar
  },
  preview: {
    port: 3000,
    host: true,
  },
});