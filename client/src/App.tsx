import React, { useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getLogged } from './utils/networks';
import useAuthState from './utils/state/auth/authState';
import useUserState from './utils/state/user/userState';
import LoginPages from './pages/LoginPages';
import LayoutPages from './layout/Layout';
import DashboardPages from './pages/DashboardPages';
import CompareMapPages from './pages/CompareMapPages';
import PlaceListPages from './pages/PlaceListPages';

const queryClient = new QueryClient();

const AuthRoute = () => {
  const authState = useAuthState();
  const userState = useUserState();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await getLogged(),
    enabled: !!authState.accessToken,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    const d = data;
    if (!d) return;
    userState.setUser({
      id: d.id,
      name: d.username,
      exp: d.exp,
    });
  }, [data]);

  if (isError) {
    authState.deleteToken();
    userState.clearUser();
  }

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
              <Route path="/place-list" element={<PlaceListPages />} />
              <Route path="/compare-map" element={<CompareMapPages />} />
            </Route>
          </Route>
          <Route path="/auth" element={<LoginPages />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
};

export default App;
