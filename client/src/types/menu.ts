export interface MenuItem {
  id: string;
  name: string;
  originalName: string;  // ✨ 독일어 원문
  category: string; // ex: Hauptgerichte, Beilagen
  priceStudent: number;
  isVegan: boolean;
  isVegetarian?: boolean;

  // ✨ 새로 추가된 아이콘 파일명 정보들
  nutritionIcon?: string | null; // 예: "ampel_gruen_70x65.png"
  co2Icon?: string | null;       // 예: "CO2_bewertung_A.svg"
  h2oIcon?: string | null;       // 예: "H2O_bewertung_A.svg"
}

export interface Recommendation {
  items: MenuItem[];
  totalPrice: number;
}