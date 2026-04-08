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
  // ⭐ [추가] 관리자 페이지에서 넘어왔는지 확인 (isAdmin: true 여부)
  const isAdmin = result?.isAdmin === true;

  if (!result) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>리포트 데이터가 없습니다</h2>
            <p style={{ color: COLORS.sub }}>메인 화면이나 관리자 페이지에서 접근해주세요.</p>
            <button style={styles.primaryButton} onClick={() => navigate("/")}>홈으로 가기</button>
          </div>
        </div>
      </div>
    );
  }

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      pdf.save(`${result.studentName}_진단리포트.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.topActions}>
          {/* 관리자일 때만 관리자 페이지로 돌아가기 버튼 노출 */}
          {isAdmin && (
            <button style={styles.secondaryButton} onClick={() => navigate("/admin")}>
              관리자 목록
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
            {/* ⭐ [수정] 관리자에게만 점수(18/20) 노출, 부모님께는 레벨만 노출 */}
            {isAdmin ? (
              <InfoCard label="원점수" value={`${result.score}/${result.total} (${result.scoreRate}%)`} />
            ) : (
              <InfoCard label="진단 결과" value="분석 완료" />
            )}
            <InfoCard label="성취도 레벨" value={result.level || "-"} />
          </div>

          <Section title="1. 종합 평가">
            <div style={styles.summaryCard}>
              {/* ⭐ [수정] 관리자일 때만 상단에 정답률 크게 표시 */}
              {isAdmin && <div style={styles.summaryRate}>정답률 {result.scoreRate}%</div>}
              <p style={styles.summaryText}>
                {/* 관리자가 아닐 땐 점수 언급이 없는 부모님용 멘트로 필터링하거나 그대로 노출 */}
                {result.consultingComment}
              </p>
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
              <p style={styles.emptyText}>기본 개념을 차근차근 다져나가고 있습니다.</p>
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
              <p style={styles.emptyText}>전체적으로 고른 이해도를 보이고 있습니다.</p>
            )}
          </Section>

          {/* ⭐ [수정] 학부모 상담 메모 섹션 내용 보강 */}
          <Section title="4. 학습 안내">
            <div style={styles.memoCard}>
              현재 진단은 단순 점수보다 <strong>개념 이해의 균형</strong>을 확인하는 데 의미가 있습니다.
              부족한 부분은 {TEXT.BRAND_NAME}의 맞춤형 클리닉을 통해 완벽히 보완 가능합니다.
            </div>
          </Section>

          <div style={styles.footer}>
            본 리포트는 {TEXT.BRAND_NAME} 수학전문학원 진단 시스템을 통해 발행되었습니다.
          </div>
        </div>
      </div>
    </div>
  );
}

// ... Section, InfoCard 함수 및 styles 객체는 기존과 동일 ...
