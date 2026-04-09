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
   1. 점수 및 레벨 계산 (기존 유지)
========================= */
export function calculateScore(questions, answers) {
  return questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.answer ? 1 : 0);
  }, 0);
}

export function calculateScoreRate(score, total) {
  return Math.round((score / total) * 100);
}

export function classifyLevel(scoreRate) {
  if (scoreRate >= 90) return "최상";
  if (scoreRate >= 70) return "상";
  if (scoreRate >= 50) return "중";
  return "하";
}

/* =========================
   2. 개념 분석 (강점/약점 추출)
========================= */
export function analyzeResults(questions, answers) {
  const conceptMap = {};
  questions.forEach((q, i) => {
    // subConcept(세부개념) 기준으로 분석해야 더 정교한 멘트가 나옵니다.
    const concept = q.subConcept || q.concept || "기타";
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
  return analysis.filter((item) => item.correct === item.total).map((item) => item.concept);
}

export function getWeakConcepts(analysis) {
  return analysis.filter((item) => item.correct < item.total).map((item) => item.concept);
}

/* =========================
   3. 👑 멘트의 제왕 전문 상담 엔진 (추가됨)
========================= */
export const ALL_CONCEPT_DATA = {
  "S1": {
    STRENGTH: {
      "소인수분해": "수의 구조를 소인수의 곱으로 분해하여 바라보는 논리적 사고력이 매우 탄탄합니다.",
      "정수와 유리수": "기본적인 사칙연산의 원리를 정확히 이해하고 있으며, 부호 결정에 있어 실수가 거의 없는 안정적인 계산력을 보유하고 있습니다.",
      "문자와 식": "추상적인 문자를 사용하여 상황을 식으로 나타내는 능력이 우수하며, 이는 향후 방정식 학습의 큰 자산이 됩니다."
    },
    WEAKNESS: {
      "최대공약수와 최소공배수": "수의 성질을 활용한 문장제 문제에서 어떤 개념을 적용할지 판단하는 추론 능력이 다소 부족합니다.",
      "일차방정식의 활용": "문제의 상황을 수식으로 옮기는 '모델링' 단계에서 어려움을 겪고 있습니다. 독해력과 연계된 집중 훈련이 필요합니다."
    }
  },
  "S2": {
    STRENGTH: {
      "연립방정식": "두 변수의 관계를 소거법이나 대입법으로 해결하는 기술적 숙련도가 매우 높습니다.",
      "일차함수와 그래프": "함수의 기울기와 절편이 의미하는 변화율을 정확히 파악하여 응용 문제에 강점을 보입니다."
    },
    WEAKNESS: {
      "부등식의 활용": "부등호의 방향이 바뀌는 조건에 대한 주의력이 부족하여 아쉬운 감점이 발생합니다.",
      "확률과 통계": "경우의 수를 빠짐없이 구하는 논리적 꼼꼼함이 부족하여 결정적인 실수가 잦습니다."
    }
  },
  "S3": {
    STRENGTH: {
      "제곱근의 정의": "무리수의 발생 원리와 수 체계 확장을 깊이 있게 이해하고 있어 상위 개념 수용 능력이 탁월합니다.",
      "합차 공식": "식의 구조를 직관적으로 파악하여 전개 과정을 단축시키는 경제적 풀이 감각을 가졌습니다.",
      "인수분해": "다항식을 인수의 곱으로 묶어내는 패턴 인식 능력이 좋아 복잡한 방정식 풀이의 기초가 탄탄합니다."
    },
    WEAKNESS: {
      "제곱근의 성질 활용": "문자가 포함된 근호 식에서 부호를 결정하는 디테일이 부족합니다. 상위권 도약을 위해 반드시 정복해야 할 구간입니다.",
      "이차방정식의 활용": "문제의 조건을 검토하여 근의 유효성을 판단하는 추론력이 보완되어야 합니다."
    }
  }
};

// 전문 코멘트 생성기
export function buildConsultingComment({ studentName, gradeCode, scoreRate, strongConcepts, weakConcepts }) {
  const db = ALL_CONCEPT_DATA[gradeCode] || ALL_CONCEPT_DATA["S3"];
  const sText = strongConcepts.length > 0 ? db.STRENGTH[strongConcepts[0]] || "수학적 기본기가 탄탄합니다." : "성실하게 학습에 임하고 있습니다.";
  const wText = weakConcepts.length > 0 ? weakConcepts.slice(0, 2).map(con => db.WEAKNESS[con] || `${con} 보완이 필요합니다.`).join(" 또한 ") : "안정적인 성취도를 보입니다.";
  
  let advice = scoreRate >= 70 ? " 실수를 줄이면 최상위권 진입이 가능합니다." : " 기초 개념 재정립이 필요한 시기입니다.";
  
  return `${studentName} 학생은 ${sText} 다만, ${wText}${advice}`;
}

/* =========================
   4. Firebase 저장 및 조회 (기존 유지)
========================= */
export async function saveResultToFirebase(result) {
  await addDoc(collection(db, "results"), {
    ...result,
    createdAt: serverTimestamp(),
  });
}

export async function getSavedResultsFromFirebase() {
  const q = query(collection(db, "results"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
