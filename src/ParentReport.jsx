import { useRef, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ALL_CONCEPT_DATA } from "./utils/report"; 

const COLORS = {
  primary: "#E11D48",
  grad: "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)",
  bg: "#F8FAFC",
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
  const isAdmin = result?.isAdmin === true;

  const professionalComment = useMemo(() => {
    if (!result) return "";
    const { studentName, scoreRate, gradeCode, strongConcepts = [], weakConcepts = [] } = result;
    const db = ALL_CONCEPT_DATA[gradeCode] || ALL_CONCEPT_DATA["S3"];
    const sText = strongConcepts.length > 0 
      ? db.STRENGTH[strongConcepts[0]] || "수학적 기본기가 탄탄하며 성실한 학습 태도를 보여줍니다."
      : "기본 개념을 차근차근 익히며 문제 해결을 위한 집중력을 발휘하고 있습니다.";
    const wText = weakConcepts.length > 0
      ? weakConcepts.slice(0, 2).map(con => db.WEAKNESS[con] || `${con} 영역의 보완 학습이 필요합니다.`).join(" 또한 ")
      : "현재 특별한 취약점 없이 고른 성취도를 보이고 있는 안정적인 상태입니다.";
    let advice = "";
    if (scoreRate >= 90) advice = " 현재의 완벽함에 안주하지 말고 고난도 심화 유형을 통해 상위 1%의 사고력을 다져야 합니다.";
    else if (scoreRate >= 70) advice = " 아는 문제를 틀리지 않는 '실수 제로' 훈련이 병행된다면 충분히 최상위권 진입이 가능합니다.";
    else advice = " 진도를 서두르기보다 약점 개념을 완벽히 내 것으로 만드는 '후퇴 없는 전진'이 필요한 시기입니다.";
    return `${studentName} 학생은 ${sText} 다만, ${wText}${advice}`;
  }, [result]);

  if (!result) return <div style={{padding: 50, textAlign: 'center'}}>리포트 데이터가 없습니다.</div>;

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, (canvas.height * 190) / canvas.width);
      pdf.save(`${result.studentName}_진단리포트.pdf`);
    } catch (err) {
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        {/* 상단 버튼 영역 */}
        <div style={styles.topActions}>
          {isAdmin && (
            <button style={styles.secondaryButton} onClick={() => navigate("/admin")}>
              관리 대시보드
            </button>
          )}
          <button style={styles.primaryButton} onClick={handleExportPdf}>
            {isExporting ? "생성 중..." : "리포트 PDF 저장"}
          </button>
        </div>

        {/* 리포트 본문 (PDF 영역) */}
        <div ref={reportRef} style={styles.reportCard}>
          <div style={styles.headerBand} />
          <div style={styles.logoWrap}>
            <div style={styles.logoText}>JEET</div>
            <div style={styles.logoTag}>MATHEMATICS</div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={styles.title}>실력 진단 분석 리포트</div>
            <div style={styles.subtitle}>Personalized Diagnostic & Strategy Report</div>
          </div>

          {/* 기본 정보 */}
          <div style={styles.infoGrid}>
            <InfoItem label="학생명" value={result.studentName} />
            <InfoItem label="진단 학년" value={result.gradeLabel} />
            <InfoItem label={isAdmin ? "진단 점수" : "진단 상태"} value={isAdmin ? `${result.score} / ${result.total}` : "분석 완료"} />
            <InfoItem label="성취도 레벨" value={`${result.level}등급`} />
          </div>

          {/* 종합 평가 */}
          <section style={{ marginBottom: 30 }}>
            <h3 style={styles.sectionTitle}>1. 종합 학습 진단</h3>
            <div style={styles.summaryCard}>
              {isAdmin && <div style={styles.summaryRate}>정답률 {result.scoreRate}%</div>}
              <p style={styles.summaryText}>{professionalComment}</p>
            </div>
          </section>

          {/* 세부 영역 분석 */}
          <section style={{ marginBottom: 30 }}>
            <h3 style={styles.sectionTitle}>2. 영역별 상세 분석</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div style={styles.conceptBox}>
                <div style={{ color: COLORS.successText, fontWeight: 900, marginBottom: 10, fontSize: 14 }}>✓ 강점 영역</div>
                <div style={styles.tagWrap}>
                  {result.strongConcepts?.length > 0 ? (
                    result.strongConcepts.map(c => <span key={c} style={styles.tag}>{c}</span>)
                  ) : <span style={styles.noData}>해당 없음</span>}
                </div>
              </div>
              <div style={styles.conceptBox}>
                <div style={{ color: COLORS.warnText, fontWeight: 900, marginBottom: 10, fontSize: 14 }}>! 보완 필요 영역</div>
                <div style={styles.tagWrap}>
                  {result.weakConcepts?.length > 0 ? (
                    result.weakConcepts.map(c => <span key={c} style={styles.tagWarn}>{c}</span>)
                  ) : <span style={styles.noData}>완벽한 성취도</span>}
                </div>
              </div>
            </div>
          </section>

          <div style={styles.footer}>본 분석 결과는 JEET 수학학원의 전문 진단 시스템에 의해 생성되었습니다.</div>
        </div>

        {/* 🚀 하단 리뷰/정보 섹션 (PDF 제외) */}
        {!isExporting && (
          <div style={styles.actionSection}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={styles.actionTitle}>"아이들의 시간이 헛되지 않도록"</h3>
              <p style={styles.actionDesc}>
                JEET는 단 한 명의 아이도 소홀히 하지 않기 위해 오늘도 연구합니다.<br/>
                더 나은 교육 서비스를 제공할 수 있도록,<br/>
                <strong>소중한 피드백(응원 리뷰)을 남겨주시면 큰 힘이 됩니다.</strong>
              </p>
            </div>

            <div style={styles.btnGroup}>
              <button 
                onClick={() => window.open(`https://m.place.naver.com/place/21370523/review/visitor`, '_blank')}
                style={styles.reviewBtn}
              >
                네이버 응원 리뷰 남기기 ✍️
              </button>
              
              <button 
                onClick={() => window.open(`https://m.place.naver.com/place/21370523/home`, '_blank')}
                style={styles.infoBtn}
              >
                JEET 학원 위치 및 정보 📍
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F1F5F9", padding: "20px 10px", fontFamily: "'Pretendard', sans-serif" },
  wrap: { maxWidth: 850, margin: "0 auto" },
  topActions: { display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 16 },
  reportCard: { background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 28, padding: "40px 35px", boxShadow: "0 15px 35px rgba(0,0,0,0.08)", position: 'relative', overflow: 'hidden' },
  headerBand: { height: 10, background: COLORS.grad, position: 'absolute', top: 0, left: 0, right: 0 },
  logoWrap: { display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 15, marginTop: 10 },
  logoText: { fontSize: 32, fontWeight: 900, color: COLORS.primary, letterSpacing: "-1px" },
  logoTag: { background: "#0F172A", color: "#FFF", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 },
  title: { fontSize: 28, fontWeight: 900, color: "#1E293B", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 15, color: COLORS.sub, marginTop: 6, fontWeight: 500 },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 35, marginTop: 20 },
  infoItem: { background: "#F8FAFC", padding: "18px 10px", borderRadius: 20, textAlign: 'center', border: "1px solid #F1F5F9" },
  infoLabel: { fontSize: 12, color: COLORS.sub, fontWeight: 600, marginBottom: 6 },
  infoValue: { fontSize: 17, fontWeight: 800, color: "#0F172A" },
  sectionTitle: { fontSize: 19, fontWeight: 900, marginBottom: 15, color: "#1E293B", display: 'flex', alignItems: 'center', gap: 10 },
  summaryCard: { background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 24, padding: "25px 28px", position: 'relative' },
  summaryRate: { fontSize: 22, fontWeight: 900, color: COLORS.primary, marginBottom: 12 },
  summaryText: { margin: 0, fontSize: 16, lineHeight: 1.8, color: "#334155", wordBreak: 'keep-all' },
  conceptBox: { background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "20px", borderRadius: 24 },
  tagWrap: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: { background: COLORS.successBg, color: COLORS.successText, padding: '6px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: "1px solid #D1FAE5" },
  tagWarn: { background: COLORS.warnBg, color: COLORS.warnText, padding: '6px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: "1px solid #FFEDD5" },
  noData: { fontSize: 13, color: "#94A3B8", fontStyle: 'italic' },
  footer: { marginTop: 50, textAlign: 'center', fontSize: 13, color: "#94A3B8", borderTop: "1px solid #F1F5F9", paddingTop: 20 },
  primaryButton: { border: "none", background: COLORS.grad, color: "#FFF", borderRadius: 12, padding: "12px 24px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(225,29,72,0.3)" },
  secondaryButton: { border: "1px solid #E2E8F0", background: "#FFF", borderRadius: 12, padding: "12px 24px", fontWeight: 800, cursor: "pointer", color: "#475569" },
  
  // 🚀 추가된 액션 스타일
  actionSection: { marginTop: '30px', padding: '30px 20px', backgroundColor: '#FFFFFF', borderRadius: '28px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  actionTitle: { fontSize: '19px', fontWeight: '900', color: '#1E293B', marginBottom: '10px' },
  actionDesc: { fontSize: '14px', color: '#64748B', lineHeight: '1.6', wordBreak: 'keep-all' },
  btnGroup: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '15px auto 0' },
  reviewBtn: { backgroundColor: '#03C75A', color: '#FFFFFF', padding: '16px', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(3,199,90,0.2)' },
  infoBtn: { backgroundColor: '#F8FAFC', color: '#475569', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '16px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }
};
