// src/components/MenuList.tsx
import styled from 'styled-components';
import type { MenuItem } from '../types/menu';
import MenuCard from './MenuCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MenuList = ({ menuItems, onSelect }: { menuItems: MenuItem[]; loading: boolean; onSelect: (item: MenuItem) => void }) => {
  return (
    <Grid>
      {menuItems.map((item) => (
        <MenuCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </Grid>
  );
};

export default MenuList;