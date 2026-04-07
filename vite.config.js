import React, { useState, useEffect, useMemo } from "react";
import { dataMap, gradeLabels } from "./data";

// --- 1. 수식 렌더링용 컴포넌트 ---
const MathText = ({ text }) => {
  useEffect(() => {
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
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isCheck, setIsCheck] = useState(false);

  const questions = useMemo(() => (grade ? dataMap[grade] || [] : []), [grade]);
  const q = questions[index];

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

  // --- 화면 A: 시작 화면 ---
  if (!grade) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.topBar} />
          <div style={styles.logoSection}>
            <div style={styles.logoGroup}>
              <span style={styles.logoMain}>삼척 JEET</span>
              <span style={styles.logoSub}>수학</span>
            </div>
            <div style={styles.titleLine}>개념 진단 시스템</div>
          </div>
          <div style={styles.inputSection}>
            <label style={styles.inputLabel}>학생 이름</label>
            <input 
              style={styles.input} 
              placeholder="이름을 입력하세요" 
              value={studentName} 
              onChange={e => setStudentName(e.target.value)} 
            />
          </div>
          <div style={styles.gridSection}>
            <div style={styles.gridLabel}>진단 학년 선택</div>
            <div style={styles.grid}>
              {Object.keys(dataMap).map(key => (
                <button key={key} onClick={() => handleStart(key)} style={styles.gradeBtn}>
                  {gradeLabels[key]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 화면 B: 결과 리포트 ---
  if (showResult) {
    const correctCount = answers.filter((ans, i) => ans === questions[i].answer).length;
    const scoreRate = Math.round((correctCount / (questions.length || 1)) * 100);
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{textAlign:'center', marginBottom: '20px'}}>진단 결과 리포트</h2>
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

  // --- 화면 C: 문제 풀이 화면 ---
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>{gradeLabels[grade]}</span>
          <span style={styles.badge}>{index + 1} / {questions.length}</span>
        </div>
        <div style={styles.questionBox}>
          <div style={styles.conceptTag}>● {q?.concept}</div>
          <div style={styles.questionText}>
            <MathText text={q?.prompt} />
          </div>
        </div>
        <div style={styles.choiceList}>
          {q?.choices.map((choice, i) => {
            let bgColor = '#FFF';
            let borderColor = '#E2E8F0';
            if (isCheck) {
              if (i === q.answer) { bgColor = '#ECFDF5'; borderColor = '#10B981'; }
              else if (selected === i) { bgColor = '#FFF1F2'; borderColor = '#E11D48'; }
            } else if (selected === i) {
              borderColor = '#E11D48'; bgColor = '#FFF1F2';
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
        {isCheck && (
          <div style={styles.explainBox}>
            <div style={{fontWeight: '800', color: q.answer === selected ? '#047857' : '#BE123C', marginBottom: '8px'}}>
              {q.answer === selected ? "✨ 정답입니다!" : "🎯 오답입니다 (정답: " + (q.answer + 1) + "번)"}
            </div>
            <div style={{fontSize: '15px', color: '#475569', lineHeight: '1.5'}}>
              <span style={{fontWeight: 'bold'}}>해설: </span>
              <MathText text={q?.explanation} />
            </div>
          </div>
        )}
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
  container: { padding: '20px 15px', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center' },
  card: { width: '100%', background: '#fff', padding: '40px 25px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)', position: 'relative', overflow: 'hidden' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #E11D48, #FB7185)' },
  logoSection: { textAlign: 'center', marginBottom: '35px' },
  logoGroup: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  logoMain: { fontSize: '32px', fontWeight: '900', color: '#E11D48', letterSpacing: '-1px' },
  logoSub: { background: '#E11D48', color: '#FFF', padding: '4px 10px', borderRadius: '8px', fontSize: '14px', fontWeight: '800' },
  titleLine: { color: '#64748B', fontSize: '16px', fontWeight: '600', letterSpacing: '2px' },
  inputSection: { marginBottom: '30px' },
  inputLabel: { display: 'block', color: '#475569', fontSize: '14px', fontWeight: '700', marginBottom: '8px', marginLeft: '5px' },
  input: { width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #F1F5F9', backgroundColor: '#F8FAFC', boxSizing: 'border-box', fontSize: '18px', textAlign: 'center', color: '#1E293B', outline: 'none' },
  gridSection: { borderTop: '1px solid #F1F5F9', paddingTop: '25px' },
  gridLabel: { color: '#94A3B8', fontSize: '13px', fontWeight: '700', textAlign: 'center', marginBottom: '15px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  gradeBtn: { padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#FFF', fontWeight: '700', color: '#334155', fontSize: '15px', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  headerTitle: { fontWeight: '800', color: '#1E293B', fontSize: '18px' },
  badge: { background: '#FEE2E2', color: '#EF4444', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' },
  questionBox: { padding: '25px 20px', background: '#F8FAFC', borderRadius: '20px', marginBottom: '20px', border: '1px solid #F1F5F9' },
  conceptTag: { color: '#E11D48', fontSize: '13px', fontWeight: '800', marginBottom: '8px' },
  questionText: { fontSize: '20px', fontWeight: '800', color: '#0F172A', lineHeight: '1.5' },
  choiceList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' },
  choiceBtn: { textAlign: 'left', padding: '15px', borderRadius: '15px', border: '2px solid #E2E8F0', cursor: 'pointer', fontSize: '17px', display: 'flex', alignItems: 'center', fontWeight: '600' },
  choiceNum: { color: '#94A3B8', marginRight: '12px', fontSize: '14px', width: '15px' },
  explainBox: { padding: '20px', background: '#F8FAFC', borderRadius: '16px', marginBottom: '25px', borderLeft: '6px solid #E11D48' },
  mainBtn: { width: '100%', padding: '20px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)', color: '#fff', fontSize: '19px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 16px rgba(225, 29, 72, 0.25)' },
  resultBox: { textAlign: 'center', padding: '40px 20px', background: '#F8FAFC', borderRadius: '24px', margin: '20px 0' },
  scoreText: { fontSize: '72px', color: '#E11D48', margin: '15px 0', fontWeight: '900' }
};
