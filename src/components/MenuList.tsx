import styled from 'styled-components';
import type { MenuItem } from '../types/menu';
import MenuCard from './MenuCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
`;

const MenuList = ({ menuItems, loading, onSelect }: { menuItems: MenuItem[]; loading: boolean; onSelect: (item: MenuItem) => void }) => {
  if (loading) return <StatusMessage>메뉴를 불러오는 중... 🍛</StatusMessage>;
  if (menuItems.length === 0) return <StatusMessage>오늘은 메뉴가 없어요. 😴</StatusMessage>;

  return (
    <Grid>
      {menuItems.map((item) => (
        <MenuCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </Grid>
  );
};

export default MenuList;