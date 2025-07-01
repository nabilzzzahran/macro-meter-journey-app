
import React, { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react';
import { User, FoodEntry, WeightEntry, DailyProgress } from '../types/fitness';
import MacroChart from './MacroChart';
import WeightChart from './WeightChart';
import FoodLogger from './FoodLogger';
import WeightLogger from './WeightLogger';

interface DashboardProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUserUpdate }) => {
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    date: new Date().toISOString().split('T')[0],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    foods: []
  });
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [showFoodLogger, setShowFoodLogger] = useState(false);
  const [showWeightLogger, setShowWeightLogger] = useState(false);

  useEffect(() => {
    // Load daily progress from localStorage
    const savedProgress = localStorage.getItem(`dailyProgress_${user.id}_${dailyProgress.date}`);
    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress));
    }

    // Load weight entries from localStorage
    const savedWeights = localStorage.getItem(`weightEntries_${user.id}`);
    if (savedWeights) {
      setWeightEntries(JSON.parse(savedWeights));
    }
  }, [user.id, dailyProgress.date]);

  useEffect(() => {
    // Save daily progress to localStorage
    localStorage.setItem(`dailyProgress_${user.id}_${dailyProgress.date}`, JSON.stringify(dailyProgress));
  }, [dailyProgress, user.id]);

  useEffect(() => {
    // Save weight entries to localStorage
    localStorage.setItem(`weightEntries_${user.id}`, JSON.stringify(weightEntries));
  }, [weightEntries, user.id]);

  const addFoodEntry = (food: Omit<FoodEntry, 'id' | 'date'>) => {
    const newFood: FoodEntry = {
      ...food,
      id: Date.now().toString(),
      date: dailyProgress.date
    };

    setDailyProgress(prev => ({
      ...prev,
      foods: [...prev.foods, newFood],
      totalCalories: prev.totalCalories + newFood.calories,
      totalProtein: prev.totalProtein + newFood.protein,
      totalCarbs: prev.totalCarbs + newFood.carbs,
      totalFats: prev.totalFats + newFood.fats
    }));
    setShowFoodLogger(false);
  };

  const addWeightEntry = (weight: number) => {
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight,
      date: new Date().toISOString().split('T')[0]
    };

    setWeightEntries(prev => [newEntry, ...prev].slice(0, 30)); // Keep last 30 entries
    
    // Update user's current weight
    const updatedUser = { ...user, currentWeight: weight };
    onUserUpdate(updatedUser);
    setShowWeightLogger(false);
  };

  const caloriesRemaining = user.dailyCalories - dailyProgress.totalCalories;
  const proteinProgress = (dailyProgress.totalProtein / user.dailyMacros.protein) * 100;
  const carbsProgress = (dailyProgress.totalCarbs / user.dailyMacros.carbs) * 100;
  const fatsProgress = (dailyProgress.totalFats / user.dailyMacros.fats) * 100;

  const mealSections = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Calories Remaining</p>
              <p className="text-2xl font-bold text-emerald-600">{caloriesRemaining}</p>
            </div>
            <Target className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Weight</p>
              <p className="text-2xl font-bold text-blue-600">{user.currentWeight} kg</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Target Weight</p>
              <p className="text-2xl font-bold text-purple-600">{user.targetWeight} kg</p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">To Goal</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.abs(user.targetWeight - user.currentWeight).toFixed(1)} kg
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Macro Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Macros</h3>
          <MacroChart 
            current={{
              protein: dailyProgress.totalProtein,
              carbs: dailyProgress.totalCarbs,
              fats: dailyProgress.totalFats
            }}
            target={user.dailyMacros}
          />
        </div>

        {/* Weight Progress Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weight Progress</h3>
            <button
              onClick={() => setShowWeightLogger(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Log Weight
            </button>
          </div>
          <WeightChart entries={weightEntries} targetWeight={user.targetWeight} />
        </div>
      </div>

      {/* Macro Progress Bars */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Macro Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Protein</span>
              <span>{dailyProgress.totalProtein}g / {user.dailyMacros.protein}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Carbohydrates</span>
              <span>{dailyProgress.totalCarbs}g / {user.dailyMacros.carbs}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(carbsProgress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Fats</span>
              <span>{dailyProgress.totalFats}g / {user.dailyMacros.fats}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(fatsProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Log */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Today's Food Log</h3>
          <button
            onClick={() => setShowFoodLogger(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Food
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mealSections.map(meal => {
            const mealFoods = dailyProgress.foods.filter(food => food.meal === meal);
            const mealCalories = mealFoods.reduce((sum, food) => sum + food.calories, 0);

            return (
              <div key={meal} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 capitalize mb-2">{meal}</h4>
                <p className="text-2xl font-bold text-emerald-600 mb-3">{mealCalories} cal</p>
                
                <div className="space-y-2">
                  {mealFoods.map(food => (
                    <div key={food.id} className="text-sm">
                      <div className="font-medium text-gray-800">{food.name}</div>
                      <div className="text-gray-600">
                        {food.quantity} serving • {food.calories} cal
                      </div>
                    </div>
                  ))}
                </div>
                
                {mealFoods.length === 0 && (
                  <p className="text-gray-500 text-sm">No foods logged</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showFoodLogger && (
        <FoodLogger
          onAddFood={addFoodEntry}
          onClose={() => setShowFoodLogger(false)}
        />
      )}

      {showWeightLogger && (
        <WeightLogger
          currentWeight={user.currentWeight}
          onAddWeight={addWeightEntry}
          onClose={() => setShowWeightLogger(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
