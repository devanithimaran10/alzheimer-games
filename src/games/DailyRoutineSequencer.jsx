import React, { useState, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import BackButton from "../components/BackButton";
import GameCard from "../components/GameCard";
import * as THREE from "three";

const routines = [
  {
    name: "Making a Cup of Tea",
    steps: [
      { id: 1, text: "Boil water" },
      { id: 2, text: "Put tea bag in cup" },
      { id: 3, text: "Pour water" },
      { id: 4, text: "Add milk" },
    ],
  },
  {
    name: "Brushing Teeth",
    steps: [
      { id: 1, text: "Wet toothbrush" },
      { id: 2, text: "Add toothpaste" },
      { id: 3, text: "Brush teeth" },
      { id: 4, text: "Rinse mouth" },
    ],
  },
  {
    name: "Getting Dressed",
    steps: [
      { id: 1, text: "Put on underwear" },
      { id: 2, text: "Put on shirt" },
      { id: 3, text: "Put on pants" },
      { id: 4, text: "Put on shoes" },
    ],
  },
];

function DailyRoutineSequencer({ onBack }) {
  const [currentRoutine, setCurrentRoutine] = useState(0);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const routine = routines[currentRoutine];
  const availableSteps = routine.steps.filter(
    (step) => !selectedSteps.find((s) => s.id === step.id)
  );

  const handleStepClick = (step) => {
    if (completed) return;

    setSelectedSteps([...selectedSteps, step]);
    setShowHint(false);

    // Check if all steps are selected
    if (selectedSteps.length + 1 === routine.steps.length) {
      checkOrder([...selectedSteps, step]);
    }
  };

  const checkOrder = (steps) => {
    const isCorrect = steps.every((step, index) => step.id === index + 1);

    if (isCorrect) {
      setCompleted(true);
      setTimeout(() => {
        // Move to next routine or reset
        if (currentRoutine < routines.length - 1) {
          setCurrentRoutine(currentRoutine + 1);
          setSelectedSteps([]);
          setCompleted(false);
        } else {
          // All routines completed, reset
          setCurrentRoutine(0);
          setSelectedSteps([]);
          setCompleted(false);
        }
      }, 2000);
    } else {
      // Gently guide back - reset after a moment
      setTimeout(() => {
        setSelectedSteps([]);
        setShowHint(false);
      }, 1500);
    }
  };

  const handleHint = () => {
    if (selectedSteps.length < routine.steps.length) {
      const nextStepId = selectedSteps.length + 1;
      setShowHint(true);
    }
  };

  const resetCurrent = () => {
    setSelectedSteps([]);
    setShowHint(false);
    setCompleted(false);
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
        Daily Routine: {routine.name}
      </Text>

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Arrange the steps in the correct order
      </Text>

      {/* Selected steps sequence */}
      <group position={[0, 1.5, 0]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Your Sequence:
        </Text>
        {selectedSteps.map((step, index) => (
          <GameCard
            key={`selected-${step.id}`}
            position={[-3 + index * 2, 0, 0]}
            text={`${index + 1}. ${step.text}`}
            isSelected={true}
            isCorrect={completed ? true : null}
          />
        ))}
        {selectedSteps.length < routine.steps.length && showHint && (
          <GameCard
            position={[-3 + selectedSteps.length * 2, 0, 0]}
            text={`${selectedSteps.length + 1}. ${
              routine.steps[selectedSteps.length].text
            }`}
            isSelected={true}
            isCorrect={null}
          />
        )}
      </group>

      {/* Available steps */}
      <group position={[0, -0.5, 0]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Click to add:
        </Text>
        <group position={[0, -0.3, 0]}>
          {availableSteps.map((step, index) => (
            <GameCard
              key={step.id}
              position={[
                -2.25 + (index % 4) * 1.5,
                -Math.floor(index / 4) * 1.5,
                0,
              ]}
              text={step.text}
              onClick={() => handleStepClick(step)}
            />
          ))}
        </group>
      </group>

      {/* Hint and Reset buttons */}
      <group position={[0, -2.5, 0]}>
        <mesh onClick={handleHint} onPointerOver={(e) => e.stopPropagation()}>
          <boxGeometry args={[1.5, 0.6, 0.2]} />
          <meshStandardMaterial color="#ffa726" />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Hint
        </Text>

        <mesh
          position={[2, 0, 0]}
          onClick={resetCurrent}
          onPointerOver={(e) => e.stopPropagation()}
        >
          <boxGeometry args={[1.5, 0.6, 0.2]} />
          <meshStandardMaterial color="#66bb6a" />
        </mesh>
        <Text
          position={[2, 0, 0.15]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Reset
        </Text>
      </group>

      {completed && (
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.4}
          color="#4caf50"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Correct! Well done!
        </Text>
      )}

      <BackButton onBack={onBack} />
    </group>
  );
}

export default DailyRoutineSequencer;
