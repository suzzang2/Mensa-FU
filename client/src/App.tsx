import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import Header from './components/Header';
import MenuList from './components/MenuList';
import Recommendation from './components/Recommendation';
import type { MenuItem } from './types/menu';

// 1. 실제 사이트 구성을 본뜬 더미 데이터
const DUMMY_MENU: MenuItem[] = [
  { id: '1', name: 'Gemüse-Linsen-Curry mit Kokosmilch (Vegan)', category: 'Hauptgerichte', priceStudent: 1.45, isVegan: true, isVegetarian: true },
  { id: '2', name: 'Hähnchenbrustfilet in Kräuterrahm', category: 'Hauptgerichte', priceStudent: 3.90, isVegan: false, isVegetarian: false },
  { id: '3', name: 'Gnocchi-Pfanne mit Kirschtomaten', category: 'Aktion', priceStudent: 2.60, isVegan: false, isVegetarian: false },
  { id: '4', name: 'Beilagensalat (klein)', category: 'Beilagen', priceStudent: 0.85, isVegan: true, isVegetarian: true },
  { id: '5', name: 'Basmati Reis', category: 'Beilagen', priceStudent: 0.30, isVegan: true, isVegetarian: true },
  { id: '6', name: 'Frisches Obst', category: 'Dessert', priceStudent: 0.45, isVegan: true, isVegetarian: true },
];

const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 16px 80px;
`;

const MainGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

function App() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // 2. API 호출 대신 더미 데이터를 0.5초 뒤에 불러오는 척 설정
  //   const loadDummyData = () => {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setMenuData(DUMMY_MENU);
  //       setLoading(false);
  //     }, 500); // 로딩 애니메이션 확인을 위한 딜레이
  //   };

  //   loadDummyData();
  // }, []);
  useEffect(() => {
    // App.tsx 내부 fetchFromMyServer 함수
const fetchFromMyServer = async () => {
  setLoading(true);
  try {
    const response = await fetch('http://localhost:4000/api/menu');
    const data = await response.json();
    
    // 데이터가 잘 왔는지 콘솔에 찍어서 형식을 확인해보세요.
    console.log("백엔드에서 받은 데이터:", data);
    
    // 데이터가 배열인지 확인하고 상태 업데이트
    if (Array.isArray(data)) {
      setMenuData(data);
    } else {
      setMenuData([]);
    }
  } catch (e) {
    console.error("백엔드 연결 실패:", e);
    setMenuData([]);
  } finally {
    setLoading(false);
  }
};
fetchFromMyServer();
}, []);

  // 3. 메뉴 선택 핸들러 (중복 선택 가능)
  const handleSelect = (item: MenuItem) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  // 4. 메뉴 삭제 핸들러 (인덱스 기준)
  const handleRemove = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header />
        <MainGrid>
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>오늘의 메뉴</h2>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>* 더미 데이터 모드</span>
            </div>
            <MenuList 
              menuItems={menuData} 
              loading={loading} 
              onSelect={handleSelect} 
            />
          </section>
          <aside>
            <Recommendation 
              selectedItems={selectedItems} 
              onRemove={handleRemove} 
            />
          </aside>
        </MainGrid>
      </Container>
    </>
  );
}

export default App;