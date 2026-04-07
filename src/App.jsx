import { TEXT } from "./constants/text";
import { useMemo, useState, useEffect } from "react"; // useEffect 추가
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

// --- 수식 처리를 위한 헬퍼 컴포넌트 추가 ---
const MathText = ({ text }) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [text]);
  return <span className="math-text">{text}</span>;
};

// ... COLORS 와 gradeDescriptions 는 사장님 기존 코드와 동일 (중략) ...
const COLORS = { primary: "#E11D48", primarySoft: "#FB7185", navy: "#0F172A", slate: "#64748B", bg: "#F8FAFC", line: "#E2E8F0", white: "#FFFFFF", successBg: "#ECFDF5", successText: "#047857", errorBg: "#FFF1F2", errorText: "#BE123C", softCard: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)", primaryGrad: "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)", };
const gradeDescriptions = { g1: "수 감각 · 규칙 · 비교", g2: "받아올림 · 길이 · 곱셈 기초", g3: "분수 기초 · 자료 읽기", g4: "약수/배수 기초 · 각도", g5: "분수/소수 · 비와 비율", g6: "비례식 · 속력 · 원", m1: "정수 · 문자와 식 · 방정식", m2: "일차함수 · 연립방정식 · 확률", m3: "이차방정식 · 이차함수", h1: "다항식 · 방정식 · 이차함수", h2: "지수로그 · 수열 · 미분 기초", h3: "확률과통계 · 함수 해석 · 수능형 사고", s1: "삼일중1 시험대비", s2: "삼척청아중2 시험대비", s3: "청아삼일중3 시험대비", s4: "삼척여고1 시험대비", s5: "삼척삼일고2 시험대비", s6: "삼척삼여고3 시험대비", };
function getLevelComment(level) { if (level === "최상") return "상위권 수준으로 심화 및 선행 학습 연결이 가능합니다."; if (level === "상") return "핵심 개념은 안정적이며 응용 훈련을 통해 상위권으로 확장 가능합니다."; if (level === "중") return "기본은 갖추었으나 취약 개념 보완이 필요합니다."; return "기초 개념 재정리와 반복 훈련이 우선입니다."; }

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

  // ... (useMemo 로직들은 사장님 기존 코드와 동일하므로 그대로 유지) ...
  const score = useMemo(() => calculateScore(questions, answers), [questions, answers]);
  const scoreRate = useMemo(() => calculateScoreRate(score, questions.length || 1), [score, questions.length] );
  const analysis = useMemo(() => analyzeResults(questions, answers), [questions, answers]);
  const strongConcepts = useMemo(() => getStrongConcepts(analysis), [analysis]);
  const weakConcepts = useMemo(() => getWeakConcepts(analysis), [analysis]);
  const level = useMemo(() => classifyLevel(scoreRate), [scoreRate]);
  const consultingComment = useMemo(() => grade ? buildConsultingComment({ gradeLabel: gradeLabels[grade], scoreRate, strongConcepts, weakConcepts, }) : "", [grade, scoreRate, strongConcepts, weakConcepts] );

  const resetToHome = () => { setGrade(null); setIndex(0); setAnswers([]); setFinished(false); setSelected(null); setShow(false); };
  const startTest = (selectedGrade) => { setGrade(selectedGrade); setIndex(0); setAnswers([]); setFinished(false); setSelected(null); setShow(false); };
  const checkAnswer = () => { if (selected === null) return; setShow(true); };
  const nextQuestion = async () => {
    const newAnswers = [...answers, selected];
    if (index + 1 < questions.length) { setAnswers(newAnswers); setIndex(index + 1); setSelected(null); setShow(false); return; }
    setAnswers(newAnswers); setFinished(true);
    try { 
      const resultSummary = buildParentSummary({ studentName: studentName || "학생", gradeLabel: gradeLabels[grade], score: calculateScore(questions, newAnswers), total: questions.length, scoreRate: calculateScoreRate(calculateScore(questions, newAnswers), questions.length), level: classifyLevel(calculateScoreRate(calculateScore(questions, newAnswers), questions.length)), strongConcepts: getStrongConcepts(analyzeResults(questions, newAnswers)), weakConcepts: getWeakConcepts(analyzeResults(questions, newAnswers)), consultingComment: buildConsultingComment({ gradeLabel: gradeLabels[grade], scoreRate: calculateScoreRate(calculateScore(questions, newAnswers), questions.length), strongConcepts: getStrongConcepts(analyzeResults(questions, newAnswers)), weakConcepts: getWeakConcepts(analyzeResults(questions, newAnswers)) }), });
      await saveResultToFirebase(resultSummary); 
    } catch (e) { console.error(e); }
  };

  const progress = questions.length ? Math.round(((index + 1) / questions.length) * 100) : 0;

  // 메인/결과 화면 로직 (사장님 기존 코드 유지하되, 텍스트 부분만 MathText로 감싸기)
  if (!grade) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.heroCard}>
            <div style={styles.curveTop} />
            <div style={styles.logoWrap}>
              <div style={styles.logoText}>{TEXT.BRAND_NAME}</div>
              <div style={styles.logoTag}>{TEXT.BRAND_SUBJECT}</div>
            </div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={styles.title}>{TEXT.MAIN_TITLE}</div>
              <div style={styles.subtitle}>{TEXT.MAIN_SUBTITLE}</div>
            </div>
            <div style={styles.inputCard}>
               <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder={TEXT.NAME_PLACEHOLDER} style={styles.nameInput} />
            </div>
            <div style={styles.gradeGrid}>
              {Object.keys(dataMap).map((key) => (
                <button key={key} onClick={() => startTest(key)} style={styles.gradeButton}>
                  <div style={styles.gradeButtonTop}>
                    <span style={styles.gradeButtonTitle}>{gradeLabels[key]}</span>
                  </div>
                  <div style={styles.gradeDesc}>{gradeDescriptions[key] || "핵심 개념 점검"}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finished) { /* 결과화면 생략 - 기존과 동일하게 유지 가능 */ }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.heroCard}>
          <div style={styles.curveTop} />
          <div style={styles.quizHead}>
            <div>
              <div style={styles.quizGrade}>{gradeLabels[grade]}</div>
              <div style={styles.quizCount}>{index + 1} / {questions.length}</div>
            </div>
          </div>

          <div style={styles.questionCard}>
            <div style={styles.questionConcept}>{q.concept}</div>
            {/* 수정: 문제를 MathText로 감쌈 */}
            <div style={styles.questionText}><MathText text={q.prompt} /></div>
          </div>

          <div style={styles.choiceList}>
            {q.choices.map((choice, i) => {
              const isSelected = selected === i;
              const isCorrect = q.answer === i;
              const showCorrect = show && isCorrect;
              const showWrong = show && isSelected && !isCorrect;

              return (
                <button
                  key={i}
                  onClick={() => { if (!show) setSelected(i); }}
                  style={{
                    ...styles.choiceButton,
                    ...(isSelected ? styles.choiceSelected : {}),
                    ...(showCorrect ? styles.choiceCorrect : {}),
                    ...(showWrong ? styles.choiceWrong : {}),
                  }}
                >
                  <span style={styles.choiceIndex}>{i + 1}</span>
                  {/* 수정: 선택지를 MathText로 감싸고 번호와 확실히 격리 */}
                  <span style={{flex: 1}}><MathText text={choice} /></span>
                </button>
              );
            })}
          </div>

          {!show ? (
            <button onClick={checkAnswer} style={styles.primaryButton} disabled={selected === null}>확인하기</button>
          ) : (
            <>
              <div style={{ ...styles.feedbackCard, ...(selected === q.answer ? styles.feedbackCorrect : styles.feedbackWrong) }}>
                <div style={styles.feedbackTitle}>{selected === q.answer ? "정답입니다!" : "아쉽네요"}</div>
                {/* 수정: 해설도 수식 처리 */}
                <div style={styles.feedbackText}>해설: <MathText text={q.explanation} /></div>
              </div>
              <button onClick={nextQuestion} style={styles.primaryButton}>다음 문제</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
// ... (TagBlock 과 styles 는 사장님 기존 코드와 동일) ...
