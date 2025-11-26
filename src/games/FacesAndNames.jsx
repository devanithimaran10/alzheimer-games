import React, { useState } from "react";
import { Text } from "@react-three/drei";
import BackButton from "../components/BackButton";
import GameCard from "../components/GameCard";

// Note: In a real implementation, you would load actual family photos
// For now, we'll use placeholder names that can be replaced with actual photos
const people = [
  { id: 1, name: "Grandson", photo: "👦", relationship: "Grandson" },
  { id: 2, name: "Granddaughter", photo: "👧", relationship: "Granddaughter" },
  { id: 3, name: "Son", photo: "👨", relationship: "Son" },
  { id: 4, name: "Daughter", photo: "👩", relationship: "Daughter" },
  { id: 5, name: "Elvis Presley", photo: "🎤", relationship: "Famous Singer" },
  {
    id: 6,
    name: "Marilyn Monroe",
    photo: "💃",
    relationship: "Famous Actress",
  },
  { id: 7, name: "Gandhi", photo: "🕊️", relationship: "Historical Figure" },
  { id: 8, name: "Spouse", photo: "💑", relationship: "Spouse" },
];

function FacesAndNames({ onBack }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  // Shuffle people for each round
  const shuffledPeople = [...people].sort(() => Math.random() - 0.5);
  const availablePeople = shuffledPeople.filter(
    (person) => !matchedPairs.find((pair) => pair.id === person.id)
  );

  const handlePhotoClick = (person) => {
    if (matchedPairs.find((pair) => pair.id === person.id)) return;

    if (selectedPhoto === person) {
      setSelectedPhoto(null);
    } else {
      setSelectedPhoto(person);
      if (selectedName && selectedName.id === person.id) {
        // Match found!
        setMatchedPairs([...matchedPairs, person]);
        setScore(score + 1);
        setSelectedPhoto(null);
        setSelectedName(null);

        // Check if all matched
        if (matchedPairs.length + 1 === people.length) {
          setTimeout(() => {
            setRound(round + 1);
            setMatchedPairs([]);
            setScore(0);
          }, 2000);
        }
      }
    }
  };

  const handleNameClick = (person) => {
    if (matchedPairs.find((pair) => pair.id === person.id)) return;

    if (selectedName === person) {
      setSelectedName(null);
    } else {
      setSelectedName(person);
      if (selectedPhoto && selectedPhoto.id === person.id) {
        // Match found!
        setMatchedPairs([...matchedPairs, person]);
        setScore(score + 1);
        setSelectedPhoto(null);
        setSelectedName(null);

        // Check if all matched
        if (matchedPairs.length + 1 === people.length) {
          setTimeout(() => {
            setRound(round + 1);
            setMatchedPairs([]);
            setScore(0);
          }, 2000);
        }
      }
    }
  };

  const resetRound = () => {
    setMatchedPairs([]);
    setSelectedPhoto(null);
    setSelectedName(null);
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
        Faces & Names
      </Text>

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Match the photo to the name - Round {round} - Matched: {score}/
        {people.length}
      </Text>

      {/* Photos section */}
      <group position={[0, 1.5, 0]}>
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Photos:
        </Text>
        <group position={[0, 0, 0]}>
          {availablePeople.map((person, index) => {
            const isMatched = matchedPairs.find(
              (pair) => pair.id === person.id
            );
            const isSelected = selectedPhoto?.id === person.id;

            return (
              <group
                key={person.id}
                position={[
                  -3 + (index % 4) * 2,
                  -Math.floor(index / 4) * 1.5,
                  0,
                ]}
              >
                <mesh
                  onClick={() => !isMatched && handlePhotoClick(person)}
                  onPointerOver={(e) => e.stopPropagation()}
                >
                  <boxGeometry args={[1.5, 1.5, 0.1]} />
                  <meshStandardMaterial
                    color={
                      isMatched ? "#4caf50" : isSelected ? "#2196f3" : "#4a9eff"
                    }
                  />
                </mesh>
                <Text
                  position={[0, 0, 0.1]}
                  fontSize={0.8}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {person.photo}
                </Text>
                {isMatched && (
                  <Text
                    position={[0, -0.9, 0.1]}
                    fontSize={0.2}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                  >
                    ✓
                  </Text>
                )}
              </group>
            );
          })}
        </group>
      </group>

      {/* Names section */}
      <group position={[0, -1.5, 0]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Names:
        </Text>
        <group position={[0, -0.3, 0]}>
          {availablePeople.map((person, index) => {
            const isMatched = matchedPairs.find(
              (pair) => pair.id === person.id
            );
            const isSelected = selectedName?.id === person.id;

            return (
              <GameCard
                key={person.id}
                position={[
                  -3 + (index % 4) * 2,
                  -Math.floor(index / 4) * 1.2,
                  0,
                ]}
                text={person.name}
                onClick={() => !isMatched && handleNameClick(person)}
                isSelected={isSelected}
                isCorrect={isMatched ? true : null}
              />
            );
          })}
        </group>
      </group>

      {/* Instructions */}
      {selectedPhoto && !selectedName && (
        <Text
          position={[0, -3, 0]}
          fontSize={0.25}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          Now click the matching name
        </Text>
      )}

      {selectedName && !selectedPhoto && (
        <Text
          position={[0, -3, 0]}
          fontSize={0.25}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          Now click the matching photo
        </Text>
      )}

      {/* Reset button */}
      <mesh position={[4, 3.5, 0]} onClick={resetRound}>
        <boxGeometry args={[1.0, 0.4, 0.15]} />
        <meshStandardMaterial color="#66bb6a" />
      </mesh>
      <Text
        position={[4, 3.5, 0.15]}
        fontSize={0.16}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Reset
      </Text>

      {matchedPairs.length === people.length && (
        <Text
          position={[0, -3.5, 0]}
          fontSize={0.4}
          color="#4caf50"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Perfect! All matches found!
        </Text>
      )}

      <BackButton onBack={onBack} />
    </group>
  );
}

export default FacesAndNames;
