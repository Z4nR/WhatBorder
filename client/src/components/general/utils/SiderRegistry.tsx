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

type SideMenuConfig = {
  order?: number | null;
  parentKey?: string | null;
  icon?: React.ReactNode | null;
};

type SideRegistry = Record<string, Record<string, SideMenuConfig>>;

const sideRegistry: SideRegistry = {
  // Super Admin
  1: {
    dashboard: {
      order: 1,
      parentKey: null,
      icon: <AppstoreOutlined />,
    },
    statistic: {
      order: 2,
      parentKey: null,
      icon: <FundViewOutlined />,
    },
    statistic_place: {
      order: 1,
      parentKey: 'statistic',
      icon: <EnvironmentOutlined />,
    },
    statistic_user: {
      order: 2,
      parentKey: 'statistic',
      icon: <TeamOutlined />,
    },
    compare_place: {
      order: 3,
      parentKey: null,
      icon: <BlockOutlined />,
    },
    access: {
      order: 2,
      parentKey: null,
      icon: <GroupOutlined />,
    },
    access_menu: {
      order: 1,
      parentKey: null,
      icon: <AppstoreAddOutlined />,
    },
    access_role: {
      order: 2,
      parentKey: null,
      icon: <IdcardOutlined />,
    },
  },
  // Admin
  2: {
    dashboard: {
      order: 1,
      parentKey: null,
      icon: <AppstoreOutlined />,
    },
    statistic: {
      order: 2,
      parentKey: null,
      icon: <FundViewOutlined />,
    },
    statistic_place: {
      order: 1,
      parentKey: 'statistic',
      icon: <EnvironmentOutlined />,
    },
    statistic_user: {
      order: 2,
      parentKey: 'statistic',
      icon: <TeamOutlined />,
    },
    compare_place: {
      order: 3,
      parentKey: null,
      icon: <BlockOutlined />,
    },
  },
  // User
  3: {
    dashboard: {
      order: 1,
      parentKey: null,
      icon: <AppstoreOutlined />,
    },
    statistic: {
      order: 2,
      parentKey: null,
      icon: <FundViewOutlined />,
    },
    statistic_place: {
      order: 1,
      parentKey: 'statistic',
      icon: <EnvironmentOutlined />,
    },
    statistic_user: {
      order: 2,
      parentKey: 'statistic',
      icon: <TeamOutlined />,
    },
    compare_place: {
      order: 3,
      parentKey: null,
      icon: <BlockOutlined />,
    },
  },
};

type MenuItem = Required<MenuProps>['items'][number];

type OrderedMenuItem = MenuItem & {
  order: number;
};

const buildSiderMenuItems = (
  roleCode: number,
  routeData: any[],
): MenuItem[] => {
  const roleRegistry = sideRegistry[String(roleCode)] ?? {};

  console.log(routeData);

  const siderMapping: OrderedMenuItem[] = routeData
    .map((route) => {
      const registryEntry = roleRegistry[route.pathKey];

      if (!registryEntry) return null;

      const children: OrderedMenuItem[] | undefined = route.children
        ?.map((child: any) => {
          const childRegistry = roleRegistry[child.pathKey];

          if (!childRegistry) return null;

          return {
            key: child.pathKey,
            label: <Link to={child.side}>{child.routeName}</Link>,
            icon: childRegistry.icon ?? undefined,
            order: childRegistry.order ?? child.order_path,
          } as OrderedMenuItem;
        })
        .filter(Boolean) as OrderedMenuItem[];

      const sortedChildren =
        children && children.length > 0
          ? children.sort((a, b) => a.order - b.order)
          : undefined;

      return {
        key: route.pathKey,
        label: <Link to={route.side}>{route.routeName}</Link>,
        icon: registryEntry.icon ?? undefined,
        children: sortedChildren,
        order: registryEntry.order ?? route.order_path,
      } as OrderedMenuItem;
    })
    .filter(Boolean) as OrderedMenuItem[];

  siderMapping.sort((a, b) => a.order - b.order);

  return siderMapping;
};

export default buildSiderMenuItems;
