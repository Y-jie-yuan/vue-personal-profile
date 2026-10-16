import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // 允许通过反向代理域名（部署后的线上域名）访问
    host: '0.0.0.0',
    allowedHosts: true,
    // 平台会通过 PORT 环境变量指定端口，本地开发时回退到 5173
    port: Number(process.env.PORT) || 5173,
    strictPort: false
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: Number(process.env.PORT) || 4173,
    strictPort: false
  }
})
