import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.error || "Đăng nhập thất bại");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated Liquid Background specifically for login if needed, though body has one already. 
                We can add a specific overlay here to make it pop. */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 via-transparent to-orange-500/20 pointer-events-none" />

            <div className="w-full max-w-md glass-panel rounded-[2.5rem] p-8 md:p-12 relative z-10 shadow-2xl border border-white/40">
                <div className="text-center pb-8">
                    <div className="mx-auto mb-6 h-20 w-20 rounded-[2rem] bg-gradient-to-br from-primary to-rose-500 flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-white/50 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Chào mừng trở lại!</h1>
                    <p className="text-slate-500 mt-2 font-medium">Đăng nhập vào hệ thống HR Admin</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium animate-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Email</Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-primary/10 group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                                <Mail className="h-4 w-4 text-primary group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-14 h-12 rounded-2xl bg-white/50 border-white/50 focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-700 font-bold ml-1">Mật khẩu</Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-primary/10 group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                                <Lock className="h-4 w-4 text-primary group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-14 pr-12 h-12 rounded-2xl bg-white/50 border-white/50 focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all font-medium text-slate-800"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-600/90 shadow-lg shadow-primary/25 text-lg font-bold tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Đăng nhập"
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 font-semibold bg-slate-100/50 inline-block px-3 py-1 rounded-full border border-white/50">
                        Chỉ dành cho quản trị viên (Admin Role)
                    </p>
                </div>
            </div>
        </div>
    );
}
