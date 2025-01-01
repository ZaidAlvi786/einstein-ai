import {
  HomeLineIcon,
  LayersThree01Icon,
  CheckDone01Icon,
  PieChart03Icon,
  Users01Icon,
  LifeBuoy01Icon,
  Settings01Icon,
  BarChartSquare02Icon,
} from '@assets/iconComponents';
import SvgUsers01 from '@assets/iconComponents/Users01';
import { APP_PATHS } from '@routes/app-paths';

type SidebarEntry = {
  icon: JSX.Element | null;
  title: string;
  href: string;
  children?: {
    title: string;
    href: string;
    icon: JSX.Element | null;
  }[];
};

export const sidebarEntries: SidebarEntry[] = [
  {
    icon: <HomeLineIcon className="size-6" />,
    title: 'Home',
    href: APP_PATHS.home.get(),
  },
  {
    icon: <LayersThree01Icon className="size-6" />,
    title: 'Qualified',
    href: APP_PATHS.qualified.get(),
  },
  {
    icon: <LayersThree01Icon className="size-6" />,
    title: 'Quality Tenant Guarantee',
    href: APP_PATHS.qualityTenant.get(),
  },
  {
    icon: <LayersThree01Icon className="size-6" />,
    title: 'Lease Guarantee',
    href: '/leases-guarantee',
    children: [
      {
        icon: null,
        title: 'Pre-Qualified',
        href: APP_PATHS.leaseGuaranteed.preQualified.get(),
      },
      {
        icon: null,
        title: 'Applications',
        href: APP_PATHS.leaseGuaranteed.application.get(),
      },
      {
        icon: null,
        title: 'Guaranteed Leases',
        href: APP_PATHS.leaseGuaranteed.get(),
      },
    ],
  },
  {
    icon: <LayersThree01Icon className="size-6" />,
    title: 'Leasing',
    href: '/leases',
    children: [
      {
        icon: null,
        title: 'Applications',
        href: APP_PATHS.leasing.application.get(),
      },
      {
        icon: null,
        title: 'Leases',
        href: APP_PATHS.leasing.get(),
      },
    ],
  },
  {
    icon: <CheckDone01Icon className="size-6" />,
    title: 'Rent Claims',
    href: '/rent-claims',
    children: [],
  },
  {
    icon: <PieChart03Icon className="size-6" />,
    title: 'Eviction Legal Fees',
    href: '/eviction-legal-fees',
    children: [],
  },
  {
    icon: <SvgUsers01 className="size-6" />,
    title: 'Malicious Damages',
    href: '/malicious-damages',
    children: [],
  },
  {
    icon: <BarChartSquare02Icon className="size-6" />,
    title: 'Properties',
    href: APP_PATHS.properties.get(),
    children: [
      {
        icon: null,
        title: 'Property',
        href: APP_PATHS.properties.get(),
      },
      {
        icon: null,
        title: 'Units',
        href: APP_PATHS.properties.units.get(),
      },
    ],
  },
  {
    icon: <BarChartSquare02Icon className="size-6" />,
    title: 'Contacts',
    href: '/contacts',
    children: [
      {
        icon: null,
        title: 'Owners and Managers',
        href: APP_PATHS.contacts.ownerAndManager.get(),
      },
      {
        icon: null,
        title: 'Tenants',
        href: APP_PATHS.contacts.tenants.get(),
      },
    ],
  },
];
