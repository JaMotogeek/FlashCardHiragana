"use client";

import { useState } from "react";
import WritingPad from "../_components/WritingPad";
import { kanaReferences } from "../../lib/kanaReferences";

type Kana = keyof typeof kanaReferences;

const readings: Record<Kana, string> = {
  か: "ka",
  く: "ku",
};

export default function WritingDemoPage() {
  const [kana, setKana] = useState<Kana>("か");

  return (
    <main className="space-y-3 p-6">
      <h1>
        Writing practice · <span lang="ja">{kana}</span> ({readings[kana]})
      </h1>

      <button
        type="button"
        className="rounded border border-current px-3 py-2"
        onClick={() => setKana((current) => (current === "か" ? "く" : "か"))}
      >
        Practice {kana === "か" ? "く (ku)" : "か (ka)"}
      </button>

      <p>
        Follow the dashed paths in number order. Lift after each stroke,
        then select Check.
      </p>

      <WritingPad key={kana} reference={kanaReferences[kana]} showGuide />
    </main>
  );
}