import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getLogged } from './utils/networks';
import useAuthState from './utils/state/authState';
import useUserState from './utils/state/userState';
import Loading from './components/general/utils/Loading';
import LayoutPages from './layout/Layout';
import DashboardPages from './pages/DashboardPages';
import VerifPages from './pages/VerifPages';
import ProfilePages from './pages/ProfilePages';
import StatisticPages from './pages/StatisticPages';
import PlaceDetailPages from './pages/PlaceDetailPages';
import { message } from 'antd';
import StatisticProfilePages from './pages/StatisticProfilePages';
import IntegratedCreateLocationPages from './pages/user/desktop/create-location/IntegratedCreateLocationPages';
import ManualCreateLocationPages from './pages/user/desktop/create-location/ManualCreateLocationPages';
import ManualUpdateLocationPages from './pages/user/desktop/update-location/ManualUpdateLocationPages';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PlaceTypePages from './pages/admin/PlaceTypePages';
import AddCoordinatePages from './pages/user/client/AddCoordinatePages';
import PlaceAccessPages from './pages/admin/PlaceAccessPages';
import UserRoleSettingPages from './pages/admin/UserRoleSettingPages';
import CompareMapPages from './pages/desktop/CompareMapPages';

const queryClient = new QueryClient();

const AuthRoute = () => {
  const authState = useAuthState();
  const userState = useUserState();
  const [notified, setNotified] = useState(false);

  const { data, error, isError, isFetching } = useQuery({
    queryKey: ['login'],
    queryFn: async () => await getLogged(),
    enabled: !!authState.accessToken,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;
    userState.setUser({
      role: data.role,
      name: data.username,
      exp: data.exp,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isError && !notified) {
      authState.deleteToken();
      userState.clearUser();

      message.open({
        type: 'error',
        content: 'Sesi Anda Telah Habis, Silahkan Masuk Kembali',
        duration: 5,
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      });
      setNotified(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, notified]);

  if (isFetching) return <Loading />;

  return data && !error ? <Outlet /> : <Navigate to={'/auth'} />;
};

const App: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Routes>
          <Route caseSensitive path="/" element={<AuthRoute />}>
            <Route element={<LayoutPages />}>
              <Route index element={<DashboardPages />} />
              <Route caseSensitive path="/profile" element={<ProfilePages />} />
              <Route
                caseSensitive
                path="/place-type-action"
                element={<PlaceTypePages />}
              />
              <Route
                caseSensitive
                path="/place-action"
                element={<PlaceAccessPages />}
              />
              <Route
                caseSensitive
                path="/user-action"
                element={<UserRoleSettingPages />}
              />
              <Route caseSensitive path="/location" element={<Outlet />}>
                <Route
                  caseSensitive
                  path="/location/new/desktop"
                  element={<IntegratedCreateLocationPages />}
                />
                <Route
                  caseSensitive
                  path="/location/new/client"
                  element={<AddCoordinatePages />}
                />
                <Route
                  caseSensitive
                  path="/location/new/manual"
                  element={<ManualCreateLocationPages />}
                />
                <Route
                  caseSensitive
                  path="/location/update/manual/:id"
                  element={<ManualUpdateLocationPages />}
                />
              </Route>
              <Route caseSensitive path="/statistic" element={<Outlet />}>
                <Route index element={<StatisticPages />} />
                <Route
                  caseSensitive
                  path="/statistic/user/:id"
                  element={<StatisticProfilePages />}
                />
                <Route
                  caseSensitive
                  path="/statistic/place/:id"
                  element={<PlaceDetailPages />}
                />
              </Route>
              <Route
                caseSensitive
                path="/compare-map"
                element={<CompareMapPages />}
              />
            </Route>
          </Route>
          <Route caseSensitive path="/auth" element={<VerifPages />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
};

export default App;
