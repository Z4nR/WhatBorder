import React from 'react';
import AdminDashboard from '@/components/general/dashboard/admin/AdminDashboard';
import UserDashboard from '@/components/general/dashboard/user/UserDashboard';
import useUserState from '@/utils/state/userState';
import { Spin } from 'antd';

const DashboardPages: React.FC = () => {
  const role = useUserState().role;

  if (role === undefined || role === null) {
    // while role is still loading, don't render dashboards
    return (
      <div style={{ minHeight: '100dvh' }}>
        <Spin style={{ margin: '0 auto' }} tip="Memuat..." size="large">
          <div className="content" />
        </Spin>
      </div>
    );
  }

  return role === 3 ? <UserDashboard /> : <AdminDashboard />;
};

export default DashboardPages;
