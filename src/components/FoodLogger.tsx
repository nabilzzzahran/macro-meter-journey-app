
import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { FoodEntry } from '../types/fitness';

interface FoodLoggerProps {
  onAddFood: (food: Omit<FoodEntry, 'id' | 'date'>) => void;
  onClose: () => void;
}

const FoodLogger: React.FC<FoodLoggerProps> = ({ onAddFood, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    quantity: '1',
    meal: 'breakfast' as FoodEntry['meal']
  });

  // Common foods database for quick selection
  const commonFoods = [
    { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { name: 'White Rice (100g)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
    { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.3 },
    { name: 'Oatmeal (100g)', calories: 389, protein: 16.9, carbs: 66, fats: 6.9 },
    { name: 'Egg (1 large)', calories: 70, protein: 6, carbs: 0.6, fats: 5 },
    { name: 'Salmon (100g)', calories: 208, protein: 22, carbs: 0, fats: 13 },
    { name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
    { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fats: 14 },
    { name: 'Greek Yogurt (100g)', calories: 100, protein: 10, carbs: 6, fats: 4 },
    { name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fats: 0.1 }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const filteredFoods = commonFoods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectFood = (food: typeof commonFoods[0]) => {
    setFormData(prev => ({
      ...prev,
      name: food.name,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fats: food.fats.toString()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantity = parseFloat(formData.quantity);
    const baseCalories = parseFloat(formData.calories);
    const baseProtein = parseFloat(formData.protein);
    const baseCarbs = parseFloat(formData.carbs);
    const baseFats = parseFloat(formData.fats);

    onAddFood({
      name: formData.name,
      calories: Math.round(baseCalories * quantity),
      protein: Math.round(baseProtein * quantity * 10) / 10,
      carbs: Math.round(baseCarbs * quantity * 10) / 10,
      fats: Math.round(baseFats * quantity * 10) / 10,
      quantity,
      meal: formData.meal
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Food</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Quick Search */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Add</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search common foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {filteredFoods.map((food, index) => (
                <button
                  key={index}
                  onClick={() => selectFood(food)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{food.name}</div>
                  <div className="text-sm text-gray-600">{food.calories} cal</div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Entry Form */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Grilled Chicken Breast"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.calories}
                    onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="165"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.protein}
                    onChange={(e) => setFormData(prev => ({ ...prev, protein: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="31"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.carbs}
                    onChange={(e) => setFormData(prev => ({ ...prev, carbs: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.fats}
                    onChange={(e) => setFormData(prev => ({ ...prev, fats: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="3.6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal</label>
                  <select
                    value={formData.meal}
                    onChange={(e) => setFormData(prev => ({ ...prev, meal: e.target.value as FoodEntry['meal'] }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snacks">Snacks</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Food
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodLogger;
