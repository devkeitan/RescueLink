import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import SidebarLayout from '@/layouts/SidebarLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import LiveMap from '@/pages/LiveMap';
import Logs from '@/pages/Logs';
import Settings from '@/pages/Settings';
import Users from '@/pages/Users';
import Alerts from '@/pages/Alerts';
import Register from '@/pages/Register';
import Vehicles from '@/pages/Vehicles';
import ReportAccident from '@/pages/ReportAccident';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
   {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <SidebarLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/map', element: <LiveMap /> },
          { path: '/users', element: <Users /> },
          {path: '/vehicles', element: <Vehicles /> },
          { path: '/settings', element: <Settings /> },
          { path: '/logs', element: <Logs /> },
          { path: '/alerts', element: <Alerts /> },
          {path: '/report-accident', element: <ReportAccident /> }
        ],
      },
    ],
  },
]);
