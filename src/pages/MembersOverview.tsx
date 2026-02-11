import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Search,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    Users,
    Calendar,
    Send,
    Facebook,
    Linkedin,
    MapPin,
    Laptop,
    Sparkles,
    Target,
    Activity,
    BookOpen,
    UserCircle,
    CheckCircle2
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function MembersOverview() {
    const [members, setMembers] = useState<MemberInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedTeam, setSelectedTeam] = useState<string>("all");
    const [availableTeams, setAvailableTeams] = useState<string[]>([]);
    const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await analyticsService.getMembers(page, limit, search, selectedTeam);
            setMembers(response.members);
            setTotal(response.total);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, selectedTeam]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    // Fetch unique teams for the filter
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const overview = await analyticsService.getOverview();
                const teams = overview.teamMemberRatio.map(t => t.team);
                setAvailableTeams(teams);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };
        fetchTeams();
    }, []);

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
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm theo tên hoặc email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-white/50 border-white/20 rounded-xl focus:ring-[#3B82F6]"
                            />
                        </form>

                        <div className="w-full md:w-56">
                            <Select value={selectedTeam} onValueChange={(v) => { setSelectedTeam(v); setPage(1); }}>
                                <SelectTrigger className="bg-white/50 border-white/20 rounded-xl">
                                    <SelectValue placeholder="Lọc theo team" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả team</SelectItem>
                                    {availableTeams.map(team => (
                                        <SelectItem key={team} value={team}>{team}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

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
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-xs">Telegram</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-xs">Email</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-xs">Team hoạt động</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-center text-xs">Tài khoản Nquoc?</TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase tracking-wider py-5 text-right pr-8 text-xs">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: limit }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-white/10">
                                        <TableCell className="py-4 pl-8"><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell className="py-4"><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell className="py-4 text-center"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></TableCell>
                                        <TableCell className="py-4 text-right pr-8"><Skeleton className="h-8 w-8 ml-auto rounded-xl" /></TableCell>
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
                                        <TableCell className="text-gray-600 py-4">
                                            <div className="flex items-center gap-2">
                                                <Send className="h-3 w-3 text-sky-500" />
                                                <span className="text-xs truncate max-w-[120px]">
                                                    {member.telegramUsername ? `@${member.telegramUsername}` : "---"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 py-4">{member.email}</TableCell>
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
                <DialogContent className="sm:max-w-[700px] bg-white border border-gray-200 rounded-[2rem] shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh] font-sans">
                    {/* Header */}
                    <div className="p-8 pb-4 border-b bg-gray-50/50">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                                <UserCircle className="h-8 w-8 text-[#3B82F6]" />
                                Chi tiết thành viên
                            </DialogTitle>
                            <p className="text-gray-400 font-medium text-sm mt-1 uppercase tracking-widest">Thông tin hệ thống & Cá nhân</p>
                        </DialogHeader>
                    </div>

                    <div className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                        {/* 1. Thông tin cơ bản */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black text-[#3B82F6] uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-6 bg-[#3B82F6] rounded-full" />
                                Thông tin cơ bản
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Họ và tên</span>
                                    <p className="text-gray-900 font-bold text-lg">{selectedMember?.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                                    <p className="text-gray-700 font-semibold">{selectedMember?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số điện thoại</span>
                                    <p className="text-gray-700 font-bold flex items-center gap-2">
                                        <Phone className="h-3 w-3 text-gray-400" />
                                        {selectedMember?.phone || "Chưa cập nhật"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vị trí</span>
                                    <p className="text-[#3B82F6] font-black uppercase text-sm">
                                        {selectedMember?.position || selectedMember?.role || "---"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Thông tin liên hệ & MXH */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black text-[#3B82F6] uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-6 bg-[#3B82F6] rounded-full" />
                                Liên hệ & MXH
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="h-10 w-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                        <Send className="h-5 w-5 text-sky-500" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Telegram</span>
                                        <span className="text-gray-800 font-bold">{selectedMember?.telegramUsername ? `@${selectedMember.telegramUsername}` : "---"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <Facebook className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Facebook</span>
                                        <span className="text-gray-800 font-bold truncate block">{selectedMember?.facebookLink || "---"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <Linkedin className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">LinkedIn</span>
                                        <span className="text-gray-800 font-bold truncate block">{selectedMember?.linkedinLink || "---"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Địa chỉ</span>
                                        <span className="text-gray-800 font-bold truncate block">{selectedMember?.address || "---"}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Thông tin đội ngũ & Công việc */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black text-[#3B82F6] uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-6 bg-[#3B82F6] rounded-full" />
                                Đội ngũ & Công việc
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Thiết bị làm việc</span>
                                        <div className="flex items-center gap-2">
                                            <Laptop className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-800 font-bold">{selectedMember?.workEquipment || "---"}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Trạng thái Nquoc</span>
                                        <Badge className={cn(
                                            "px-4 py-1 rounded-full border-none shadow-sm text-[10px] font-black tracking-wider",
                                            selectedMember?.hasNquoc ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"
                                        )}>
                                            {selectedMember?.hasNquoc ? "ĐÃ THAM GIA NQUOC" : "CHƯA THAM GIA"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
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
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2 flex items-center gap-1">
                                            <Target className="h-3 w-3" /> Mục tiêu phát triển
                                        </span>
                                        <p className="text-indigo-900 font-medium text-sm leading-relaxed">{selectedMember?.developmentGoal || "---"}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-amber-50/30 border border-amber-100 rounded-2xl">
                                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1 flex items-center gap-1">
                                                <Activity className="h-3 w-3" /> Nhóm thể dục
                                            </span>
                                            <span className="text-amber-900 font-bold text-xs">{selectedMember?.exerciseGroupJoined || "---"}</span>
                                        </div>
                                        <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl">
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1 flex items-center gap-1">
                                                <Sparkles className="h-3 w-3" /> Sự kiện NLT
                                            </span>
                                            <span className="text-emerald-900 font-bold text-xs">{selectedMember?.nltEventsJoined || "---"}</span>
                                        </div>
                                        <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-2xl">
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1 flex items-center gap-1">
                                                <BookOpen className="h-3 w-3" /> Khóa học tham gia
                                            </span>
                                            <span className="text-blue-900 font-bold text-xs">{selectedMember?.coursesJoined || "---"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Thông tin cá nhân & Thần số học */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black text-[#3B82F6] uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-6 bg-[#3B82F6] rounded-full" />
                                Cá nhân & Thần số học
                            </h3>
                            <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-2xl space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles className="h-24 w-24" />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ngày sinh</span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tuổi</span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Giới tính</span>

                                    <p className="font-bold text-sm">
                                        {selectedMember?.dob ? new Date(selectedMember.dob).toLocaleDateString('vi-VN') : "---"}
                                    </p>
                                    <p className="font-bold text-sm">{selectedMember?.age ? `${selectedMember.age} tuổi` : "---"}</p>
                                    <p className="font-bold text-sm capitalize">{selectedMember?.gender || "---"}</p>
                                </div>

                                <div className="h-px bg-gray-800" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.2em] block">Cung hoàng đạo</span>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 text-center">
                                                <span className="text-[9px] text-gray-500 uppercase block mb-1">Sun</span>
                                                <span className="font-bold text-xs">{selectedMember?.sunSign || "---"}</span>
                                            </div>
                                            <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 text-center">
                                                <span className="text-[9px] text-gray-500 uppercase block mb-1">Moon</span>
                                                <span className="font-bold text-xs">{selectedMember?.moonSign || "---"}</span>
                                            </div>
                                            <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 text-center">
                                                <span className="text-[9px] text-gray-500 uppercase block mb-1">Rising</span>
                                                <span className="font-bold text-xs">{selectedMember?.risingSign || "---"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.2em] block">Thần số học</span>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 text-center">
                                                <span className="text-[9px] text-gray-500 uppercase block mb-1">Chủ đạo</span>
                                                <span className="font-bold text-xs">{selectedMember?.lifePathNumber || "---"}</span>
                                            </div>
                                            <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 text-center">
                                                <span className="text-[9px] text-gray-500 uppercase block mb-1">Linh hồn</span>
                                                <span className="font-bold text-xs">{selectedMember?.soulNumber || "---"}</span>
                                            </div>
                                            <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 text-center">
                                                <span className="text-[9px] text-gray-500 uppercase block mb-1">Trưởng thành</span>
                                                <span className="font-bold text-xs">{selectedMember?.maturityNumber || "---"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedMember(null)}
                            className="text-gray-500 hover:text-gray-900 font-bold px-6"
                        >
                            Đóng
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}} />
        </div>
    );
}
