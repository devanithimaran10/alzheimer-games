import React, { useState, useEffect } from "react";
import { Text } from "@react-three/drei";
import BackButton from "../components/BackButton";
import GameCard from "../components/GameCard";

const items = [
  { id: 1, name: "Keys", color: "#ff6b6b" },
  { id: 2, name: "Glasses", color: "#4ecdc4" },
  { id: 3, name: "Apple", color: "#95e1d3" },
  { id: 4, name: "Comb", color: "#f38181" },
  { id: 5, name: "Watch", color: "#aa96da" },
  { id: 6, name: "Pen", color: "#fcbad3" },
  { id: 7, name: "Book", color: "#a8e6cf" },
  { id: 8, name: "Phone", color: "#ffd3a5" },
];

function MemoryTray({ onBack }) {
  const [level, setLevel] = useState(1); // 1 = Easy, 2 = Hard
  const [trayItems, setTrayItems] = useState([]);
  const [showTray, setShowTray] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [correctItem, setCorrectItem] = useState(null);
  const [distractor, setDistractor] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const startNewRound = () => {
    const itemCount = level === 1 ? 3 : 5;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const newTrayItems = shuffled.slice(0, itemCount);

    setTrayItems(newTrayItems);
    setShowTray(true);
    setSelectedItems([]);
    setShowQuestion(false);
    setResult(null);

    // Hide tray after 30 seconds
    setTimeout(() => {
      setShowTray(false);
      setShowQuestion(true);

      if (level === 1) {
        // Easy: Show correct item and one distractor
        setCorrectItem(newTrayItems[0]);
        const otherItems = items.filter(
          (item) => !newTrayItems.find((ti) => ti.id === item.id)
        );
        setDistractor(
          otherItems[Math.floor(Math.random() * otherItems.length)]
        );
      }
    }, 30000);
  };

  useEffect(() => {
    startNewRound();
  }, [level]);

  const handleItemClick = (item) => {
    if (level === 1) {
      // Easy level: just click the correct one
      if (item.id === correctItem.id) {
        setResult(true);
        setScore(score + 1);
        setTimeout(() => {
          setRound(round + 1);
          startNewRound();
        }, 2000);
      } else {
        setResult(false);
        setTimeout(() => {
          setRound(round + 1);
          startNewRound();
        }, 2000);
      }
    } else {
      // Hard level: select multiple items
      if (selectedItems.find((si) => si.id === item.id)) {
        setSelectedItems(selectedItems.filter((si) => si.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const checkHardLevel = () => {
    const selectedIds = selectedItems.map((si) => si.id).sort();
    const trayIds = trayItems.map((ti) => ti.id).sort();

    if (
      selectedIds.length === trayIds.length &&
      selectedIds.every((id, index) => id === trayIds[index])
    ) {
      setResult(true);
      setScore(score + 1);
    } else {
      setResult(false);
    }

    setTimeout(() => {
      setRound(round + 1);
      startNewRound();
    }, 2000);
  };

  const changeLevel = () => {
    setLevel(level === 1 ? 2 : 1);
    setRound(1);
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
        Memory Tray
      </Text>

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Level {level === 1 ? "Easy" : "Hard"} - Round {round} - Score: {score}
      </Text>

      {showTray && (
        <>
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.3}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
          >
            Look carefully at the tray...
          </Text>
          <group position={[0, 0, 0]}>
            {trayItems.map((item, index) => (
              <group
                key={item.id}
                position={[
                  -2 + (index % 3) * 2,
                  -Math.floor(index / 3) * 1.5,
                  0,
                ]}
              >
                <mesh>
                  <boxGeometry args={[1, 1, 0.1]} />
                  <meshStandardMaterial color={item.color} />
                </mesh>
                <Text
                  position={[0, -0.7, 0.1]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {item.name}
                </Text>
              </group>
            ))}
          </group>
        </>
      )}

      {showQuestion && level === 1 && (
        <>
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.35}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Which item was on the tray?
          </Text>
          <group position={[0, 0, 0]}>
            <GameCard
              position={[-1.5, 0, 0]}
              text={correctItem.name}
              onClick={() => handleItemClick(correctItem)}
              isCorrect={
                result === true ? true : result === false ? null : null
              }
            />
            <GameCard
              position={[1.5, 0, 0]}
              text={distractor.name}
              onClick={() => handleItemClick(distractor)}
              isCorrect={result === false ? false : null}
            />
          </group>
        </>
      )}

      {showQuestion && level === 2 && (
        <>
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.35}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Tap all the items you saw:
          </Text>
          <group position={[0, -0.5, 0]}>
            {items.map((item, index) => {
              const isSelected = selectedItems.find((si) => si.id === item.id);
              const wasOnTray = trayItems.find((ti) => ti.id === item.id);
              return (
                <GameCard
                  key={item.id}
                  position={[
                    -3 + (index % 4) * 2,
                    -Math.floor(index / 4) * 1.5,
                    0,
                  ]}
                  text={item.name}
                  onClick={() => handleItemClick(item)}
                  isSelected={isSelected}
                  isCorrect={
                    result !== null ? (wasOnTray ? true : false) : null
                  }
                />
              );
            })}
          </group>
          <mesh position={[0, -2.5, 0]} onClick={checkHardLevel}>
            <boxGeometry args={[2, 0.8, 0.2]} />
            <meshStandardMaterial color="#4caf50" />
          </mesh>
          <Text
            position={[0, -2.5, 0.15]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Check Answer
          </Text>
        </>
      )}

      {result !== null && (
        <Text
          position={[0, -3, 0]}
          fontSize={0.4}
          color={result ? "#4caf50" : "#ff9800"}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {result ? "Excellent memory!" : "Good try! Let's try again."}
        </Text>
      )}

      {/* Level toggle */}
      <mesh position={[-4, 3.5, 0]} onClick={changeLevel}>
        <boxGeometry args={[1.5, 0.5, 0.2]} />
        <meshStandardMaterial color="#9c27b0" />
      </mesh>
      <Text
        position={[-4, 3.5, 0.15]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Level {level === 1 ? 2 : 1}
      </Text>

      <BackButton onBack={onBack} />
    </group>
  );
}

export default MemoryTray;
