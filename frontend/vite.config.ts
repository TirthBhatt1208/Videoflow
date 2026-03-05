import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("🔴 Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log(
              "🚀 Proxying:",
              req.method,
              req.url,
              "→",
              options.target,
            );
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("✅ Proxy response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
