import styled from 'styled-components';
import type { MenuItem } from '../types/menu';

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

const MenuCard = ({ item, onSelect }: { item: MenuItem; onSelect: (item: MenuItem) => void }) => (
  <Card>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Category>{item.category}</Category>
        {item.isVegan && <Badge>VEGAN</Badge>}
      </div>
    <IconGroup>
      {item.nutritionIcon && (
        <BadgeIcon src={`/assets/icons/${item.nutritionIcon}`} alt="Nutrition" /> 
      )}
      {item.co2Icon && (
        <BadgeIcon src={`/assets/icons/${item.co2Icon}`} alt="CO2" />
      )}
      {item.h2oIcon && (
        <BadgeIcon src={`/assets/icons/${item.h2oIcon}`} alt="H2O" />
      )}
    </IconGroup>
      <FoodName>{item.name}</FoodName>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <PriceTag>{item.priceStudent.toFixed(2)} €</PriceTag>
      <AddButton onClick={() => onSelect(item)}>담기</AddButton>
    </div>
  </Card>
);

export default MenuCard;