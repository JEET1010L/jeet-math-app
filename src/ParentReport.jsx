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

  if (!result) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>리포트 데이터가 없습니다</h2>
            <p style={{ color: COLORS.sub }}>
              관리자 페이지에서 학생 결과를 클릭해서 들어오세요.
            </p>
            <button style={styles.primaryButton} onClick={() => navigate("/admin")}>
              관리자 페이지로 돌아가기
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
      const pageHeight = 297;
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      const filename = `${result.studentName || "student"}_${result.gradeLabel || "report"}_JEET_report.pdf`;
      pdf.save(filename);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.topActions}>
          <button style={styles.secondaryButton} onClick={() => navigate("/admin")}>
            관리자 페이지로
          </button>
          <button style={styles.primaryButton} onClick={handleExportPdf}>
            {isExporting ? "PDF 생성 중..." : "PDF 저장"}
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
              학생의 현재 수준과 보완이 필요한 개념을 정리한 상담용 보고서입니다.
            </div>
          </div>

          <div style={styles.infoGrid}>
            <InfoCard label="학생명" value={result.studentName || "미입력"} />
            <InfoCard label="학년" value={result.gradeLabel || "-"} />
            <InfoCard label="점수" value={`${result.score}/${result.total}`} />
            <InfoCard label="레벨" value={result.level || "-"} />
          </div>

          <Section title="1. 종합 평가">
            <div style={styles.summaryCard}>
              <div style={styles.summaryRate}>정답률 {result.scoreRate}%</div>
              <p style={styles.summaryText}>{result.consultingComment}</p>
            </div>
          </Section>

          <Section title="2. 강점 개념">
            {result.strongConcepts?.length ? (
              <div style={styles.tagWrap}>
                {result.strongConcepts.map((concept) => (
                  <span key={concept} style={styles.strongTag}>
                    {concept}
                  </span>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>강점 개념 데이터가 아직 충분하지 않습니다.</p>
            )}
          </Section>

          <Section title="3. 보완 필요 개념">
            {result.weakConcepts?.length ? (
              <div style={{ display: "grid", gap: 12 }}>
                {result.weakConcepts.map((concept) => (
                  <div key={concept} style={styles.weakCard}>
                    <div style={styles.weakTitle}>{concept}</div>
                    <div style={styles.weakText}>
                      개념 설명 → 쉬운 적용 문제 → 반복 확인 순으로 보완하는 것이 좋습니다.
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>특별히 낮은 개념 없이 고르게 수행했습니다.</p>
            )}
          </Section>

          <Section title="4. 학부모 상담 메모">
            <div style={styles.memoCard}>
              현재 진단은 단순 점수보다 <strong>개념 이해의 균형</strong>을 확인하는 데 의미가 있습니다.
              강점 개념은 심화로 연결하고, 보완이 필요한 개념은 짧고 자주 반복하는 방식으로 학습하면
              효과가 높습니다.
            </div>
          </Section>

          <div style={styles.footer}>
            본 리포트는 JEET 수학전문학원 진단 시스템을 바탕으로 자동 생성되었습니다.
          </div>
        </div>
      </div>
    </div>
  );
}

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

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)",
    padding: "20px 12px 40px",
    fontFamily: "Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif",
    color: COLORS.text,
  },
  wrap: {
    maxWidth: 920,
    margin: "0 auto",
  },
  topActions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  reportCard: {
    position: "relative",
    overflow: "hidden",
    background: COLORS.white,
    border: `1px solid ${COLORS.line}`,
    borderRadius: 28,
    boxShadow: "0 24px 50px rgba(15,23,42,0.10)",
    padding: 28,
  },
  headerBand: {
    height: 8,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    background: COLORS.grad,
    margin: "-12px -12px 24px -12px",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 900,
    color: COLORS.primary,
    lineHeight: 1,
    letterSpacing: -1.2,
  },
  logoTag: {
    background: COLORS.grad,
    color: COLORS.white,
    padding: "8px 14px",
    borderRadius: 12,
    fontWeight: 800,
    fontSize: 20,
    lineHeight: 1,
    boxShadow: "0 10px 24px rgba(225,29,72,0.22)",
  },
  title: {
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: COLORS.sub,
    lineHeight: 1.6,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 28,
  },
  infoCard: {
    border: `1px solid ${COLORS.line}`,
    background: "#FAFAFA",
    padding: 16,
    borderRadius: 16,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.sub,
  },
  infoValue: {
    marginTop: 8,
    fontWeight: 900,
    fontSize: 18,
    color: COLORS.text,
  },
  sectionTitle: {
    margin: "0 0 12px 0",
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: -0.4,
  },
  summaryCard: {
    background: "#FFF7F9",
    border: "1px solid #FFD5DF",
    borderRadius: 18,
    padding: 18,
  },
  summaryRate: {
    fontSize: 22,
    fontWeight: 900,
    color: COLORS.primary,
    marginBottom: 10,
  },
  summaryText: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.8,
    color: COLORS.text,
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  strongTag: {
    background: COLORS.successBg,
    color: COLORS.successText,
    padding: "10px 14px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 800,
  },
  weakCard: {
    border: "1px solid #FED7AA",
    background: COLORS.warnBg,
    padding: 16,
    borderRadius: 16,
  },
  weakTitle: {
    fontWeight: 900,
    color: COLORS.warnText,
    marginBottom: 6,
    fontSize: 16,
  },
  weakText: {
    fontSize: 14,
    color: "#9A3412",
    lineHeight: 1.7,
  },
  memoCard: {
    border: `1px solid ${COLORS.line}`,
    background: COLORS.white,
    padding: 18,
    borderRadius: 18,
    lineHeight: 1.8,
    fontSize: 15,
  },
  emptyText: {
    margin: 0,
    color: COLORS.sub,
    fontSize: 15,
  },
  footer: {
    marginTop: 30,
    borderTop: `1px solid ${COLORS.line}`,
    paddingTop: 14,
    fontSize: 12,
    color: "#94A3B8",
  },
  primaryButton: {
    border: "none",
    background: COLORS.grad,
    color: COLORS.white,
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(225,29,72,0.22)",
  },
  secondaryButton: {
    border: `1px solid ${COLORS.line}`,
    background: COLORS.white,
    color: COLORS.text,
    borderRadius: 14,
    padding: "12px 18px",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
  },
};