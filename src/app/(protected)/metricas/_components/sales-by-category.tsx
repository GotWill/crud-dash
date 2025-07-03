'use client'
import { BarChart, Bar, YAxis, XAxis, ResponsiveContainer } from "recharts";
import { CategoryDataProps } from "@/app/types";

interface SalesByCategoryProps {
    categoryData: CategoryDataProps[]
}       

export default function SalesByCategory({categoryData}: SalesByCategoryProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#374151" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}