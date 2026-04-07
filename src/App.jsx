import React, { useState, useEffect, useMemo } from "react";
import { dataMap, gradeLabels } from "./data";

// --- 1. 수식 렌더링용 컴포넌트 ---
const MathText = ({ text }) => {
  useEffect(() => {
    // 텍스트가 렌더링될 때마다 MathJax에게 수식 변환을 요청합니다.
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [text]);

  return <span className="math-text">{text || ""}</span>;
};

// --- 2. 메인 앱 컴포넌트 ---
export default function App() {
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // 학생이 선택한 답안 배열
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isCheck, setIsCheck] = useState(false); // 현재 문제 채점 여부

  const questions = useMemo(() => (grade ? dataMap[grade] || [] : []), [grade]);
  const q = questions[index];

  // 테스트 시작 핸들러
  const handleStart = (g) => {
    if (!studentName.trim()) {
      alert("학생 이름을 입력해주세요!");
      return;
    }
    setGrade(g);
    setIndex(0);
    setAnswers([]);
    setShowResult(false);
    setSelected(null);
    setIsCheck(false);
  };

  // 다음 문제로 이동 (답안 저장 및 인덱스 증가)
  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (index + 1 < questions.length) {
      setAnswers(newAnswers);
      setIndex(index + 1);
      setSelected(null);
      setIsCheck(false);
    } else {
      setAnswers(newAnswers);
      setShowResult(true);
    }
  };

  // --- 화면 1: 초기 진입 (이름 입력 및 학년 선택) ---
  if (!grade) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logoBox}>
            <span style={styles.logoMain}>삼척JEET</span>
            <span style={styles.logoSub}>수학</span>
          </div>
          <h1 style={styles.title}>실력 진단평가</h1>
          <input 
            style={styles.input} 
            placeholder="학생 이름을 입력하세요" 
            value={studentName} 
            onChange={e => setStudentName(e.target.value)} 
          />
          <div style={styles.grid}>
            {Object.keys(dataMap).map(key => (
              <button key={key} onClick={() => handleStart(key)} style={styles.gradeBtn}>
                {gradeLabels[key]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 화면 2: 결과 리포트 (채점 결과 계산) ---
  if (showResult) {
    const correctCount = answers.filter((ans, i) => ans === questions[i].answer).length;
    const scoreRate = Math.round((correctCount / questions.length) * 100);

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{textAlign:'center', marginBottom: '20px'}}>진단 결과</h2>
          <div style={styles.resultBox}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}}>{studentName} 학생</p>
            <h1 style={styles.scoreText}>{scoreRate}점</h1>
            <p style={{color: '#64748B'}}>총 {questions.length}문제 중 {correctCount}문제 정답</p>
          </div>
          <button onClick={() => setGrade(null)} style={styles.mainBtn}>처음으로 돌아가기</button>
        </div>
      </div>
    );
  }

  // --- 화면 3: 문제 풀이 화면 ---
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>{gradeLabels[grade]}</span>
          <span style={styles.progressBadge}>{index + 1} / {questions.length}</span>
        </div>

        <div style={styles.questionBox}>
          <div style={styles.conceptTag}>● {q?.concept}</div>
          <div style={styles.questionText}>
            <MathText text={q?.prompt} />
          </div>
        </div>

        <div style={styles.choiceList}>
          {q?.choices.map((choice, i) => {
            // 채점 상태에 따른 스타일 결정
            let bgColor = '#FFF';
            let borderColor = '#E2E8F0';

            if (isCheck) {
              if (i === q.answer) {
                bgColor = '#ECFDF5'; // 정답 (초록색)
                borderColor = '#10B981';
              } else if (selected === i) {
                bgColor = '#FFF1F2'; // 내가 고른 오답 (빨간색)
                borderColor = '#E11D48';
              }
            } else if (selected === i) {
              borderColor = '#E11D48'; // 선택 중
              bgColor = '#FFF1F2';
            }

            return (
              <button 
                key={i} 
                onClick={() => !isCheck && setSelected(i)}
                style={{ ...styles.choiceBtn, background: bgColor, borderColor: borderColor }}
              >
                <span style={styles.choiceNum}>{i + 1}</span>
                <MathText text={choice} />
              </button>
            );
          })}
        </div>

        {!isCheck ? (
          <button disabled={selected === null} onClick={() => setIsCheck(true)} style={styles.mainBtn}>정답 확인</button>
        ) : (
          <button onClick={handleNext} style={styles.mainBtn}>
            {index + 1 === questions.length ? "결과 보기" : "다음 문제"}
          </button>
        )}
      </div>
    </div>
  );
}

// --- 3. 스타일 시트 ---
const styles = {
  container: { padding: '20px 15px', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC' },
  card: { background: '#fff', padding: '30px 20px', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9' },
  logoBox: { textAlign: 'center', marginBottom: '10px' },
  logoMain: { fontSize: '28px', fontWeight: '900', color: '#E11D48' },
  logoSub: { fontSize: '16px', fontWeight: '800', background: '#E11D48', color: '#FFF', padding: '2px 8px', borderRadius: '6px', marginLeft: '5px', verticalAlign: 'middle' },
  title: { textAlign: 'center', color: '#0F172A', fontSize: '24px', marginBottom: '25px', fontWeight: '800' },
  input: { width: '100%', padding: '16px', marginBottom: '20px', borderRadius: '14px', border: '2px solid #E2E8F0', boxSizing: 'border-box', fontSize: '18px', textAlign: 'center', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  gradeBtn: { padding: '16px 10px', borderRadius: '14px', border: '1px solid #E2E8F0', cursor: 'pointer', fontWeight: '700', background: '#FFF', color: '#334155', fontSize: '15px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  headerTitle: { fontWeight: '800', color: '#1E293B', fontSize: '18px' },
  progressBadge: { background: '#FEE2E2', color: '#EF4444', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' },
  questionBox: { padding: '25px 20px', background: '#F8FAFC', borderRadius: '20px', marginBottom: '20px', border: '1px solid #F1F5F9' },
  conceptTag: { color: '#E11D48', fontSize: '13px', fontWeight: '800', marginBottom: '8px' },
  questionText: { fontSize: '21px', fontWeight: '800', color: '#0F172A', lineHeight: '1.5' },
  choiceList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' },
  choiceBtn: { textAlign: 'left', padding: '15px', borderRadius: '15px', border: '2px solid #E2E8F0', cursor: 'pointer', fontSize: '17px', display: 'flex', alignItems: 'center', fontWeight: '600', transition: '0.2s' },
  choiceNum: { color: '#94A3B8', marginRight: '12px', fontSize: '14px', width: '15px' },
  mainBtn: { width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)', color: '#fff', fontSize: '19px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 6px 15px rgba(225, 29, 72, 0.3)' },
  resultBox: { textAlign: 'center', padding: '40px 20px', background: '#F8FAFC', borderRadius: '24px', margin: '20px 0', border: '1px solid #F1F5F9' },
  scoreText: { fontSize: '72px', color: '#E11D48', margin: '15px 0', fontWeight: '900' },
};
