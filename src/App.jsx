import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { XR, VRButton, ARButton, createXRStore, useXR } from "@react-three/xr";
import MainMenu from "./components/MainMenu";
import DailyRoutineSequencer from "./games/DailyRoutineSequencer";
import MusicalTimeTravel from "./games/MusicalTimeTravel";
import MemoryTray from "./games/MemoryTray";
import GroceryAisleSorter from "./games/GroceryAisleSorter";
import FacesAndNames from "./games/FacesAndNames";
import SpotTheOddOne from "./games/SpotTheOddOne";

const GAMES = {
  MENU: "menu",
  DAILY_ROUTINE: "daily_routine",
  MUSICAL_TIME_TRAVEL: "musical_time_travel",
  MEMORY_TRAY: "memory_tray",
  GROCERY_AISLE: "grocery_aisle",
  FACES_AND_NAMES: "faces_and_names",
  SPOT_THE_ODD_ONE: "spot_the_odd_one",
};

// Create XR store outside component to persist across renders
const xrStore = createXRStore();

// Console Logger Component
function ConsoleLogger() {
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);
  const originalConsole = useRef({
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
  });

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    // Intercept console methods
    const addLog = (type, args) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args
        .map((arg) => {
          if (typeof arg === "object") {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(" ");

      setLogs((prev) => [
        ...prev.slice(-99), // Keep last 100 logs
        { type, message, timestamp },
      ]);
    };

    console.log = (...args) => {
      originalConsole.current.log(...args);
      addLog("log", args);
    };

    console.error = (...args) => {
      originalConsole.current.error(...args);
      addLog("error", args);
    };

    console.warn = (...args) => {
      originalConsole.current.warn(...args);
      addLog("warn", args);
    };

    console.info = (...args) => {
      originalConsole.current.info(...args);
      addLog("info", args);
    };

    // Also catch unhandled errors
    window.addEventListener("error", (event) => {
      addLog("error", [
        `Uncaught Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
      ]);
    });

    window.addEventListener("unhandledrejection", (event) => {
      addLog("error", [`Unhandled Promise Rejection: ${event.reason}`]);
    });

    return () => {
      // Restore original console methods
      console.log = originalConsole.current.log;
      console.error = originalConsole.current.error;
      console.warn = originalConsole.current.warn;
      console.info = originalConsole.current.info;
    };
  }, []);

  const getLogColor = (type) => {
    switch (type) {
      case "error":
        return "#ff4444";
      case "warn":
        return "#ffaa00";
      case "info":
        return "#44aaff";
      default:
        return "#ffffff";
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "10px",
        top: "10px",
        width: "400px",
        maxHeight: "80vh",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        border: "2px solid #333",
        borderRadius: "8px",
        padding: "10px",
        zIndex: 2000,
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          paddingBottom: "10px",
          borderBottom: "1px solid #444",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "14px" }}>
          Console Logs ({logs.length})
        </div>
        <button
          onClick={clearLogs}
          style={{
            padding: "4px 12px",
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
          }}
        >
          Clear
        </button>
      </div>
      <div
        style={{
          overflowY: "auto",
          flex: 1,
          maxHeight: "calc(80vh - 60px)",
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "#888", fontStyle: "italic" }}>
            No logs yet...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: "8px",
                padding: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "4px",
                borderLeft: `3px solid ${getLogColor(log.type)}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    color: getLogColor(log.type),
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                >
                  [{log.type.toUpperCase()}]
                </span>
                <span style={{ color: "#888", fontSize: "10px" }}>
                  {log.timestamp}
                </span>
              </div>
              <div
                style={{
                  color: "#fff",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {log.message}
              </div>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
      <div
        style={{
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: "1px solid #444",
          fontSize: "10px",
          color: "#888",
        }}
      >
        Legend: <span style={{ color: "#ff4444" }}>ERROR</span> |{" "}
        <span style={{ color: "#ffaa00" }}>WARN</span> |{" "}
        <span style={{ color: "#44aaff" }}>INFO</span> |{" "}
        <span style={{ color: "#fff" }}>LOG</span>
      </div>
    </div>
  );
}

// Component to handle VR session events
function VRScene({ children }) {
  const { isPresenting, session } = useXR();

  useEffect(() => {
    if (isPresenting) {
      console.log("VR session started!", session);
    } else {
      console.log("VR session ended or not active");
    }
  }, [isPresenting, session]);

  useEffect(() => {
    // Listen for XR session errors
    const handleError = (event) => {
      console.error("XR Session Error:", event);
    };

    if (session) {
      session.addEventListener("end", () => {
        console.log("XR session ended");
      });
      session.addEventListener("error", handleError);
    }

    return () => {
      if (session) {
        session.removeEventListener("end", () => {});
        session.removeEventListener("error", handleError);
      }
    };
  }, [session]);

  // In VR, position content in front of the user with comfortable spacing
  // Position at [0, 1.6, -3] - centered horizontally, at eye level (1.6m), 3 meters in front
  // Only apply this offset in VR mode, keep desktop view as is
  return (
    <group position={isPresenting ? [0, 1.6, -3] : [0, 0, 0]}>{children}</group>
  );
}

function App() {
  const [currentGame, setCurrentGame] = useState(GAMES.MENU);
  const [webXRStatus, setWebXRStatus] = useState({
    available: false,
    vrSupported: false,
    isSecure: false,
    message: "Checking WebXR support...",
  });

  // Debug: Check XR support on mount
  useEffect(() => {
    const checkXR = async () => {
      // Check if we're in a secure context (HTTPS or localhost)
      const isSecureContext =
        window.isSecureContext ||
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      console.log("Secure Context:", isSecureContext);
      console.log("Protocol:", window.location.protocol);
      console.log("Hostname:", window.location.hostname);

      setWebXRStatus({
        available: !!navigator.xr,
        vrSupported: false,
        isSecure: isSecureContext,
        message: isSecureContext ? "Checking WebXR..." : "⚠️ HTTPS Required!",
      });

      if (!isSecureContext) {
        const errorMsg =
          "⚠️ WebXR requires HTTPS! " +
          "Your app is being served over HTTP. " +
          "For Quest 2, you need to either:\n" +
          "1. Use ngrok or similar to create HTTPS tunnel\n" +
          "2. Build and deploy to a server with HTTPS\n" +
          "3. Use Oculus Browser's special localhost handling (if available)";
        console.error(errorMsg);
        setWebXRStatus((prev) => ({
          ...prev,
          message: "❌ HTTPS Required for WebXR! See console for details.",
        }));
      }

      if (navigator.xr) {
        try {
          const vrSupported = await navigator.xr.isSessionSupported(
            "immersive-vr"
          );
          const arSupported = await navigator.xr.isSessionSupported(
            "immersive-ar"
          );
          console.log("VR Supported:", vrSupported);
          console.log("AR Supported:", arSupported);

          setWebXRStatus({
            available: true,
            vrSupported: vrSupported,
            isSecure: isSecureContext,
            message: vrSupported
              ? "✅ WebXR Ready!"
              : "❌ WebXR sessions not supported",
          });

          if (!vrSupported && !arSupported) {
            const errorMsg =
              "❌ WebXR sessions not supported. " +
              "This could be because:\n" +
              "1. Not using HTTPS (required for WebXR)\n" +
              "2. Browser doesn't support WebXR\n" +
              "3. WebXR not enabled in browser settings\n" +
              "4. Quest 2 needs Oculus Browser (not other browsers)";
            console.error(errorMsg);
            setWebXRStatus((prev) => ({
              ...prev,
              message: "❌ WebXR Not Supported. Check console for details.",
            }));
          }
        } catch (error) {
          console.error("XR check failed:", error);
          console.error("Error details:", error.message, error.stack);
          setWebXRStatus((prev) => ({
            ...prev,
            message: `❌ Error: ${error.message}`,
          }));
        }
      } else {
        const errorMsg =
          "❌ navigator.xr is not available!\n" +
          "Possible reasons:\n" +
          "1. Not using HTTPS (WebXR requires secure context)\n" +
          "2. Browser doesn't support WebXR\n" +
          "3. Using wrong browser - Quest 2 needs 'Oculus Browser'\n" +
          "4. WebXR disabled in browser settings\n\n" +
          "Solutions:\n" +
          "- Use Oculus Browser (not Firefox Reality or others)\n" +
          "- Ensure you're accessing via HTTPS\n" +
          "- Check browser settings for WebXR flags";
        console.error(errorMsg);
        setWebXRStatus({
          available: false,
          vrSupported: false,
          isSecure: isSecureContext,
          message: "❌ WebXR Not Available. See console for details.",
        });
      }
    };
    checkXR();
  }, []);

  const renderGame = () => {
    switch (currentGame) {
      case GAMES.DAILY_ROUTINE:
        return (
          <DailyRoutineSequencer onBack={() => setCurrentGame(GAMES.MENU)} />
        );
      case GAMES.MUSICAL_TIME_TRAVEL:
        return <MusicalTimeTravel onBack={() => setCurrentGame(GAMES.MENU)} />;
      case GAMES.MEMORY_TRAY:
        return <MemoryTray onBack={() => setCurrentGame(GAMES.MENU)} />;
      case GAMES.GROCERY_AISLE:
        return <GroceryAisleSorter onBack={() => setCurrentGame(GAMES.MENU)} />;
      case GAMES.FACES_AND_NAMES:
        return <FacesAndNames onBack={() => setCurrentGame(GAMES.MENU)} />;
      case GAMES.SPOT_THE_ODD_ONE:
        return <SpotTheOddOne onBack={() => setCurrentGame(GAMES.MENU)} />;
      default:
        return <MainMenu onSelectGame={setCurrentGame} />;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Console Logger - Shows all console logs and errors */}
      <ConsoleLogger />

      {/* WebXR Status Banner */}
      {!webXRStatus.isSecure && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 68, 68, 0.95)",
            color: "white",
            padding: "20px 30px",
            borderRadius: "12px",
            zIndex: 3000,
            maxWidth: "600px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            border: "3px solid #ff0000",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            ⚠️ HTTPS Required for WebXR
          </div>
          <div
            style={{
              fontSize: "16px",
              marginBottom: "15px",
              lineHeight: "1.6",
            }}
          >
            Your app is being served over HTTP. WebXR requires HTTPS to work.
          </div>
          <div
            style={{
              fontSize: "14px",
              backgroundColor: "rgba(0,0,0,0.3)",
              padding: "15px",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <strong>Quick Fix for Quest 2:</strong>
            <ol style={{ margin: "10px 0", paddingLeft: "20px" }}>
              <li>
                Install ngrok:{" "}
                <code
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  npm install -g ngrok
                </code>
              </li>
              <li>
                Run:{" "}
                <code
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  ngrok http 3000
                </code>
              </li>
              <li>Use the HTTPS URL in Quest 2</li>
            </ol>
            <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.9 }}>
              See <strong>QUEST2_HTTPS_SETUP.md</strong> for detailed
              instructions
            </div>
          </div>
        </div>
      )}

      {/* VR/AR Control Buttons - Using built-in VRButton and ARButton components */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
          flexDirection: "column",
        }}
      >
        <VRButton
          store={xrStore}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#4a9eff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          🥽 Enter VR
        </VRButton>
        <ARButton
          store={xrStore}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#66bb6a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          📱 Enter AR
        </ARButton>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <XR
          store={xrStore}
          sessionInit={{
            optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
          }}
        >
          <VRScene>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="sunset" />
            {renderGame()}
          </VRScene>
        </XR>
      </Canvas>
    </div>
  );
}

export default App;
