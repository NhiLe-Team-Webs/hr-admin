import { Outlet, useLocation, Link } from "react-router-dom";
import { Shield, BarChart3, Network, Settings, LogOut } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Quản lý Tổ chức", href: "/organization", icon: Network },
  { name: "Phân tích & Báo cáo", href: "/analytics", icon: BarChart3 },
  { name: "Cấu hình Hệ thống", href: "/settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card shadow-elevated flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center text-2xl font-bold text-primary">
            <Shield className="mr-2 h-8 w-8" />
            HR Admin
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                  ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              H
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-card-foreground">HR Manager</p>
              <button className="text-xs text-primary hover:underline flex items-center">
                <LogOut className="w-3 h-3 mr-1" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}