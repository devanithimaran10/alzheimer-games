import React, { useState, useEffect } from "react";
import { Text } from "@react-three/drei";
import BackButton from "../components/BackButton";
import GameCard from "../components/GameCard";

const puzzles = [
  {
    items: [
      { id: 1, name: "Dog", type: "animal", emoji: "🐕" },
      { id: 2, name: "Dog", type: "animal", emoji: "🐕" },
      { id: 3, name: "Dog", type: "animal", emoji: "🐕" },
      { id: 4, name: "Toaster", type: "appliance", emoji: "🍞" },
    ],
    oddOne: 4,
  },
  {
    items: [
      { id: 1, name: "Apple", type: "fruit", emoji: "🍎" },
      { id: 2, name: "Apple", type: "fruit", emoji: "🍎" },
      { id: 3, name: "Apple", type: "fruit", emoji: "🍎" },
      { id: 4, name: "Hammer", type: "tool", emoji: "🔨" },
    ],
    oddOne: 4,
  },
  {
    items: [
      { id: 1, name: "Car", type: "vehicle", emoji: "🚗" },
      { id: 2, name: "Car", type: "vehicle", emoji: "🚗" },
      { id: 3, name: "Car", type: "vehicle", emoji: "🚗" },
      { id: 4, name: "Tree", type: "plant", emoji: "🌳" },
    ],
    oddOne: 4,
  },
  {
    items: [
      { id: 1, name: "Book", type: "object", emoji: "📚" },
      { id: 2, name: "Book", type: "object", emoji: "📚" },
      { id: 3, name: "Book", type: "object", emoji: "📚" },
      { id: 4, name: "Bird", type: "animal", emoji: "🐦" },
    ],
    oddOne: 4,
  },
  {
    items: [
      { id: 1, name: "Shirt", type: "clothing", emoji: "👕" },
      { id: 2, name: "Shirt", type: "clothing", emoji: "👕" },
      { id: 3, name: "Shirt", type: "clothing", emoji: "👕" },
      { id: 4, name: "Phone", type: "device", emoji: "📱" },
    ],
    oddOne: 4,
  },
];

function SpotTheOddOne({ onBack }) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const puzzle = puzzles[currentPuzzle];
  const shuffledItems = [...puzzle.items].sort(() => Math.random() - 0.5);

  const handleItemClick = (item) => {
    if (showResult) return;

    setSelectedItem(item);
    const isCorrect = item.id === puzzle.oddOne;
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      // Move to next puzzle
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(currentPuzzle + 1);
        setSelectedItem(null);
        setShowResult(false);
      } else {
        // All puzzles completed, reset
        setCurrentPuzzle(0);
        setSelectedItem(null);
        setShowResult(false);
        setRound(round + 1);
        setScore(0);
      }
    }, 2500);
  };

  const resetGame = () => {
    setCurrentPuzzle(0);
    setSelectedItem(null);
    setShowResult(false);
    setScore(0);
    setRound(1);
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
        Spot the Odd One
      </Text>

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Puzzle {currentPuzzle + 1} of {puzzles.length} - Round {round} - Score:{" "}
        {score}
      </Text>

      <Text
        position={[0, 2.2, 0]}
        fontSize={0.3}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        Find the item that is different:
      </Text>

      {/* Grid of items */}
      <group position={[0, 0.5, 0]}>
        {shuffledItems.map((item, index) => {
          const isOddOne = item.id === puzzle.oddOne;
          const isSelected = selectedItem?.id === item.id;

          let xPos, yPos;
          if (index === 0) {
            xPos = -1.5;
            yPos = 0.75;
          } else if (index === 1) {
            xPos = 1.5;
            yPos = 0.75;
          } else if (index === 2) {
            xPos = -1.5;
            yPos = -0.75;
          } else {
            xPos = 1.5;
            yPos = -0.75;
          }

          return (
            <group key={item.id} position={[xPos, yPos, 0]}>
              <mesh
                onClick={() => handleItemClick(item)}
                onPointerOver={(e) => e.stopPropagation()}
              >
                <boxGeometry args={[2, 2, 0.1]} />
                <meshStandardMaterial
                  color={
                    showResult
                      ? isOddOne
                        ? "#4caf50"
                        : isSelected
                        ? "#ff9800"
                        : "#4a9eff"
                      : isSelected
                      ? "#2196f3"
                      : "#4a9eff"
                  }
                />
              </mesh>
              <Text
                position={[0, 0.3, 0.1]}
                fontSize={1}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {item.emoji}
              </Text>
              <Text
                position={[0, -0.5, 0.1]}
                fontSize={0.2}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {item.name}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Result feedback */}
      {showResult && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.4}
          color={selectedItem.id === puzzle.oddOne ? "#4caf50" : "#ff9800"}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {selectedItem.id === puzzle.oddOne
            ? "Correct! Well spotted!"
            : "Not quite. Look for the one that's different from the others."}
        </Text>
      )}

      {/* Reset button */}
      <mesh position={[4, 3.5, 0]} onClick={resetGame}>
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

      <BackButton onBack={onBack} />
    </group>
  );
}

export default SpotTheOddOne;
