# Alzheimer's Therapy Games

A collection of therapeutic games designed for Alzheimer's patients using React Three Fiber. These games target different cognitive functions and are designed with accessibility and gentle feedback in mind.

## Games Included

### 1. Daily Routine Sequencer
**Target:** Procedural Memory & Sequencing (Executive Function)
- Players arrange 3-4 steps of familiar daily activities in the correct order
- Examples: Making a Cup of Tea, Brushing Teeth, Getting Dressed
- Features gentle guidance with hint system (no harsh "X" marks)

### 2. Musical Time Travel
**Target:** Auditory Memory & Long-Term Recall
- Players complete lyrics from famous songs from their youth (1940s-1970s)
- Music processing areas of the brain are often preserved longer
- Boosts confidence with high success rates

### 3. Memory Tray
**Target:** Short-Term Working Memory
- Display 3-5 objects for 30 seconds, then test recall
- Two difficulty levels: Easy (single choice) and Hard (select all items)
- Uses distinct, high-contrast everyday objects

### 4. Grocery Aisle Sorter
**Target:** Semantic Memory (Categorization)
- Sort items into correct categories (Fruit, Tools, Vegetables, Clothing)
- Provides repetitive, calming sense of order
- Gentle bounce-back for incorrect placements

### 5. Faces & Names
**Target:** Facial Recognition & Biographical Memory
- Match photos to names or relationships
- Can be personalized with family photos
- Low-stakes environment to practice associations

### 6. Spot the Odd One
**Target:** Attention & Visual Processing
- Find the item that's different from the others
- High contrast, plain backgrounds
- Relies on immediate visual data

## Design Principles

- **Large, clear visuals** - Easy to see and interact with
- **Gentle feedback** - No harsh negative indicators
- **High contrast** - Better visibility
- **Simple interactions** - Click-based, intuitive controls
- **Preserved functions** - Targets cognitive areas that remain strong longer

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Building for Production

```bash
npm run build
```

## Technology Stack

- **React** - UI framework
- **React Three Fiber** - 3D rendering
- **Three.js** - 3D graphics library
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/xr** - VR/AR support for WebXR
- **Vite** - Build tool and dev server

## VR/AR Support

This application supports VR and AR experiences through WebXR! 

### ⚠️ Accessing from VR Headset

**Important**: Your VR headset cannot access `localhost:3000`. You need to use your computer's local IP address instead.

**Quick Steps:**
1. Find your computer's IP address (see `VR_SETUP.md` for detailed instructions)
2. Start the dev server: `npm run dev`
3. Note the **Network URL** shown in the terminal (e.g., `http://192.168.1.105:3000`)
4. Open that URL in your VR headset's browser
5. Click "🥽 Enter VR" to start!

📖 **See [VR_SETUP.md](./VR_SETUP.md) for complete setup instructions**

### Using VR/AR

1. **Enter VR Mode**: Click the "🥽 Enter VR" button in the top-right corner
2. **Enter AR Mode**: Click the "📱 Enter AR" button in the top-right corner

### Requirements

- A WebXR-compatible browser (Chrome, Edge, Firefox Reality, etc.)
- A VR headset (Oculus Quest, HTC Vive, etc.) or AR-capable device
- Both devices on the same Wi-Fi network
- HTTPS connection (required for WebXR in production)

### Interaction in VR/AR

- All games work seamlessly in VR/AR mode
- Use VR controllers or hand tracking to interact with game elements
- Point and click (or trigger) to select items, buttons, and cards
- The 3D environment adapts to your VR/AR space

### Browser Setup

For development, you may need to enable WebXR flags:
- **Chrome/Edge**: `chrome://flags` → Enable "WebXR Incubations"
- **Firefox Reality**: WebXR enabled by default

For production, ensure your site is served over HTTPS (required by WebXR specification).

## Customization

### Adding Family Photos
In `FacesAndNames.jsx`, replace the emoji placeholders with actual photo URLs:

```javascript
const people = [
  { id: 1, name: 'Grandson', photo: '/photos/grandson.jpg', relationship: 'Grandson' },
  // ...
]
```

### Adding Music Files
In `MusicalTimeTravel.jsx`, add actual audio file paths and implement audio playback:

```javascript
const songs = [
  {
    title: 'You Are My Sunshine',
    audioUrl: '/audio/you-are-my-sunshine.mp3',
    // ...
  }
]
```

### Customizing Routines
Edit the `routines` array in `DailyRoutineSequencer.jsx` to add more daily activities.

## Notes

- All games are designed to be non-stressful and encouraging
- Visual feedback uses colors (green for correct, orange for gentle correction)
- Games automatically progress or reset after completion
- Each game includes a "Back to Menu" button for easy navigation
- **VR/AR Mode**: All games are fully playable in VR/AR - simply click the VR/AR buttons to enter immersive mode
- **Accessibility**: Large buttons and clear visuals make the games accessible in both desktop and VR modes

## License

This project is designed for therapeutic use with Alzheimer's patients.

