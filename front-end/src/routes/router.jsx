import { createBrowserRouter } from 'react-router-dom';
import SidebarLayout from '@/layouts/SidebarLayout';
import Dashboard from '@/pages/Dashboard';
import LiveMap from '@/pages/LiveMap';

export const router = createBrowserRouter([
  {
    element: <SidebarLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/map', element: <LiveMap /> }
    ],
  },
]);