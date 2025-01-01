import { Outlet } from 'react-router-dom';
import { Settings01Icon, LifeBuoy01Icon } from '@assets/iconComponents';
import { Loader } from '@components/Loader';
import { LeftSidebarMenu } from './LeftSidebarMenu';
import { TopMenubar } from './TopMenubar';

export const MainLayout = () => (
  <div className="overflow-auto pr-1 relative">
    <Loader />
    <LeftSidebarMenu />
    <main className="flex flex-col 1024:ps-80">
      <div className="flex items-center border-brand-110 border-b-2 border-solid h-17 ">
        <div className="grid grid-cols-4 gap-4 w-full ps-8 pe-9">
          <div className="relative">
            <TopMenubar title="All Properties" />
          </div>
          <div></div>
          <div className="flex items-center justify-end h-12">
            <Settings01Icon className="text-brand-940" />
            <LifeBuoy01Icon className="text-brand-940 ms-4" />
          </div>
          <div className="relative">
            <TopMenubar title="Estate Estates" />
          </div>
        </div>
      </div>
      <Outlet />
    </main>
  </div>
);
