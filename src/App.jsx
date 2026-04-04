
import { TEXT } from "./constants/text";
import { useMemo, useState } from "react";
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
  g1: "수 감각 · 규칙 · 비교",
  g2: "받아올림 · 길이 · 곱셈 기초",
  g3: "분수 기초 · 자료 읽기",
  g4: "약수/배수 기초 · 각도",
  g5: "분수/소수 · 비와 비율",
  g6: "비례식 · 속력 · 원",
  m1: "정수 · 문자와 식 · 방정식",
  m2: "일차함수 · 연립방정식 · 확률",
  m3: "이차방정식 · 이차함수",
  h1: "다항식 · 방정식 · 이차함수",
  h2: "지수로그 · 수열 · 미분 기초",
  h3: "미적분 · 함수 해석 · 수능형 사고",
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
  const scoreRate = useMemo(
    () => calculateScoreRate(score, questions.length || 1),
    [score, questions.length]
  );
  const analysis = useMemo(() => analyzeResults(questions, answers), [questions, answers]);
  const strongConcepts = useMemo(() => getStrongConcepts(analysis), [analysis]);
  const weakConcepts = useMemo(() => getWeakConcepts(analysis), [analysis]);
  const level = useMemo(() => classifyLevel(scoreRate), [scoreRate]);
  const consultingComment = useMemo(
    () =>
      grade
        ? buildConsultingComment({
          gradeLabel: gradeLabels[grade],
          scoreRate,
          strongConcepts,
          weakConcepts,
        })
        : "",
    [grade, scoreRate, strongConcepts, weakConcepts]
  );

  const resetToHome = () => {
    setGrade(null);
    setIndex(0);
    setAnswers([]);
    setFinished(false);
    setSelected(null);
    setShow(false);
  };

  const startTest = (selectedGrade) => {
    setGrade(selectedGrade);
    setIndex(0);
    setAnswers([]);
    setFinished(false);
    setSelected(null);
    setShow(false);
  };

  const checkAnswer = () => {
    if (selected === null) return;
    setShow(true);
  };

  const nextQuestion = async () => {
    const newAnswers = [...answers, selected];

    if (index + 1 < questions.length) {
      setAnswers(newAnswers);
      setIndex(index + 1);
      setSelected(null);
      setShow(false);
      return;
    }

    const finalScore = calculateScore(questions, newAnswers);
    const finalRate = calculateScoreRate(finalScore, questions.length);
    const finalAnalysis = analyzeResults(questions, newAnswers);
    const finalStrong = getStrongConcepts(finalAnalysis);
    const finalWeak = getWeakConcepts(finalAnalysis);
    const finalLevel = classifyLevel(finalRate);
    const finalComment = buildConsultingComment({
      gradeLabel: gradeLabels[grade],
      scoreRate: finalRate,
      strongConcepts: finalStrong,
      weakConcepts: finalWeak,
    });

    const resultSummary = buildParentSummary({
      studentName: studentName || "학생",
      gradeLabel: gradeLabels[grade],
      score: finalScore,
      total: questions.length,
      scoreRate: finalRate,
      level: finalLevel,
      strongConcepts: finalStrong,
      weakConcepts: finalWeak,
      consultingComment: finalComment,
    });

    // 결과 화면은 먼저 보여주기
    setAnswers(newAnswers);
    setSelected(null);
    setShow(false);
    setFinished(true);

    // 저장은 따로 시도
    try {
      await saveResultToFirebase(resultSummary);
      console.log("Firebase 저장 성공");
    } catch (error) {
      console.error("Firebase 저장 실패:", error);
    }
  };
  const progress = questions.length ? Math.round(((index + 1) / questions.length) * 100) : 0;

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
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={TEXT.NAME_PLACEHOLDER}
                style={styles.nameInput}
              />
            </div>

            <div style={styles.gradeGrid}>
              {Object.keys(dataMap).map((key) => (
                <button
                  key={key}
                  onClick={() => startTest(key)}
                  style={styles.gradeButton}
                >
                  <div style={styles.gradeButtonTop}>
                    <span style={styles.gradeButtonTitle}>{gradeLabels[key]}</span>
                    <span style={styles.gradeBadge}>{TEXT.START_BADGE}</span>
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

  if (grade && questions.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.heroCard}>
            <div style={styles.title}>문제 데이터가 없습니다</div>
            <button onClick={resetToHome} style={styles.primaryButton}>처음으로</button>
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
            <div style={styles.curveTop} />
            <div style={styles.logoWrap}>
              <div style={styles.logoText}>JEET</div>
              <div style={styles.logoTag}>수학</div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ ...styles.title, marginBottom: 8 }}>{studentName || "학생"} 결과 리포트</div>
              <div style={styles.resultScore}>{scoreRate}%</div>
              <div style={styles.resultMeta}>{score} / {questions.length} · {gradeLabels[grade]} · {level}</div>
            </div>

            <div style={styles.reportCard}>
              <div style={styles.reportTitle}>{TEXT.RESULT_REPORT_TITLE}</div>
              <div style={styles.reportText}>{consultingComment}</div>
              <div style={{ ...styles.reportText, marginTop: 8, color: COLORS.slate }}>{getLevelComment(level)}</div>
            </div>

            <div style={styles.resultSectionTitle}>{TEXT.RESULT_ANALYSIS_TITLE}</div>
            <div style={{ display: "grid", gap: 12 }}>
              {analysis.map((item) => (
                <div key={item.concept} style={styles.analysisCard}>
                  <div style={styles.analysisHead}>
                    <span style={styles.analysisConcept}>{item.concept}</span>
                    <span style={styles.analysisRate}>{item.correct}/{item.total} · {item.rate}%</span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressFill, width: `${item.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.tagSection}>
              <TagBlock label="강점 개념" items={strongConcepts} tone="success" />
              <TagBlock label="보완 필요" items={weakConcepts} tone="danger" />
            </div>

            <div style={styles.resultButtons}>
              <button onClick={resetToHome} style={styles.secondaryButton}>{TEXT.HOME_BUTTON}</button>
              <button onClick={resetToHome} style={styles.primaryButton}>{TEXT.RETRY_BUTTON}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div style={styles.progressBadge}>{progress}%</div>
          </div>

          <div style={styles.progressTrackLarge}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>

          <div style={styles.questionCard}>
            <div style={styles.questionConcept}>{q.concept}</div>
            <div style={styles.questionText}>{q.prompt}</div>
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
                  onClick={() => {
                    if (!show) setSelected(i);
                  }}
                  style={{
                    ...styles.choiceButton,
                    ...(isSelected ? styles.choiceSelected : {}),
                    ...(showCorrect ? styles.choiceCorrect : {}),
                    ...(showWrong ? styles.choiceWrong : {}),
                  }}
                >
                  <span style={styles.choiceIndex}>{i + 1}</span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {!show ? (
            <button onClick={checkAnswer} style={styles.primaryButton} disabled={selected === null}>
              {TEXT.CHECK_ANSWER}
            </button>
          ) : (
            <>
              <div
                style={{
                  ...styles.feedbackCard,
                  ...(selected === q.answer ? styles.feedbackCorrect : styles.feedbackWrong),
                }}
              >
                <div style={styles.feedbackTitle}>
                  {selected === q.answer ? TEXT.FEEDBACK_CORRECT : TEXT.FEEDBACK_WRONG}
                </div>
                <div style={styles.feedbackText}>해설: {q.explanation}</div>
              </div>
              <button onClick={nextQuestion} style={styles.primaryButton}>
                {index + 1 === questions.length ? TEXT.VIEW_RESULT : TEXT.NEXT_QUESTION}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TagBlock({ label, items, tone }) {
  const isSuccess = tone === "success";
  return (
    <div style={styles.tagCard}>
      <div style={styles.tagTitle}>{label}</div>
      <div style={styles.tagWrap}>
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              style={{
                ...styles.tag,
                background: isSuccess ? COLORS.successBg : COLORS.errorBg,
                color: isSuccess ? COLORS.successText : COLORS.errorText,
              }}
            >
              {item}
            </span>
          ))
        ) : (
          <span style={{ color: COLORS.slate, fontSize: 14 }}>해당 없음</span>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)",
    padding: "20px 12px",
    fontFamily: "Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif",
    color: COLORS.navy,
  },
  shell: {
    maxWidth: 640,
    margin: "0 auto",
  },
  heroCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 32,
    background: COLORS.softCard,
    boxShadow: "0 24px 50px rgba(15,23,42,0.10)",
    padding: 20,
    border: `1px solid ${COLORS.line}`,
  },
  curveTop: {
    height: 8,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    background: COLORS.primaryGrad,
    margin: "-4px -4px 24px -4px",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 900,
    color: COLORS.primary,
    lineHeight: 1,
    letterSpacing: -1.5,
  },
  logoTag: {
    background: COLORS.primaryGrad,
    color: COLORS.white,
    padding: "8px 16px",
    borderRadius: 14,
    fontWeight: 800,
    fontSize: 24,
    lineHeight: 1,
    boxShadow: "0 10px 24px rgba(225,29,72,0.22)",
  },
  title: {
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 18,
    color: COLORS.slate,
    fontStyle: "italic",
  },
  inputCard: {
    marginBottom: 18,
  },
  nameInput: {
    width: "100%",
    height: 68,
    borderRadius: 18,
    border: `2px solid ${COLORS.line}`,
    background: COLORS.white,
    textAlign: "center",
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.navy,
    outline: "none",
    boxSizing: "border-box",
  },
  gradeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  gradeButton: {
    borderRadius: 20,
    border: `1px solid ${COLORS.line}`,
    background: COLORS.white,
    padding: 16,
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
  },
  gradeButtonTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  gradeButtonTitle: {
    fontSize: 22,
    fontWeight: 900,
    color: COLORS.navy,
  },
  gradeBadge: {
    background: "rgba(225,29,72,0.08)",
    color: COLORS.primary,
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 800,
  },
  gradeDesc: {
    color: COLORS.slate,
    fontSize: 13,
    lineHeight: 1.5,
  },
  quizHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quizGrade: {
    fontSize: 28,
    fontWeight: 900,
    color: COLORS.navy,
  },
  quizCount: {
    fontSize: 14,
    color: COLORS.slate,
    marginTop: 4,
  },
  progressBadge: {
    borderRadius: 999,
    background: "rgba(225,29,72,0.08)",
    color: COLORS.primary,
    padding: "8px 14px",
    fontWeight: 800,
    fontSize: 14,
  },
  progressTrackLarge: {
    width: "100%",
    height: 12,
    background: "#E2E8F0",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 18,
  },
  progressTrack: {
    width: "100%",
    height: 10,
    background: "#E2E8F0",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: COLORS.primaryGrad,
    borderRadius: 999,
  },
  questionCard: {
    borderRadius: 24,
    background: "#FFFFFF",
    border: `1px solid ${COLORS.line}`,
    padding: 20,
    marginBottom: 18,
    boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  },
  questionConcept: {
    color: COLORS.primary,
    fontWeight: 800,
    fontSize: 14,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 900,
    lineHeight: 1.4,
    letterSpacing: -0.6,
  },
  choiceList: {
    display: "grid",
    gap: 12,
    marginBottom: 20,
  },
  choiceButton: {
    width: "100%",
    borderRadius: 18,
    border: `2px solid ${COLORS.line}`,
    background: COLORS.white,
    padding: "18px 16px",
    fontSize: 24,
    fontWeight: 700,
    textAlign: "left",
    color: COLORS.navy,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxSizing: "border-box",
  },
  choiceIndex: {
    minWidth: 26,
    color: COLORS.slate,
    fontWeight: 800,
  },
  choiceSelected: {
    border: `2px solid ${COLORS.primary}`,
    background: "rgba(225,29,72,0.05)",
  },
  choiceCorrect: {
    border: "2px solid #10B981",
    background: COLORS.successBg,
    color: COLORS.successText,
  },
  choiceWrong: {
    border: `2px solid ${COLORS.primary}`,
    background: COLORS.errorBg,
    color: COLORS.errorText,
  },
  primaryButton: {
    width: "100%",
    height: 76,
    border: "none",
    borderRadius: 18,
    color: COLORS.white,
    fontSize: 30,
    fontWeight: 900,
    background: COLORS.primaryGrad,
    boxShadow: "0 14px 28px rgba(225,29,72,0.28)",
    cursor: "pointer",
  },
  secondaryButton: {
    flex: 1,
    height: 64,
    border: `1px solid ${COLORS.line}`,
    borderRadius: 16,
    background: COLORS.white,
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: 800,
    cursor: "pointer",
  },
  feedbackCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    border: `1px solid ${COLORS.line}`,
  },
  feedbackCorrect: {
    background: COLORS.successBg,
    color: COLORS.successText,
  },
  feedbackWrong: {
    background: COLORS.errorBg,
    color: COLORS.errorText,
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: 900,
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 18,
    lineHeight: 1.6,
  },
  resultScore: {
    fontSize: 64,
    fontWeight: 900,
    lineHeight: 1,
    color: COLORS.navy,
    letterSpacing: -2,
  },
  resultMeta: {
    marginTop: 8,
    fontSize: 18,
    color: COLORS.slate,
  },
  reportCard: {
    borderRadius: 22,
    background: "#FFF7F9",
    border: "1px solid #FFD5DF",
    padding: 18,
    marginBottom: 20,
  },
  reportTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 8,
  },
  reportText: {
    fontSize: 17,
    lineHeight: 1.7,
    color: COLORS.navy,
  },
  resultSectionTitle: {
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 12,
  },
  analysisCard: {
    borderRadius: 18,
    border: `1px solid ${COLORS.line}`,
    background: COLORS.white,
    padding: 14,
  },
  analysisHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  analysisConcept: {
    fontWeight: 800,
    fontSize: 16,
  },
  analysisRate: {
    fontSize: 14,
    color: COLORS.slate,
  },
  tagSection: {
    display: "grid",
    gap: 12,
    marginTop: 18,
  },
  tagCard: {
    borderRadius: 18,
    border: `1px solid ${COLORS.line}`,
    background: COLORS.white,
    padding: 14,
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: 900,
    marginBottom: 10,
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 14,
    fontWeight: 800,
  },
  resultButtons: {
    display: "flex",
    gap: 12,
    marginTop: 20,
  },
};
