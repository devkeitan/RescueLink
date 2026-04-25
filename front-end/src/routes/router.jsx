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
import History from '@/pages/alerts/History';
import ResetPassword from '@/pages/ResetPassword';
import ForgotPassword from '@/pages/ForgotPassword';

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
    path: '/reset-password',
    element: <ResetPassword />,
  },
   {
    path: '/forgot-password',
    element: <ForgotPassword/>,
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
          { path: '/logs', element: <Logs /> },
          { path: '/alerts/active', element: <Alerts /> },
          {path: '/alerts/history', element: <History /> },
          {path: '/report-accident', element: <ReportAccident /> }
        ],
      },
    ],
  },
]);
