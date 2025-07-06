
import { useState, useEffect } from 'react';

const positions = ["UTG", "MP", "CO", "Button", "SB", "BB"];
const actions = ["None", "Raise", "Call"];
const hands = [
  "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22",
  "AKs", "AQs", "AJs", "ATs", "KQs", "KJs", "QJs", "JTs", "T9s", "98s",
  "AKo", "AQo", "AJo", "KQo", "KJo", "QJo"
];

export default function App() {
  const [hand, setHand] = useState("AKs");
  const [position, setPosition] = useState("Button");
  const [opponentAction, setOpponentAction] = useState("None");
  const [stackSize, setStackSize] = useState(100);
  const [potSize, setPotSize] = useState(3);
  const [gtoData, setGtoData] = useState([]);
  const [recommendation, setRecommendation] = useState("데이터 없음");

  useEffect(() => {
    fetch("/gto_data.json")
      .then(res => res.json())
      .then(data => setGtoData(data))
      .catch(err => console.error("GTO 데이터 불러오기 실패:", err));
  }, []);

  useEffect(() => {
    const sprValue = potSize ? stackSize / potSize : 0;
    const roundedSpr = Math.round(sprValue * 10) / 10;

    const match = gtoData.find(item =>
      item.hand === hand &&
      item.position === position &&
      item.opponentAction === opponentAction &&
      Math.round(item.spr * 10) / 10 === roundedSpr
    );

    if (sprValue <= 2 && match) {
      setRecommendation("Push All-in (SPR<2)");
    } else if (match) {
      setRecommendation(match.action);
    } else {
      setRecommendation("데이터 없음");
    }
  }, [hand, position, opponentAction, stackSize, potSize, gtoData]);

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
      <div>
        {actions.map(act => (
          <button
            key={act}
            onClick={() => setOpponentAction(act)}
            className={opponentAction === act ? "selected" : ""}
            style={{ margin: '5px', padding: '8px 12px' }}
          >
            {act}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <label>스택 크기 (BB)</label><br />
        <input type="number" value={stackSize} onChange={e => setStackSize(Number(e.target.value))} style={{ width: '100%' }} />
        <label>팟 크기 (BB)</label><br />
        <input type="number" value={potSize} onChange={e => setPotSize(Number(e.target.value))} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: 20, background: '#f0f0f0', padding: 10 }}>
        <strong>GTO 추천 액션:</strong><br />
        {recommendation} (SPR: {(potSize ? (stackSize / potSize).toFixed(2) : 0)})
      </div>
    </div>
  );
}
