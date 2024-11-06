import AdminDashboard from '@/components/general/dashboard/AdminDashboard';
import UserDashboard from '@/components/general/dashboard/UserDashboard';
import useUserState from '@/utils/state/userState';
import React from 'react';

const DashboardPages: React.FC = () => {
  const user = useUserState().role;
  return user ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardPages;
