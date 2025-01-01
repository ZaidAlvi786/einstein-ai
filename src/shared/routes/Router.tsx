import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  ErrorPage,
  GuaranteedLeasesPage,
  HomePage,
  LeasesPage,
  NewPropertyPage,
  PropertiesPage,
  TenantsPage,
  UnitsPage,
  OwnerAndManagerPage,
  LeaseGuaranteeApplicationsPage,
  LeasingApplicationsPage,
  PreQualifiedPage,
  SignupPage,
  LoginPage,
} from '@pages/index';
import { ForgotPassword } from '@pages/ForgotPassword.page';
import { ResetPassword } from '@pages/ResetPassword.page';
import ProtectedRoutes from '@shared/authGuard/protectedRoutes';
import NonProtectedRoutes from '@shared/authGuard/nonProtectedRoutes';
import { RedirectPage } from '@pages/Redirect.page';
import { PropertyDetailsPage } from '@pages/Properties/PropertiesDetails.page';
import { BulkEditUnitModel } from '@pages/Properties/BulkEditUnitModel';
import { UnitDetails } from '@components/Properties/PropertyDasboard/Units/UnitDetails/Index';
import AddTenant from '@components/Properties/Tenant/AddTenant';
import { ApplicationDetails } from '@pages/Leasing/ApplicationDetails';
import { QualityTenantGuarantees } from '@pages/QualityTenantGuarantee';
import { APP_PATHS } from './app-paths';
import Qualified from '@pages/Qualified';
import QualifiedTenantForm from '@components/Qualified/QualifiedTenantForm';
import { NewApplication } from '@pages/Leasing/NewApplication/NewApplication';
import EnrollTenant from '@components/QualityTenantGuarantee/EnrollTenant';
import { element } from 'prop-types';
import { TenantApplicationPage } from '@pages/TenantApplication.page';
import { LeaseDetails } from '@pages/Leasing/LeaseDetails';
import AddLease from '@components/Leasing/Leases/LeaseDashboard/AddLease/AddLease';
import AddLeaseTenant from '@components/Leasing/Leases/LeaseDetails/AddTenant/AddLeaseTenant';
import ScrollToTop from '@shared/components/ScrollToTop/ScrollToTop';

const propertiesRoutes = [
  {
    path: APP_PATHS.properties.get(),
    element: <PropertiesPage />,
  },
  {
    path: APP_PATHS.properties.property.getById(),
    element: <PropertyDetailsPage />,
  },
  {
    path: APP_PATHS.properties.units.get(),
    element: <UnitsPage />,
  },
  {
    path: APP_PATHS.properties.bulkEdit.get(),
    element: <BulkEditUnitModel />,
  },
  {
    path: APP_PATHS.properties.new.get(),
    element: <NewPropertyPage />,
  },
  {
    path: APP_PATHS.properties.units.getById(),
    element: <UnitDetails />,
  },
  {
    path: APP_PATHS.properties.addTenant.get(),
    element: <AddTenant />,
  },
];

const contactsRoutes = [
  {
    path: APP_PATHS.contacts.tenants.get(),
    element: <TenantsPage />,
  },
  {
    path: APP_PATHS.contacts.ownerAndManager.get(),
    element: <OwnerAndManagerPage />,
  },
];

const qualityTenantRoutes = [
  {
    path: APP_PATHS.qualityTenant.get(),
    element: <QualityTenantGuarantees />,
  },
  {
    path: APP_PATHS.qualityTenant.enrollTenant.get(),
    element: <EnrollTenant />,
  },
];
const qualifiedRoutes = [
  {
    path: APP_PATHS.qualified.get(),
    element: <Qualified />,
  },
  {
    path: APP_PATHS.qualified.qualifyTenant.get(),
    element: <QualifiedTenantForm />,
  },
];

const leaseGuaranteeRoutes = [
  {
    path: APP_PATHS.leaseGuaranteed.preQualified.get(),
    element: <PreQualifiedPage />,
  },
  {
    path: APP_PATHS.leaseGuaranteed.application.get(),
    element: <LeaseGuaranteeApplicationsPage />,
  },
  {
    path: APP_PATHS.leaseGuaranteed.get(),
    element: <GuaranteedLeasesPage />,
  },
];

const leasingRoutes = [
  {
    path: APP_PATHS.leasing.application.getId(),
    element: <ApplicationDetails />,
  },
  {
    path: APP_PATHS.leasing.application.get(),
    element: <LeasingApplicationsPage />,
  },
  {
    path: APP_PATHS.leasing.get(),
    element: <LeasesPage />,
  },
  {
    path: APP_PATHS.leasing.application.new.get(),
    element: <NewApplication />,
  },
  {
    path: APP_PATHS.leasing.addLease.get(),
    element: <AddLease />,
  },
  {
    path: APP_PATHS.leasing.addTenant.get(),
    element:<AddLeaseTenant />
  },
  {
    path: APP_PATHS.leasing.getbyid(),
    element: <LeaseDetails />
  }
];

const routes = [
  {
    path: APP_PATHS.home.get(),
    element: <HomePage />,
  },
  {
    path: APP_PATHS.properties.get(),
    element: <PropertiesPage />,
  },
  {
    path: APP_PATHS.rentalApplication.get(),
    element: <TenantApplicationPage />
  },
  ...propertiesRoutes,
  ...contactsRoutes,
  ...leaseGuaranteeRoutes,
  ...leasingRoutes,
  ...qualityTenantRoutes,
  ...qualifiedRoutes,
];

const authRoutes = [
  {
    path: APP_PATHS.signup.get(),
    element: <SignupPage />,
  },
  {
    path: APP_PATHS.login.get(),
    element: <LoginPage />,
  },
  {
    path: APP_PATHS.forgotPassword.get(),
    element: <ForgotPassword />,
  },
  {
    path: APP_PATHS.resetPassword.get(),
    element: <ResetPassword />,
  },
  { path: APP_PATHS.redirect.get(), element: <RedirectPage /> },
];

export function Router() {
  return<RouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    element:<><ScrollToTop/><ProtectedRoutes /></> ,
    errorElement: <ErrorPage />,
    children: routes,
  },

  {
    element:<><ScrollToTop/><NonProtectedRoutes /></>,
    errorElement: <ErrorPage />,
    children: authRoutes,
  },
]);
