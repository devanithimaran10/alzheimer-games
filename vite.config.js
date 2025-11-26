import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Try to enable HTTPS if certificates exist, otherwise fall back to HTTP
let https = false
try {
  // Check if we have certificates (you can generate these with mkcert or similar)
  const keyPath = path.resolve(__dirname, 'localhost-key.pem')
  const certPath = path.resolve(__dirname, 'localhost.pem')
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    https = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
    console.log('✅ HTTPS enabled with local certificates')
  }
} catch (e) {
  console.log('⚠️  HTTPS not available - using HTTP. WebXR will not work without HTTPS.')
  console.log('   For Quest 2, use ngrok or deploy to a server with HTTPS.')
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    strictPort: false,
    https: https || false,
  }
})

