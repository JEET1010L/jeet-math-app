import React, { useState, useEffect, useMemo } from "react";
import { dataMap, gradeLabels } from "./data";

// --- 수식 렌더링 컴포넌트 ---
const MathText = ({ text }) => {
  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [text]);
  return <span className="math-text">{text || ""}</span>;
};

export default function App() {
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isCheck, setIsCheck] = useState(false);

  const questions = useMemo(() => (grade ? dataMap[grade] || [] : []), [grade]);
  const q = questions[index];

  const handleStart = (g) => {
    if (!studentName.trim()) { alert("이름을 입력해주세요!"); return; }
    setGrade(g); setIndex(0); setAnswers([]); setShowResult(false); setSelected(null); setIsCheck(false);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (index + 1 < questions.length) {
      setAnswers(newAnswers); setIndex(index + 1); setSelected(null); setIsCheck(false);
    } else {
      setAnswers(newAnswers); setShowResult(true);
    }
  };

  if (!grade) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>삼척JEET 수학 진단</h1>
          <input style={styles.input} placeholder="학생 이름" value={studentName} onChange={e => setStudentName(e.target.value)} />
          <div style={styles.grid}>
            {Object.keys(dataMap).map(key => (
              <button key={key} onClick={() => handleStart(key)} style={styles.gradeBtn}>{gradeLabels[key]}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = answers.filter((ans, i) => ans === questions[i].answer).length;
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{textAlign:'center'}}>진단 완료!</h2>
          <div style={styles.resultBox}>
            <h1 style={{fontSize: '50px', color: '#E11D48'}}>{Math.round((score/questions.length)*100)}점</h1>
            <p>{studentName} 학생, 수고했어요!</p>
          </div>
          <button onClick={() => setGrade(null)} style={styles.mainBtn}>처음으로</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span>{gradeLabels[grade]}</span>
          <span style={styles.badge}>{index + 1} / {questions.length}</span>
        </div>

        <div style={styles.questionBox}>
          <MathText text={q?.prompt} />
        </div>

        <div style={styles.choiceList}>
          {q?.choices.map((choice, i) => (
            <button 
              key={i} 
              onClick={() => !isCheck && setSelected(i)}
              style={{
                ...styles.choiceBtn,
                borderColor: isCheck && q.answer === i ? '#10B981' : (selected === i ? '#E11D48' : '#E2E8F0'),
                background: isCheck && q.answer === i ? '#ECFDF5' : (selected === i ? '#FFF1F2' : '#FFF')
              }}
            >
              <span style={{marginRight: '8px'}}>{i + 1}.</span>
              <MathText text={choice} />
            </button>
          ))}
        </div>

        {/* 👇 여기가 핵심! 정답 확인 후 해설이 나오는 부분입니다 */}
        {isCheck && (
          <div style={styles.explainBox}>
            <div style={{fontWeight: '800', color: q.answer === selected ? '#047857' : '#BE123C', marginBottom: '5px'}}>
              {q.answer === selected ? "✨ 정답입니다!" : "🎯 오답입니다 (정답: " + (q.answer + 1) + "번)"}
            </div>
            <div style={{fontSize: '15px', color: '#475569', lineHeight: '1.4'}}>
              <span style={{fontWeight: 'bold'}}>해설: </span>
              <MathText text={q?.explanation} />
            </div>
          </div>
        )}

        {!isCheck ? (
          <button disabled={selected === null} onClick={() => setIsCheck(true)} style={styles.mainBtn}>정답 확인</button>
        ) : (
          <button onClick={handleNext} style={styles.mainBtn}>다음 문제</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px 10px', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F1F5F9' },
  card: { background: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  title: { textAlign: 'center', color: '#E11D48', marginBottom: '20px' },
  input: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '12px', border: '2px solid #E2E8F0', boxSizing: 'border-box', textAlign: 'center', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  gradeBtn: { padding: '15px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFF', fontWeight: 'bold', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#64748B', fontWeight: 'bold' },
  badge: { background: '#E11D48', color: '#FFF', padding: '2px 10px', borderRadius: '10px', fontSize: '12px' },
  questionBox: { padding: '25px', background: '#F8FAFC', borderRadius: '16px', marginBottom: '20px', fontSize: '19px', fontWeight: 'bold', lineHeight: '1.6' },
  choiceList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  choiceBtn: { textAlign: 'left', padding: '14px', borderRadius: '12px', border: '2px solid #E2E8F0', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center' },
  explainBox: { padding: '15px', background: '#F1F5F9', borderRadius: '12px', marginBottom: '20px', borderLeft: '5px solid #E11D48' },
  mainBtn: { width: '100%', padding: '18px', borderRadius: '15px', border: 'none', background: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)', color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  resultBox: { textAlign: 'center', padding: '30px', background: '#F8FAFC', borderRadius: '20px', margin: '20px 0' }
};
