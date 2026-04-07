import React, { useMemo, useState, useEffect } from "react";
import { TEXT } from "./constants/text";
import {
  analyzeResults,
  calculateScore,
  calculateScoreRate,
  classifyLevel,
  getStrongConcepts,
  getWeakConcepts,
  buildConsultingComment,
  buildParentSummary,
  saveResultToFirebase,
} from "./utils/report";
import { dataMap, gradeLabels } from "./data";

// --- 수식 처리 컴포넌트 ---
const MathText = ({ text }) => {
  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [text]);
  return <span className="math-text">{text || ""}</span>;
};

const COLORS = {
  primary: "#E11D48",
  primarySoft: "#FB7185",
  navy: "#0F172A",
  slate: "#64748B",
  bg: "#F8FAFC",
  line: "#E2E8F0",
  white: "#FFFFFF",
  successBg: "#ECFDF5",
  successText: "#047857",
  errorBg: "#FFF1F2",
  errorText: "#BE123C",
  softCard: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
  primaryGrad: "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)",
};

const gradeDescriptions = {
  g1: "수 감각 · 규칙 · 비교", g2: "받아올림 · 길이 · 곱셈 기초", g3: "분수 기초 · 자료 읽기",
  g4: "약수/배수 기초 · 각도", g5: "분수/소수 · 비와 비율", g6: "비례식 · 속력 · 원",
  m1: "정수 · 문자와 식 · 방정식", m2: "일차함수 · 연립방정식 · 확률", m3: "이차방정식 · 이차함수",
  h1: "다항식 · 방정식 · 이차함수", h2: "지수로그 · 수열 · 미분 기초", h3: "확률과통계 · 함수 해석 · 수능형 사고",
  s1: "삼일중1 시험대비", s2: "삼척청아중2 시험대비", s3: "청아삼일중3 시험대비",
  s4: "삼척여고1 시험대비", s5: "삼척삼일고2 시험대비", s6: "삼척삼여고3 시험대비",
};

function getLevelComment(level) {
  if (level === "최상") return "상위권 수준으로 심화 및 선행 학습 연결이 가능합니다.";
  if (level === "상") return "핵심 개념은 안정적이며 응용 훈련을 통해 상위권으로 확장 가능합니다.";
  if (level === "중") return "기본은 갖추었으나 취약 개념 보완이 필요합니다.";
  return "기초 개념 재정리와 반복 훈련이 우선입니다.";
}

export default function App() {
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);

  const questions = useMemo(() => (grade ? dataMap[grade] ?? [] : []), [grade]);
  const q = questions[index];

  const score = useMemo(() => calculateScore(questions, answers), [questions, answers]);
  const scoreRate = useMemo(() => calculateScoreRate(score, questions.length || 1), [score, questions.length]);
  const analysis = useMemo(() => analyzeResults(questions, answers), [questions, answers]);
  const strongConcepts = useMemo(() => getStrongConcepts(analysis), [analysis]);
  const weakConcepts = useMemo(() => getWeakConcepts(analysis), [analysis]);
  const level = useMemo(() => classifyLevel(scoreRate), [scoreRate]);

  const resetToHome = () => { setGrade(null); setIndex(0); setAnswers([]); setFinished(false); setSelected(null); setShow(false); };
  const startTest = (g) => { setGrade(g); setIndex(0); setAnswers([]); setFinished(false); setSelected(null); setShow(false); };
  const checkAnswer = () => { if (selected !== null) setShow(true); };

  const nextQuestion = async () => {
    const newAnswers = [...answers, selected];
    if (index + 1 < questions.length) {
      setAnswers(newAnswers);
      setIndex(index + 1);
      setSelected(null);
      setShow(false);
    } else {
      setAnswers(newAnswers);
      setFinished(true);
      // 백그라운드 저장 로직
      try {
        const finalRate = calculateScoreRate(calculateScore(questions, newAnswers), questions.length);
        const res = buildParentSummary({
          studentName: studentName || "학생",
          gradeLabel: gradeLabels[grade],
          score: calculateScore(questions, newAnswers),
          total: questions.length,
          scoreRate: finalRate,
          level: classifyLevel(finalRate),
          strongConcepts: getStrongConcepts(analyzeResults(questions, newAnswers)),
          weakConcepts: getWeakConcepts(analyzeResults(questions, newAnswers)),
          consultingComment: "진단이 완료되었습니다.",
        });
        await saveResultToFirebase(res);
      } catch (e) { console.error(e); }
    }
  };

  if (!grade) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.heroCard}>
            <div style={styles.curveTop} />
            <div style={styles.logoWrap}><div style={styles.logoText}>{TEXT.BRAND_NAME}</div><div style={styles.logoTag}>{TEXT.BRAND_SUBJECT}</div></div>
            <div style={{ textAlign: "center", marginBottom: 24 }}><div style={styles.title}>{TEXT.MAIN_TITLE}</div></div>
            <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder={TEXT.NAME_PLACEHOLDER} style={styles.nameInput} />
            <div style={styles.gradeGrid}>
              {Object.keys(dataMap).map((key) => (
                <button key={key} onClick={() => startTest(key)} style={styles.gradeButton}>
                  <div style={styles.gradeButtonTitle}>{gradeLabels[key]}</div>
                  <div style={styles.gradeDesc}>{gradeDescriptions[key]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.heroCard}>
            <div style={styles.title}>결과 리포트</div>
            <div style={styles.resultScore}>{scoreRate}%</div>
            <button onClick={resetToHome} style={styles.primaryButton}>다시하기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.heroCard}>
          <div style={styles.quizHead}>
            <div style={styles.quizGrade}>{gradeLabels[grade]}</div>
            <div style={styles.progressBadge}>{index + 1}/{questions.length}</div>
          </div>
          <div style={styles.questionCard}>
            <div style={styles.questionConcept}>{q?.concept}</div>
            <div style={styles.questionText}><MathText text={q?.prompt} /></div>
          </div>
          <div style={styles.choiceList}>
            {q?.choices.map((choice, i) => (
              <button key={i} onClick={() => !show && setSelected(i)} style={{...styles.choiceButton, ...(selected === i ? styles.choiceSelected : {}), ...(show && q.answer === i ? styles.choiceCorrect : {}), ...(show && selected === i && q.answer !== i ? styles.choiceWrong : {})}}>
                <span style={styles.choiceIndex}>{i + 1}</span>
                <span style={{flex: 1}}><MathText text={choice} /></span>
              </button>
            ))}
          </div>
          {!show ? (
            <button onClick={checkAnswer} style={styles.primaryButton} disabled={selected === null}>정답 확인</button>
          ) : (
            <button onClick={nextQuestion} style={styles.primaryButton}>다음 문제</button>
          )}
        </div>
      </div>
    </div>
  );
}

