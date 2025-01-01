import { Header } from "@components/Leasing/Leases/LeaseDashboard/Header";
import { LeaseOverview } from "@components/Leasing/Leases/LeaseDashboard/LeaseOverview/Index";
import { LeaseOverViewCard } from "@components/Leasing/Leases/LeaseDashboard/LeaseOverViewCard";
import { LeasesList } from "@components/Leasing/Leases/LeaseDashboard/LeasesList";
import { TenantLeaseDashboard } from "@components/Leasing/Leases/LeaseDashboard/TenantLeaseDashboard/Index";
import { TaskActivity } from "@shared/components/TaskActivity";


export function LeasesPage() {
  return (
    <div className="flex">
      <div className="flex flex-col flex-0 gap-6 p-8 bg-Gray-50 w-[67.25%]">
        <header className="w-full">
          <Header />
        </header>
        <LeaseOverview />
        <TenantLeaseDashboard />
        <LeasesList />
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1 hidden xl:block w-[32.75%]">
        <div className="flex items-start self-stretch flex-col">
          <LeaseOverViewCard />
          <TaskActivity />
        </div>
      </div>
    </div>
  );
}
