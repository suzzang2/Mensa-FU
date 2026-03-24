export interface MenuItem {
  id: string;
  name: string;
  category: string; // ex: Hauptgerichte, Beilagen
  priceStudent: number;
  isVegan: boolean;
  isVegetarian: boolean;
}

export interface Recommendation {
  items: MenuItem[];
  totalPrice: number;
}