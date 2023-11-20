import React from 'react';
import { Layout, Spin } from 'antd';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLogged } from './utils/networks';
import LoginPages from './pages/LoginPages';
import LayoutPages from './layout/Layout';
import DashboardPages from './pages/DashboardPages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthState from './utils/state/auth/authState';

const queryClient = new QueryClient();

const AuthRoute = () => {
  const authState = useAuthState();
  console.log(authState);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await getLogged(),
    enabled: !!authState.accessToken,
  });

  if (isError) authState.deleteToken();

  if (isLoading)
    return (
      <Layout
        style={{
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Spin style={{ margin: '0 auto' }} tip="Loading..." size="large">
          <div className="content" />
        </Spin>
      </Layout>
    );

  console.log(data);

  return data && !error ? <Outlet /> : <Navigate to={'/auth'} />;
};

const App: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<AuthRoute />}>
            <Route element={<LayoutPages />}>
              <Route index element={<DashboardPages />} />
            </Route>
          </Route>
          <Route path="/auth" element={<LoginPages />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
};

export default App;
