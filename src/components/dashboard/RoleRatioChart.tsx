"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { DashboardCard } from "./DashboardCard"
import { RoleRatio } from "@/services/analyticsService"

const COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];

export function RoleRatioChart({ data }: { data: RoleRatio[] }) {
    return (
        <DashboardCard title="Tỷ lệ Leader/Colead/ Member" chartHeight={320}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ left: 40, right: 40, top: 20, bottom: 20 }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="role"
                        stroke="none"
                        label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </DashboardCard>
    )
}
