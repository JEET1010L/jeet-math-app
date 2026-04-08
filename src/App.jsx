import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dataMap, gradeLabels } from "./data";
import { TEXT } from "./constants/text";

// --- 1. 수식 렌더링용 ---
const MathText = ({ text }) => {
  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [text]);
  return <span className="math-text" style={{ color: '#1E293B' }}>{text || ""}</span>;
};

const gradeDescriptions = {
  g1: "수 감각 · 규칙 · 비교", g2: "받아올림 · 길이 · 곱셈 기초", g3: "분수 기초 · 자료 읽기",
  g4: "약수/배수 기초 · 각도", g5: "분수/소수 · 비와 비율", g6: "비례식 · 속력 · 원",
  m1: "정수 · 문자와 식 · 방정식", m2: "일차함수 · 연립방정식 · 확률", m3: "이차방정식 · 이차함수",
  h1: "다항식 · 방정식 · 이차함수", h2: "지수로그 · 수열 · 미분 기초", h3: "확률과통계 · 함수 해석 · 수능형 사고",
  s1: "삼일중1 시험대비", s2: "삼척청아중2 시험대비", s3: "청아삼일중3 시험대비"
};

// ⭐ 여기 형식을 더 확실한 'export default'로 고쳤습니다.
function App() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isCheck, setIsCheck] = useState(false);

  const questions = useMemo(() => (grade ? dataMap[grade] || [] : []), [grade]);
  const q = questions[index];

  const handleStart = (g) => {
    if (!studentName.trim()) { alert("이름을 입력해주세요!"); return; }
    setGrade(g); setIndex(0); setAnswers([]); setSelected(null); setIsCheck(false);
  };

  const handleFinish = async (finalAnswers) => {
    const strong = [];
    const weak = [];

    questions.forEach((question, i) => {
      if (finalAnswers[i] === question.answer) {
        if (!strong.includes(question.concept)) strong.push(question.concept);
      } else {
        if (!weak.includes(question.concept)) weak.push(question.concept);
      }
    });

    const finalStrong = strong.filter(c => !weak.includes(c));
    const score = finalAnswers.filter((ans, i) => ans === questions[i].answer).length;
    const scoreRate = Math.round((score / questions.length) * 100);

    const resultData = {
      studentName,
      grade,
      gradeLabel: gradeLabels[grade],
      score,
      total: questions.length,
      scoreRate,
      strongConcepts: finalStrong,
      weakConcepts: weak,
      consultingComment: `${studentName} 학생은 ${gradeLabels[grade]} 과정 진단 결과, ${finalStrong.length > 0 ? finalStrong[0] : '기본'} 파트에 강점을 보이나 ${weak.length > 0 ? weak[0] : '일부'} 개념 보완이 권장됩니다.`,
      level: scoreRate > 85 ? "심화" : scoreRate > 60 ? "응용" : "기본",
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "results"), resultData);
      navigate("/report", { state: resultData });
    } catch (e) {
      console.error("저장 실패: ", e);
      alert("결과 저장 중 오류가 발생했습니다.");
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (index + 1 < questions.length) {
      setAnswers(newAnswers); setIndex(index + 1); setSelected(null); setIsCheck(false);
    } else {
      handleFinish(newAnswers);
    }
  };

  if (!grade) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logoRow}>
            <span style={styles.logoMain}>{TEXT.BRAND_NAME}</span>
            <span style={styles.logoSub}>{TEXT.BRAND_SUBJECT}</span>
          </div>
          <h1 style={styles.title}>{TEXT.MAIN_TITLE}</h1>
          <input 
            style={styles.nameInput} 
            placeholder={TEXT.NAME_PLACEHOLDER} 
            value={studentName} 
            onChange={e => setStudentName(e.target.value)} 
          />
          <div style={styles.gradeGrid}>
            {Object.keys(dataMap).map(key => (
              <button key={key} onClick={() => handleStart(key)} style={styles.gradeButton}>
                <div style={styles.gradeButtonTitle}>{gradeLabels[key]} {key.startsWith('s') && "🔥"}</div>
                <div style={styles.gradeDesc}>{gradeDescriptions[key]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>{gradeLabels[grade]} {TEXT.QUIZ_TITLE_SUFFIX}</span>
          <span style={styles.badge}>{index + 1} / {questions.length}</span>
        </div>
        <div style={styles.questionBox}>
          <div style={styles.questionText}><MathText text={q?.prompt} /></div>
        </div>
        <div style={styles.choiceList}>
          {q?.choices.map((choice, i) => (
            <button key={i} onClick={() => !isCheck && setSelected(i)} style={{ 
              ...styles.choiceBtn, 
              borderColor: isCheck ? (i === q.answer ? '#10B981' : (selected === i ? '#E11D48' : '#E2E8F0')) : (selected === i ? '#E11D48' : '#E2E8F0'),
              background: isCheck ? (i === q.answer ? '#ECFDF5' : (selected === i ? '#FFF1F2' : '#FFF')) : (selected === i ? '#FFF1F2' : '#FFF')
            }}>
              <span style={styles.choiceNum}>{i + 1}.</span>
              <MathText text={choice} />
            </button>
          ))}
        </div>
        {isCheck && (
          <div style={styles.explainBox}>
            <div style={{fontWeight: 'bold', color: q.answer === selected ? '#047857' : '#BE123C', marginBottom: '8px'}}>
              {q.answer === selected ? TEXT.FEEDBACK_CORRECT : TEXT.FEEDBACK_WRONG}
            </div>
            <div style={{fontSize: '14px', color: '#475569'}}><MathText text={q?.explanation} /></div>
          </div>
        )}
        {!isCheck ? (
          <button disabled={selected === null} onClick={() => setIsCheck(true)} style={styles.mainBtn}>{TEXT.CHECK_ANSWER}</button>
        ) : (
          <button onClick={handleNext} style={styles.mainBtn}>
            {index + 1 === questions.length ? TEXT.VIEW_RESULT : TEXT.NEXT_QUESTION}
          </button>
        )}
      </div>
    </div>
  );
}

// 명시적으로 default export를 마지막에 한 번 더 선언해줍니다.
export default App;

const styles = {
  container: { padding: '20px 10px', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC' },
  card: { background: '#ffffff', padding: '25px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' },
  logoRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '5px' },
  logoMain: { fontSize: '28px', fontWeight: '900', color: '#E11D48' },
  logoSub: { background: '#E11D48', color: '#FFF', padding: '2px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '800' },
  title: { textAlign: 'center', color: '#475569', fontSize: '22px', fontWeight: '800', marginBottom: '20px' },
  nameInput: { 
    width: '100%', padding: '16px', marginBottom: '20px', borderRadius: '12px', 
    border: '1px solid #E2E8F0', boxSizing: 'border-box', fontSize: '16px', 
    textAlign: 'center', outline: 'none', backgroundColor: '#FFFFFF', color: '#000000' 
  },
  gradeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  gradeButton: { padding: '15px 12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFF', textAlign: 'left', cursor: 'pointer' },
  gradeButtonTitle: { fontSize: '15px', fontWeight: '800', color: '#1E293B', marginBottom: '2px' },
  gradeDesc: { fontSize: '11px', color: '#94A3B8' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  headerTitle: { fontWeight: '800', color: '#1E293B', fontSize: '16px' },
  badge: { background: '#E11D48', color: '#FFF', padding: '3px 10px', borderRadius: '10px', fontSize: '11px' },
  questionBox: { padding: '20px', background: '#F8FAFC', borderRadius: '16px', marginBottom: '20px' },
  questionText: { fontSize: '18px', fontWeight: '800', color: '#0F172A', lineHeight: '1.6' },
  choiceList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  choiceBtn: { 
    textAlign: 'left', padding: '15px', borderRadius: '12px', border: '2px solid #E2E8F0', 
    cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', 
    fontWeight: '600', color: '#1E293B' 
  },
  choiceNum: { color: '#94A3B8', marginRight: '10px', width: '15px' },
  explainBox: { padding: '15px', background: '#F1F5F9', borderRadius: '12px', marginBottom: '20px', borderLeft: '5px solid #E11D48' },
  mainBtn: { width: '100%', padding: '18px', borderRadius: '15px', border: 'none', background: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)', color: '#fff', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' }
};
