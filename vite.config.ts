import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 5173,
    host: true, // Listen on all network interfaces
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      },
      manifest: {
        short_name: "My WO",
        name: "My WO Planner",
        description: "Smart workout roster with auto-progression, fatigue management, and HGH optimization.",
        icons: [
          {
            src: "/favicon.svg",
            type: "image/svg+xml",
            sizes: "any",
            purpose: "any maskable"
          }
        ],
        start_url: "/",
        background_color: "#030810",
        theme_color: "#030810",
        display: "fullscreen",
        orientation: "portrait"
      }
    })
  ],
});
