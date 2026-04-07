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

// --- 학년별 상세 설명 데이터 (이미지와 동일하게 세팅) ---
const gradeDescriptions = {
  g1: "수 감각 · 규칙 · 비교", g2: "받아올림 · 길이 · 곱셈 기초", g3: "분수 기초 · 자료 읽기",
  g4: "약수/배수 기초 · 각도", g5: "분수/소수 · 비와 비율", g6: "비례식 · 속력 · 원",
  m1: "정수 · 문자와 식 · 방정식", m2: "일차함수 · 연립방정식 · 확률", m3: "이차방정식 · 이차함수",
  h1: "다항식 · 방정식 · 이차함수", h2: "지수로그 · 수열 · 미분 기초", h3: "확률과통계 · 함수 해석 · 수능형 사고",
  s1: "삼일중1 시험대비", s2: "삼척청아중2 시험대비", s3: "청아삼일중3 시험대비"
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

  // --- 화면 A: 메인 시작 화면 (디자인 복구) ---
  if (!grade) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logoRow}>
            <span style={styles.logoMain}>삼척JEET</span>
            <span style={styles.logoSub}>수학</span>
          </div>
          <h1 style={styles.title}>개념 진단 테스트</h1>
          
          <input 
            style={styles.nameInput} 
            placeholder="학생이름 (개인별피드백용)" 
            value={studentName} 
            onChange={e => setStudentName(e.target.value)} 
          />
          
          <div style={styles.gradeGrid}>
            {Object.keys(dataMap).map(key => {
              const isSpecial = key.startsWith('s');
              return (
                <button key={key} onClick={() => handleStart(key)} style={styles.gradeButton}>
                  <div style={styles.gradeButtonTitle}>
                    {gradeLabels[key]} {isSpecial && "🔥"}
                  </div>
                  <div style={styles.gradeDesc}>{gradeDescriptions[key]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- 화면 B: 결과 화면 ---
  if (showResult) {
    const correctCount = answers.filter((ans, i) => ans === questions[i].answer).length;
    const scoreRate = Math.round((correctCount / (questions.length || 1)) * 100);
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{textAlign:'center', marginBottom: '20px'}}>진단 결과</h2>
          <div style={styles.resultBox}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}}>{studentName} 학생</p>
            <h1 style={{fontSize: '60px', color: '#E11D48', margin: '15px 0', fontWeight: '900'}}>{scoreRate}점</h1>
            <p style={{color: '#64748B'}}>총 {questions.length}문제 중 {correctCount}문제 정답</p>
          </div>
          <button onClick={() => setGrade(null)} style={styles.mainBtn}>처음으로</button>
        </div>
      </div>
    );
  }

  // --- 화면 C: 문제 풀이 및 해설 ---
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>{gradeLabels[grade]}</span>
          <span style={styles.badge}>{index + 1} / {questions.length}</span>
        </div>
        <div style={styles.questionBox}>
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
              <button key={i} onClick={() => !isCheck && setSelected(i)} style={{ ...styles.choiceBtn, background: bgColor, borderColor: borderColor }}>
                <span style={styles.choiceNum}>{i + 1}.</span>
                <MathText text={choice} />
              </button>
            );
          })}
        </div>
        {isCheck && (
          <div style={styles.explainBox}>
            <div style={{fontWeight: 'bold', color: q.answer === selected ? '#047857' : '#BE123C', marginBottom: '8px'}}>
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

// --- 3. 스타일 시트 (고급형 복구) ---
const styles = {
  container: { padding: '20px 10px', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC' },
  card: { background: '#fff', padding: '25px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', position: 'relative' },
  
  logoRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '5px' },
  logoMain: { fontSize: '28px', fontWeight: '900', color: '#E11D48' },
  logoSub: { background: '#E11D48', color: '#FFF', padding: '2px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '800' },
  title: { textAlign: 'center', color: '#475569', fontSize: '24px', fontWeight: '800', marginBottom: '20px' },
  
  nameInput: { width: '100%', padding: '16px', marginBottom: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxSizing: 'border-box', fontSize: '18px', textAlign: 'center', outline: 'none', backgroundColor: '#F8FAFC' },
  
  gradeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  gradeButton: { padding: '15px 12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFF', textAlign: 'left', cursor: 'pointer', transition: '0.2s' },
  gradeButtonTitle: { fontSize: '16px', fontWeight: '800', color: '#1E293B', marginBottom: '2px' },
  gradeDesc: { fontSize: '11px', color: '#94A3B8' },
  
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  headerTitle: { fontWeight: '800', color: '#1E293B', fontSize: '18px' },
  badge: { background: '#E11D48', color: '#FFF', padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  questionBox: { padding: '25px 20px', background: '#F8FAFC', borderRadius: '16px', marginBottom: '20px', border: '1px solid #F1F5F9' },
  questionText: { fontSize: '19px', fontWeight: '800', color: '#0F172A', lineHeight: '1.6' },
  choiceList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  choiceBtn: { textAlign: 'left', padding: '15px', borderRadius: '12px', border: '2px solid #E2E8F0', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', fontWeight: '600' },
  choiceNum: { color: '#94A3B8', marginRight: '10px', width: '15px' },
  explainBox: { padding: '18px', background: '#F1F5F9', borderRadius: '12px', marginBottom: '20px', borderLeft: '5px solid #E11D48' },
  mainBtn: { width: '100%', padding: '18px', borderRadius: '15px', border: 'none', background: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)', color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(225, 29, 72, 0.2)' },
  resultBox: { textAlign: 'center', padding: '30px', background: '#F8FAFC', borderRadius: '20px', margin: '20px 0' }
};
