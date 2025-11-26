import React, { useState, useRef } from "react";
import { Text } from "@react-three/drei";
import BackButton from "../components/BackButton";
import GameCard from "../components/GameCard";

// Note: In a real implementation, you would load actual audio files
// For now, we'll simulate with text prompts
const songs = [
  {
    title: "You Are My Sunshine",
    lyric: "You are my sunshine, my only sunshine...",
    options: [
      { text: "You make me happy", correct: true },
      { text: "You make me sad", correct: false },
    ],
    era: "1940s",
  },
  {
    title: "Somewhere Over the Rainbow",
    lyric: "Somewhere over the rainbow, way up high...",
    options: [
      { text: "There's a land that I heard of", correct: true },
      { text: "There's a place I don't know", correct: false },
    ],
    era: "1930s",
  },
  {
    title: "Blue Moon",
    lyric: "Blue moon, you saw me standing alone...",
    options: [
      { text: "Without a dream in my heart", correct: true },
      { text: "Without a care in the world", correct: false },
    ],
    era: "1930s",
  },
  {
    title: "Moon River",
    lyric: "Moon river, wider than a mile...",
    options: [
      { text: "I'm crossing you in style", correct: true },
      { text: "I'm sailing you tonight", correct: false },
    ],
    era: "1960s",
  },
];

function MusicalTimeTravel({ onBack }) {
  const [currentSong, setCurrentSong] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const song = songs[currentSong];

  const handleOptionClick = (option) => {
    if (showResult) return;

    setSelectedOption(option);
    setShowResult(true);

    if (option.correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      // Move to next song
      if (currentSong < songs.length - 1) {
        setCurrentSong(currentSong + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        // All songs completed, reset
        setCurrentSong(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
      }
    }, 2500);
  };

  const resetGame = () => {
    setCurrentSong(0);
    setSelectedOption(null);
    setShowResult(false);
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
        Musical Time Travel
      </Text>

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Song {currentSong + 1} of {songs.length} - {song.era}
      </Text>

      <Text
        position={[0, 2.2, 0]}
        fontSize={0.35}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {song.title}
      </Text>

      {/* Lyric display */}
      <group position={[0, 1.2, 0]}>
        <mesh>
          <boxGeometry args={[6, 1.5, 0.1]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <Text
          position={[0, 0.3, 0.1]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={5.5}
        >
          {song.lyric}
        </Text>
        <Text
          position={[0, -0.3, 0.1]}
          fontSize={0.25}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          ...?
        </Text>
      </group>

      {/* Options */}
      <group position={[0, -0.5, 0]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Complete the lyric:
        </Text>
        {song.options.map((option, index) => (
          <GameCard
            key={index}
            position={[0, -0.5 - index * 1.2, 0]}
            text={option.text}
            onClick={() => handleOptionClick(option)}
            isCorrect={
              showResult
                ? option.correct
                  ? true
                  : selectedOption === option
                  ? false
                  : null
                : null
            }
          />
        ))}
      </group>

      {/* Result feedback */}
      {showResult && (
        <Text
          position={[0, -2.8, 0]}
          fontSize={0.4}
          color={selectedOption.correct ? "#4caf50" : "#ff9800"}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {selectedOption.correct
            ? "Correct! Beautiful!"
            : "Not quite, but that's okay!"}
        </Text>
      )}

      {/* Score */}
      <Text
        position={[-4, 3.5, 0]}
        fontSize={0.3}
        color="#ffd700"
        anchorX="left"
        anchorY="middle"
      >
        Score: {score}/{currentSong + (showResult ? 1 : 0)}
      </Text>

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

export default MusicalTimeTravel;
