import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const STORAGE_KEY = "hr_admin_auth";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

interface FailedRequest {
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
    config: InternalAxiosRequestConfig;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            if (prom.config.headers) {
                prom.config.headers.Authorization = `Bearer ${token}`;
            }
            prom.resolve(api(prom.config));
        }
    });

    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const { session } = JSON.parse(stored);
                if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`;
                }
            } catch (e) {
                console.error("Error parsing auth state from transition", e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and not a retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const { user, session } = JSON.parse(stored);
                    const refreshToken = session?.refresh_token;

                    if (refreshToken) {
                        // Call refresh endpoint
                        // Note: Adjust endpoint if different in backend
                        const response = await axios.post(`${API_URL}/hr/auth/refresh`, {
                            refresh_token: refreshToken,
                        });

                        if (response.data.success) {
                            const newSession = response.data.data.session;

                            // Update localStorage
                            localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, session: newSession }));

                            // Dispatch event so useAuth can update its state if needed
                            window.dispatchEvent(new Event("auth-state-changed"));

                            processQueue(null, newSession.access_token);

                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
                            }
                            return api(originalRequest);
                        }
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);

                    // Clear auth on refresh failure
                    localStorage.removeItem(STORAGE_KEY);
                    window.dispatchEvent(new Event("auth-state-changed"));
                    window.location.href = "/login";

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // If no refresh token or other issues, logout
            localStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new Event("auth-state-changed"));
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
