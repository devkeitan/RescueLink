import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleNavigate = (path) => {
    // Navigation is handled by Link components, this can be empty or handle custom logic
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with menu toggle */}
      <TopNav onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          activePath={location.pathname}
          onNavigate={handleNavigate}
        />
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;