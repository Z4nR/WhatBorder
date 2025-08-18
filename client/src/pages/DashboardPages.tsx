import React from 'react';
import AdminDashboard from '@/components/general/dashboard/admin/AdminDashboard';
import UserDashboard from '@/components/general/dashboard/user/UserDashboard';
import useUserState from '@/utils/state/userState';
import Loading from '@/components/general/utils/Loading';

const DashboardPages: React.FC = () => {
  const role = useUserState().role;

  if (role === undefined || role === null) {
    // while role is still loading, don't render dashboards
    return <Loading />;
  }

  return role === 3 ? <UserDashboard /> : <AdminDashboard />;
};

export default DashboardPages;
