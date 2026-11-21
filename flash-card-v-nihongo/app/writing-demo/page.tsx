import WritingPad from "../_components/WritingPad";

const reference = [[{ x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }]];

export default function WritingDemoPage() {
  return (
    <main className="p-6">
      <h1>Drawing pad test</h1>
        <p>Draw from the blue dot to the gray dot, then select Check.</p>
        <WritingPad reference={reference} showGuide />
    </main>
  );
}