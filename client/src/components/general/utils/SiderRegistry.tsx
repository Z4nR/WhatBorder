import { Link } from 'react-router-dom';
import { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  BlockOutlined,
  FundViewOutlined,
} from '@ant-design/icons';

const pageRegistry: Record<
  string,
  {
    path: string | null;
    aside: boolean;
    parentKey: string | null;
    icon: React.ReactNode | null;
  }
> = {
  dashboard_admin: {
    path: '/',
    aside: true,
    parentKey: null,
    icon: <AppstoreOutlined />,
  },
  place_type_admin: {
    path: '/place-type',
    aside: false,
    parentKey: null,
    icon: null,
  },
  place_admin: {
    path: '/place',
    aside: false,
    parentKey: null,
    icon: null,
  },
  user_admin: {
    path: '/user',
    aside: false,
    parentKey: null,
    icon: null,
  },
  compare_admin: {
    path: '/compare-map',
    aside: true,
    parentKey: null,
    icon: <BlockOutlined />,
  },
  dashboard_user: {
    path: '/',
    aside: true,
    parentKey: null,
    icon: <AppstoreOutlined />,
  },
};

type MenuItem = Required<MenuProps>['items'][number];

const buildSiderMenuItems = (routeData: any[]): MenuItem[] => {
  const siderMapping: MenuItem[] = routeData
    .map((route) => {
      const registryEntry = pageRegistry[route.pathKey];
      if (!registryEntry) return null;
      if (!registryEntry.aside) return null;

      const children: MenuItem[] | undefined = route.children
        ?.map((child: any) => {
          const childRegistry = pageRegistry[child.pathKey];
          if (!childRegistry) return null;
          if (!childRegistry.aside) return null;

          return {
            key: child.pathKey,
            label: (
              <Link to={childRegistry.path ?? '#'}>{child.routeName}</Link>
            ),
            icon: childRegistry.icon ?? undefined,
          } as MenuItem;
        })
        .filter(Boolean) as MenuItem[];

      return {
        key: route.pathKey,
        label: <Link to={registryEntry.path ?? '#'}>{route.routeName}</Link>,
        icon: registryEntry.icon ?? undefined,
        children: children && children.length > 0 ? children : undefined,
      } as MenuItem;
    })
    .filter(Boolean) as MenuItem[];

  return siderMapping;
};

export default buildSiderMenuItems;
