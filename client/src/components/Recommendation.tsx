import styled from 'styled-components';
import type { MenuItem } from '../types/menu';

const TrayCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 28px;
  border: 2px solid #f3e8ff;
  position: sticky;
  top: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  margin-bottom: 12px;
  color: #374151;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  margin-left: 8px;
  &:hover { color: #ef4444; }
`;

const TotalSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #f3f4f6;
`;

const PriceWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
`;

const TotalAmount = styled.span`
  font-size: 2.25rem;
  font-weight: 900;
  color: #7c3aed;
`;

const TipBox = styled.div`
  background: #f5f3ff;
  padding: 12px;
  border-radius: 12px;
  color: #6d28d9;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.5;
`;

const Recommendation = ({ selectedItems, onRemove }: { selectedItems: MenuItem[]; onRemove: (index: number) => void }) => {
  const total = selectedItems.reduce((s, i) => s + i.priceStudent, 0);

  return (
    <TrayCard>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>나의 트레이 🍱</h2>
      <div style={{ minHeight: '100px' }}>
        {selectedItems.length === 0 ? <p style={{ color: '#9ca3af', fontSize: '14px' }}>메뉴를 담아보세요!</p> : 
          selectedItems.map((item, i) => (
            <ItemRow key={i}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
              <span style={{ fontWeight: 700 }}>{item.priceStudent.toFixed(2)}€</span>
              <RemoveBtn onClick={() => onRemove(i)}>✕</RemoveBtn>
            </ItemRow>
          ))
        }
      </div>
      <TotalSection>
        <PriceWrap>
          <span style={{ color: '#6b7280', fontWeight: 600 }}>총 합계</span>
          <TotalAmount>{total.toFixed(2)} €</TotalAmount>
        </PriceWrap>
        <TipBox>
          {total === 0 ? "최고의 조합을 찾아보세요!" : total > 6 ? "💸 오늘 식사는 호화롭네요!" : "✅ 아주 훌륭한 가성비 구성입니다!"}
        </TipBox>
      </TotalSection>
    </TrayCard>
  );
};

export default Recommendation;