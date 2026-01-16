import { Bell, User, AlertTriangle, Menu } from 'lucide-react';

export function TopNav({ onMenuClick }) {
  return (
  <nav className="bg-white border-b border-gray-200 z-[60] h-16">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-white" size={20} />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              RescueLink Response System
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={18} className="text-gray-700" />
            </div>
            <span className="hidden sm:inline text-sm text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </nav>
  );
}