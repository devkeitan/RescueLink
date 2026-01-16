import { useState } from "react";
import {
  Home, Users, Palmtree, Briefcase, CardSim, UserCog,
  X, ChevronDown, ChevronsLeft, ChevronsRight, ShieldCheck,
  Printer,
  Map
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';

const sidebarItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/map", label: "Live Map", icon: Map },
  { path: "/user-management", label: "User Management", icon: UserCog },
  { path: "/audit-logs", label: "Audit Logs", icon: ShieldCheck },
];

const Sidebar = ({ isOpen, setIsOpen, activePath, onNavigate }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSubmenu = (path) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderMenu = (items, level = 0) => {
    return items.map((item) => {
      const Icon = item.icon;
      const hasChildren = item.children && item.children.length > 0;
      const isActive = activePath === item.path;
      const isOpenSubmenu = openSubmenus[item.path];

      return (
        <div key={item.path || item.label} className={cn(!isCollapsed && `ml-${level * 4}`)}>
          <Link 
            to={item.path} 
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-lg transition-colors",
              isActive
                ? "bg-red-50 text-red-600 font-medium"
                : "text-gray-700 hover:bg-gray-100",
              isCollapsed ? "justify-center" : "space-x-3"
            )}
            title={isCollapsed ? item.label : ""}
          >
            {Icon && <Icon className="h-5 w-5" />}
            {!isCollapsed && <span>{item.label}</span>}
            {!isCollapsed && hasChildren && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 ml-auto transition-transform",
                  isOpenSubmenu ? "rotate-180" : "rotate-0"
                )}
              />
            )}
          </Link>

          {hasChildren && isOpenSubmenu && !isCollapsed && (
            <div className="space-y-2 mt-2">
              {renderMenu(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed h-screen md:relative md:h-auto z-40 bg-white border-r border-gray-200 flex flex-col transform transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Desktop collapse button */}
        <div className="hidden md:flex justify-end p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            {isCollapsed ? (
              <ChevronsRight className="w-5 h-5" />
            ) : (
              <ChevronsLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile header */}
        <div className="p-6 flex justify-between items-center md:hidden border-b border-gray-200">
          <h2 className="text-gray-900 font-semibold text-lg">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Scrollable menu */}
        <nav className={cn("flex-1 p-4 space-y-2 overflow-y-auto")}>
          {renderMenu(sidebarItems)}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
