import { Outlet, useLocation, Link } from "react-router-dom";
import { Shield, BarChart3, FileText, ChevronDown, ChevronRight, LogOut, Menu, X, Bell, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = (menuName: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedMenus(prev => {
        if (!prev.includes(menuName)) {
          return [...prev, menuName];
        }
        return prev;
      });
      return;
    }

    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(m => m !== menuName)
        : [...prev, menuName]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: { href: string }[]) =>
    children.some(child => location.pathname === child.href);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "A";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full relative">
      {/* Toggle Button for Desktop */}
      <div className="absolute -right-3 top-8 hidden lg:block z-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-full bg-white text-primary border border-primary/20 shadow-md hover:bg-primary hover:text-white transition-all duration-300"
        >
          {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className={cn("p-6 flex items-center gap-3 transition-all duration-300", isCollapsed ? "justify-center p-4" : "md:p-8")}>
        <div className={cn("relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-red-600 shadow-lg shadow-primary/25 transition-all duration-300", isCollapsed ? "h-10 w-10" : "h-10 w-10")}>
          <Shield className="h-6 w-6 text-white" />
        </div>
        {!isCollapsed && (
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-600 animate-in fade-in duration-300 whitespace-nowrap">
            HR Admin
          </span>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navigation.map((item) => {
          const Icon = item.icon;

          // Menu with children (dropdown)
          if ('children' in item && item.children) {
            const isExpanded = expandedMenus.includes(item.name) && !isCollapsed;
            const hasActiveChild = isParentActive(item.children);

            return (
              <div key={item.name} className="space-y-1">
                {isCollapsed ? (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => toggleMenu(item.name)}
                          className={cn(
                            "flex items-center justify-center p-3 rounded-2xl transition-all duration-300 cursor-pointer",
                            hasActiveChild
                              ? "bg-white/50 shadow-sm border border-white/40 text-primary font-medium"
                              : "text-muted-foreground hover:bg-white/30 hover:text-foreground"
                          )}>
                          <Icon className={cn("w-5 h-5", hasActiveChild ? "text-primary" : "")} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-white text-foreground border-white/20 shadow-xl">
                        <p>{item.name}</p>
                        {/* We could list children here too depending on UX preference, but simple tooltip is okay for now */}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
                      hasActiveChild
                        ? "bg-white/50 shadow-sm border border-white/40 text-primary font-medium"
                        : "text-muted-foreground hover:bg-white/30 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5 transition-colors", hasActiveChild ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                )}

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out pl-4",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden space-y-1 border-l-2 border-primary/20 ml-2 pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          "flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 text-sm",
                          isActive(child.href)
                            ? "bg-primary/10 text-primary font-medium shadow-sm"
                            : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                        )}
                      >
                        <span className="whitespace-nowrap">{child.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // Regular menu item
          return (
            isCollapsed ? (
              <TooltipProvider key={item.name} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href!}
                      className={cn(
                        "flex items-center justify-center p-3 rounded-2xl transition-all duration-300 group",
                        isActive(item.href!)
                          ? "bg-gradient-to-r from-primary to-red-600 text-white shadow-lg shadow-primary/25"
                          : "text-muted-foreground hover:bg-white/30 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive(item.href!) ? "text-white" : "group-hover:text-primary")} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white text-foreground border-white/20 shadow-xl">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                key={item.name}
                to={item.href!}
                className={cn(
                  "flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group",
                  isActive(item.href!)
                    ? "bg-gradient-to-r from-primary to-red-600 text-white shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-white/30 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive(item.href!) ? "text-white" : "group-hover:text-primary")} />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            )
          );
        })}
      </nav>

      <div className={cn("p-4 mb-4 mt-auto transition-all duration-300", isCollapsed ? "mx-2" : "mx-4")}>
        <div className={cn("glass-panel rounded-2xl border border-white/50 relative overflow-hidden group transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className={cn("flex items-center relative z-10", isCollapsed ? "justify-center" : "gap-3")}>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/50 shrink-0">
              {getInitials(user?.full_name)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.full_name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            className={cn(
              "mt-3 flex items-center justify-center gap-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all duration-300 relative z-20 cursor-pointer hover:shadow-sm",
              isCollapsed ? "w-10 h-10 p-0 mx-auto" : "w-full px-3 py-2 text-xs font-semibold"
            )}
            title="Sign Out"
          >
            <LogOut className={cn("w-3.5 h-3.5", isCollapsed ? "w-4 h-4" : "")} />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f0f4f8] text-foreground font-sans overflow-hidden">
      {/* Mobile Header (Visible on small screens) */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 h-16 glass-panel border-b border-white/20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">HR Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-xl active:scale-95 transition-transform bg-white/50">
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Main Layout Container */}
      <div className="flex w-full max-w-[1920px] mx-auto h-full p-0 lg:p-4 gap-4">

        {/* Desktop Sidebar (Hidden on mobile) */}
        <aside
          className={cn(
            "hidden lg:flex glass-panel rounded-[2rem] flex-col shadow-2xl shadow-black/5 ring-1 ring-white/50 bg-white/80 transition-all duration-300 ease-in-out relative z-30",
            isCollapsed ? "w-24" : "w-72"
          )}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar (Overlay) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-xl shadow-2xl p-0 flex flex-col animate-in slide-in-from-left duration-300">
              <div className="absolute top-4 right-4 z-50">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full bg-black/5 hover:bg-black/10">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 lg:pt-0 z-10">
          {/* Header/Searching/Notifications could go here */}

          <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-[2rem] lg:glass-panel lg:border lg:border-white/40 lg:bg-white/40 lg:shadow-inner scroll-smooth p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}