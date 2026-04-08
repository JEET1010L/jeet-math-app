const styles = {
  container: { padding: '20px 10px', maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC' },
  card: { background: '#ffffff', padding: '25px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' },
  logoRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '5px' },
  logoMain: { fontSize: '28px', fontWeight: '900', color: '#E11D48' },
  logoSub: { background: '#E11D48', color: '#FFF', padding: '2px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '800' },
  title: { textAlign: 'center', color: '#475569', fontSize: '22px', fontWeight: '800', marginBottom: '20px' },
  
  // 1. 이름 입력란 수정 (글자색 color 추가)
  nameInput: { 
    width: '100%', 
    padding: '16px', 
    marginBottom: '20px', 
    borderRadius: '12px', 
    border: '1px solid #E2E8F0', 
    boxSizing: 'border-box', 
    fontSize: '16px', 
    textAlign: 'center', 
    outline: 'none', 
    backgroundColor: '#FFFFFF', // 배경 흰색
    color: '#000000'           // 글자색 검정으로 강제 고정!
  },
  
  gradeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  gradeButton: { padding: '15px 12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFF', textAlign: 'left', cursor: 'pointer' },
  gradeButtonTitle: { fontSize: '15px', fontWeight: '800', color: '#1E293B', marginBottom: '2px' },
  gradeDesc: { fontSize: '11px', color: '#94A3B8' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  headerTitle: { fontWeight: '800', color: '#1E293B', fontSize: '16px' },
  badge: { background: '#E11D48', color: '#FFF', padding: '3px 10px', borderRadius: '10px', fontSize: '11px' },
  questionBox: { padding: '20px', background: '#F8FAFC', borderRadius: '16px', marginBottom: '20px' },
  questionText: { fontSize: '18px', fontWeight: '800', color: '#0F172A', lineHeight: '1.6' },
  choiceList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  
  // 2. 보기 버튼 수정 (글자색 color 추가)
  choiceBtn: { 
    textAlign: 'left', 
    padding: '15px', 
    borderRadius: '12px', 
    border: '2px solid #E2E8F0', 
    cursor: 'pointer', 
    fontSize: '16px', 
    display: 'flex', 
    alignItems: 'center', 
    fontWeight: '600',
    color: '#1E293B' // 보기 글자색을 진한 회색/검정으로 고정!
  },
  
  choiceNum: { color: '#94A3B8', marginRight: '10px', width: '15px' },
  explainBox: { padding: '15px', background: '#F1F5F9', borderRadius: '12px', marginBottom: '20px', borderLeft: '5px solid #E11D48' },
  mainBtn: { width: '100%', padding: '18px', borderRadius: '15px', border: 'none', background: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)', color: '#fff', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' }
};
