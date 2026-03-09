export interface Macros {
  cal: number;
  p: number;
  c: number;
  f: number;
}

export interface Hack {
  id: number;
  user: string;
  location: string;
  title: string;
  description: string;
  macros: Macros;
  likes: number;
  verifications: number;
  image: string;
}

export type Tab = 'feed' | 'scan' | 'stats' | 'summary';

export interface NutrientData {
  name: string;
  sku: string;
  nutrients: {
    calories: number;
    protein: number;
    total_carbohydrates: number;
    total_fat: number;
    [key: string]: number;
  };
}

export interface LoggedMeal {
  id: string;
  timestamp: number;
  title: string;
  macros: Macros;
}
