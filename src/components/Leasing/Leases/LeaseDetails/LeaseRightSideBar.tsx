import { Home05Icon, ShieldTickIcon, Users01Icon, VerifiedIcon } from '@assets/iconComponents';
import { Badge, Button, Card } from '@mantine/core';

export const RightSideBar = () => {
  return (
    <div className="flex flex-col items-start flex-0 self-stretch border-l0-[1px] border-solid border-Gray-200 bg-white">
      <div className="flex flex-col items-start -gap-8 self-stretch">
        <div className="flex px-8 pt-8 pb-sm-1 flex-col items-start self-stretch bg-gradient-brand-60050090-deg w-full">
          <Card
            withBorder
            className="max-w-xs-2 p-0"
            classNames={{
              root: 'flex flex-col items-start self-stretch rounded-xl border border-solid border-Brand-300 bg-white drop-shadow-xs',
            }}
          >
            <div className="flex p-6 flex-col items-start gap-6 self-stretch">
              <div className="flex flex-col items-start gap-0.5 self-stretch">
                <span className="text-Gray-900 text-base font-semibold leading-6">
                  Whitestone Apartments
                </span>
                <span className="text-Gray-900 text-2xl font-semibold leading-8">Unit 101</span>
                <span className="text-Gray-700 text-xs font-medium leading-18">
                  123 Main St, #101, New York NY 11100
                </span>
              </div>
              <div className="flex items-center gap-4 self-stretch">
                <span className="flex h-12 w-12  rounded-[9999px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
                  <span className="h-full flex w-full p-2 ustify-center items-center flex-0">
                    <Home05Icon width={24} height={24} />
                  </span>
                </span>
                <div className="flex flex-col justify-center items-start">
                  <span className="text-Gray-700 text-sm font-semibold leading-5">
                    3 bed, 1 bath, 1,200 sqft.
                  </span>
                  <span className="text-Gray-700 text-sm font-semibold leading-5">
                    $2,000 monthly rent
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex px-6 -mt-8 flex-col items-start gap-4 self-stretch">
          <div className="flex flex-col items-start gap-6 self-stretch">
            <div className="flex justify-between items-end self-stretch">
              {/* <div
                className="flex w-24 h-24 justify-center items-center rounded-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `var(--Avatar-user-square-Mollie-Hall, url(${(<Users01Icon />)})), lightgray;`,
                }}
              ></div>   Avatar profile div   */}
              <div className="w-24 h-24 flex justify-center items-center shrink-0 rounded-[200px] border-[4px] border-solid border-white bg-Gray-100 shadow-lg">
                <Users01Icon width={48} height={48} stroke="#475467" />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  leftSection={<ShieldTickIcon width={20} height={20} />}
                  className="bg-Success-600 text-sm text-base font-semibold rounded-lg border-Gray-300 text-white h-10 hover:bg-Success-600 hover:text-white w-fit drop-shadow-sm"
                >
                  Guaranteed lease
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 self-stretch">
              <div className="flex flex-col items-start gap-1 self-stretch">
                <div className="flex items-center gap-2 self-stretch">
                  <span className="flex-Gray-900 text-2xl font-semibold leading-8 ">
                    Mollie Hall
                  </span>
                  <Badge
                    classNames={{
                      root: `rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center border-Gray-200 bg-Gray-50`,
                      label: 'text-center text-xs text-Gray-700 leading-18 font-medium capitalize',
                    }}
                    variant="outline"
                  >
                    Primary applicant
                  </Badge>
                </div>
                <Badge
                  classNames={{
                    root: `rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center border-Success-200 bg-Success-50`,
                    label: 'text-center text-xs text-Success-700 leading-18 font-medium capitalize',
                  }}
                  variant="outline"
                  leftSection={<VerifiedIcon width={12} height={12} />}
                >
                  Verified
                </Badge>
                <span className="text-Gray-600 text-sm font-normal leading-5">
                  mollie@untitledui.com
                </span>
                <span className="text-Gray-600 text-sm font-normal leading-5">212-212-1100</span>
              </div>
              <div className="flex flex-col items-start gap-1 self-stretch">
                <div className="flex items-center gap-2 self-stretch">
                  <span className="flex-Gray-900 text-2xl font-semibold leading-8 ">
                    Mollie Hall
                  </span>
                  <Badge
                    classNames={{
                      root: `rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center border-Gray-200 bg-Gray-50`,
                      label: 'text-center text-xs text-Gray-700 leading-18 font-medium capitalize',
                    }}
                    variant="outline"
                  >
                    Co-applicant
                  </Badge>
                </div>
                <Badge
                  classNames={{
                    root: `rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center border-Success-200 bg-Success-50`,
                    label: 'text-center text-xs text-Success-700 leading-18 font-medium capitalize',
                  }}
                  variant="outline"
                  leftSection={<VerifiedIcon width={12} height={12} />}
                >
                  Verified
                </Badge>
                <span className="text-Gray-600 text-sm font-normal leading-5">
                  mollie@untitledui.com
                </span>
                <span className="text-Gray-600 text-sm font-normal leading-5">212-212-1100</span>
              </div>
              <div className="flex gap-2 items-center self-stretch">
                <span className="text-Gray-600 text-sm font-medium leading-5">
                  Combined monthly income: $4,000
                </span>
                <Badge
                  classNames={{
                    root: `rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center border-Success-200 bg-Success-50`,
                    label: 'text-center text-xs text-Success-700 leading-18 font-medium capitalize',
                  }}
                  variant="outline"
                >
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
