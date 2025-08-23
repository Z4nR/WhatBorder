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
// import DashboardPages from './pages/DashboardPages';
// import ProfilePages from './pages/ProfilePages';
// import StatisticPages from './pages/StatisticPages';
// import PlaceDetailPages from './pages/PlaceDetailPages';
// import StatisticProfilePages from './pages/StatisticProfilePages';
// import IntegratedCreateLocationPages from './pages/user/desktop/create-location/IntegratedCreateLocationPages';
// import ManualCreateLocationPages from './pages/user/desktop/create-location/ManualCreateLocationPages';
// import ManualUpdateLocationPages from './pages/user/desktop/update-location/ManualUpdateLocationPages';
// import PlaceTypePages from './pages/admin/PlaceTypePages';
// import AddCoordinatePages from './pages/user/client/AddCoordinatePages';
// import PlaceAccessPages from './pages/admin/PlaceAccessPages';
// import UserRoleSettingPages from './pages/admin/UserRoleSettingPages';
// import CompareMapPages from './pages/desktop/CompareMapPages';
import { getLogged, getRoute } from './utils/networks';
import useAuthState from './utils/state/authState';
import useUserState from './utils/state/userState';
import { message } from 'antd';
import Loading from './components/general/utils/Loading';
import buildRoutesFromRegistry from './components/general/utils/PagesRegistry';

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
        role: data.role,
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
  console.log('Routes:', data);

  const routeData = data ? buildRoutesFromRegistry(data) : [];
  console.log('Built Routes:', routeData);

  // const routes = [
  //   {
  //     path: '/',
  //     element: (
  //       <PrivateRoute>
  //         <LayoutPages />
  //       </PrivateRoute>
  //     ),
  //     children: [
  //       { index: true, element: <DashboardPages /> },
  //       { path: 'profile', element: <ProfilePages /> },
  //       { path: 'place-type-action', element: <PlaceTypePages /> },
  //       { path: 'place-action', element: <PlaceAccessPages /> },
  //       { path: 'user-action', element: <UserRoleSettingPages /> },
  //       {
  //         path: 'location',
  //         children: [
  //           { path: 'new/desktop', element: <IntegratedCreateLocationPages /> },
  //           { path: 'new/client', element: <AddCoordinatePages /> },
  //           { path: 'new/manual', element: <ManualCreateLocationPages /> },
  //           {
  //             path: 'update/manual/:id',
  //             element: <ManualUpdateLocationPages />,
  //           },
  //         ],
  //       },
  //       {
  //         path: 'statistic',
  //         children: [
  //           { index: true, element: <StatisticPages /> },
  //           { path: 'user/:id', element: <StatisticProfilePages /> },
  //           { path: 'place/:id', element: <PlaceDetailPages /> },
  //         ],
  //       },
  //       { path: 'compare-map', element: <CompareMapPages /> },
  //     ],
  //   },
  //   {
  //     path: '/auth',
  //     element: (
  //       <PublicRoute>
  //         <VerifPages />
  //       </PublicRoute>
  //     ),
  //   },
  //   { path: '*', element: <Navigate to="/" replace /> },
  // ];

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
    { path: '*', element: <Navigate to="/" replace /> },
  ];

  const element = useRoutes(routes);

  if (isLoading) return <div>Loading...</div>;

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