function TagBlock({ label, items, tone }) { return null; } // 결과페이지 간소화용

const styles = {
  page: { minHeight: "100vh", background: "#F8FAFC", padding: "20px 12px", fontFamily: "sans-serif" },
  shell: { maxWidth: 640, margin: "0 auto" },
  heroCard: { borderRadius: 32, background: "#FFFFFF", padding: 20, border: "1px solid #E2E8F0", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  curveTop: { height: 8, background: COLORS.primaryGrad, borderRadius: "32px 32px 0 0", margin: "-20px -20px 20px -20px" },
  logoWrap: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 },
  logoText: { fontSize: 32, fontWeight: 900, color: COLORS.primary },
  logoTag: { background: COLORS.primary, color: "#FFF", padding: "4px 12px", borderRadius: 10 },
  title: { fontSize: 28, fontWeight: 900, textAlign: "center" },
  nameInput: { width: "100%", height: 60, borderRadius: 15, border: "2px solid #E2E8F0", fontSize: 20, textAlign: "center", marginBottom: 20, boxSizing: "border-box" },
  gradeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  gradeButton: { padding: 15, borderRadius: 15, border: "1px solid #E2E8F0", background: "#FFF", textAlign: "left", cursor: "pointer" },
  gradeButtonTitle: { fontSize: 18, fontWeight: 800 },
  gradeDesc: { fontSize: 12, color: "#64748B" },
  quizHead: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
  quizGrade: { fontSize: 22, fontWeight: 800 },
  progressBadge: { background: "#FFF1F2", color: "#E11D48", padding: "4px 10px", borderRadius: 10, fontWeight: 800 },
  questionCard: { background: "#F8FAFC", padding: 20, borderRadius: 20, marginBottom: 20 },
  questionConcept: { color: "#E11D48", fontSize: 14, fontWeight: 800, marginBottom: 8 },
  questionText: { fontSize: 24, fontWeight: 800, lineHeight: 1.4 },
  choiceList: { display: "grid", gap: 10, marginBottom: 20 },
  choiceButton: { display: "flex", alignItems: "center", gap: 10, padding: 15, borderRadius: 15, border: "2px solid #E2E8F0", background: "#FFF", fontSize: 18, fontWeight: 700, textAlign: "left", cursor: "pointer", width: "100%" },
  choiceIndex: { color: "#64748B", width: 20 },
  choiceSelected: { borderColor: "#E11D48", background: "#FFF1F2" },
  choiceCorrect: { borderColor: "#10B981", background: "#ECFDF5" },
  choiceWrong: { borderColor: "#E11D48", background: "#FFF1F2" },
  primaryButton: { width: "100%", height: 60, borderRadius: 15, border: "none", background: COLORS.primaryGrad, color: "#FFF", fontSize: 20, fontWeight: 800, cursor: "pointer" },
  resultScore: { fontSize: 60, fontWeight: 900, textAlign: "center", margin: "40px 0", color: "#0F172A" },
};
