import { Header } from '@components/Properties/PropertyDasboard/Header';
import { AllProperties } from '@components/Properties/PropertyDasboard/AllProperties';
import { GuaranteedMonthlyRent } from '@components/Properties/PropertyDasboard/GuaranteedMonthlyRent';
import { RightSideBar } from '@components/Properties/PropertyDasboard/RightSideBar';

export function PropertiesPage() {
  return (
    <div className="flex items-start self-stretch">
      <div className="flex flex-col items-start flex-0 self-stretch">
        <header className="w-full">
          <Header />
        </header>
        <AllProperties />
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1 hidden xl:block w-[32.75%]">
        <div className="flex items-start self-stretch flex-col">
          <GuaranteedMonthlyRent />
          <RightSideBar/>
        </div>
      </div>
    </div>
  );
}
