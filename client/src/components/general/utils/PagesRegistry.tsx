import { RouteObject } from 'react-router-dom';
import PlaceTypePages from '@/pages/admin/PlaceTypePages';
import CompareAdminMapPages from '@/pages/admin/desktop/CompareAdminMapPages';
import PlaceAccessPages from '@/pages/admin/PlaceAccessPages';
import UserRoleSettingPages from '@/pages/admin/UserRoleSettingPages';
import AdminDashboardPages from '@/pages/admin/AdminDashboardPages';
import UserDashboardPages from '@/pages/user/UserDashboardPages';

const pageRegistry: Record<
  string,
  {
    path: string | null;
    index: boolean;
    parentKey: string | null;
    element: React.ReactNode;
  }
> = {
  dashboard_admin: {
    path: null,
    index: true,
    parentKey: null,
    element: <AdminDashboardPages />,
  },
  place_type_admin: {
    path: 'place-type',
    index: false,
    parentKey: null,
    element: <PlaceTypePages />,
  },
  place_admin: {
    path: 'place',
    index: false,
    parentKey: null,
    element: <PlaceAccessPages />,
  },
  user_admin: {
    path: 'user',
    index: false,
    parentKey: null,
    element: <UserRoleSettingPages />,
  },
  compare_admin: {
    path: 'compare-map',
    index: false,
    parentKey: null,
    element: <CompareAdminMapPages />,
  },
  dashboard_user: {
    path: null,
    index: true,
    parentKey: null,
    element: <UserDashboardPages />,
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
            path: childRegistry.path ?? undefined,
            index: childRegistry.index,
            element: childRegistry.element,
          } as RouteObject;
        })
        .filter(Boolean) as RouteObject[];

      return {
        path: registryEntry.path ?? undefined,
        index: registryEntry.index,
        element: registryEntry.element,
        children: children && children.length > 0 ? children : undefined,
      } as RouteObject;
    })
    .filter(Boolean) as RouteObject[];

  return routeMapping;
};

export default buildRoutesFromRegistry;
