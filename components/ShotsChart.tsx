import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ShotsChartProps {
    data: { name: string; [key: string]: string | number }[];
    timeA: string;
    timeB: string;
}

const ShotsChart: React.FC<ShotsChartProps> = ({ data, timeA, timeB }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(250, 204, 21, 0.2)" />
                <XAxis dataKey="name" stroke="#fde047" />
                <YAxis stroke="#fde047" allowDecimals={false}/>
                <Tooltip
                     contentStyle={{
                        background: 'rgba(20, 0, 0, 0.8)',
                        borderColor: '#facc15',
                        color: '#ffffff'
                    }}
                />
                <Legend />
                <Bar dataKey={timeA} fill="#facc15" />
                <Bar dataKey={timeB} fill="#b91c1c" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ShotsChart;
