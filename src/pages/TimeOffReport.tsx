import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, User, Filter, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels: Record<string, string> = {
    PENDING: "Đang chờ",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    CANCELLED: "Đã hủy",
};

export default function TimeOffReport() {
    const { getAuthHeader } = useAuth();
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
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });

            if (status && status !== "ALL") {
                params.append("status", status);
            }

            if (search) {
                params.append("search", search);
            }

            const response = await fetch(`${API_URL}/nreport/time-off?${params}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch time off requests");
            }

            const result = await response.json();

            if (result.success) {
                setRequests(result.data);
                setPagination(result.pagination);
            } else {
                throw new Error(result.message || "Unknown error");
            }
        } catch (err) {
            console.error("Error fetching time off requests:", err);
            setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, [getAuthHeader, statusFilter, searchQuery]);

    useEffect(() => {
        fetchTimeOffRequests();
    }, []);

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
        <div className="p-8">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-card-foreground">Report Xin Off</h1>
                <p className="text-muted-foreground mt-1">
                    Xem danh sách các đơn xin nghỉ phép của nhân viên
                </p>
            </header>

            {/* Filters */}
            <Card className="mb-6 shadow-card">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Lọc:</span>
                        </div>

                        <Select value={statusFilter} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-[160px]">
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

                        <div className="flex flex-1 max-w-sm gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm theo tên, email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-9"
                                />
                            </div>
                            <Button onClick={handleSearch} variant="secondary">
                                Tìm
                            </Button>
                        </div>

                        <Button onClick={handleRefresh} variant="outline" size="icon">
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="shadow-card">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>Danh sách đơn xin off</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            Tổng: {pagination.total} đơn
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="text-center py-12 text-red-500">
                            <p>{error}</p>
                            <Button onClick={handleRefresh} variant="outline" className="mt-4">
                                Thử lại
                            </Button>
                        </div>
                    ) : loading ? (
                        <div className="text-center py-12">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                            <p className="mt-2 text-muted-foreground">Đang tải...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Không có đơn xin off nào</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="font-semibold">Người gửi</TableHead>
                                            <TableHead className="font-semibold">Thời gian nghỉ</TableHead>
                                            <TableHead className="font-semibold">Số ngày</TableHead>
                                            <TableHead className="font-semibold">Lý do</TableHead>
                                            <TableHead className="font-semibold">Trạng thái</TableHead>
                                            <TableHead className="font-semibold">Ngày tạo</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requests.map((request) => (
                                            <TableRow key={request.id} className="hover:bg-muted/30">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-card-foreground">
                                                                {request.requester_name || "N/A"}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {request.requester_email || ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        <span>
                                                            {formatDate(request.start_date)} - {formatDate(request.end_date)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-medium">
                                                        {calculateDays(request.start_date, request.end_date)} ngày
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="max-w-[200px] truncate" title={request.reason}>
                                                        {request.reason}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${statusColors[request.status]} border`}>
                                                        {statusLabels[request.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="w-4 h-4" />
                                                        {formatDateTime(request.created_at)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Trang {pagination.page} / {pagination.totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Trước
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages}
                                        >
                                            Sau
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
