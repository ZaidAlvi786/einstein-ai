import { ArrowBlockRight, Building04Icon, Home02Icon, Users01Icon } from '@assets/iconComponents';
import { IQualityTenantSliderData } from '@interfaces/qualityTenant.interface';

interface IQualityTenantSliderListProps {
  item: IQualityTenantSliderData;
}

const QualityTenantSliderList: React.FC<IQualityTenantSliderListProps> = ({ item }) => (
  <div className="flex items-start">
    <div className="flex flex-col justify-center items-center gap-2.5 self-stretch bg-Gray-100 w-7.8">
      <Building04Icon />
    </div>
    <div className="flex p-3 items-start gap-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-start gap-1.5">
            <span className="text-Gray-700 text-sm font-medium leading-5">{item.name}</span>
          </div>
          <div className="flex w-5.5 flex-col items-start gap-0.5">
            <span className="text-Gray-600 text-xs font-regular leading-18">{item.address}</span>
          </div>
          <div className="flex w-11.5 items-start content-start gap-y-0.5 gap-x-2 flex-wrap">
            <div className="flex items-center content-center gap-1 flex-wrap">
              <Home02Icon />
              <span className="text-Gray-600 text-xs font-medium leading-18">{item.tenant}</span>
            </div>
            <div className="flex items-center content-center gap-1 flex-wrap">
              <Users01Icon />
              <span className="text-Gray-600 text-xs font-medium leading-18">
                {item.applications}
              </span>
            </div>
            <div className="flex items-center content-center gap-1 flex-wrap">
              <ArrowBlockRight />
              <span className="text-Gray-600 text-xs font-medium leading-18">{item.prospects}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default QualityTenantSliderList;
