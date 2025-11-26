import React, { useState, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import BackButton from "../components/BackButton";
import GameCard from "../components/GameCard";
import * as THREE from "three";

const categories = [
  { id: "fruit", name: "Fruit", color: "#ff6b6b", position: [-3, 0, 0] },
  { id: "tools", name: "Tools", color: "#4ecdc4", position: [3, 0, 0] },
  {
    id: "vegetables",
    name: "Vegetables",
    color: "#95e1d3",
    position: [-3, -2, 0],
  },
  { id: "clothing", name: "Clothing", color: "#f38181", position: [3, -2, 0] },
];

const items = [
  { id: 1, name: "Apple", category: "fruit", color: "#ff6b6b" },
  { id: 2, name: "Hammer", category: "tools", color: "#4ecdc4" },
  { id: 3, name: "Banana", category: "fruit", color: "#ffd93d" },
  { id: 4, name: "Screwdriver", category: "tools", color: "#6c5ce7" },
  { id: 5, name: "Carrot", category: "vegetables", color: "#ff9800" },
  { id: 6, name: "Shirt", category: "clothing", color: "#2196f3" },
  { id: 7, name: "Orange", category: "fruit", color: "#ff6b00" },
  { id: 8, name: "Wrench", category: "tools", color: "#607d8b" },
  { id: 9, name: "Broccoli", category: "vegetables", color: "#4caf50" },
  { id: 10, name: "Pants", category: "clothing", color: "#9c27b0" },
];

function GroceryAisleSorter({ onBack }) {
  const [availableItems, setAvailableItems] = useState([...items]);
  const [sortedItems, setSortedItems] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const handleItemClick = (item) => {
    setDraggedItem(item);
  };

  const handleCategoryClick = (categoryId) => {
    if (!draggedItem) return;

    const isCorrect = draggedItem.category === categoryId;

    if (isCorrect) {
      // Correct placement
      setSortedItems({
        ...sortedItems,
        [categoryId]: [...(sortedItems[categoryId] || []), draggedItem],
      });
      setAvailableItems(availableItems.filter((i) => i.id !== draggedItem.id));
      setScore(score + 1);

      // Check if all items are sorted
      if (availableItems.length === 1) {
        setTimeout(() => {
          // Reset for next round
          setRound(round + 1);
          setAvailableItems([...items]);
          setSortedItems({});
          setScore(0);
        }, 2000);
      }
    } else {
      // Incorrect - gently bounce back (visual feedback)
      setTimeout(() => {
        setDraggedItem(null);
      }, 300);
    }
  };

  const resetRound = () => {
    setAvailableItems([...items]);
    setSortedItems({});
    setDraggedItem(null);
    setScore(0);
  };

  return (
    <group>
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Grocery Aisle Sorter
      </Text>

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Sort items into the correct containers - Round {round} - Score: {score}/
        {items.length}
      </Text>

      {/* Category containers */}
      {categories.map((category) => (
        <group key={category.id} position={category.position}>
          <mesh
            onClick={() => handleCategoryClick(category.id)}
            onPointerOver={(e) => e.stopPropagation()}
          >
            <boxGeometry args={[2, 2.5, 0.2]} />
            <meshStandardMaterial
              color={
                draggedItem && draggedItem.category === category.id
                  ? "#4caf50"
                  : category.color
              }
              opacity={0.7}
              transparent
            />
          </mesh>
          <Text
            position={[0, 1.2, 0.15]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {category.name}
          </Text>

          {/* Show sorted items in this category */}
          {(sortedItems[category.id] || []).map((item, index) => (
            <GameCard
              key={item.id}
              position={[
                -0.5 + (index % 2) * 1,
                -0.5 - Math.floor(index / 2) * 1,
                0.1,
              ]}
              text={item.name}
              isCorrect={true}
            />
          ))}
        </group>
      ))}

      {/* Available items to sort */}
      <group position={[0, -3.5, 0]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Click an item, then click a container:
        </Text>
        <group position={[0, -0.3, 0]}>
          {availableItems.map((item, index) => (
            <GameCard
              key={item.id}
              position={[
                -3 + (index % 5) * 1.5,
                -Math.floor(index / 5) * 1.2,
                0,
              ]}
              text={item.name}
              onClick={() => handleItemClick(item)}
              isSelected={draggedItem?.id === item.id}
            />
          ))}
        </group>
      </group>

      {draggedItem && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          Selected: {draggedItem.name} - Click a container to sort
        </Text>
      )}

      {/* Reset button */}
      <mesh position={[4, 3.5, 0]} onClick={resetRound}>
        <boxGeometry args={[1.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#66bb6a" />
      </mesh>
      <Text
        position={[4, 3.5, 0.15]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Reset
      </Text>

      {availableItems.length === 0 && (
        <Text
          position={[0, -1, 0]}
          fontSize={0.4}
          color="#4caf50"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Perfect! All sorted correctly!
        </Text>
      )}

      <BackButton onBack={onBack} />
    </group>
  );
}

export default GroceryAisleSorter;
