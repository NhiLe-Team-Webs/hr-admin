import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
    title: "Đang chờ duyệt",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    key: "approved",
    title: "Đã duyệt",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    key: "rejected",
    title: "Từ chối",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    key: "cancelled",
    title: "Đã hủy",
    icon: AlertCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Đang chờ",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
};

export default function Dashboard() {
  const { getAuthHeader } = useAuth();
  const [stats, setStats] = useState<TimeOffStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        };

        // Fetch stats
        const statsRes = await fetch(`${API_URL}/nreport/time-off/stats`, { headers });
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch recent pending requests
        const requestsRes = await fetch(`${API_URL}/nreport/time-off?status=PENDING&limit=5`, { headers });
        const requestsData = await requestsRes.json();
        if (requestsData.success) {
          setRecentRequests(requestsData.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAuthHeader]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-card-foreground">HR Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Tổng quan các đơn xin nghỉ phép</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const value = stats ? stats[stat.key as keyof TimeOffStats] : 0;

          return (
            <Card key={stat.key} className="shadow-card hover:shadow-elevated transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.bgColor} ${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {loading ? "..." : value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total Stats Card */}
      <Card className="mb-8 shadow-card bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng số đơn xin off</p>
              <p className="text-4xl font-bold text-primary">
                {loading ? "..." : stats?.total || 0}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-primary/30" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Pending Requests */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Đơn xin off đang chờ duyệt</CardTitle>
            <Link to="/time-off-report">
              <Button variant="ghost" size="sm" className="text-primary">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
              <p>Không có đơn nào đang chờ duyệt</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground">
                      {request.requester_name || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(request.start_date)} - {formatDate(request.end_date)}
                    </p>
                    <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {request.reason}
                    </p>
                  </div>
                  <Badge className={statusColors[request.status]}>
                    {statusLabels[request.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}