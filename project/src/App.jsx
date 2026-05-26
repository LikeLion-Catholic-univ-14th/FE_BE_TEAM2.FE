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
  const [bubble, setBubble] = useState(
    "안녕! 무엇을 배워볼까?💭"
  );

  const [animal, setAnimal] = useState([
    "🐶",
    "강아지",
  ]);

  const [editId, setEditId] = useState(null);

  // GET
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        "https://animal-talk.duckdns.org/messages"
      );

      const data = await response.json();

      // 전체 객체 저장
      setSentences(data);

    } catch (error) {
      console.error(error);
    }
  };

  // 처음 실행 시 메시지 불러오기
  useEffect(() => {
    fetchMessages();
  }, []);

  // 저장 / 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sentence = input.trim();

    if (!sentence) return;

    try {

      // 수정
      if (editId !== null) {

        const response = await fetch(
          `https://animal-talk.duckdns.org/messages/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: sentence,
            }),
          }
        );

        const updatedMessage =
          await response.json();

        const updated = sentences.map(
          (item) =>
            item.id === editId
              ? updatedMessage
              : item
        );

        setSentences(updated);

        setBubble(updatedMessage.message);

        setEditId(null);

      } else {

        // 저장
        const response = await fetch(
          "https://animal-talk.duckdns.org/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: sentence,
            }),
          }
        );

        const data = await response.json();

        setSentences([
          ...sentences,
          data,
        ]);

        setBubble(data.message);
      }

      setInput("");

    } catch (error) {
      console.error(error);
      alert("서버 연결 실패");
    }
  };

  // 수정 버튼
  const editSentence = (sentence) => {
    setInput(sentence.message);
    setEditId(sentence.id);
  };

  // 삭제 버튼
  const deleteSentence = async (id) => {
    try {

      await fetch(
        `https://animal-talk.duckdns.org/messages/${id}`,
        {
          method: "DELETE",
        }
      );

      const updated = sentences.filter(
        (sentence) =>
          sentence.id !== id
      );

      setSentences(updated);

      if (editId === id) {
        setEditId(null);
        setInput("");
      }

    } catch (error) {
      console.error(error);
      alert("삭제 실패");
    }
  };

  // 말하기 버튼
  const handleSpeak = () => {

    const lastSentence =
      sentences[sentences.length - 1];

    setBubble(
      input.trim() ||
      lastSentence?.message ||
      "먼저 문장을 입력해줘!"
    );
  };

  // 랜덤 동물 버튼
  const randomAnimal = () => {

    const randomIndex = Math.floor(
      Math.random() * animals.length
    );

    setAnimal(animals[randomIndex]);
  };

  return (
    <main>

      <section className="box">

        <p className="eyebrow">
          프-백 연합 프로젝트 : 서윤소래
        </p>

        <h1>
          귀요미들에게 말을 가르쳐보세요!
        </h1>

        <div className="direction">
          <p>
            사용 방법 ✏️
            <br />
            문장을 입력하고 말하기 버튼을
            누르면 동물이 똑같이 말해요.
          </p>
        </div>

        <div className="animal-area">

          <div className="bubble">
            {bubble}
          </div>

          <div className="animal">
            {animal[0]}
          </div>

          <h2>{animal[1]}</h2>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="가르칠 문장을 입력하세요"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            required
          />

          <button type="submit">
            {editId === null
              ? "저장"
              : "수정"}
          </button>

        </form>

        <div className="button-row">

          <button
            type="button"
            onClick={handleSpeak}
          >
            🗣️ 말하기
          </button>

          <button
            type="button"
            className="randomBtn"
            onClick={randomAnimal}
          >
            🎲 랜덤 동물
          </button>

        </div>

      </section>

      <section className="box">

        <h2>
          저장한 문장{" "}
          <span>
            {sentences.length}개
          </span>
        </h2>

        {sentences.length === 0 ? (

          <p id="emptyText">
            아직 저장한 문장이 없어요.
          </p>

        ) : (

          <ul id="list">

            {sentences.map((sentence) => (

              <li key={sentence.id}>

                <span>
                  {sentence.message}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    editSentence(sentence)
                  }
                >
                  수정
                </button>

                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    deleteSentence(sentence.id)
                  }
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