import React, { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GameCard({
  position,
  image,
  text,
  onClick,
  isSelected = false,
  isCorrect = null,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      const scale = hovered ? 1.05 : isSelected ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  let color = "#4a9eff";
  if (isCorrect === true) color = "#4caf50";
  if (isCorrect === false) color = "#ff9800";
  if (isSelected) color = "#2196f3";

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.2, 1.2, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {text && (
        <Text
          position={[0, -0.7, 0.08]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.1}
        >
          {text}
        </Text>
      )}
    </group>
  );
}

export default GameCard;
