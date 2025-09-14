import { Outlet, RouteObject } from 'react-router-dom';
import PlaceTypePages from '@/pages/admin/PlaceTypePages';
import CompareAdminMapPages from '@/pages/admin/desktop/CompareAdminMapPages';
import PlaceAccessPages from '@/pages/admin/PlaceAccessPages';
import UserRoleSettingPages from '@/pages/admin/UserRoleSettingPages';
import AdminDashboardPages from '@/pages/admin/AdminDashboardPages';
import UserDashboardPages from '@/pages/user/UserDashboardPages';
import PlaceDetailPages from '@/pages/PlaceDetailPages';
import StatisticProfilePages from '@/pages/StatisticProfilePages';
import CompareUserMapPages from '@/pages/user/desktop/compare-map/CompareUserMapPages';
import ProfilePages from '@/pages/ProfilePages';
import IntegratedCreateLocationPages from '@/pages/user/desktop/create-location/IntegratedCreateLocationPages';
import AddCoordinatePages from '@/pages/user/client/AddCoordinatePages';
import ManualCreateLocationPages from '@/pages/user/desktop/create-location/ManualCreateLocationPages';
import ManualUpdateLocationPages from '@/pages/user/desktop/update-location/ManualUpdateLocationPages';
import AdminListPages from '@/pages/admin/AdminListPages';
import UserListPages from '@/pages/user/UserListPages';
import PlaceStatisticPages from '@/pages/PlaceStatisticPages';

const pageRegistry: Record<
  string,
  {
    index: boolean;
    parentKey: string | null;
    element: React.ReactNode;
  }
> = {
  // Super Admin
  dashboard_super_admin: {
    index: true,
    parentKey: null,
    element: <AdminDashboardPages />,
  },
  place_type_super_admin: {
    index: false,
    parentKey: null,
    element: <PlaceTypePages />,
  },
  place_super_admin: {
    index: false,
    parentKey: null,
    element: <PlaceAccessPages />,
  },
  user_super_admin: {
    index: false,
    parentKey: null,
    element: <UserRoleSettingPages />,
  },
  setup_web_super_admin: {
    index: false,
    parentKey: null,
    element: <Outlet />,
  },
  setup_web_menu_super_admin: {
    index: false,
    parentKey: null,
    element: <p>Comingsoon</p>,
  },
  setup_web_role_super_admin: {
    index: false,
    parentKey: null,
    element: <p>Comingsoon</p>,
  },
  statistic_super_admin: {
    index: false,
    parentKey: null,
    element: <Outlet />,
  },
  statistic_place_super_admin: {
    index: false,
    parentKey: 'statistic_admin',
    element: <PlaceStatisticPages />,
  },
  statistic_user_super_admin: {
    index: false,
    parentKey: 'statistic_admin',
    element: <AdminListPages />,
  },
  // Admin
  dashboard_admin: {
    index: true,
    parentKey: null,
    element: <AdminDashboardPages />,
  },
  place_type_admin: {
    index: false,
    parentKey: null,
    element: <PlaceTypePages />,
  },
  place_admin: {
    index: false,
    parentKey: null,
    element: <PlaceAccessPages />,
  },
  user_admin: {
    index: false,
    parentKey: null,
    element: <UserRoleSettingPages />,
  },
  statistic_admin: {
    index: false,
    parentKey: null,
    element: <Outlet />,
  },
  statistic_place_admin: {
    index: false,
    parentKey: 'statistic_admin',
    element: <PlaceStatisticPages />,
  },
  statistic_place_id_admin: {
    index: false,
    parentKey: 'statistic_admin',
    element: <PlaceDetailPages />,
  },
  statistic_user_admin: {
    index: false,
    parentKey: 'statistic_admin',
    element: <AdminListPages />,
  },
  statistic_user_id_admin: {
    index: false,
    parentKey: 'statistic_admin',
    element: <StatisticProfilePages />,
  },
  compare_admin: {
    index: false,
    parentKey: null,
    element: <CompareAdminMapPages />,
  },
  // User
  dashboard_user: {
    index: true,
    parentKey: null,
    element: <UserDashboardPages />,
  },
  profile_user: {
    index: false,
    parentKey: null,
    element: <ProfilePages />,
  },
  location_user: {
    index: false,
    parentKey: null,
    element: <Outlet />,
  },
  new_desktop_user: {
    index: false,
    parentKey: 'location_user',
    element: <IntegratedCreateLocationPages />,
  },
  new_client_user: {
    index: false,
    parentKey: 'location_user',
    element: <AddCoordinatePages />,
  },
  new_manual_user: {
    index: false,
    parentKey: 'location_user',
    element: <ManualCreateLocationPages />,
  },
  update_manual_user: {
    index: false,
    parentKey: 'location_user',
    element: <ManualUpdateLocationPages />,
  },
  statistic_user: {
    index: false,
    parentKey: null,
    element: <Outlet />,
  },
  statistic_place_user: {
    index: false,
    parentKey: 'statistic_user',
    element: <PlaceStatisticPages />,
  },
  statistic_place_id_user: {
    index: false,
    parentKey: 'statistic_user',
    element: <PlaceDetailPages />,
  },
  statistic_user_user: {
    index: false,
    parentKey: 'statistic_user',
    element: <UserListPages />,
  },
  statistic_user_id_user: {
    index: false,
    parentKey: 'statistic_user',
    element: <StatisticProfilePages />,
  },
  compare_user: {
    index: false,
    parentKey: null,
    element: <CompareUserMapPages />,
  },
};

const buildRoutesFromRegistry = (routeData: any[]): RouteObject[] => {
  const routeMapping: RouteObject[] = routeData
    .map((route) => {
      const registryEntry = pageRegistry[route.pathKey];
      if (!registryEntry) return null;

      const children: RouteObject[] | undefined = route.children
        ?.map((child: any) => {
          const childRegistry = pageRegistry[child.pathKey];
          if (!childRegistry) return null;
          return {
            path: child.path,
            index: childRegistry.index,
            element: childRegistry.element,
          } as RouteObject;
        })
        .filter(Boolean) as RouteObject[];

      return {
        path: route.path,
        index: registryEntry.index,
        element: registryEntry.element,
        children: children && children.length > 0 ? children : undefined,
      } as RouteObject;
    })
    .filter(Boolean) as RouteObject[];

  return routeMapping;
};

export default buildRoutesFromRegistry;
