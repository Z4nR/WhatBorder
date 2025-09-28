import { Link } from 'react-router-dom';
import { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  BlockOutlined,
  FundViewOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  IdcardOutlined,
  AppstoreAddOutlined,
  GroupOutlined,
} from '@ant-design/icons';

const pageRegistry: Record<
  string,
  {
    order?: number | null;
    parentKey?: string | null;
    icon?: React.ReactNode | null;
  }
> = {
  // Super Admin
  dashboard_super_admin: {
    order: 1,
    parentKey: null,
    icon: <AppstoreOutlined />,
  },
  access_super_admin: {
    order: 2,
    parentKey: null,
    icon: <GroupOutlined />,
  },
  access_menu_super_admin: {
    order: 1,
    parentKey: null,
    icon: <AppstoreAddOutlined />,
  },
  access_role_super_admin: {
    order: 2,
    parentKey: null,
    icon: <IdcardOutlined />,
  },
  statistic_super_admin: {
    order: 3,
    parentKey: null,
    icon: <FundViewOutlined />,
  },
  statistic_place_super_admin: {
    order: 1,
    parentKey: 'statistic_admin',
    icon: <EnvironmentOutlined />,
  },
  statistic_user_super_admin: {
    order: 2,
    parentKey: 'statistic_admin',
    icon: <TeamOutlined />,
  },
  // Admin
  dashboard_admin: {
    order: 1,
    parentKey: null,
    icon: <AppstoreOutlined />,
  },
  statistic_admin: {
    order: 2,
    parentKey: null,
    icon: <FundViewOutlined />,
  },
  statistic_place_admin: {
    order: 1,
    parentKey: 'statistic_admin',
    icon: <EnvironmentOutlined />,
  },
  statistic_user_admin: {
    order: 2,
    parentKey: 'statistic_admin',
    icon: <TeamOutlined />,
  },
  compare_admin: {
    order: 3,
    parentKey: null,
    icon: <BlockOutlined />,
  },
  // User
  dashboard_user: {
    order: 1,
    parentKey: null,
    icon: <AppstoreOutlined />,
  },
  statistic_user: {
    order: 2,
    parentKey: null,
    icon: <FundViewOutlined />,
  },
  statistic_place_user: {
    order: 1,
    parentKey: 'statistic_user',
    icon: <EnvironmentOutlined />,
  },
  statistic_user_user: {
    order: 2,
    parentKey: 'statistic_user',
    icon: <TeamOutlined />,
  },
  compare_user: {
    order: 3,
    parentKey: null,
    icon: <BlockOutlined />,
  },
};

type MenuItem = Required<MenuProps>['items'][number];

const buildSiderMenuItems = (routeData: any[]): MenuItem[] => {
  const siderMapping: (MenuItem & { order: number })[] = routeData
    .map((route) => {
      const registryEntry = pageRegistry[route.pathKey];
      if (!registryEntry) return null;

      const children: (MenuItem & { order: number })[] | undefined =
        route.children
          ?.map((child: any) => {
            const childRegistry = pageRegistry[child.pathKey];
            if (!childRegistry) return null;

            return {
              key: child.pathKey,
              label: <Link to={child.side}>{child.routeName}</Link>,
              icon: childRegistry.icon ?? undefined,
              order: childRegistry.order ?? Number.MAX_SAFE_INTEGER,
            } as MenuItem & { order: number };
          })
          .filter(Boolean) as (MenuItem & { order: number })[];

      // sort children if exist
      const sortedChildren =
        children && children.length > 0
          ? children.sort((a, b) => a.order - b.order)
          : undefined;

      return {
        key: route.pathKey,
        label: <Link to={route.side}>{route.routeName}</Link>,
        icon: registryEntry.icon ?? undefined,
        children: sortedChildren,
        order: registryEntry.order ?? Number.MAX_SAFE_INTEGER,
      } as MenuItem & { order: number };
    })
    .filter(Boolean) as (MenuItem & { order: number })[];

  // sort parents
  siderMapping.sort((a, b) => a.order - b.order);

  return siderMapping;
};

export default buildSiderMenuItems;
