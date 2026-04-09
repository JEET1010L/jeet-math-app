import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TEXT } from "./constants/text";

const COLORS = {
  primary: "#E11D48",
  primarySoft: "#FB7185",
  grad: "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  text: "#0F172A",
  sub: "#64748B",
  line: "#E2E8F0",
  successBg: "#ECFDF5",
  successText: "#047857",
  warnBg: "#FFF7ED",
  warnText: "#C2410C",
};

export default function ParentReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const result = location.state;

  // ⭐ 관리자 여부 확인 (AdminDashboard에서 보낸 isAdmin: true 값 체크)
  const isAdmin = result?.isAdmin === true;

  if (!result) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>리포트 데이터가 없습니다</h2>
            <p style={{ color: COLORS.sub }}>
              정상적인 경로로 접근해주세요.
            </p>
            <button style={styles.primaryButton} onClick={() => navigate("/")}>
              메인으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      pdf.save(`${result.studentName}_${result.gradeLabel}_리포트.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.topActions}>
          {/* ⭐ 관리자만 목록으로 돌아가기 버튼 보임 */}
          {isAdmin && (
            <button style={styles.secondaryButton} onClick={() => navigate("/admin")}>
              관리 대시보드로
            </button>
          )}
          <button style={styles.primaryButton} onClick={handleExportPdf}>
            {isExporting ? "PDF 생성 중..." : "리포트 PDF 저장"}
          </button>
        </div>

        <div ref={reportRef} style={styles.reportCard}>
          <div style={styles.headerBand} />

          <div style={styles.logoWrap}>
            <div style={styles.logoText}>{TEXT.BRAND_NAME}</div>
            <div style={styles.logoTag}>{TEXT.BRAND_SUBJECT}</div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={styles.title}>학년별 필수개념 진단 리포트</div>
            <div style={styles.subtitle}>
              학생의 현재 수준과 보완이 필요한 개념을 정리한 보고서입니다.
            </div>
          </div>

          <div style={styles.infoGrid}>
            <InfoCard label="학생명" value={result.studentName || "미입력"} />
            <InfoCard label="진단 과정" value={result.gradeLabel || "-"} />
            {/* ⭐ 관리자는 정확한 점수, 부모님은 분석 완료 문구 */}
            <InfoCard 
              label={isAdmin ? "원점수" : "진단 결과"} 
              value={isAdmin ? `${result.score}/${result.total}` : "정밀 분석 완료"} 
            />
            <InfoCard label="성취 레벨" value={result.level || "-"} />
          </div>

          <Section title="1. 종합 평가">
            <div style={styles.summaryCard}>
              {/* ⭐ 관리자 모드에서만 정답률 수치 크게 표시 */}
              {isAdmin && <div style={styles.summaryRate}>정답률 {result.scoreRate}%</div>}
              <p style={styles.summaryText}>{result.consultingComment}</p>
            </div>
          </Section>

          <Section title="2. 강점 개념">
            {result.strongConcepts?.length ? (
              <div style={styles.tagWrap}>
                {result.strongConcepts.map((concept) => (
                  <span key={concept} style={styles.strongTag}>{concept}</span>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>기본 개념 학습을 충실히 진행 중입니다.</p>
            )}
          </Section>

          <Section title="3. 보완 필요 개념">
            {result.weakConcepts?.length ? (
              <div style={{ display: "grid", gap: 12 }}>
                {result.weakConcepts.map((concept) => (
                  <div key={concept} style={styles.weakCard}>
                    <div style={styles.weakTitle}>{concept}</div>
                    <div style={styles.weakText}>
                      해당 단원의 기본 원리 복습 후 유형 문제풀이가 권장됩니다.
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>모든 영역에서 고른 성취도를 보이고 있습니다.</p>
            )}
          </Section>

          <Section title="4. 향후 학습 안내">
            <div style={styles.memoCard}>
              진단 결과 {result.level} 수준의 성취를 보이고 있습니다. 
              {isAdmin ? (
                // 관리자용 추가 메모
                <span style={{color: COLORS.primary, fontWeight: 'bold'}}> [관리자 확인: 위 학생은 점수 대비 특정 오답 패턴을 분석하여 상담 바랍니다.]</span>
              ) : (
                // 부모님용 격려 메모
                " 강점은 더욱 살리고 부족한 개념은 맞춤형 클리닉을 통해 보완하여 완벽한 실력을 만들겠습니다."
              )}
            </div>
          </Section>

          <div style={styles.footer}>
            본 리포트는 {TEXT.BRAND_NAME} 진단 시스템에 의해 발행되었습니다.
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 하위 컴포넌트들 ---
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div style={styles.infoCard}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

// --- 스타일 (기존 유지) ---
const styles = {
  page: { minHeight: "100vh", background: "#F8FAFC", padding: "20px 12px 40px", fontFamily: "Pretendard, sans-serif" },
  wrap: { maxWidth: 920, margin: "0 auto" },
  topActions: { display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 16 },
  reportCard: { position: "relative", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 28, padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  headerBand: { height: 8, background: COLORS.grad, borderRadius: '999px 999px 0 0', margin: "-12px -12px 24px -12px" },
  logoWrap: { display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 18 },
  logoText: { fontSize: 32, fontWeight: 900, color: COLORS.primary },
  logoTag: { background: COLORS.grad, color: "#FFF", padding: "4px 10px", borderRadius: 8, fontWeight: 800, fontSize: 16 },
  title: { fontSize: 30, fontWeight: 900 },
  subtitle: { marginTop: 8, fontSize: 14, color: COLORS.sub },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 },
  infoCard: { border: "1px solid #E2E8F0", background: "#FAFAFA", padding: 14, borderRadius: 16, textAlign: 'center' },
  infoLabel: { fontSize: 12, color: COLORS.sub },
  infoValue: { marginTop: 6, fontWeight: 800, fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 900, marginBottom: 12, borderLeft: `4px solid ${COLORS.primary}`, paddingLeft: 10 },
  summaryCard: { background: "#FFF7F9", border: "1px solid #FFD5DF", borderRadius: 18, padding: 18 },
  summaryRate: { fontSize: 20, fontWeight: 900, color: COLORS.primary, marginBottom: 8 },
  summaryText: { margin: 0, fontSize: 15, lineHeight: 1.7 },
  tagWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  strongTag: { background: COLORS.successBg, color: COLORS.successText, padding: "8px 12px", borderRadius: 999, fontSize: 13, fontWeight: 800 },
  weakCard: { border: "1px solid #FED7AA", background: COLORS.warnBg, padding: 14, borderRadius: 16 },
  weakTitle: { fontWeight: 800, color: COLORS.warnText, marginBottom: 4 },
  weakText: { fontSize: 13, color: "#9A3412" },
  memoCard: { border: "1px solid #E2E8F0", padding: 16, borderRadius: 16, fontSize: 14, lineHeight: 1.7 },
  emptyText: { color: COLORS.sub, fontSize: 14 },
  footer: { marginTop: 30, textAlign: 'center', fontSize: 12, color: "#94A3B8", borderTop: "1px solid #E2E8F0", paddingTop: 15 },
  primaryButton: { border: "none", background: COLORS.grad, color: "#FFF", borderRadius: 12, padding: "10px 16px", fontWeight: 800, cursor: "pointer" },
  secondaryButton: { border: "1px solid #E2E8F0", background: "#FFF", borderRadius: 12, padding: "10px 16px", fontWeight: 800, cursor: "pointer" },
  card: { background: "#FFF", padding: 30, borderRadius: 20, textAlign: 'center' }
};
