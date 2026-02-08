import React from 'react';

interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    chartHeight?: number | string;
}

export const DashboardCard = ({ title, children, className = "", chartHeight = 250 }: DashboardCardProps) => (
    <div className={`bg-[#fdf6f0] rounded-[40px] p-8 shadow-sm flex flex-col transition-all duration-300 hover:shadow-md border border-[#f5ebe0]/50 ${className}`}>
        <div style={{ width: '100%', height: chartHeight }}>
            {children}
        </div>
        <h3 className="mt-8 text-xl font-bold text-gray-800 text-center uppercase tracking-tight">
            {title}
        </h3>
    </div>
);
