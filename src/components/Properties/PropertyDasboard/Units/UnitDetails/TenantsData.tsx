import { useState } from 'react';
import { NoTenant } from './NoTenant';
import { TenantProfile } from './TenantProfile';
import { TenantStatus } from './TenantStatus';
interface Props {
  tenantStatus: string;
  tenantsData: any[];
}
export function TenantsData({ tenantStatus, tenantsData }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleCollapse = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  

  return (
    <div className="flex flex-col items-center gap-6 flex-0 self-stretch">
      <TenantStatus tenantStatus={tenantStatus} />
      {tenantsData.length ? (
        tenantsData.map((tenant, index) => (
          <div key={index} className="w-full">
            <TenantProfile
              key={index}
              tenantData={tenant}
              index={index}
              isOpen={openIndex === index}
              toggleCollapse={() => toggleCollapse(index)}
            />
          </div>
        ))
      ) : (
        <>
        { tenantStatus === 'Active tenants' &&(<NoTenant type= 'active' btnTitle='New Application' title= 'No active tenants' />)}
        { tenantStatus === 'Scheduled move in' &&(<NoTenant type= 'scheduled' btnTitle='New Application' title= 'No move in scheduled' />)}
       { tenantStatus === 'Past tenants' &&( <NoTenant type= 'past' btnTitle=''  title= 'No past tenants' />)}
        </>
      )}
    </div>
  );
}
