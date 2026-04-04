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
};

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSavedResultsFromFirebase();
        setResults(data);
      } catch (e) {
        console.error("데이터 불러오기 실패", e);
      }
    }
    load();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, padding: 20 }}>
      
      {/* 헤더 */}
      <div style={{ maxWidth: 900, margin: "0 auto", marginBottom: 24 }}>
        <div
          style={{
            borderRadius: 24,
            padding: 20,
            background: COLORS.grad,
            color: "white",
            boxShadow: "0 15px 30px rgba(225,29,72,0.25)",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: "900" }}>
            JEET 진단 관리 시스템
          </div>
          <div style={{ marginTop: 6, opacity: 0.9 }}>
            학생 개념 진단 결과를 기반으로 상담이 가능합니다
          </div>
        </div>
      </div>

      {/* 리스트 */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {results.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              background: "white",
              borderRadius: 20,
            }}
          >
            저장된 결과가 없습니다
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {results.map((r, idx) => (
              <div
                key={r.id || idx}
                onClick={() => navigate("/report", { state: r })}
                style={{
                  borderRadius: 20,
                  padding: 20,
                  background: COLORS.card,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
              >
                {/* 상단 */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: "bold" }}>
                      {r.studentName || "이름 없음"}
                    </div>
                    <div style={{ color: COLORS.sub }}>
                      {r.gradeLabel}
                    </div>
                  </div>

                  <div
                    style={{
                      background: COLORS.grad,
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {r.level}
                  </div>
                </div>

                {/* 점수 */}
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: COLORS.text,
                  }}
                >
                  {r.score}/{r.total} ({r.scoreRate}%)
                </div>

                {/* 개념 */}
                <div style={{ marginTop: 10, fontSize: 14, color: COLORS.sub }}>
                  <div>
                    강점: {r.strongConcepts?.join(", ") || "없음"}
                  </div>
                  <div>
                    보완: {r.weakConcepts?.join(", ") || "없음"}
                  </div>
                </div>

                {/* 코멘트 */}
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    background: "#F1F5F9",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  {r.consultingComment}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}