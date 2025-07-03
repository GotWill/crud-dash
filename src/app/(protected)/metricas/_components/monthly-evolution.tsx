'use client'
import { MonthlyDataProps } from "@/app/types";
import { Line, LineChart, ResponsiveContainer, YAxis, XAxis } from "recharts";

interface MonthlyEvolutionProps  {
    monthlyData: MonthlyDataProps[] 
}

export default function MonthlyEvolution({monthlyData}:MonthlyEvolutionProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Line
                    type="monotone"
                    dataKey="sale"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}