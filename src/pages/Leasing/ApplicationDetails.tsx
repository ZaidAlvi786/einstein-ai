import { Header } from '@components/Leasing/Applications/ApplicationDetails/Header';
import { TenantStatus } from '@components/Leasing/Applications/ApplicationDetails/TenantStatus';
import { GuaranteedMonthlyRent } from '@components/Properties/PropertyDasboard/GuaranteedMonthlyRent';
import { TenantOverviewPanel } from '@shared/components/TenantOverviewPanel';
import ShieldTick from '@assets/iconComponents/ShieldTick';
import { TenantGuaranteeFeatures } from '@constants/app.constant';
import { Box, Button, Card, List } from '@mantine/core';
import { ApplicantsCarousel } from '@components/Leasing/Applications/ApplicationDetails/ApplicantsCarousel';
import { useEffect, useState } from 'react';

const mockApplication = {
  name: 'Mollie Hall',
  phone: '212-111-4444',
  email: 'olivia@email.com',
  monthlyIncome: 2000,
  isVerified: true,
  screeningStatus: 'Screening tenant...',
  applicants: [
    {
      role: 'Primary applicant',
      name: 'Calvin Brown',
      phone: '212-212-1100',
      email: 'calvin@email.com',
      isVerified: 'Verified',
    },
    {
      role: 'Co-applicant',
      name: 'Calvin Brown',
      phone: '212-212-1100',
      email: 'calvin@email.com',
      isVerified: 'verified',
    },
  ],
};

const fetchApplication = new Promise((resolve) => {
  setTimeout(() => resolve(mockApplication), 1000);
});

export const ApplicationDetails = () => {
  const [application, setApplication] = useState<any | null>(null);

  useEffect(() => {
    fetchApplication.then((data: any) => {
      setApplication(data);
    });
  }, []);

  if (application === null) return <Box>Leading...</Box>;

  return (
    <div className="flex">
      <div className="flex flex-col flex-0 gap-6 p-8 bg-Gray-50 w-[67.25%]">
        <header className="w-full">
          <Header
            name={application.name}
            phone={application.phone}
            email={application.email}
            monthlyIncome={application.monthlyIncome}
            isVerified={application.isVerified}
          />
        </header>
        <TenantStatus type="screening" title="Screening tenant..." />
        <ApplicantsCarousel />
        <TenantOverviewPanel />
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1 hidden xl:block w-[32.75%]">
        <div className="flex items-start self-stretch flex-col">
          <GuaranteedMonthlyRent />
          <div className="flex flex-col justify-center items-start self-stretch bg-white gap-6 py-6 px-4">
            <Card
              withBorder
              className="max-w-xs-2 p-0"
              classNames={{
                root: 'flex flex-col p-0 items-start self-stretch rounded-[12px] border-[2px] border-solid border-Success-600 bg-white',
              }}
            >
              <Card.Section
                classNames={{
                  section:
                    'flex mt-0 justify-center items-center self-stretch rounded-t-[12px] border-[2px] border-solid border-Success-600 bg-Success-600 gap-1 pr-5 pl-4 py-4',
                }}
              >
                <div className="flex justify-center items-center gap-4">
                  <ShieldTick />
                  <span className="text-white text-lg font-semibold">Quality Tenant Guarantee</span>
                </div>
              </Card.Section>
              <div className="flex flex-col items-start self-stretch gap-4 pt-8 pb-6 px-4">
                <div className="flex flex-col justify-center items-center self-stretch gap-4">
                  <div className="flex flex-col items-start self-stretch gap-5">
                    <span className="text-Gray-600 text-sm leading-5 font-semibold text-center">
                      Enroll tenants into the QualityTenantGuarantee program
                    </span>
                    <div className="flex flex-col items-center self-stretch px-4">
                      <span className="text-Gray-600 text-base font-medium">For only</span>
                      <div className="flex items-end gap-2">
                        <span className="text-Gray-700 text-4xl font-semibold tracking-tighter">
                          4%
                        </span>
                        <div className="flex pb-sm-3 gap-2.5">
                          <span className="text-Gray-600 text-base font-medium text-center">
                            of monthly rent
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-Gray-600 font-normal leading-18">
                        Paid monthly with anuell comitment
                      </span>
                    </div>
                    <div className="flex items-center self-stretch">
                      <List>
                        {TenantGuaranteeFeatures.map((feature, index) => (
                          <List.Item
                            classNames={{
                              item: 'list-disc text-Gray-700 font-semibold text-xs leading-18',
                            }}
                            key={index}
                          >
                            {feature}
                          </List.Item>
                        ))}
                      </List>
                    </div>
                  </div>
                  <div className="text-Brand-700 text-sm leading-5 font-semibold cursor-pointer">
                    See full details
                  </div>
                </div>
                <Button
                  variant="filled"
                  className="border-solid w-full border-success-600 bg-success-600 rounded-[8px] hover:bg-success-500"
                >
                  Enroll tenants
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex flex-col px-4 gap-3 w-full">
          <Button
            fullWidth
            variant="filled"
            disabled={!application.isVerified}
            className="rounded-[8px] bg-Brand-600 hover:bg-Brand-700"
          >
            Accept Tenant
          </Button>
          <Button
            fullWidth
            variant="outline"
            disabled={!application.isVerified}
            className="rounded-[8px] border-Gray-300 text-Gray-700 hover:text-Gray-700"
          >
            Decline Tenant
          </Button>
        </div>
      </div>
    </div>
  );
};
