import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, User, Filter, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface TimeOffRequest {
    id: string;
    requester_id: string;
    requester_name: string | null;
    requester_email: string | null;
    start_date: string;
    end_date: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    reviewed_by: string | null;
    reviewer_name: string | null;
    reviewed_at: string | null;
    created_at: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

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

export default function TimeOffReport() {
    const [requests, setRequests] = useState<TimeOffRequest[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTimeOffRequests = useCallback(async (page = 1, status = statusFilter, search = searchQuery) => {
        setLoading(true);
        setError(null);

        try {
            const params: Record<string, string | number> = {
                page,
                limit: 10,
            };

            if (status && status !== "ALL") {
                params.status = status;
            }

            if (search) {
                params.search = search;
            }

            const response = await api.get("/nreport/time-off", { params });
            const result = response.data;

            if (result.success) {
                setRequests(result.data);
                setPagination(result.pagination);
            } else {
                throw new Error(result.message || "Unknown error");
            }
        } catch (err: unknown) {
            console.error("Error fetching time off requests:", err);
            let errorMessage = "Lỗi khi tải dữ liệu";

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchQuery]);


    useEffect(() => {
        fetchTimeOffRequests();
    }, [fetchTimeOffRequests]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchTimeOffRequests(newPage, statusFilter, searchQuery);
        }
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        fetchTimeOffRequests(1, value, searchQuery);
    };

    const handleSearch = () => {
        fetchTimeOffRequests(1, statusFilter, searchQuery);
    };

    const handleRefresh = () => {
        fetchTimeOffRequests(pagination.page, statusFilter, searchQuery);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const calculateDays = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-600 to-rose-600 pb-1">
                        Report Xin Off
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Quản lý và xem xét các đơn xin nghỉ phép.
                    </p>
                </div>
            </header>

            {/* Filters */}
            <div className="glass-panel p-5 rounded-[1.5rem] border border-white/60 shadow-lg">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 shadow-sm border border-white/40">
                            <Filter className="w-4 h-4" />
                            <span>Bộ lọc</span>
                        </div>

                        <Select value={statusFilter} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-[160px] rounded-xl bg-white/70 border-white/50 focus:ring-primary/20">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả</SelectItem>
                                <SelectItem value="PENDING">Đang chờ</SelectItem>
                                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                                <SelectItem value="REJECTED">Từ chối</SelectItem>
                                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-1 md:max-w-md w-full gap-2">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Tìm theo tên, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="pl-9 rounded-xl bg-white/70 border-white/50 focus:bg-white focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <Button onClick={handleSearch} variant="secondary" className="rounded-xl shadow-sm hover:bg-white">
                            Tìm
                        </Button>
                        <Button onClick={handleRefresh} variant="outline" size="icon" className="rounded-xl bg-white/50 border-white/50 hover:bg-white">
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel border border-white/60 rounded-[2rem] shadow-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/20 bg-white/30 backdrop-blur-md flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full inline-block" />
                        Danh sách đơn
                    </h2>
                    <Badge variant="secondary" className="bg-white/50 text-slate-600">
                        Tổng: {pagination.total}
                    </Badge>
                </div>

                <div className="p-0 overflow-x-auto">
                    {error ? (
                        <div className="text-center py-12 text-red-500 bg-red-50/50">
                            <p>{error}</p>
                            <Button onClick={handleRefresh} variant="outline" className="mt-4 bg-white">
                                Thử lại
                            </Button>
                        </div>
                    ) : loading ? (
                        <div className="text-center py-20">
                            <div className="relative w-12 h-12 mx-auto">
                                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                            </div>
                            <p className="mt-4 text-muted-foreground font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                <Calendar className="w-10 h-10 text-slate-400" />
                            </div>
                            <p className="text-lg font-medium text-slate-600">Không tìm thấy dữ liệu</p>
                            <p className="text-sm opacity-70">Chưa có đơn xin nghỉ phép nào phù hợp với bộ lọc</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/60 border-b border-white/20">
                                    <TableHead className="font-bold text-slate-700 w-[250px] pl-6">Người gửi</TableHead>
                                    <TableHead className="font-bold text-slate-700">Thời gian</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-center">Số ngày</TableHead>
                                    <TableHead className="font-bold text-slate-700">Lý do</TableHead>
                                    <TableHead className="font-bold text-slate-700">Trạng thái</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-right pr-6">Ngày tạo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request, i) => (
                                    <TableRow
                                        key={request.id}
                                        className="hover:bg-primary/5 border-b border-white/10 transition-colors duration-200 group"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-red-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-slate-800 text-sm">
                                                        {request.requester_name || "N/A"}
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        {request.requester_email || ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <Calendar className="w-3.5 h-3.5 text-primary/70" />
                                                    {formatDate(request.start_date)}
                                                </div>
                                                <div className="w-px h-3 bg-slate-300 ml-2"></div>
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <Calendar className="w-3.5 h-3.5 text-primary/70" />
                                                    {formatDate(request.end_date)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-bold border-slate-200 bg-white/50">
                                                {calculateDays(request.start_date, request.end_date)}d
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[200px] truncate text-sm text-slate-600 bg-slate-50/80 px-2 py-1 rounded-lg border border-white/50" title={request.reason}>
                                                {request.reason}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn("rounded-lg px-2.5 py-0.5 font-bold shadow-sm", statusColors[request.status])}>
                                                {statusLabels[request.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 text-xs text-slate-500 font-medium">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDateTime(request.created_at)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-white/20 bg-white/30 backdrop-blur-md flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-600">
                            Trang {pagination.page} / {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="bg-white/50 hover:bg-white border-white/60 rounded-xl"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="bg-white/50 hover:bg-white border-white/60 rounded-xl"
                            >
                                Sau
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
