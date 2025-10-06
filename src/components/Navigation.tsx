import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

type Role = "ADMIN" | "CLIENT";

interface NavigationProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const Navigation = ({ currentRole, onRoleChange }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuth, profile, userId } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const mockNotifications = [
    { id: 1, text: "Nuevo evento creado", time: "hace 2 min" },
    { id: 2, text: "Catálogo actualizado", time: "hace 5 min" },
    { id: 3, text: "Recordatorio: Reunión a las 2pm", time: "hace 10 min" },
    { id: 4, text: "Usuario registrado", time: "hace 15 min" },
    { id: 5, text: "Sincronización de calendario completada", time: "hace 20 min" },
  ];

  const adminMenuItems = [
    { name: "Eventos", path: "/events" },
    { name: "Catalogos", path: "/catalogs" },
    { name: "Usuarios", path: "/users" },
    { name: "Calendario", path: "/calendar" },
  ];

  const clientMenuItems = [
    { name: "Eventos", path: "/events" },
    { name: "Calendario", path: "/calendar" },
  ];

  const menuItems = currentRole === "ADMIN" ? adminMenuItems : clientMenuItems;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showNotifications]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  const isActivePath = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Clear auth state
    clearAuth();
    // Delete JWT cookie (if any)
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to login
    navigate("/login");
  };

  // Get user initials for avatar
  const userInitials = profile ? profile.substring(0, 2).toUpperCase() : "U";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-card backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Center/Left: Role-based menu */}
          <div className="hidden md:flex items-center space-x-8 ml-10">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? "bg-primary/10 text-primary border-b-2 border-primary"
                    : "text-foreground hover:text-primary hover:bg-accent/30"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: Notifications, Role Switcher and User Profile */}
          <div className="flex items-center space-x-4">
            {/* Dev Role Switcher */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-secondary/30 border border-border/30">
              <span className="text-xs text-muted-foreground">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as Role)}
                className="text-xs bg-transparent border-none outline-none text-foreground"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="CLIENT">CLIENT</option>
              </select>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-border/30">
                      <h3 className="font-semibold text-foreground">Notificaciones</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-border/20 hover:bg-accent/20 transition-smooth cursor-pointer"
                        >
                          <p className="text-sm text-foreground">{notification.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gradient-card backdrop-blur-lg border-border/50" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{profile || "Usuario"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      ID: {userId || "N/A"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-foreground hover:bg-accent/20 cursor-pointer"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:text-primary hover:bg-accent/30"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;