import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

/* =========================
   1. 점수 계산
========================= */

export function calculateScore(questions, answers) {
  return questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.answer ? 1 : 0);
  }, 0);
}

export function calculateScoreRate(score, total) {
  return Math.round((score / total) * 100);
}

/* =========================
   2. 개념 분석
========================= */

export function analyzeResults(questions, answers) {
  const conceptMap = {};

  questions.forEach((q, i) => {
    const concept = q.concept || "기타";

    if (!conceptMap[concept]) {
      conceptMap[concept] = { total: 0, correct: 0 };
    }

    conceptMap[concept].total += 1;

    if (answers[i] === q.answer) {
      conceptMap[concept].correct += 1;
    }
  });

  return Object.entries(conceptMap).map(([concept, value]) => ({
    concept,
    total: value.total,
    correct: value.correct,
    rate: Math.round((value.correct / value.total) * 100),
  }));
}

export function getStrongConcepts(analysis) {
  return analysis
    .filter((item) => item.correct === item.total)
    .map((item) => item.concept);
}

export function getWeakConcepts(analysis) {
  return analysis
    .filter((item) => item.correct < item.total)
    .map((item) => item.concept);
}

/* =========================
   3. 레벨 분류
========================= */

export function classifyLevel(scoreRate) {
  if (scoreRate >= 90) return "최상";
  if (scoreRate >= 70) return "상";
  if (scoreRate >= 50) return "중";
  return "하";
}

/* =========================
   4. 상담 코멘트
========================= */

export function buildConsultingComment({
  gradeLabel,
  scoreRate,
  strongConcepts,
  weakConcepts,
}) {
  let comment = `${gradeLabel} 기준으로 현재 이해도는 ${scoreRate}%입니다. `;

  if (strongConcepts.length) {
    comment += `강점은 ${strongConcepts.join(", ")}이며 `;
  }

  if (weakConcepts.length) {
    comment += `보완이 필요한 개념은 ${weakConcepts.join(", ")}입니다.`;
  } else {
    comment += "전반적으로 고르게 이해하고 있습니다.";
  }

  return comment;
}

/* =========================
   5. 학부모 리포트 요약
========================= */

export function buildParentSummary({
  studentName,
  gradeLabel,
  score,
  total,
  scoreRate,
  level,
  strongConcepts,
  weakConcepts,
  consultingComment,
}) {
  return {
    studentName,
    gradeLabel,
    score,
    total,
    scoreRate,
    level,
    strongConcepts,
    weakConcepts,
    consultingComment,
  };
}

/* =========================
   6. Firebase 저장
========================= */

export async function saveResultToFirebase(result) {
  await addDoc(collection(db, "results"), {
    ...result,
    createdAt: serverTimestamp(),
  });
}

/* =========================
   7. Firebase 조회
========================= */

export async function getSavedResultsFromFirebase() {
  const q = query(collection(db, "results"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}