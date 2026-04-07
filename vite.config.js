import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'JEET 수학 진단 앱',
        short_name: 'JEET',
        description: '개념 진단 기반 수학 분석 앱',
        theme_color: '#E11D48',
        background_color: '#F8FAFC',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    // 사장님, 여기서 보따리 크기 제한을 1000kb로 늘려 경고를 없앱니다.
    chunkSizeWarningLimit: 1000,
    // 대용량 라이브러리를 효율적으로 관리하는 설정입니다.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
})
