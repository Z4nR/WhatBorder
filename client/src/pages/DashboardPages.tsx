import React from 'react';
import AdminDashboard from '@/components/general/dashboard/admin/AdminDashboard';
import UserDashboard from '@/components/general/dashboard/user/UserDashboard';
import useUserState from '@/utils/state/userState';

const DashboardPages: React.FC = () => {
  const user = useUserState().role;
  return user ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardPages;
