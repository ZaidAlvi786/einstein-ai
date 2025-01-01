import { Outlet } from 'react-router-dom';

export const AuthLayout = () => (
  <div className="bg-white min-h-screen">
    <Outlet />
  </div>
);
