import { useEffect, useState } from "react";
import "./styles.css";

function App() {
  const animals = [
    ["🐶", "강아지"],
    ["🐱", "고양이"],
    ["🐰", "토끼"],
    ["🐻", "곰"],
    ["🐼", "판다"],
    ["🦊", "여우"],
    ["🐸", "개구리"],
    ["🐵", "원숭이"],
    ["🐹", "햄스터"],
    ["🐥", "병아리"],
  ];

  const [sentences, setSentences] = useState([]);
  const [input, setInput] = useState("");
  const [bubble, setBubble] = useState("안녕! 무엇을 배워볼까?💭");
  const [animal, setAnimal] = useState(["🐶", "강아지"]);
  const [editIndex, setEditIndex] = useState(-1);

  // GET (서버 기준 데이터 동기화)
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        "https://animal-talk.duckdns.org/messages"
      );
      const data = await res.json();

      const messages = data.map((item) => item.message);
      setSentences(messages);
    } catch (error) {
      console.error(error);
    }
  };

  // 처음 로딩
  useEffect(() => {
    fetchMessages();
  }, []);

  // 저장 / 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sentence = input.trim();
    if (!sentence) return;

    try {
      await fetch("https://animal-talk.duckdns.org/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: sentence,
        }),
      });

      setInput("");
      setBubble(sentence);
      setEditIndex(-1);

      // 🔥 핵심: 서버 기준 재동기화
      fetchMessages();
    } catch (error) {
      console.error(error);
      alert("서버 연결 실패");
    }
  };

  // 수정 버튼
  const editSentence = (index) => {
    setInput(sentences[index]);
    setEditIndex(index);
  };

  // 삭제 (핵심 수정)
  const deleteSentence = async (index) => {
    try {
      await fetch(
        `https://animal-talk.duckdns.org/messages/${index + 1}`,
        {
          method: "DELETE",
        }
      );

      // 🔥 핵심: 서버 기준 다시 가져오기
      fetchMessages();
      setEditIndex(-1);
    } catch (error) {
      console.error(error);
      alert("삭제 실패");
    }
  };

  // 말하기
  const handleSpeak = () => {
    const lastSentence =
      sentences[sentences.length - 1];

    setBubble(
      input.trim() ||
        lastSentence ||
        "먼저 문장을 입력해줘!"
    );
  };

  // 랜덤 동물
  const randomAnimal = () => {
    const randomIndex = Math.floor(
      Math.random() * animals.length
    );

    setAnimal(animals[randomIndex]);
  };

  return (
    <main>
      <section className="box">
        <h1>귀요미들에게 말을 가르쳐보세요!</h1>

        <div className="animal-area">
          <div className="bubble">{bubble}</div>
          <div className="animal">{animal[0]}</div>
          <h2>{animal[1]}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="가르칠 문장을 입력하세요"
          />
          <button type="submit">
            {editIndex === -1 ? "저장" : "수정"}
          </button>
        </form>

        <button onClick={handleSpeak}>🗣️ 말하기</button>
        <button onClick={randomAnimal}>🎲 랜덤 동물</button>
      </section>

      <section className="box">
        <h2>
          저장한 문장 ({sentences.length})
        </h2>

        {sentences.length === 0 ? (
          <p>아직 저장된 문장이 없어요.</p>
        ) : (
          <ul>
            {sentences.map((sentence, index) => (
              <li key={index}>
                <span>{sentence}</span>

                <button onClick={() => editSentence(index)}>
                  수정
                </button>

                <button
                  className="delete"
                  onClick={() => deleteSentence(index)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;