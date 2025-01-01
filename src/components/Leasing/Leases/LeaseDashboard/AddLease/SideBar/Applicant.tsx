import { CheckZigzagVerified } from '@assets/iconComponents';
import SvgCheckCircle from '@assets/iconComponents/CheckCircle';
import { Badge } from '@mantine/core';

interface Props {
  verifiedTenant: boolean;
}

const Applicant = ({ verifiedTenant }: Props) => {
  return (
    <>
      <div className="flex float-end items-center bg-Success-600 text-white px-3 py-2 gap-2 border border-solid border-[1px]  border-Success-600 rounded-[12px] me-6 mt-4 shadow-xs">
        <div>
          <SvgCheckCircle height={20} width={20} stroke="#FFFFFF" />
        </div>
        <div className="text-sm font-semibold leading-5 ">{verifiedTenant? "Approved tenant":"Qualified tenant"}</div>
      </div>
      <div className="pt-10 px-6 mt-12">
        <div className="flex justify-between ">
          <div className="flex">
            <div className="self-center">
              <div className="text-2xl	font-semibold leading-8	text-Gray-900  flex items-center ">
                <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                  Mollie Hall
                </span>
                <Badge
                  classNames={{
                    root: 'ms-1 bg-Gray-200 rounded-[6px] border border-Gray-200 border-solid  border-[1px] drop-shadow-xs',
                    label:
                      'text-xs font-medium leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                  }}
                  variant="light"
                  className="h-3.2"
                >
                  Primary Applicant
                </Badge>
              </div>

              {verifiedTenant && (
                <div className="flex gap-2 bg-Success-50 border border-solid border-[1px] border-success-200 w-fit rounded-[6px] px-1.5 py-0.5">
                  <div className="">
                    <CheckZigzagVerified />
                  </div>
                  <div className="text-xs text-Success-700 leading-18 font-medium ">Verified</div>
                </div>
              )}
              {!verifiedTenant && (
                <Badge
                  classNames={{
                    root: ' bg-Gray-200 rounded-[6px] border border-Gray-200 border-solid  border-[1px] drop-shadow-xs',
                    label:
                      'text-xs font-medium leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                  }}
                  variant="light"
                  className="h-3.2"
                >
                  Unverified
                </Badge>
              )}
              <div className="font-normal	text-sm	leading-5 text-gray-600 ">
                mollie@untitledui.com
              </div>
              <div className="font-normal	text-sm	leading-5	text-gray-600 ">212-212-1100</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 ">
          <div className="flex">
            <div className="self-center">
              <div className="text-2xl	font-semibold leading-8	text-Gray-900  flex items-center ">
                <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                  Mollie Hall
                </span>
                <Badge
                  classNames={{
                    root: 'ms-1 bg-Gray-200 rounded-[6px] border border-gray-300 border-solid  border-[1px] drop-shadow-xs',
                    label:
                      'text-xs font-medium leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                  }}
                  variant="light"
                  className="h-3.2"
                >
                  Co-applicant
                </Badge>
              </div>
              {verifiedTenant && (
                <div className="flex gap-2 bg-Success-50 border border-solid border-[1px] border-success-200 w-fit rounded-[6px] px-1.5 py-0.5">
                  <div className="">
                    <CheckZigzagVerified />
                  </div>
                  <div className="text-xs text-Success-700 leading-18 font-medium ">Verified</div>
                </div>
              )}
              {!verifiedTenant && (
                <Badge
                  classNames={{
                    root: ' bg-Gray-200 rounded-[6px] border border-Gray-200 border-solid  border-[1px] drop-shadow-xs',
                    label:
                      'text-xs font-medium leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                  }}
                  variant="light"
                  className="h-3.2"
                >
                  Unverified
                </Badge>
              )}
              <div className="font-normal	text-sm	leading-5 text-gray-600 ">
                mollie@untitledui.com
              </div>
              <div className="font-normal	text-sm	leading-5	text-gray-600">212-212-1100</div>
              <div className="flex gap-2">
                <div className="text-xs leading-5 font-medium text-gray-600 mt-1 ">
                  Combined monthly income: $4,000
                </div>
                {verifiedTenant && (
                  <div className="bg-Success-50 border border-solid border-[1px] border-success-200 w-fit rounded-[6px] px-1.5 py-0.5">
                    <div className="text-xs text-Success-700 leading-18 font-medium ">Verified</div>
                  </div>
                )}
                {!verifiedTenant && (
                  <Badge
                    classNames={{
                      root: 'ms-1 bg-Gray-200 rounded-[6px] border border-Gray-200 border-solid  border-[1px] drop-shadow-xs',
                      label:
                        'text-xs font-medium leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                    }}
                    variant="light"
                    className="h-3.2"
                  >
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Applicant;
