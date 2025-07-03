'use client'
import { DeviceAccessDataProps } from "@/app/types";
import {ResponsiveContainer, Pie, PieChart, Cell } from "recharts";

interface DeviceAccessProps {
    deviceData: DeviceAccessDataProps[]
}

export default function DeviceAccess({deviceData}: DeviceAccessProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    )
}