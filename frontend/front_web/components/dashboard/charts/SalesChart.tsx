'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { month: 'Jan', thisMonth: 400, lastMonth: 300 },
  { month: 'Feb', thisMonth: 300, lastMonth: 200 },
  { month: 'May', thisMonth: 200, lastMonth: 150 },
  { month: 'Jun', thisMonth: 500, lastMonth: 400 },
  { month: 'Jul', thisMonth: 450, lastMonth: 350 },
  { month: 'Aug', thisMonth: 300, lastMonth: 250 },
  { month: 'Sept', thisMonth: 480, lastMonth: 380 },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} barGap={8}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Bar dataKey="lastMonth" fill="#E5E7EB" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="thisMonth" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.month === 'Jun' ? '#312E81' : '#4F46E5'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}