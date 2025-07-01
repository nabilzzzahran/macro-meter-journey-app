
import React, { useState } from 'react';
import { ArrowLeft, Calculator } from 'lucide-react';
import { User } from '../types/fitness';

interface UserSelectorProps {
  onUserCreate: (user: User) => void;
  onBack: () => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ onUserCreate, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: 'moderately_active' as User['activityLevel'],
    goal: 'maintain_weight' as User['goal']
  });

  const calculateMacros = (calories: number, goal: User['goal']) => {
    let proteinRatio = 0.3;
    let fatRatio = 0.25;
    let carbRatio = 0.45;

    if (goal === 'lose_weight') {
      proteinRatio = 0.35;
      fatRatio = 0.25;
      carbRatio = 0.4;
    } else if (goal === 'gain_weight') {
      proteinRatio = 0.25;
      fatRatio = 0.25;
      carbRatio = 0.5;
    }

    return {
      protein: Math.round((calories * proteinRatio) / 4), // 4 calories per gram
      carbs: Math.round((calories * carbRatio) / 4), // 4 calories per gram
      fats: Math.round((calories * fatRatio) / 9) // 9 calories per gram
    };
  };

  const calculateDailyCalories = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.currentWeight);
    const height = parseFloat(formData.height);

    // Mifflin-St Jeor Equation
    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    const tdee = bmr * activityMultipliers[formData.activityLevel];

    // Adjust for goal
    let calories = tdee;
    if (formData.goal === 'lose_weight') {
      calories = tdee - 500; // 500 calorie deficit
    } else if (formData.goal === 'gain_weight') {
      calories = tdee + 500; // 500 calorie surplus
    }

    return Math.round(calories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dailyCalories = calculateDailyCalories();
    const dailyMacros = calculateMacros(dailyCalories, formData.goal);

    const user: User = {
      id: '',
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      height: parseFloat(formData.height),
      currentWeight: parseFloat(formData.currentWeight),
      targetWeight: parseFloat(formData.targetWeight),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      dailyCalories,
      dailyMacros
    };

    onUserCreate(user);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Your Profile</h2>
            <p className="text-gray-600">Let's set up your personalized fitness plan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                required
                min="13"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                required
                min="100"
                max="250"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="170"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
              <input
                type="number"
                required
                min="30"
                max="300"
                step="0.1"
                value={formData.currentWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, currentWeight: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (kg)</label>
              <input
                type="number"
                required
                min="30"
                max="300"
                step="0.1"
                value={formData.targetWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, targetWeight: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="65"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value as User['activityLevel'] }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="sedentary">Sedentary (little/no exercise)</option>
              <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
              <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
              <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
              <option value="extremely_active">Extremely Active (very hard exercise, physical job)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value as User['goal'] }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="lose_weight">Lose Weight</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="gain_weight">Gain Weight</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Create Profile & Calculate Macros
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSelector;
