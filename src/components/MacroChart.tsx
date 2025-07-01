import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MacroChartProps {
  current: {
    protein: number;
    carbs: number;
    fats: number;
  };
  target: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

const MacroChart: React.FC<MacroChartProps> = ({ current, target }) => {
  const data = [
    { name: 'Protein', value: current.protein, target: target.protein, color: '#EF4444' },
    { name: 'Carbs', value: current.carbs, target: target.carbs, color: '#EAB308' },
    { name: 'Fats', value: current.fats, target: target.fats, color: '#3B82F6' }
  ];

  const COLORS = ['#EF4444', '#EAB308', '#3B82F6'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Current: {data.value}g
          </p>
          <p className="text-sm text-gray-600">
            Target: {data.target}g
          </p>
          <p className="text-sm text-gray-600">
            Progress: {Math.round((data.value / data.target) * 100)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (current.protein === 0 && current.carbs === 0 && current.fats === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🍽️</div>
          <p>No food logged yet today</p>
          <p className="text-sm">Add your first meal to see your macro breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value}: {data.find(d => d.name === value)?.value}g
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroChart;
