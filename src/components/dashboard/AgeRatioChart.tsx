"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DashboardCard } from "./DashboardCard"
import { AgeRatio } from "@/services/analyticsService"

export function AgeRatioChart({ data }: { data: AgeRatio[] }) {
    return (
        <DashboardCard title="Độ tuổi" chartHeight={320}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ bottom: 10 }}>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="range"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }}
                        interval={0}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                        dataKey="count"
                        fill="#3B82F6"
                        radius={[6, 6, 0, 0]}
                        barSize={25}
                    />
                </BarChart>
            </ResponsiveContainer>
        </DashboardCard>
    )
}
