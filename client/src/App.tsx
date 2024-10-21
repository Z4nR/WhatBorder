import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getLogged } from './utils/networks';
import useAuthState from './utils/state/auth/authState';
import useUserState from './utils/state/user/userState';
import Loading from './components/general/utils/Loading';
import LayoutPages from './layout/Layout';
import DashboardPages from './pages/DashboardPages';
import CompareMapPages from './pages/desktop/CompareMapPages';
import VerifPages from './pages/VerifPages';
import ProfilePages from './pages/ProfilePages';
import StatisticPages from './pages/StatisticPages';
import PlaceDetailPages from './pages/PlaceDetailPages';
import { message } from 'antd';
import AddCoordinatePages from './pages/client/AddCoordinatePages';
import CreateLocationPages from './pages/desktop/CreateLocationPages';

const queryClient = new QueryClient();

const AuthRoute = () => {
  const authState = useAuthState();
  const userState = useUserState();
  const [notified, setNotified] = useState(false);

  const { data, error, isError, isFetching } = useQuery({
    queryKey: ['login', authState.accessToken],
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
        content: 'Sesi Anda Telah Habis, Silahkan Login Kembali',
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
        <Routes>
          <Route path="/" element={<AuthRoute />}>
            <Route element={<LayoutPages />}>
              <Route index element={<DashboardPages />} />
              <Route path="/statistic" element={<StatisticPages />} />
              <Route path="/compare-map" element={<CompareMapPages />} />
              <Route path="/profile" element={<ProfilePages />} />
              <Route path="/:id/detail" element={<PlaceDetailPages />} />
              <Route path="/location/new" element={<CreateLocationPages />} />
              <Route
                path="/location/new/coordinate"
                element={<AddCoordinatePages />}
              />
            </Route>
          </Route>
          <Route path="/auth" element={<VerifPages />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
};

export default App;
