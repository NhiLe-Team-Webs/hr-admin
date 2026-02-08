import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { DashboardCard } from "./DashboardCard"
import { TeamChangeTrend } from "@/services/analyticsService"

const COLORS = ['#67e8f9', '#22d3ee', '#0891b2', '#0e7490', '#155e75', '#164e63'];

export function TeamChangeChart({ data }: { data: TeamChangeTrend[] }) {
    // Get unique team names from the first data point if available
    const teams = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'week') : [];

    return (
        <DashboardCard
            title="Tỷ lệ thay đổi các team"
            className="h-full justify-center"
            chartHeight={550}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }}
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
                    {teams.map((team, index) => (
                        <Line
                            key={team}
                            type="monotone"
                            dataKey={team}
                            stroke={['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'][index % 5]}
                            strokeWidth={3}
                            dot={{ r: 4, fill: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'][index % 5] }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </DashboardCard>
    )
}
