import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  DollarSign,
  LifeBuoy,
  LogOut,
  Shield,
  Users2,
  BarChart3,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import "./styles/Sidebar.css";

interface SidebarProps {
  user: any;
  isAdmin: boolean;
}

interface SimpleMenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge: number | null;
}

interface SubmenuItem {
  label: string;
  path: string;
  icon: any;
}

interface MenuSection {
  id: string;
  label: string;
  icon: any;
  submenu: SubmenuItem[];
  visible?: boolean;
}

type MenuItem = SimpleMenuItem | MenuSection;

const Sidebar: React.FC<SidebarProps> = ({ user, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/dashboard",
      badge: null,
    },
    {
      id: "admin",
      label: "Quản trị viên",
      icon: Shield,
      submenu: [
        { label: "Quản lý nhân viên", path: "/admin/staff", icon: Users2 },
        { label: "Web Log", path: "/admin/logs", icon: BarChart3 },
      ],
      visible: isAdmin,
    },
    {
      id: "management",
      label: "Quản lý chung",
      icon: BarChart3,
      submenu: [
        { label: "Người dùng", path: "/users", icon: Users },
        { label: "Thanh toán", path: "/payments", icon: DollarSign },
        { label: "Hỗ trợ", path: "/support", icon: LifeBuoy },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* User Profile */}
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email?.split("@")[0] || "Staff"}
            </h3>
            <p className="profile-role">
              {isAdmin ? "🔐 Quản trị viên" : "👤 Nhân viên"}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            if ("submenu" in item) {
              if (item.visible === false) return null;

              return (
                <div key={item.id} className="nav-section">
                  <button
                    className={`nav-section-title ${
                      expandedMenu === item.id ? "expanded" : ""
                    }`}
                    onClick={() => toggleMenu(item.id)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    <ChevronDown size={16} className="chevron" />
                  </button>

                  {expandedMenu === item.id && (
                    <div className="nav-submenu">
                      {item.submenu.map((subitem) => (
                        <button
                          key={subitem.path}
                          className={`nav-link ${
                            isActive(subitem.path) ? "active" : ""
                          }`}
                          onClick={() => {
                            navigate(subitem.path);
                            setIsOpen(false);
                          }}
                        >
                          <subitem.icon size={18} />
                          <span>{subitem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
