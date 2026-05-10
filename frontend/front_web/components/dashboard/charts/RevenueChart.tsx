'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

type RevenuePoint = {
  mois: string;
  loyers: number;
  charges: number;
};

type RevenueChartProps = {
  data: RevenuePoint[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    // Graphique des revenus avec formatage FCFA.
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={8} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="mois" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickFormatter={(value) => `${value} FCFA`}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString('fr-FR')} FCFA`, '']}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="charges" name="Charges" fill="#FCA5A5" radius={[4, 4, 0, 0]} barSize={24} />
        <Bar dataKey="loyers" name="Loyers perçus" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
