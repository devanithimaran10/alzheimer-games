import React from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import * as THREE from "three";

const GAMES = {
  DAILY_ROUTINE: "daily_routine",
  MUSICAL_TIME_TRAVEL: "musical_time_travel",
  MEMORY_TRAY: "memory_tray",
  GROCERY_AISLE: "grocery_aisle",
  FACES_AND_NAMES: "faces_and_names",
  SPOT_THE_ODD_ONE: "spot_the_odd_one",
};

const gameOptions = [
  {
    id: GAMES.DAILY_ROUTINE,
    name: "Daily Routine",
    description: "Arrange steps in order",
  },
  {
    id: GAMES.MUSICAL_TIME_TRAVEL,
    name: "Musical Time Travel",
    description: "Finish the lyric",
  },
  {
    id: GAMES.MEMORY_TRAY,
    name: "Memory Tray",
    description: "Remember the items",
  },
  {
    id: GAMES.GROCERY_AISLE,
    name: "Grocery Aisle",
    description: "Sort items correctly",
  },
  {
    id: GAMES.FACES_AND_NAMES,
    name: "Faces & Names",
    description: "Match photos to names",
  },
  {
    id: GAMES.SPOT_THE_ODD_ONE,
    name: "Spot the Odd One",
    description: "Find the different item",
  },
];

function Button({
  position,
  text,
  description,
  onClick,
  isHovered,
  setIsHovered,
}) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const scale = isHovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <boxGeometry args={[1.8, 0.4, 0.15]} />
        <meshStandardMaterial color={isHovered ? "#4a9eff" : "#2a5a9f"} />
      </mesh>
      <Text
        position={[0, 0.08, 0.12]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.7}
      >
        {text}
      </Text>
      <Text
        position={[0, -0.08, 0.12]}
        fontSize={0.08}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.7}
      >
        {description}
      </Text>
    </group>
  );
}

function MainMenu({ onSelectGame }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  // Calculate centered vertical positioning for all 6 buttons
  // Total height: 6 buttons * 0.6 spacing = 3.6 units
  // Center at 0, so start at 1.8 and go down to -1.8
  const startY = 1.5;
  const spacing = 0.6;

  return (
    <group>
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Therapy Games
      </Text>

      {gameOptions.map((game, index) => (
        <Button
          key={game.id}
          position={[0, startY - index * spacing, 0]}
          text={game.name}
          description={game.description}
          onClick={() => onSelectGame(game.id)}
          isHovered={hoveredButton === game.id}
          setIsHovered={(hovered) => setHoveredButton(hovered ? game.id : null)}
        />
      ))}
    </group>
  );
}

export default MainMenu;
