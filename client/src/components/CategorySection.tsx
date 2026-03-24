import { useState } from 'react';
import styled from 'styled-components';
import MenuList from './MenuList';
import type { MenuItem } from '../types/menu';

interface CategorySectionProps {
  title: string;
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
}

const CategorySection = ({ title, items, onSelect }: CategorySectionProps) => {
  // ✨ 해당 카테고리가 열려있는지 상태 관리 (기본값: true - 열림)
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SectionWrapper>
      <CategoryHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <div className="title-area">
          <span className="arrow">{isOpen ? '▼' : '▶'}</span>
          {title} 
          <span className="count">{items.length}</span>
        </div>
      </CategoryHeader>
      
      {/* ✨ isOpen이 true일 때만 메뉴 리스트를 렌더링 */}
      {isOpen && (
        <ListWrapper>
          <MenuList menuItems={items} loading={false} onSelect={onSelect} />
        </ListWrapper>
      )}
    </SectionWrapper>
  );
};

// --- Styled Components ---

const SectionWrapper = styled.div`
  margin-bottom: 24px;
`;

const CategoryHeader = styled.div<{ $isOpen: boolean }>`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${props => props.$isOpen ? '#7c3aed' : '#6b7280'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${props => props.$isOpen ? '16px' : '0'};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 0;
  transition: all 0.2s ease;

  &:hover {
    color: #9333ea;
  }

  .title-area {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }
  }

  .arrow {
    font-size: 0.8rem;
    width: 16px;
    color: #a855f7;
  }

  .count {
    background: #f3f4f6;
    color: #9ca3af;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 999px;
    font-weight: 600;
  }
`;

const ListWrapper = styled.div`
  /* 접히고 펴질 때 부드러운 효과를 위해 추가할 수 있습니다 */
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default CategorySection;