import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PossessionChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#facc15', '#b91c1c']; // Yellow, Red

const PossessionChart: React.FC<PossessionChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                    contentStyle={{
                        background: 'rgba(20, 0, 0, 0.8)',
                        borderColor: '#facc15',
                        color: '#ffffff'
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend iconType="circle" />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PossessionChart;
