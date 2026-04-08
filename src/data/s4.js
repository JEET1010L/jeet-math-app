export const s4 = [
  // --- 1. 다항식의 연산 ---
  { id: 1, concept: "다항식의 연산", subconcept: "덧셈과 뺄셈", difficulty: 1, prompt: "$A = x^2 - x + 2, B = 2x^2 + 3x - 1$일 때, $A+B$는?", choices: ["$3x^2+2x+1$", "$3x^2-2x+1$", "$x^2+4x-3$", "$3x^2+4x+1$", "$3x^2+2x-1$"], answer: 0, explanation: "$(x^2+2x^2) + (-x+3x) + (2-1) = 3x^2+2x+1$" },
  { id: 2, concept: "다항식의 연산", subconcept: "곱셈공식", difficulty: 2, prompt: "$(x+3)^2 - (x-3)^2$을 간단히 하면?", choices: ["$2x^2+18$", "$12x$", "$6x$", "$18$", "$0$"], answer: 1, explanation: "$(x^2+6x+9) - (x^2-6x+9) = 12x$" },
  { id: 3, concept: "다항식의 연산", subconcept: "곱셈공식(변형)", difficulty: 3, prompt: "$x+y=4, xy=1$일 때, $x^2+y^2$의 값은?", choices: ["14", "16", "18", "12", "15"], answer: 0, explanation: "$x^2+y^2 = (x+y)^2 - 2xy = 4^2 - 2(1) = 14$" },
  { id: 4, concept: "다항식의 연산", subconcept: "곱셈공식(변형)", difficulty: 3, prompt: "$x-y=2, xy=3$일 때, $x^3-y^3$의 값은?", choices: ["18", "20", "26", "30", "35"], answer: 2, explanation: "$x^3-y^3 = (x-y)^3 + 3xy(x-y) = 2^3 + 3(3)(2) = 8+18 = 26$" },
  { id: 5, concept: "다항식의 연산", subconcept: "내림차순 정리", difficulty: 2, prompt: "$x^2+xy-y^2+2x-3y+1$을 $x$에 대한 내림차순으로 정리했을 때 $x$의 계수는?", choices: ["$y$", "$y+2$", "$-y-3$", "$1$", "$2$"], answer: 1, explanation: "$x^2 + (y+2)x + (-y^2-3y+1)$ 이므로 계수는 $y+2$이다." },
  { id: 6, concept: "다항식의 연산", subconcept: "곱셈공식(고차)", difficulty: 4, prompt: "$(x+1)(x+2)(x+3)$의 전개식에서 $x^2$의 계수는?", choices: ["3", "6", "11", "18", "22"], answer: 1, explanation: "$(x+a)(x+b)(x+c)$에서 $x^2$의 계수는 $a+b+c$이다. $1+2+3=6$." },
  { id: 7, concept: "다항식의 연산", subconcept: "다항식의 나눗셈", difficulty: 2, prompt: "$x^2-3x+5$를 $x-1$로 나누었을 때의 몫은?", choices: ["$x-1$", "$x-2$", "$x+2$", "$x+1$", "$x-3$"], answer: 1, explanation: "$x^2-3x+5 = (x-1)(x-2) + 3$ 이므로 몫은 $x-2$이다." },
  { id: 8, concept: "다항식의 연산", subconcept: "조립제법", difficulty: 3, prompt: "$2x^3-4x^2+x-3$을 $x-2$로 나눌 때 조립제법을 이용하면 나머지는?", choices: ["-1", "-2", "1", "2", "3"], answer: 0, explanation: "$x=2$를 대입한 값과 같다. $2(8)-4(4)+2-3 = 16-16+2-3 = -1$." },

  // --- 2. 나머지정리와 인수분해 ---
  { id: 9, concept: "나머지정리", subconcept: "나머지정리 기본", difficulty: 2, prompt: "$f(x)=x^3-2x^2+ax-3$을 $x-1$로 나눈 나머지가 2일 때, $a$의 값은?", choices: ["4", "5", "6", "7", "8"], answer: 2, explanation: "$f(1)=1-2+a-3=2 \Rightarrow a-4=2, a=6$." },
  { id: 10, concept: "나머지정리", subconcept: "인수정리", difficulty: 3, prompt: "$x^3+ax^2+bx-2$가 $(x-1)(x+2)$로 나누어 떨어질 때, $a+b$의 값은?", choices: ["1", "2", "3", "-1", "0"], answer: 0, explanation: "$f(1)=a+b-1=0 \Rightarrow a+b=1$. 연립 과정 생략 시 결과값 $a+b=1$은 인덱스 0번입니다." },
  { id: 11, concept: "항등식", subconcept: "계수비교법", difficulty: 2, prompt: "모든 실수 $x$에 대하여 $ax^2+2x+c = 3x^2+bx-1$이 성립할 때, $a+b+c$는?", choices: ["2", "3", "4", "5", "6"], answer: 2, explanation: "$a=3, b=2, c=-1$. $a+b+c=4$." },
  { id: 12, concept: "항등식", subconcept: "수치대입법", difficulty: 3, prompt: "$a(x-1)^2 + b(x-1) + c = x^2$이 $x$에 대한 항등식일 때, $a+b+c$의 값은?", choices: ["1", "3", "4", "6", "9"], answer: 2, explanation: "$a=1, b=2, c=1$이므로 $a+b+c=4$입니다." },
  { id: 13, concept: "인수분해", subconcept: "공통인수", difficulty: 2, prompt: "$x(a-b) - y(b-a)$를 인수분해하면?", choices: ["$(x-y)(a-b)$", "$(x+y)(a-b)$", "$(x+y)(b-a)$", "$(x-y)(b-a)$", "$-(x+y)(a-b)$"], answer: 1, explanation: "$x(a-b) + y(a-b) = (x+y)(a-b)$" },
  { id: 14, concept: "인수분해", subconcept: "이차식의 인수분해", difficulty: 2, prompt: "$2x^2-5x-3$을 인수분해하면?", choices: ["$(2x-1)(x+3)$", "$(2x+1)(x-3)$", "$(2x-3)(x+1)$", "$(2x+3)(x-1)$", "$(x-3)(x+2)$"], answer: 1, explanation: "$(2x+1)(x-3) = 2x^2-5x-3$" },
  { id: 15, concept: "인수분해", subconcept: "복이차식", difficulty: 4, prompt: "$x^4+x^2+1$을 인수분해하면?", choices: ["$(x^2+x+1)(x^2-x+1)$", "$(x^2+1)^2$", "$(x^2-1)^2$", "$(x^2+x-1)(x^2-x-1)$", "인수분해 안됨"], answer: 0, explanation: "$(x^2+1)^2-x^2 = (x^2+x+1)(x^2-x+1)$" },
  { id: 16, concept: "인수분해", subconcept: "치환을 이용한 인수분해", difficulty: 3, prompt: "$(x^2-x)^2 - 8(x^2-x) + 12$의 인수가 아닌 것은?", choices: ["$x-2$", "$x+1$", "$x-3$", "$x+2$", "$x-1$"], answer: 4, explanation: "$(x-2)(x+1)(x-3)(x+2)$로 인수분해되므로 $x-1$은 인수가 아니다." },
  { id: 17, concept: "인수분해", subconcept: "순환식의 인수분해", difficulty: 5, prompt: "$a(b^2-c^2)+b(c^2-a^2)+c(a^2-b^2)$를 인수분해하면?", choices: ["$(a-b)(b-c)(c-a)$", "$-(a-b)(b-c)(c-a)$", "$(a+b)(b+c)(c+a)$", "$-(a+b)(b+c)(c+a)$", "$abc(a+b+c)$"], answer: 1, explanation: "내림차순 정리 후 인수분해하면 $-(a-b)(b-c)(c-a)$이다." },
  { id: 18, concept: "인수분해", subconcept: "계산 활용", difficulty: 3, prompt: "$101^2 - 99^2$의 값은?", choices: ["200", "400", "600", "800", "1000"], answer: 1, explanation: "$(101-99)(101+99) = 2 \times 200 = 400$" },

  // --- 3. 복소수와 이차방정식 ---
  { id: 19, concept: "복소수", subconcept: "복소수의 뜻", difficulty: 1, prompt: "다음 중 허수인 것은?", choices: ["$0$", "$\pi$", "$\sqrt{2}$", "$1+i$", "$-3$"], answer: 3, explanation: "$i$가 포함된 수가 허수이다." },
  { id: 20, concept: "복소수", subconcept: "복소수의 연산", difficulty: 2, prompt: "$(2+3i) + (1-i)$는?", choices: ["$3+4i$", "$3+2i$", "$1+4i$", "$3-2i$", "$2+2i$"], answer: 1, explanation: "$3+2i$" },
  { id: 21, concept: "복소수", subconcept: "복소수의 곱셈", difficulty: 2, prompt: "$(1+i)^2$을 간단히 하면?", choices: ["$2$", "$-2$", "$2i$", "$-2i$", "$0$"], answer: 2, explanation: "$1+2i+i^2 = 2i$" },
  { id: 22, concept: "복소수", subconcept: "켤레복소수", difficulty: 3, prompt: "$z=2-i$일 때, $z\bar{z}$의 값은?", choices: ["3", "5", "4", "$4-i$", "$4+i$"], answer: 1, explanation: "$(2-i)(2+i) = 4+1 = 5$" },
  { id: 23, concept: "복소수", subconcept: "i의 거듭제곱", difficulty: 3, prompt: "$i^{50}$의 값은?", choices: ["$i$", "$-i$", "$1$", "$-1$", "$0$"], answer: 3, explanation: "$i^{50} = (i^4)^{12} \times i^2 = -1$" },
  { id: 24, concept: "복소수", subconcept: "음수의 제곱근", difficulty: 4, prompt: "$\sqrt{-2}\sqrt{-3}$의 값은?", choices: ["$\sqrt{6}$", "$-\sqrt{6}$", "$\sqrt{6}i$", "$-\sqrt{6}i$", "$6$"], answer: 1, explanation: "$-\sqrt{6}$" },
  { id: 25, concept: "이차방정식", subconcept: "판별식", difficulty: 2, prompt: "$x^2-6x+9=0$의 근의 판별 결과는?", choices: ["서로 다른 두 실근", "중근", "서로 다른 두 허근", "실근이 없다", "알 수 없다"], answer: 1, explanation: "$D/4 = 0$이므로 중근이다." },
  { id: 26, concept: "이차방정식", subconcept: "판별식(미지수)", difficulty: 3, prompt: "$x^2+2x+k=0$이 허근을 갖도록 하는 $k$의 범위는?", choices: ["$k<1$", "$k=1$", "$k>1$", "$k \le 1$", "$k \ge 1$"], answer: 2, explanation: "$D/4 = 1-k < 0 \Rightarrow k>1$" },
  { id: 27, concept: "이차방정식", subconcept: "근과 계수의 관계", difficulty: 2, prompt: "$x^2-5x+3=0$의 두 근의 합은?", choices: ["-5", "5", "3", "-3", "1"], answer: 1, explanation: "두 근의 합은 5이다." },
  { id: 28, concept: "이차방정식", subconcept: "근과 계수의 관계", difficulty: 2, prompt: "$2x^2+4x-1=0$의 두 근의 곱은?", choices: ["2", "-2", "1/2", "-1/2", "4"], answer: 3, explanation: "두 근의 곱은 $-1/2$이다." },
  { id: 29, concept: "이차방정식", subconcept: "두 근을 알 때의 식", difficulty: 3, prompt: "두 근이 $1, 3$이고 $x^2$의 계수가 1인 이차방정식은?", choices: ["$x^2-4x+3=0$", "$x^2+4x+3=0$", "$x^2-4x-3=0$", "$x^2+4x-3=0$", "$x^2-3x+4=0$"], answer: 0, explanation: "$x^2-4x+3=0$" },
  { id: 30, concept: "이차방정식", subconcept: "한 근이 주어질 때", difficulty: 3, prompt: "$x^2+ax+b=0$의 한 근이 $1+i$일 때, 실수 $a+b$의 값은?", choices: ["1", "0", "-1", "2", "-2"], answer: 1, explanation: "$a=-2, b=2$이므로 합은 0이다." },
  { id: 31, concept: "이차방정식", subconcept: "활용", difficulty: 4, prompt: "어떤 수의 제곱이 그 수의 2배보다 3만큼 클 때, 이 수들의 합은?", choices: ["1", "2", "3", "4", "5"], answer: 1, explanation: "$x^2-2x-3=0$의 두 근의 합은 2이다." },
  { id: 32, concept: "이차방정식", subconcept: "절댓값 포함", difficulty: 4, prompt: "$x^2+|x|-6=0$의 모든 실근의 곱은?", choices: ["-4", "-9", "-6", "4", "6"], answer: 0, explanation: "$x=\pm 2$이므로 곱은 -4이다." },

  // --- 4. 이차함수와 이차방정식 ---
  { id: 33, concept: "이차함수", subconcept: "x축과의 교점", difficulty: 2, prompt: "$y=x^2-4x+3$의 그래프가 $x$축과 만나는 두 점의 $x$좌표의 합은?", choices: ["2", "4", "3", "-4", "-3"], answer: 1, explanation: "4이다." },
  { id: 34, concept: "이차함수", subconcept: "x축과의 위치관계", difficulty: 3, prompt: "$y=x^2-2x+k$가 $x$축과 만나지 않을 조건은?", choices: ["$k<1$", "$k=1$", "$k>1$", "$k \le 1$", "$k \ge 1$"], answer: 2, explanation: "$k>1$이다." },
  { id: 35, concept: "이차함수", subconcept: "직선과의 위치관계", difficulty: 3, prompt: "$y=x^2$과 $y=2x+k$가 접할 때 $k$의 값은?", choices: ["1", "-1", "0", "2", "-2"], answer: 1, explanation: "$k=-1$이다." },
  { id: 36, concept: "이차함수", subconcept: "그래프 해석", difficulty: 3, prompt: "이차함수 $y=ax^2+bx+c$의 그래프가 아래로 볼록하고 축이 $x>0$에 있을 때 옳은 것은?", choices: ["$a<0, b>0$", "$a>0, b>0$", "$a>0, b<0$", "$a<0, b<0$", "$a>0, b=0$"], answer: 2, explanation: "$a>0, b<0$이다." },
  { id: 37, concept: "이차함수", subconcept: "꼭짓점 구하기", difficulty: 2, prompt: "$y=2x^2-4x+5$의 꼭짓점의 좌표는?", choices: ["$(1, 3)$", "$(1, 5)$", "$(2, 5)$", "$(1, -3)$", "$(2, 3)$"], answer: 0, explanation: "$(1, 3)$이다." },
  { id: 38, concept: "이차함수", subconcept: "식 세우기", difficulty: 3, prompt: "꼭짓점이 $(2, 1)$이고 $(0, 5)$를 지나는 이차함수의 식은?", choices: ["$y=(x-2)^2+1$", "$y=2(x-2)^2+1$", "$y=(x+2)^2+1$", "$y=2(x+2)^2+1$", "$y=-(x-2)^2+1$"], answer: 0, explanation: "$y=a(x-2)^2+1$에 $(0,5)$ 대입 시 $a=1$. 따라서 $y=(x-2)^2+1$입니다." },
  { id: 39, concept: "이차함수", subconcept: "x축 절편이 주어질 때", difficulty: 3, prompt: "$x$축과 두 점 $(1, 0), (3, 0)$에서 만나고 $(0, 3)$을 지나는 식의 $x^2$ 계수는?", choices: ["1", "2", "-1", "3", "1/3"], answer: 0, explanation: "$a=1$이다." },
  { id: 40, concept: "이차함수", subconcept: "직선과의 교점 거리", difficulty: 5, prompt: "$y=x^2$과 $y=x+2$의 두 교점 사이의 거리는?", choices: ["$\sqrt{2}$", "$2\sqrt{2}$", "$3\sqrt{2}$", "$4\sqrt{2}$", "$5$"], answer: 2, explanation: "교점 $(-1,1), (2,4)$ 사이의 거리는 $3\sqrt{2}$이다." },
  { id: 41, concept: "이차함수", subconcept: "항상 위쪽에 있을 조건", difficulty: 4, prompt: "$y=x^2-2x+3$이 직선 $y=m$보다 항상 위쪽에 있을 때 $m$의 범위는?", choices: ["$m<2$", "$m>2$", "$m<3$", "$m>3$", "$m=2$"], answer: 0, explanation: "최솟값 2보다 작아야 하므로 $m<2$이다." },
  { id: 42, concept: "이차함수", subconcept: "계수 부호 판별", difficulty: 4, prompt: "$y=ax^2+bx+c$ 그래프가 $x$축과 만나지 않고 위로 볼록할 때 $b^2-4ac$의 부호는?", choices: ["양수", "0", "음수", "알 수 없다", "항상 1"], answer: 2, explanation: "만나지 않으므로 $D<0$이다." },

  // --- 5. 이차함수의 최대와 최소 ---
  { id: 43, concept: "이차함수의 최대최소", subconcept: "기본형", difficulty: 2, prompt: "$y=x^2-2x+5$의 최솟값은?", choices: ["1", "2", "3", "4", "5"], answer: 3, explanation: "최솟값은 4이다." },
  { id: 44, concept: "이차함수의 최대최소", subconcept: "위로 볼록", difficulty: 2, prompt: "$y=-2x^2+8x-3$의 최댓값은?", choices: ["3", "5", "7", "8", "10"], answer: 1, explanation: "최댓값은 5이다." },
  { id: 45, concept: "이차함수의 최대최소", subconcept: "범위 제한", difficulty: 3, prompt: "$0 \le x \le 3$에서 $y=x^2-4x+3$의 최댓값은?", choices: ["3", "0", "-1", "2", "4"], answer: 0, explanation: "$x=0$에서 최댓값 3을 가진다." },
  { id: 46, concept: "이차함수의 최대최소", subconcept: "범위 제한(심화)", difficulty: 4, prompt: "$-1 \le x \le 1$에서 $y=-x^2-2x+5$의 최솟값은?", choices: ["2", "3", "4", "5", "6"], answer: 0, explanation: "$y=-(x+1)^2+6$. 범위 내 $x=1$에서 최솟값 2입니다." },
  { id: 47, concept: "이차함수의 최대최소", subconcept: "치환 활용", difficulty: 5, prompt: "$y=(x^2-2x)^2 + 2(x^2-2x) + 3$의 최솟값은?", choices: ["1", "2", "3", "4", "5"], answer: 1, explanation: "$t=x^2-2x \ge -1$로 치환하면 $y=(t+1)^2+2$. 최솟값은 2입니다." },
  { id: 48, concept: "이차함수의 최대최소", subconcept: "실생활 활용", difficulty: 3, prompt: "합이 10인 두 실수의 곱의 최댓값은?", choices: ["20", "25", "30", "40", "50"], answer: 1, explanation: "25이다." },
  { id: 49, concept: "이차함수의 최대최소", subconcept: "도형 활용", difficulty: 4, prompt: "둘레가 12인 직사각형 넓이의 최댓값은?", choices: ["6", "9", "12", "18", "36"], answer: 1, explanation: "9이다." },
  { id: 50, concept: "이차함수의 최대최소", subconcept: "미지수 결정", difficulty: 4, prompt: "$y=x^2-2ax+4a$의 최솟값이 4일 때 양수 $a$의 값은?", choices: ["1", "2", "3", "4", "5"], answer: 1, explanation: "$a=2$이다." }
];
