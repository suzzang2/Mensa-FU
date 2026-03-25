import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import Header from './components/Header';
import Recommendation from './components/Recommendation';
import CategorySection from './components/CategorySection'; // ✨ 아코디언 로직이 담긴 컴포넌트
import type { MenuItem } from './types/menu';

const API_URL = import.meta.env.PROD 
  ? 'https://mensa-fu.onrender.com/api/menu' // 배포 환경 (Render 주소)
  : 'http://localhost:4000/api/menu';      // 로컬 개발 환경

const CATEGORY_TRANSLATIONS: { [key: string]: string } = {
  'Vorspeisen': '에피타이저',
  'Salate': '샐러드',
  'Suppen': '스프',
  'Aktionen': '스페셜 특선',
  'Essen': '메인',
  'Beilagen': '사이드',
  'Desserts': '디저트'
};

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

const Sidebar = styled.aside`
  min-width: 0; /* ✨ Grid 자식이 부모를 뚫고 나가는 것을 막는 마법의 속성 */
`;

function App() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 카테고리 순서 정의
  const categories = ['Vorspeisen', 'Salate', 'Suppen', 'Aktionen', 'Essen', 'Beilagen', 'Desserts'];

  useEffect(() => {
    const fetchFromMyServer = async () => {
      setLoading(true);
      try {
      // ✨ API 호출 시 날짜 쿼리 전달
      const response = await fetch(`${API_URL}?date=${selectedDate}`);
      const data = await response.json();
        if (Array.isArray(data)) {
          setMenuData(data);
        }
      } catch (e) {
        console.error("백엔드 연결 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFromMyServer();
  }, [selectedDate]);

  const handleSelect = (item: MenuItem) => {
    setSelectedItems((prev) => [...prev, item]);
  };

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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '32px' }}>
              오늘의 메뉴
            </h2>
            
            {loading ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                메뉴를 불러오는 중... 🍛
              </p>
            ) : (
              // ✨ 핵심 수정 부분: CategorySection을 단일 태그로 사용
              categories.map((category) => {
                const filteredItems = menuData.filter((item) => item.category === category);
                
                if (filteredItems.length === 0) return null;

                return (
                  <CategorySection 
                    key={category} 
                    title={CATEGORY_TRANSLATIONS[category] || category} // ✨ 번역된 이름 전달
                    items={filteredItems} 
                    onSelect={handleSelect} 
                  />
                );
              })
            )}
          </section>
          <Sidebar>
            <Recommendation 
              selectedItems={selectedItems} 
              onRemove={handleRemove} 
            />
          </Sidebar>
        </MainGrid>
      </Container>
    </>
  );
}

export default App;