import { useState, useEffect, useCallback } from "react";
import {
    Search,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    Users,
    Calendar
} from "lucide-react";
import { analyticsService, MemberInfo } from "@/services/analyticsService";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function MembersOverview() {
    const [members, setMembers] = useState<MemberInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await analyticsService.getMembers(page, limit, search);
            setMembers(response.members);
            setTotal(response.total);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchMembers();
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen p-6 md:p-12 font-sans text-gray-900 animate-in fade-in duration-700">
            <header className="mb-10 relative max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-10 tracking-tight uppercase">
                    TỔNG THÔNG TIN
                </h1>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 glass-panel p-6 rounded-3xl border border-white/50 shadow-xl bg-white/20">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm theo tên hoặc email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-white/50 border-white/20 rounded-xl focus:ring-[#3B82F6]"
                        />
                    </form>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Hiển thị:</span>
                        <Select
                            value={limit.toString()}
                            onValueChange={(v) => {
                                setLimit(parseInt(v));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-24 bg-white/50 border-white/20 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            {/* Table Container */}
            <div className="max-w-7xl mx-auto glass-panel rounded-[2rem] overflow-hidden border border-white/50 shadow-2xl bg-white/30 backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/50">
                            <TableRow className="hover:bg-transparent border-b border-white/20">
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 pl-8 text-xs">Tên</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-xs">Email</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-xs">Số điện thoại</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-xs">Team hoạt động</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-center text-xs">Tài khoản Nquoc?</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-right pr-8 text-xs">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse border-b border-white/10">
                                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Đang tải dữ liệu...</TableCell>
                                    </TableRow>
                                ))
                            ) : members.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="h-12 w-12 text-muted-foreground opacity-20" />
                                            <p className="text-muted-foreground font-medium">Không tìm thấy thành viên nào</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.map((member) => (
                                    <TableRow key={member.id} className="hover:bg-white/40 transition-colors border-b border-white/10 group">
                                        <TableCell className="font-semibold text-gray-800 py-4 pl-8">{member.name}</TableCell>
                                        <TableCell className="text-gray-600 py-4">{member.email}</TableCell>
                                        <TableCell className="text-gray-600 py-4">{member.phone || "---"}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {member.teams.length > 0 ? (
                                                    member.teams.map((t, i) => (
                                                        <Badge key={i} variant="secondary" className="bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 border-none px-2 py-0 text-[10px]">
                                                            {t}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Chưa có team</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            <Badge className={cn(
                                                "rounded-full px-3 py-0.5 border-none text-[10px]",
                                                member.hasNquoc
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : "bg-gray-500/10 text-gray-500"
                                            )}>
                                                {member.hasNquoc ? "Đã có" : "Chưa có"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-8">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedMember(member)}
                                                className="text-[#3B82F6] hover:text-[#2563EB] hover:bg-[#3B82F6]/10 rounded-xl"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Container */}
                <div className="p-6 bg-white/50 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground font-medium">
                        Hiển thị <span className="text-[#3B82F6] font-bold">{members.length}</span> / <span className="text-[#3B82F6] font-bold">{total}</span> thành viên
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="rounded-xl border-white/40 hover:bg-white h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-gray-700 bg-white/50 px-3 py-1 rounded-lg border border-white/30">
                                Trang {page} / {totalPages || 1}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => setPage(page + 1)}
                            className="rounded-xl border-white/40 hover:bg-white h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Member Details Modal */}
            <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
                <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200 rounded-[2rem] shadow-2xl p-0 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-4">
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            Chi tiết thành viên
                        </DialogTitle>
                        <p className="text-gray-400 font-medium text-sm mt-1">Thông tin quản lý nhân sự hệ thống</p>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Main Info Section */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Họ và tên</span>
                                <span className="col-span-2 text-gray-900 font-bold text-lg">{selectedMember?.name}</span>
                            </div>

                            <div className="grid grid-cols-3 items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
                                <span className="col-span-2 text-gray-700 font-medium">{selectedMember?.email}</span>
                            </div>

                            <div className="grid grid-cols-3 items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Số điện thoại</span>
                                <span className="col-span-2 text-gray-700 font-bold">{selectedMember?.phone || "Chưa cập nhật"}</span>
                            </div>

                            <div className="grid grid-cols-3 items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vào Nquoc?</span>
                                <div className="col-span-2">
                                    <Badge className={cn(
                                        "px-4 py-1 rounded-full border-none shadow-sm text-[10px] font-bold",
                                        selectedMember?.hasNquoc ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"
                                    )}>
                                        {selectedMember?.hasNquoc ? "ĐÃ VÀO NQUOC" : "CHƯA VÀO"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày sinh</span>
                                <span className="text-gray-800 font-bold">
                                    {selectedMember?.dob ? new Date(selectedMember.dob).toLocaleDateString('vi-VN') : "---"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tuổi</span>
                                <span className="text-gray-800 font-bold">
                                    {selectedMember?.age ? `${selectedMember.age} tuổi` : "---"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giới tính</span>
                                <span className="text-gray-800 font-bold capitalize">{selectedMember?.gender || "---"}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phân quyền</span>
                                <span className="text-gray-800 font-bold uppercase text-xs">{selectedMember?.role}</span>
                            </div>
                        </div>

                        {/* Teams Section */}
                        <div className="pt-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Team đang hoạt động</span>
                            <div className="flex flex-wrap gap-2">
                                {selectedMember?.teams.map((t, i) => (
                                    <Badge key={i} variant="secondary" className="bg-[#3B82F6]/5 text-[#3B82F6] border border-[#3B82F6]/10 px-3 py-1 rounded-xl font-bold">
                                        {t}
                                    </Badge>
                                ))}
                                {selectedMember?.teams.length === 0 && (
                                    <span className="text-sm text-gray-400 italic">Hiện tại chưa tham gia team nào</span>
                                )}
                            </div>
                        </div>

                        {/* Simple Footer */}
                        <div className="pt-6 flex justify-end">
                            <Button
                                onClick={() => setSelectedMember(null)}
                                className="bg-gray-900 hover:bg-black text-white px-8 py-5 rounded-xl font-bold transition-all active:scale-95"
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
