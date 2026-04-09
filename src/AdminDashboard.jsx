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

// 🔒 관리자 비밀번호 (필요시 수정하세요)
const ADMIN_PASSWORD = "1010";

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. 로그인 상태 유지 확인
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("jeet_admin_auth");
    if (savedAuth === "true") {
      setIsAuthed(true);
    }
  }, []);

  // 2. 인증 성공 시 데이터 불러오기
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

  // --- 로그인 화면 ---
  if (!isAuthed) {
    return (
      <div style={styles.page}>
        <div style={styles.loginWrap}>
          <div style={styles.loginCard}>
            <div style={styles.topBand} />
            <div style={styles.brand}>JEET 관리자 모드</div>
            <div style={styles.loginTitle}>Access Denied</div>
            <div style={styles.loginSub}>상담 기록 보호를 위해 비밀번호를 입력하세요.</div>

            <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                style={styles.input}
              />
              {error && <div style={styles.errorText}>{error}</div>}
              <button type="submit" style={styles.primaryButton}>관리자 로그인</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- 메인 대시보드 화면 ---
  return (
    <div style={styles.page}>
      <div style={{ maxWidth: 900, margin: "0 auto", marginBottom: 24 }}>
        <div style={styles.headerCard}>
          <div>
            <div style={styles.headerTitle}>JEET 진단 관리 시스템</div>
            <div style={styles.headerSub}>학생별 상세 분석 리포트를 확인하실 수 있습니다.</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {results.length === 0 ? (
          <div style={styles.emptyCard}>저장된 진단 결과가 아직 없습니다.</div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {results.map((r, idx) => (
              <div
                key={r.id || idx}
                // ⭐ 핵심: 클릭 시 isAdmin: true를 넘겨서 리포트가 관리자용으로 뜨게 함
                onClick={() => navigate("/report", { state: { ...r, isAdmin: true } })}
                style={styles.resultCard}
              >
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.nameText}>{r.studentName || "익명 학생"}</div>
                    <div style={styles.gradeText}>{r.gradeLabel}</div>
                  </div>
                  <div style={styles.levelBadge}>{r.level} 레벨</div>
                </div>

                <div style={styles.scoreRow}>
                  <span style={styles.scoreText}>{r.scoreRate}%</span>
                  <span style={styles.scoreDetail}>({r.score} / {r.total} 문항)</span>
                </div>

                <div style={styles.commentPreview}>
                  {r.consultingComment?.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: COLORS.bg, padding: "40px 20px", fontFamily: "Pretendard, sans-serif" },
  loginWrap: { display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" },
  loginCard: { width: "100%", maxWidth: 400, background: "#FFF", borderRadius: 24, padding: 32, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", border: `1px solid ${COLORS.line}` },
  topBand: { height: 6, background: COLORS.grad, borderRadius: 99, marginBottom: 24 },
  brand: { fontSize: 14, fontWeight: 900, color: COLORS.primary, marginBottom: 8 },
  loginTitle: { fontSize: 26, fontWeight: 900, color: "#0F172A" },
  loginSub: { fontSize: 14, color: COLORS.sub, marginTop: 8 },
  input: { width: "100%", height: 50, borderRadius: 12, border: `1px solid ${COLORS.line}`, padding: "0 16px", fontSize: 16, marginTop: 20, boxSizing: "border-box" },
  errorText: { color: COLORS.primary, fontSize: 13, marginTop: 10, fontWeight: 600 },
  primaryButton: { width: "100%", height: 50, background: COLORS.grad, color: "#FFF", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, marginTop: 16, cursor: "pointer" },
  headerCard: { background: COLORS.grad, padding: "24px 32px", borderRadius: 24, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFF", boxShadow: "0 10px 20px rgba(225,29,72,0.2)" },
  headerTitle: { fontSize: 24, fontWeight: 900 },
  headerSub: { fontSize: 14, opacity: 0.9, marginTop: 4 },
  logoutButton: { background: "rgba(255,255,255,0.2)", border: "none", color: "#FFF", padding: "8px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer" },
  resultCard: { background: "#FFF", padding: 24, borderRadius: 20, border: `1px solid ${COLORS.line}`, cursor: "pointer", transition: "transform 0.2s" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  nameText: { fontSize: 18, fontWeight: 800, color: "#1E293B" },
  gradeText: { fontSize: 14, color: COLORS.sub, marginTop: 2 },
  levelBadge: { background: "#F1F5F9", color: COLORS.primary, padding: "4px 12px", borderRadius: 8, fontSize: 13, fontWeight: 800 },
  scoreRow: { marginTop: 16, display: "flex", alignItems: "baseline", gap: 8 },
  scoreText: { fontSize: 28, fontWeight: 900, color: COLORS.primary },
  scoreDetail: { fontSize: 14, color: COLORS.sub },
  commentPreview: { marginTop: 12, fontSize: 14, color: "#475569", lineHeight: 1.5, background: "#F8FAFC", padding: 12, borderRadius: 12 },
  emptyCard: { textAlign: "center", padding: 60, color: COLORS.sub, background: "#FFF", borderRadius: 24, border: `2px dashed ${COLORS.line}` }
};
