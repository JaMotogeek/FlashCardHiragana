"use client";

import { useState } from "react";

import { getKanaReference } from "../../lib/kanaReferences";
import WritingPad from "./WritingPad";

type Card = {
  front: string;
  back: string;
};

const cards: Card[] = [
  { front: "あ", back: "a" },
  { front: "い", back: "i" },
  { front: "う", back: "u" },
  { front: "え", back: "e" },
  { front: "お", back: "o" },
  { front: "か", back: "ka" },
  { front: "く", back: "ku" },
];

function shuffleDeck(deck: Card[]) {
  return [...deck].sort(() => Math.random() - 0.5);
}

export default function FlashCard() {
  const [shuffledDeck] = useState<Card[]>(() => shuffleDeck(cards));
  const [currentCard, setCurrentCard] = useState<Card>(
    () => shuffledDeck[0]
  );
  const [deck, setDeck] = useState<Card[]>(() => shuffledDeck.slice(1));
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(0);

  const writingReference = getKanaReference(currentCard.front);

  function flipCard() {
    setIsFlipped((previous) => !previous);
  }

  function getNextCard() {
    let nextDeck = [...deck];
    let nextDiscardPile = [...discardPile, currentCard];

    if (nextDeck.length === 0) {
      nextDeck = shuffleDeck(nextDiscardPile);
      nextDiscardPile = [];
    }

    const nextCard = nextDeck[0];

    setCurrentCard(nextCard);
    setDeck(nextDeck.slice(1));
    setDiscardPile(nextDiscardPile);
    setIsFlipped(false);
    setAttemptNumber((previous) => previous + 1);
  }

  return (
    <div className="flashcard-container">
      <button type="button" onClick={flipCard} className="flashcard">
        <div
          className={`flashcard-inner ${
            isFlipped ? "flashcard-flipped" : ""
          }`}
        >
          <div className="flashcard-face flashcard-front">
            {currentCard.front}
          </div>

          <div className="flashcard-face flashcard-back">
            {currentCard.back}
          </div>
        </div>
      </button>

      <button type="button" onClick={getNextCard} className="next-button">
        Next
      </button>

      {writingReference && (
        <WritingPad
          key={attemptNumber}
          reference={writingReference}
          showGuide
        />
      )}
    </div>
  );
}