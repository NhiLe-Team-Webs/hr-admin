import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface TimeOffStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

interface TimeOffRequest {
  id: string;
  requester_name: string | null;
  requester_email: string | null;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  created_at: string;
}

const statsCards = [
  {
    key: "pending",
    title: "Chờ duyệt",
    icon: Clock,
    color: "text-amber-600",
    gradient: "from-amber-100 to-amber-50",
    iconBg: "bg-white",
  },
  {
    key: "approved",
    title: "Đã duyệt",
    icon: CheckCircle,
    color: "text-emerald-600",
    gradient: "from-emerald-100 to-emerald-50",
    iconBg: "bg-white",
  },
  {
    key: "rejected",
    title: "Từ chối",
    icon: XCircle,
    color: "text-rose-600",
    gradient: "from-rose-100 to-rose-50",
    iconBg: "bg-white",
  },
  {
    key: "cancelled",
    title: "Đã hủy",
    icon: AlertCircle,
    color: "text-slate-600",
    gradient: "from-slate-100 to-slate-50",
    iconBg: "bg-white",
  },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-800 border-slate-200",
};

const statusLabels: Record<string, string> = {
  PENDING: "Đang chờ",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
};

export default function Dashboard() {
  const [stats, setStats] = useState<TimeOffStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await api.get("/nreport/time-off/stats");
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        // Fetch recent pending requests
        const requestsRes = await api.get("/nreport/time-off?status=PENDING&limit=5");
        if (requestsRes.data.success) {
          setRecentRequests(requestsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-600 to-rose-600 pb-1">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Chào mừng quay trở lại, Admin!</p>
        </div>
        <div className="hidden md:block">
          <span className="inline-flex items-center px-4 py-2 rounded-full glass bg-white/50 text-sm font-medium text-muted-foreground shadow-sm">
            Cập nhật: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const value = stats ? stats[stat.key as keyof TimeOffStats] : 0;

          return (
            <div key={stat.key} className={cn(
              "relative overflow-hidden rounded-[2rem] p-6 shadow-sm border border-white/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group bg-gradient-to-br",
              stat.gradient
            )}>
              {/* Glass Glint */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/80 opacity-50" />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-3xl font-black text-slate-800 tracking-tight">
                    {loading ? "..." : value}
                  </p>
                  <h3 className="font-bold text-slate-700 mt-1">{stat.title}</h3>
                </div>
                <div className={cn("p-3 rounded-2xl shadow-sm ring-1 ring-black/5", stat.iconBg)}>
                  <Icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Total Stats Card - Featured */}
        <div className="lg:col-span-1">
          <div className="h-full rounded-[2rem] p-8 glass-panel border border-white/60 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/20 text-primary mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium text-slate-600 mb-1">Tổng đơn xin nghỉ</p>
              <p className="text-6xl font-black text-primary tracking-tighter">
                {loading ? "..." : stats?.total || 0}
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-primary/10">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thống kê tổng hợp tất cả các đơn từ hệ thống.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Pending Requests */}
        <div className="lg:col-span-2">
          <div className="rounded-[2rem] glass-panel border border-white/60 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-white/20 flex items-center justify-between bg-white/30 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-xl font-bold text-slate-800">Cần phê duyệt</h3>
              </div>
              <Link to="/time-off-report">
                <Button variant="ghost" className="rounded-xl hover:bg-white/50 text-primary font-semibold">
                  Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="p-4 bg-white/30 flex-1 overflow-hidden">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                  <Clock className="w-10 h-10 mb-4 animate-spin opacity-20" />
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-medium text-slate-700">Tất cả đã hoàn tất!</p>
                  <p className="text-sm">Không có đơn nào đang chờ duyệt</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRequests.map((request, i) => (
                    <div
                      key={request.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/60 border border-white/60 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-start gap-4 mb-3 sm:mb-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                          {request.requester_name ? request.requester_name[0] : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg leading-none mb-1">
                            {request.requester_name || "N/A"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>{formatDate(request.start_date)}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span>{formatDate(request.end_date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <p className="text-sm text-slate-600 font-medium truncate max-w-[150px] bg-slate-100 px-3 py-1 rounded-lg">
                          {request.reason}
                        </p>
                        <Badge variant="outline" className={cn("rounded-lg px-3 py-1 h-auto font-bold border-0", statusColors[request.status])}>
                          {statusLabels[request.status]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}