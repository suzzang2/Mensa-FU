import styled from 'styled-components';
import type { MenuItem } from '../types/menu';
import { useState } from 'react';

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s ease-in-out;

  /* ✨ 추가된 부분: 카드가 부모(Grid) 너비를 넘지 못하게 꽉 묶어줍니다. */
  width: 100%;
  max-width: 100%;
  min-width: 0; 
  box-sizing: border-box;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    border-color: #d8b4fe;
  }
`;

const Category = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #a855f7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Badge = styled.span`
  background: #f0fdf4;
  color: #15803d;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 99px;
  font-weight: 800;
`;

const FoodName = styled.h3`
  font-size: 1.125rem;
  color: #1f2937;
  font-weight: 700;
  line-height: 1.4;
  margin: 8px 0 16px;

  /* ✨ 추가된 부분: 글자 줄바꿈 규칙 설정 */
  word-break: keep-all;      /* 한국어는 띄어쓰기(단어) 단위로 예쁘게 줄바꿈 */
  overflow-wrap: break-word; /* 엄청 긴 독일어 단어가 박스를 뚫으려 하면 강제로 줄바꿈 */
`;

const PriceTag = styled.span`
  font-size: 1.25rem;
  font-weight: 900;
  color: #111827;
`;

const AddButton = styled.button`
  background: #111827;
  color: white;
  padding: 10px 18px;
  border-radius: 14px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #7c3aed; }
`;

  const IconGroup = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 12px;
    align-items: center;
  `;

  const BadgeIcon = styled.img`
    height: 20px; // 카드 크기에 맞춰 조절하세요
    object-fit: contain;
  `;

  const LangToggleButton = styled.button`
  //badge랑 사이즈 통일
  background: #f3f4f6;
  color: #374151;
  padding: 6px 8px;
  /* border-radius: 999px; */
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const MenuCard = ({ item, onSelect }: { item: MenuItem; onSelect: (item: MenuItem) => void }) => {
  // ✨ 원문 보기 상태 관리
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <Card>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <Category>{item.category}</Category>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {/* ✨ 언어 토글 버튼 */}
            <LangToggleButton onClick={() => setShowOriginal(!showOriginal)}>
              {showOriginal ? '번역' : '원문보기'}
            </LangToggleButton>
            {item.isVegan && <Badge>VEGAN</Badge>}
          </div>
        </div>
        
        <IconGroup>
          {item.nutritionIcon && <BadgeIcon src={`/assets/icons/${item.nutritionIcon}`} alt="Nutrition" />}
          {item.co2Icon && <BadgeIcon src={`/assets/icons/${item.co2Icon}`} alt="CO2" />}
          {item.h2oIcon && <BadgeIcon src={`/assets/icons/${item.h2oIcon}`} alt="H2O" />}
        </IconGroup>

        {/* ✨ 상태에 따라 다른 이름 보여주기 */}
        <FoodName>
          {showOriginal ? item.originalName : item.name}
        </FoodName>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PriceTag>{item.priceStudent.toFixed(2)} €</PriceTag>
        <AddButton onClick={() => onSelect(item)}>담기</AddButton>
      </div>
    </Card>
  );
};
export default MenuCard;