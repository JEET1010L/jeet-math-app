export const s2Questions = [
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
]
