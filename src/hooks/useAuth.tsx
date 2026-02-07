import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";

interface User {
    id: string;
    auth_id: string;
    email: string;
    full_name: string;
    role: string;
}

interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    getAuthHeader: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "hr_admin_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadAuthState = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed.user);
                setSession(parsed.session);
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
                setUser(null);
                setSession(null);
            }
        } else {
            setUser(null);
            setSession(null);
        }
        setIsLoading(false);
    };

    // Load auth state from localStorage on mount and when event is triggered
    useEffect(() => {
        loadAuthState();

        const handleAuthStateChange = () => {
            loadAuthState();
        };

        window.addEventListener("auth-state-changed", handleAuthStateChange);
        return () => window.removeEventListener("auth-state-changed", handleAuthStateChange);
    }, []);

    // Save auth state to localStorage
    const saveAuthState = (user: User, session: Session) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, session }));
        setUser(user);
        setSession(session);
    };

    const clearAuthState = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setSession(null);
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await api.post("/hr/auth/admin/login", { email, password });
            const data = response.data;

            if (!data.success) {
                return {
                    success: false,
                    error: data.error?.message || "Đăng nhập thất bại",
                };
            }

            // Check if user has admin role
            if (!["admin", "owner", "manager"].includes(data.data.user.role)) {
                return {
                    success: false,
                    error: "Bạn không có quyền truy cập. Chỉ admin mới được phép.",
                };
            }

            saveAuthState(data.data.user, data.data.session);
            return { success: true };
        } catch (error: unknown) {
            console.error("Login error:", error);
            let errorMessage = "Lỗi kết nối. Vui lòng thử lại.";

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
                errorMessage = axiosError.response?.data?.error?.message || errorMessage;
            }

            return {
                success: false,
                error: errorMessage,
            };
        }
    };

    const logout = () => {
        clearAuthState();
    };

    const getAuthHeader = (): Record<string, string> => {
        if (session?.access_token) {
            return { Authorization: `Bearer ${session.access_token}` };
        }
        return {};
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isLoading,
                isAuthenticated: !!user && !!session,
                login,
                logout,
                getAuthHeader,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

