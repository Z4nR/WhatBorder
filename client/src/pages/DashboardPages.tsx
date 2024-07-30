import AdminDashboard from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import useUserState from '@/utils/state/user/userState';

const DashboardPages: React.FC = () => {
  const user = useUserState().role;
  return user ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardPages;
