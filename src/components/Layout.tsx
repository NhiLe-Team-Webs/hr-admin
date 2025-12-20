import { Outlet, useLocation, Link } from "react-router-dom";
import { Shield, BarChart3, FileText, ChevronDown, ChevronRight, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

// Active navigation items
const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  {
    name: "Quản lý Report",
    icon: FileText,
    children: [
      { name: "Report xin off", href: "/time-off-report" }
    ]
  },
];

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Quản lý Report"]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(m => m !== menuName)
        : [...prev, menuName]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: { href: string }[]) =>
    children.some(child => location.pathname === child.href);

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "A";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

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

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            // Menu with children (dropdown)
            if ('children' in item && item.children) {
              const isExpanded = expandedMenus.includes(item.name);
              const hasActiveChild = isParentActive(item.children);

              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200
                      ${hasActiveChild
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`
                            flex items-center px-4 py-2 rounded-lg transition-colors duration-200 text-sm
                            ${isActive(child.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                            }
                          `}
                        >
                          <span className="ml-3">{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Regular menu item
            return (
              <Link
                key={item.name}
                to={item.href!}
                className={`
                  flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                  ${isActive(item.href!)
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
              {getInitials(user?.full_name)}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground truncate">
                {user?.full_name || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}