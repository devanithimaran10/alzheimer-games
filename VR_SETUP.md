# VR Headset Setup Guide

## Problem
Your VR headset cannot access `localhost:3000` because localhost refers to the device itself, not your development computer.

## Solution
Access the app using your computer's **local IP address** instead of localhost.

## Step-by-Step Instructions

### 1. Find Your Computer's Local IP Address

#### Windows:
1. Open Command Prompt (Press `Win + R`, type `cmd`, press Enter)
2. Type: `ipconfig`
3. Look for **IPv4 Address** under your active network adapter (usually "Wireless LAN adapter Wi-Fi" or "Ethernet adapter")
4. It will look like: `192.168.1.xxx` or `10.0.0.xxx`

#### Mac:
1. Open Terminal
2. Type: `ifconfig | grep "inet " | grep -v 127.0.0.1`
3. Look for an IP address starting with `192.168.` or `10.0.`

#### Linux:
1. Open Terminal
2. Type: `hostname -I` or `ip addr show`
3. Look for your local network IP address

### 2. Start the Development Server

```bash
npm run dev
```

After starting, Vite will show you the network URL. It should look like:
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.xxx:3000/
```

**Note the Network URL** - this is what you'll use in your VR headset!

### 3. Access from VR Headset

1. **Make sure your VR headset and computer are on the same Wi-Fi network**
2. Open the browser in your VR headset (Oculus Browser, Firefox Reality, etc.)
3. Type the **Network URL** (e.g., `http://192.168.1.xxx:3000`) in the address bar
4. The application should load!

### 4. Enter VR Mode

Once the app loads in your VR headset browser:
1. Click the **"🥽 Enter VR"** button in the top-right corner
2. Grant permission when prompted
3. Enjoy the immersive experience!

## Troubleshooting

### Can't Access from VR Headset?

1. **Check Firewall**: Your Windows/Mac firewall might be blocking the connection
   - **Windows**: Go to Windows Defender Firewall → Allow an app → Check "Node.js" or add port 3000
   - **Mac**: System Preferences → Security & Privacy → Firewall → Allow Node.js

2. **Same Network**: Ensure both devices are on the same Wi-Fi network

3. **Try Different Port**: If port 3000 doesn't work, you can change it in `vite.config.js`:
   ```js
   server: {
     port: 8080, // Try a different port
     host: true
   }
   ```

4. **Use HTTPS**: Some VR browsers require HTTPS. For production, you'll need to:
   - Build the app: `npm run build`
   - Serve it over HTTPS (using a service like ngrok, or deploy to a hosting service)

### For Production/HTTPS Setup

If you need HTTPS (required for some WebXR features):

**Option 1: Use ngrok (Quick Testing)**
```bash
npm run build
npx serve -s dist
# In another terminal:
npx ngrok http 3000
# Use the ngrok HTTPS URL in your VR headset
```

**Option 2: Deploy to a Hosting Service**
- Deploy to Vercel, Netlify, or GitHub Pages
- Access via the deployed HTTPS URL

## Quick Reference

- **Development**: `http://YOUR_LOCAL_IP:3000`
- **Example**: `http://192.168.1.105:3000`
- **Always use the Network URL, never localhost from VR headset**

