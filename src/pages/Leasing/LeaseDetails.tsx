import { Header } from "@components/Leasing/Leases/LeaseDetails/Header";
import { LeaseDetailsOverview } from "@components/Leasing/Leases/LeaseDetails/Index";
import { RightSideBar } from "@components/Leasing/Leases/LeaseDetails/LeaseRightSideBar";
import { TenantOverviewPanel } from "@shared/components/TenantOverviewPanel";


export const LeaseDetails = () => {
  return (
    <div className="flex">
      <div className="flex flex-col items-center self-stretch flex-0 gap-10 p-8 w-[67.25%]">
        <header className="w-full">
          <Header />
        </header>
        <LeaseDetailsOverview />
        <div className="w-full"><TenantOverviewPanel type='lease'/></div>
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1 w-[32.75%]">
        <div className="flex items-start self-stretch flex-col">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};
