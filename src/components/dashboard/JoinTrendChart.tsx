import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowUp, ArrowDown } from 'lucide-react';
import { DashboardCard } from "./DashboardCard"
import { JoinTrend } from "@/services/analyticsService"

export function JoinTrendChart({ data }: { data: JoinTrend[] }) {
    // Calculate trend for UI demonstration
    const lastValue = data.length > 0 ? data[data.length - 1].count : 0;
    const prevValue = data.length > 1 ? data[data.length - 2].count : 0;
    const trendValue = lastValue - prevValue;
    const trendPercent = prevValue !== 0 ? Math.round((trendValue / prevValue) * 100) : 0;

    return (
        <DashboardCard title="Tỷ lệ vào NLT" className="relative">
            <div className="absolute right-8 top-8 flex flex-col gap-2 z-10">
                {trendValue >= 0 ? (
                    <div className="flex items-center gap-2">
                        <ArrowUp size={24} className="text-green-600 font-bold" strokeWidth={4} />
                        <span className="font-bold text-xl text-gray-800">{trendValue} ({trendPercent}%)</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <ArrowDown size={24} className="text-red-600 font-bold" strokeWidth={4} />
                        <span className="font-bold text-xl text-gray-800">{Math.abs(trendValue)} ({Math.abs(trendPercent)}%)</span>
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ bottom: 40, top: 10 }}>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3B82F6"
                        strokeWidth={4}
                        dot={{ r: 5, fill: '#3B82F6' }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </DashboardCard>
    )
}
