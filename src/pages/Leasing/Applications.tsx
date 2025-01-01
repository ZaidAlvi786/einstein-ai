import { ApplicationOverViewCard } from '@components/Leasing/Applications/ApplicationDashboard/ApplicationOverViewCard';
import { ApplicationsList } from '@components/Leasing/Applications/ApplicationDashboard/AppplicationsList';
import { Header } from '@components/Leasing/Applications/ApplicationDashboard/Header';
import { PropertyOverview } from '@components/Leasing/Applications/ApplicationDashboard/PropertyOverView';
import { TenantApplicationDashboard } from '@components/Leasing/Applications/ApplicationDashboard/tenantApplicationDashboard';
import { TaskActivity } from '@shared/components/TaskActivity';

export function ApplicationsPage() {
  return (
    <div className="flex">
      <div className="flex flex-col flex-0 gap-6 p-8 bg-Gray-50 w-[67.25%]">
        <header className="w-full">
          <Header />
        </header>
        <PropertyOverview />
        <TenantApplicationDashboard />
        <ApplicationsList />
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1 hidden xl:block w-[32.75%]">
        <div className="flex items-start self-stretch flex-col">
          <ApplicationOverViewCard />
          <TaskActivity />
        </div>
      </div>
    </div>
  );
}
