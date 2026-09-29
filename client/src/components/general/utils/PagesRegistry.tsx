import { Outlet, RouteObject } from 'react-router-dom';
import PlaceTypePages from '@/pages/admin/PlaceTypePages';
import CompareAdminMapPages from '@/pages/admin/desktop/CompareAdminMapPages';
import PlaceAccessPages from '@/pages/admin/PlaceAccessPages';
import UserRoleSettingPages from '@/pages/super-admin/UserRoleSettingPages';
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
import MenuSettingPages from '@/pages/super-admin/menu-setting/MenuSettingPages';
import RoleAccessSettingPages from '@/pages/super-admin/role-setting/RoleAccessSettingPages';
import SuperAdminDashboardPages from '@/pages/super-admin/SuperAdminDashboardPages';
import UserActiveStatusSettingPages from '@/pages/admin/UserActiveStatusSettingPages';
import SuperAdminListPages from '../../../pages/super-admin/SuperAdminListPages';
import SuperAdminPlaceStatisticPages from '../../../pages/super-admin/SuperAdminPlaceStatisticPages';

type PageMenuConfig = {
  index: boolean;
  parentKey: string | null;
  element: React.ReactNode;
};

type PageRegistry = Record<string, Record<string, PageMenuConfig>>;

const pageRegistry: PageRegistry = {
  // Super Admin
  1: {
    dashboard: {
      index: true,
      parentKey: null,
      element: <SuperAdminDashboardPages />,
    },
    statistic: {
      index: false,
      parentKey: null,
      element: <Outlet />,
    },
    statistic_place: {
      index: false,
      parentKey: 'statistic',
      element: <SuperAdminPlaceStatisticPages />,
    },
    statistic_user: {
      index: false,
      parentKey: 'statistic',
      element: <SuperAdminListPages />,
    },
    place_type: {
      index: false,
      parentKey: null,
      element: <PlaceTypePages />,
    },
    place: {
      index: false,
      parentKey: null,
      element: <PlaceAccessPages />,
    },
    user_setting: {
      index: false,
      parentKey: null,
      element: <UserRoleSettingPages />,
    },
    compare_place: {
      index: false,
      parentKey: null,
      element: <CompareAdminMapPages />,
    },
    access: {
      index: false,
      parentKey: null,
      element: <Outlet />,
    },
    access_menu: {
      index: false,
      parentKey: 'access',
      element: <MenuSettingPages />,
    },
    access_role: {
      index: false,
      parentKey: 'access',
      element: <RoleAccessSettingPages />,
    },
  },
  // Admin
  2: {
    dashboard: {
      index: true,
      parentKey: null,
      element: <AdminDashboardPages />,
    },
    statistic: {
      index: false,
      parentKey: null,
      element: <Outlet />,
    },
    statistic_place: {
      index: false,
      parentKey: 'statistic',
      element: <PlaceStatisticPages />,
    },
    statistic_place_detail: {
      index: false,
      parentKey: 'statistic',
      element: <PlaceDetailPages />,
    },
    statistic_user: {
      index: false,
      parentKey: 'statistic',
      element: <AdminListPages />,
    },
    statistic_user_detail: {
      index: false,
      parentKey: 'statistic',
      element: <StatisticProfilePages />,
    },
    place_type: {
      index: false,
      parentKey: null,
      element: <PlaceTypePages />,
    },
    place: {
      index: false,
      parentKey: null,
      element: <PlaceAccessPages />,
    },
    user_setting: {
      index: false,
      parentKey: null,
      element: <UserActiveStatusSettingPages />,
    },
    compare_place: {
      index: false,
      parentKey: null,
      element: <CompareAdminMapPages />,
    },
  },
  // User
  3: {
    dashboard: {
      index: true,
      parentKey: null,
      element: <UserDashboardPages />,
    },
    statistic: {
      index: false,
      parentKey: null,
      element: <Outlet />,
    },
    statistic_place: {
      index: false,
      parentKey: 'statistic',
      element: <PlaceStatisticPages />,
    },
    statistic_place_detail: {
      index: false,
      parentKey: 'statistic',
      element: <PlaceDetailPages />,
    },
    statistic_user: {
      index: false,
      parentKey: 'statistic',
      element: <UserListPages />,
    },
    statistic_user_detail: {
      index: false,
      parentKey: 'statistic',
      element: <StatisticProfilePages />,
    },
    compare_place: {
      index: false,
      parentKey: null,
      element: <CompareUserMapPages />,
    },
    profile: {
      index: false,
      parentKey: null,
      element: <ProfilePages />,
    },
    location: {
      index: false,
      parentKey: null,
      element: <Outlet />,
    },
    new_desktop: {
      index: false,
      parentKey: 'location',
      element: <IntegratedCreateLocationPages />,
    },
    new_client: {
      index: false,
      parentKey: 'location',
      element: <AddCoordinatePages />,
    },
    new_manual: {
      index: false,
      parentKey: 'location',
      element: <ManualCreateLocationPages />,
    },
    update_manual: {
      index: false,
      parentKey: 'location',
      element: <ManualUpdateLocationPages />,
    },
  },
};

const buildRoutesFromRegistry = (
  roleCode: number,
  routeData: any[],
): RouteObject[] => {
  const roleRegistry = pageRegistry[String(roleCode)] ?? {};

  const routeMapping: RouteObject[] = routeData
    .map((route) => {
      const registryEntry = roleRegistry[route.pathKey];

      if (!registryEntry) return null;

      const children: RouteObject[] | undefined = route.children
        ?.map((child: any) => {
          // Important: use roleRegistry
          const childRegistry = roleRegistry[child.pathKey];

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
