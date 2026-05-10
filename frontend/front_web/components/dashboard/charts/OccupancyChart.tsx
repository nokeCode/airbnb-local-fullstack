'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type OccupancyItem = {
  name: string;
  value: number;
  color: string;
};

type OccupancyChartProps = {
  data: OccupancyItem[];
};

export function OccupancyChart({ data }: OccupancyChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const occupancy = total > 0 ? Math.round((data[0]?.value || 0) / total * 100) : 0;

  return (
    // Diagramme d'occupation (loué/vacant/travaux).
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-gray-900">{occupancy}%</span>
        <span className="text-xs text-gray-500">Occupation</span>
      </div>
    </div>
  );
}
