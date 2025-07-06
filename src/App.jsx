import { useState } from 'react';

const positions = ["UTG", "MP", "CO", "Button", "SB", "BB"];
const actions = ["None", "Raise", "Call"];
const hands = [
  "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22",
  "AKs", "AQs", "AJs", "ATs", "KQs", "KJs", "QJs", "JTs", "T9s", "98s",
  "AKo", "AQo", "AJo", "KQo", "KJo", "QJo"
];

const gtoRecommendations = {
  Button: {
    AKs: { None: "Raise (2.5BB)", Raise: "Call", Call: "Raise (4BB)" },
    AQo: { None: "Raise (2.5BB)", Raise: "Fold", Call: "Raise (4BB)" }
  }
};

export default function App() {
  const [hand, setHand] = useState("AKs");
  const [position, setPosition] = useState("Button");
  const [opponentAction, setOpponentAction] = useState("None");
  const [stackSize, setStackSize] = useState(100);
  const [potSize, setPotSize] = useState(3);

  const baseRecommendation = gtoRecommendations[position]?.[hand]?.[opponentAction] || "데이터 없음";
  const sprValue = stackSize && potSize ? stackSize / potSize : 0;
  const spr = sprValue.toFixed(2);
  const filteredRecommendation = sprValue <= 2 && baseRecommendation !== "데이터 없음"
    ? "Push All-in (SPR<2)"
    : baseRecommendation;

  return (
    <div style={{ padding: 20, maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>GTO Poker Chatbot</h2>

      <label>내 핸드</label><br />
      <select value={hand} onChange={e => setHand(e.target.value)} style={{ width: '100%', marginBottom: 10 }}>
        {hands.map(h => <option key={h}>{h}</option>)}
      </select>

      <label>포지션</label><br />
      <select value={position} onChange={e => setPosition(e.target.value)} style={{ width: '100%', marginBottom: 10 }}>
        {positions.map(p => <option key={p}>{p}</option>)}
      </select>

      <label>상대 액션</label><br />
      {actions.map(act => (
        <button key={act} onClick={() => setOpponentAction(act)} style={{ margin: '5px', padding: '8px 12px' }}>
          {act}
        </button>
      ))}

      <div style={{ marginTop: 20 }}>
        <label>스택 크기 (BB)</label><br />
        <input type="number" value={stackSize} onChange={e => setStackSize(Number(e.target.value))} style={{ width: '100%' }} />
        <label>팟 크기 (BB)</label><br />
        <input type="number" value={potSize} onChange={e => setPotSize(Number(e.target.value))} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: 20, background: '#f0f0f0', padding: 10 }}>
        <strong>GTO 추천 액션:</strong><br />
        {filteredRecommendation} (SPR: {spr})
      </div>
    </div>
  );
}