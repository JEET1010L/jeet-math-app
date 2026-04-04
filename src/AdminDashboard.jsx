import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedResultsFromFirebase } from "./utils/report";

const COLORS = {
  primary: "#E11D48",
  grad: "linear-gradient(135deg, #E11D48, #FB7185)",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#0F172A",
  sub: "#64748B",
  line: "#E2E8F0",
};

const ADMIN_PASSWORD = "1010";

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("jeet_admin_auth");
    if (savedAuth === "true") {
      setIsAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthed) return;

    async function load() {
      try {
        const data = await getSavedResultsFromFirebase();
        setResults(data);
      } catch (e) {
        console.error("데이터 불러오기 실패", e);
      }
    }

    load();
  }, [isAuthed]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      sessionStorage.setItem("jeet_admin_auth", "true");
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jeet_admin_auth");
    setIsAuthed(false);
    setPassword("");
    setResults([]);
  };

  if (!isAuthed) {
    return (
      <div style={styles.page}>
        <div style={styles.loginWrap}>
          <div style={styles.loginCard}>
            <div style={styles.topBand} />
            <div style={styles.brand}>JEET 관리자 잠금</div>
            <div style={styles.loginTitle}>관리자 전용 페이지</div>
            <div style={styles.loginSub}>
              상담 기록과 학생 결과 보호를 위해 비밀번호를 입력하세요.
            </div>

            <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자 비밀번호"
                style={styles.input}
              />

              {error ? <div style={styles.errorText}>{error}</div> : null}

              <button type="submit" style={styles.primaryButton}>
                관리자 입장
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: 900, margin: "0 auto", marginBottom: 24 }}>
        <div style={styles.headerCard}>
          <div>
            <div style={styles.headerTitle}>JEET 진단 관리 시스템</div>
            <div style={styles.headerSub}>
              학생 개념 진단 결과를 기반으로 상담이 가능합니다
            </div>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            로그아웃
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {results.length === 0 ? (
          <div style={styles.emptyCard}>저장된 결과가 없습니다</div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {results.map((r, idx) => (
              <div
                key={r.id || idx}
                onClick={() => navigate("/report", { state: r })}
                style={styles.resultCard}
              >
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.nameText}>{r.studentName || "이름 없음"}</div>
                    <div style={styles.gradeText}>{r.gradeLabel}</div>
                  </div>

                  <div style={styles.levelBadge}>{r.level}</div>
                </div>

                <div style={styles.scoreText}>
                  {r.score}/{r.total} ({r.scoreRate}%)
                </div>

                <div style={styles.metaText}>
                  <div>강점: {r.strongConcepts?.join(", ") || "없음"}</div>
                  <div>보완: {r.weakConcepts?.join(", ") || "없음"}</div>
                </div>

                <div style={styles.commentBox}>{r.consultingComment}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: COLORS.bg,
    padding: 20,
    fontFamily: "Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif",
  },
  loginWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginCard: {
    width: "100%",
    maxWidth: 460,
    background: COLORS.card,
    borderRadius: 24,
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    border: `1px solid ${COLORS.line}`,
    padding: 24,
    overflow: "hidden",
  },
  topBand: {
    height: 8,
    borderRadius: 999,
    background: COLORS.grad,
    marginBottom: 20,
  },
  brand: {
    fontSize: 16,
    fontWeight: 900,
    color: COLORS.primary,
    marginBottom: 8,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 900,
    color: COLORS.text,
    marginBottom: 8,
  },
  loginSub: {
    color: COLORS.sub,
    fontSize: 15,
    lineHeight: 1.6,
  },
  input: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    border: `1px solid ${COLORS.line}`,
    padding: "0 16px",
    fontSize: 16,
    boxSizing: "border-box",
    marginBottom: 14,
  },
  errorText: {
    color: "#BE123C",
    fontSize: 14,
    marginBottom: 12,
    fontWeight: 700,
  },
  primaryButton: {
    width: "100%",
    height: 54,
    border: "none",
    borderRadius: 14,
    background: COLORS.grad,
    color: "white",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(225,29,72,0.22)",
  },
  headerCard: {
    borderRadius: 24,
    padding: 20,
    background: COLORS.grad,
    color: "white",
    boxShadow: "0 15px 30px rgba(225,29,72,0.25)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 900,
  },
  headerSub: {
    marginTop: 6,
    opacity: 0.92,
  },
  logoutButton: {
    border: "none",
    background: "rgba(255,255,255,0.18)",
    color: "white",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  emptyCard: {
    padding: 40,
    textAlign: "center",
    background: "white",
    borderRadius: 20,
    border: `1px solid ${COLORS.line}`,
  },
  resultCard: {
    borderRadius: 20,
    padding: 20,
    background: COLORS.card,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    cursor: "pointer",
    border: `1px solid ${COLORS.line}`,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  gradeText: {
    color: COLORS.sub,
    marginTop: 4,
  },
  levelBadge: {
    background: COLORS.grad,
    color: "white",
    padding: "6px 12px",
    borderRadius: 10,
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  scoreText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  metaText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.sub,
    lineHeight: 1.7,
  },
  commentBox: {
    marginTop: 12,
    fontSize: 14,
    background: "#F1F5F9",
    padding: 10,
    borderRadius: 10,
    color: COLORS.text,
    lineHeight: 1.6,
  },
};