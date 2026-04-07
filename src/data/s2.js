export const s2Questions = [
  { 
    id: 1, 
    concept: "유리수", 
    subConcept: "뜻", 
    prompt: "다음 중 유리수가 아닌 것은?", 
    // 양옆에 공백을 넉넉히 넣었습니다. 이렇게 해야 번호와 안 겹칩니다.
    choices: [" 0 ", " \\frac{1}{2} ", " -3 ", " \\pi "], 
    answer: 3, 
    explanation: "\\pi는 무리수입니다." 
  },
  { 
    id: 2, 
    concept: "유리수", 
    subConcept: "유한소수", 
    prompt: "분수 \\frac{7}{20}을 소수로 나타내면?", 
    choices: [" 유한소수 ", " 순환소수 ", " 무한소수 ", " 정수 "], 
    answer: 0, 
    explanation: "분모의 소인수가 2와 5뿐입니다." 
  },
  { 
    id: 3, 
    concept: "유리수", 
    subConcept: "표현", 
    prompt: "0.333...을 순환마디로 나타내면?", 
    choices: [" 0.3 ", " 0.\\dot{3} ", " 0.33 ", " 0.\\dot{3}\\dot{3} "], 
    answer: 1, 
    explanation: "반복되는 마디 위에 점을 찍습니다." 
  },
  { 
    id: 4, 
    concept: "지수법칙", 
    prompt: "a^3 \\times a^4을 간단히 하면?", 
    // 정답: 각 선택지 앞에 '공백'을 한 칸씩 추가했습니다.
    choices: [" a^7", " a^{12}", " 2a^7", " a^{34}"], 
    answer: 0, 
    explanation: "지수끼리 더합니다." 
  },
  { 
    id: 5, 
    concept: "지수법칙", 
    prompt: "(x^2)^3을 간단히 하면?", 
    choices: [" x^5", " x^6", " x^8", " 3x^2"], 
    answer: 1, 
    explanation: "지수끼리 곱합니다." 
  }
