/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LayoutPages from './layout/Layout';
import VerifPages from './pages/VerifPages';
import Loading from './components/general/utils/Loading';
import { getLogged, getRoute } from './utils/networks';
import useAuthState from './utils/state/authState';
import useUserState from './utils/state/userState';
import { message } from 'antd';
import buildRoutesFromRegistry from './components/general/utils/PagesRegistry';
import NotFoundPages from './pages/NotFoundPages';

const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authState = useAuthState();
  const userState = useUserState();
  const [notified, setNotified] = useState(false);

  const { data, error, isError, isFetching } = useQuery({
    queryKey: ['login'],
    queryFn: async () => await getLogged(),
    enabled: !!authState.accessToken,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  useEffect(() => {
    if (data) {
      userState.setUser({
        name: data.username,
        exp: data.exp,
      });
    }
  }, [data]);

  useEffect(() => {
    if (isError && !notified) {
      authState.deleteToken();
      userState.clearUser();

      message.error('Sesi Anda Telah Habis, Silahkan Masuk Kembali', 5);
      setNotified(true);
    }
  }, [isError, notified]);

  if (isFetching) return <Loading />;

  return data && !error ? <>{children}</> : <Navigate to="/auth" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useAuthState();

  if (authState.accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => await getRoute(),
    enabled: !!useAuthState().accessToken,
  });

  const routeData = data ? buildRoutesFromRegistry(data) : [];

  const routes = [
    {
      path: '/',
      element: (
        <PrivateRoute>
          <LayoutPages />
        </PrivateRoute>
      ),
      children: routeData,
    },
    {
      path: '/auth',
      element: (
        <PublicRoute>
          <VerifPages />
        </PublicRoute>
      ),
    },
    { path: '*', element: <NotFoundPages /> },
  ];

  const element = useRoutes(routes);

  if (isLoading) return <Loading />;

  return element;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />

      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
