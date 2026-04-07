export const s2Questions = [
  { id: 1, concept: "유리수", subConcept: "뜻", prompt: "다음 중 유리수가 아닌 것은?", choices: [" 0 ", " \\frac{1}{2} ", " -3 ", " \\pi "], answer: 3, explanation: "\\pi는 무리수입니다." },
  { id: 2, concept: "유리수", subConcept: "유한소수", prompt: "분수 \\frac{7}{20}을 소수로 나타내면?", choices: [" 유한소수 ", " 순환소수 ", " 무한소수 ", " 정수 "], answer: 0, explanation: "분모 소인수가 2, 5뿐입니다." },
  { id: 3, concept: "유리수", subConcept: "표현", prompt: "0.333...을 순환마디로 나타내면?", choices: [" 0.3 ", " 0.\\dot{3} ", " 0.33 ", " 0.\\dot{3}\\dot{3} "], answer: 1, explanation: "반복되는 마디에 점을 찍습니다." },
  { id: 4, concept: "지수법칙", subConcept: "곱셈", prompt: "a^3 \\times a^4을 간단히 하면?", choices: [" a^7 ", " a^{12} ", " 2a^7 ", " a^{34} "], answer: 0, explanation: "지수끼리 더합니다." },
  { id: 5, concept: "지수법칙", subConcept: "거듭제곱", prompt: "(x^2)^3을 간단히 하면?", choices: [" x^5 ", " x^6 ", " x^8 ", " 3x^2 "], answer: 1, explanation: "지수끼리 곱합니다." },
  { id: 6, concept: "부등식", subConcept: "해", prompt: "2x - 4 > 0의 해는?", choices: [" x > 2 ", " x < 2 ", " x > -2 ", " x < -2 "], answer: 0, explanation: "2x > 4 이므로 x > 2입니다." },
  { id: 7, concept: "연립방정식", subConcept: "계산", prompt: "x+y=5, x-y=1 일 때 x의 값은?", choices: [" 2 ", " 3 ", " 4 ", " 5 "], answer: 1, explanation: "두 식을 더하면 2x=6, x=3입니다." },
  { id: 8, concept: "일차함수", subConcept: "기울기", prompt: "y = 3x - 5의 기울기는?", choices: [" 3 ", " -5 ", " 5 ", " -3 "], answer: 0, explanation: "x의 계수가 기울기입니다." },
  { id: 9, concept: "일차함수", subConcept: "y절편", prompt: "y = -2x + 4의 y절편은?", choices: [" -2 ", " 2 ", " 4 ", " -4 "], answer: 2, explanation: "상수항이 y절편입니다." },
  { id: 10, concept: "단항식", subConcept: "나눗셈", prompt: "12x^5 \\div 3x^2은?", choices: [" 4x^3 ", " 4x^7 ", " 9x^3 ", " 36x^7 "], answer: 0, explanation: "계수는 나누고 지수는 뺍니다." }
];
