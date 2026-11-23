"use client";

import dynamic from "next/dynamic";

const FlashCardLoader = dynamic(() => import("./FlashCard"), {
  ssr: false,
  loading: () => <p role="status">Loading flashcards…</p>,
});

export default FlashCardLoader;