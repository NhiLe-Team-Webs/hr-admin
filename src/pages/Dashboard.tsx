import { useState, useEffect } from "react";
import { Users, TrendingUp } from "lucide-react";
import { analyticsService, AnalyticsOverview } from "@/services/analyticsService";
import { TeamRatioChart } from "@/components/dashboard/TeamRatioChart";
import { RoleRatioChart } from "@/components/dashboard/RoleRatioChart";
import { AgeRatioChart } from "@/components/dashboard/AgeRatioChart";
import { JoinTrendChart } from "@/components/dashboard/JoinTrendChart";
import { TeamChangeChart } from "@/components/dashboard/TeamChangeChart";

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await analyticsService.getOverview();
        setData(result);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20" />
          <p className="text-slate-600 font-bold text-lg animate-pulse">Đang tải dữ liệu NhiLe Team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans text-gray-900 animate-in fade-in duration-700">
      {/* Phần Tiêu đề */}
      <header className="mb-16 relative max-w-7xl mx-auto">

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-10 tracking-tight uppercase">
          TỔNG QUAN
        </h1>
        <div className="text-2xl md:text-3xl font-bold ml-2 text-center md:text-left">
          Tổng thành viên NhiLe Team: <span className="font-black underline decoration-[#3B82F6] decoration-4 underline-offset-4">{data?.totalMembers || 0}</span>
        </div>
      </header>

      {/* Lưới Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">

        {/* Cột Trái & Giữa (Chứa 4 biểu đồ nhỏ) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Tỷ lệ thành viên từng team */}
          {data && <TeamRatioChart data={data.teamMemberRatio} />}

          {/* Độ tuổi */}
          {data && <AgeRatioChart data={data.ageRatio} />}

          {/* Tỷ lệ vào NLT */}
          {data && <JoinTrendChart data={data.joinTrend} />}

          {/* Tỷ lệ Leader/Colead/ Member */}
          {data && <RoleRatioChart data={data.roleRatio} />}

        </div>

        {/* Cột Phải - Biểu đồ dọc dài */}
        <div className="lg:col-span-1">
          {data && <TeamChangeChart data={data.teamChangeTrend} />}
        </div>

      </div>
    </div>
  );
}