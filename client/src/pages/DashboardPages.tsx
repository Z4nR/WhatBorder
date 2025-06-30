import React from 'react';
import AdminDashboard from '@/components/general/dashboard/admin/AdminDashboard';
import UserDashboard from '@/components/general/dashboard/user/UserDashboard';
import useUserState from '@/utils/state/userState';

const DashboardPages: React.FC = () => {
  const role = useUserState().role;
  return role === 3 ? <UserDashboard /> : <AdminDashboard />;
};

export default DashboardPages;
