
export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // in cm
  currentWeight: number; // in kg
  targetWeight: number; // in kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  dailyCalories: number;
  dailyMacros: {
    protein: number; // in grams
    carbs: number; // in grams
    fats: number; // in grams
  };
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
  meal: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  date: string; // YYYY-MM-DD format
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string; // YYYY-MM-DD format
}

export interface DailyProgress {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  foods: FoodEntry[];
}
