import { ChevronDownIcon, ChevronUp, Users01Icon } from '@assets/iconComponents';
import { Badge, Card, CardSection, Collapse } from '@mantine/core';
import { useState } from 'react';
import clsx from 'clsx';
import { ApplicationProfileDetails } from './ApplicationProfileDetails';
import { ScheduleMoveInModal } from '@shared/components/DatePickerModals/ScheduleMoveInModal';

interface ApplicationData {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  applyDate?: string;
  img?: string;
  badge?: string;
  process?: string;
  rent?: string;
  moveIn?: string;
  qtgGuarantee?: boolean;
  lease?: string;
  leaseAgreement?: string;
  moveDate?: string;
}

interface Props {
  applicationData: ApplicationData;
  index: number;
  isOpen: boolean;
  toggleCollapse: () => void;
}
interface Status {
  text: string;
  value: string;
  variant: 'success' | 'error' | 'neutral' | 'inprogress' | 'schedueled' | 'warning' | 'indigo';
}

const statuses: Status[] = [
  { text: 'Guaranteed', value: 'Guaranteed', variant: 'success' },
  { text: 'Vacant', value: 'vacant', variant: 'success' },
  { text: 'Applied', value: 'applied', variant: 'success' },
  { text: 'In Progress', value: 'inProgress', variant: 'success' },
  { text: 'Rejected', value: 'rejected', variant: 'error' },
  { text: 'Cancelled', value: 'cancelled', variant: 'error' },
  { text: 'Expired', value: 'expired', variant: 'error' },
  { text: 'Disqualified', value: 'Disqualified', variant: 'error' },
  { text: 'Pre-Qualified', value: 'Pre-Qualified', variant: 'neutral' },
  { text: 'Qualified', value: 'Qualified', variant: 'neutral' },
  { text: 'Approved', value: 'Approved', variant: 'neutral' },
  { text: 'NA', value: 'NA', variant: 'inprogress' },
  { text: 'Pending', value: 'Pending', variant: 'inprogress' },
  { text: 'Schedueled', value: 'Schedueled', variant: 'schedueled' },
  { text: 'Screening...', value: 'Screening...', variant: 'inprogress' },
  { text: 'Cancelled', value: 'Cancelled', variant: 'inprogress' },
  { text: 'Accepted', value: 'Accepted', variant: 'neutral' },
  { text: '294', value: 'Number', variant: 'neutral' },
  { text: 'Current', value: 'Current', variant: 'success' },
  { text: 'Paid', value: 'Paid', variant: 'success' },
  { text: 'Individual', value: 'Individual', variant: 'inprogress' },
  { text: 'Current', value: 'Current', variant: 'success' },
  { text: 'Notice sent', value: 'Notice sent', variant: 'warning' },
  { text: 'Under eviction', value: 'Under eviction', variant: 'error' },
  { text: 'Screening prossesing', value: 'Screening prossesing', variant: 'inprogress' },
  { text: 'QTG Qualified', value: 'QTG Qualified', variant: 'indigo' },
  { text: 'Lease signed', value: 'Lease signed', variant: 'indigo' },
  { text: 'QTG guaranteed', value: 'QTG guaranteed', variant: 'success' },
  { text: 'QTG Approved', value: 'QTG Approved', variant: 'indigo' },
  { text: 'Guaranteed lease', value: 'Guaranteed lease', variant: 'success' },
];

const getClassNameByStatus = (status?: Status, tab?: string) => {
  const variant = status?.variant;
  // Add your specific logic for "application" tab here, or return a default class
  if (variant === 'success') return 'bg-Success-50 border-Success-200 text-Success-700';
  if (variant === 'error') return 'bg-Error-50 border-Error-200 text-Error-700';
  if (variant === 'neutral' && status?.text === 'Accepted' && tab === 'open')
    return 'bg-Success-50 border-Success-200 text-Success-700';
  if (variant === 'neutral' && status?.text === 'Accepted' && tab === 'schedule')
    return 'bg-Brand-50 border-Brand-200 text-Brand-700';
  if (variant === 'neutral' && status?.text !== 'Qualified')
    return 'bg-Indigo-50 border-Indigo-200 text-Indigo-700';
  if (variant === 'schedueled') return 'bg-Bran-50 border-Brand-200 text-Brand-700';
  if (variant === 'neutral' && status?.text === 'Qualified')
    return 'bg-Success-50 border-Success-200 text-Success-700';
  if (variant === 'inprogress') return 'bg-Gray-50 border-Gray-200 text-Gray-700';
  if (variant === 'warning') return 'bg-Warning-50 border-Warning-200 text-Warning-700';
  if (variant === 'indigo') return 'bg-Indigo-50 border-Indigo-200 text-Indigo-700';
};
const getStatusText = (applicationData: ApplicationData) => {
  const { process, status, qtgGuarantee } = applicationData;
  if (process === 'open') {
    if (status === 'Screening processing') return null;
    if (status === 'QTG Qualified') return ['Accept', 'Decline'];
    if (status === 'Accepted') return ['Notify applicant', 'Sign lease', 'Schedule move in'];
  } else if (process === 'schedule') {
    if (status === 'Accepted') return ['Sign lease'];
    if (status === 'Lease signed' && !qtgGuarantee) return ['Guarantee lease'];
  }
  return [];
};

export function ApplicationProfile({ applicationData, index, isOpen, toggleCollapse }: Props) {
  const status = statuses.find((item) => item.value === applicationData.status);
  const statusText = status?.text ?? 'Unknown status';
  const statusClassName = getClassNameByStatus(status, applicationData.process);
  console.log(statusClassName, 'fffhhhfhghf');
  const [scheduleMoveInModalOpen, setScheduleMoveInModalOpen]= useState(false)

  const buttonText = getStatusText(applicationData);
  let textToShow;

  if (applicationData.process === 'close') {
    textToShow = 'Reopen';
  } else if (
    applicationData.process !== 'close' &&
    applicationData.status !== 'Screening processing'
  ) {
    textToShow = 'Cancel';
  } else {
    textToShow = 'Delete';
  }
  return (
    <>
    <Card
      classNames={{
        root: 'flex w-full flex-col items-start self-stretch rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs',
        section: 'flex flex-col items-start self-stretch',
      }}
    >
      <CardSection>
        <div className="flex items-start self-stretch">
          {applicationData.img == null ? (
            <div className="flex w-md-1 flex-col justify-center relative bg-Gray-100 border-solid border-Gray-200 border-[1px] border-r-[0px] items-center gap-2.5 self-stretch">
              <Users01Icon width={80} height={80} />
            </div>
          ) : (
            <div
              className="flex relative w-md-1 flex-col justify-center items-center gap-2.5 self-stretch bg-center bg-no-repeat bg-cover bg-gray-300"
              style={{
                backgroundImage: `url(${applicationData.img}), linear-gradient(lightgray 50%, #E0E0E0)`,
              }}
            >
              {/* <Image src={applicationData.img} alt="" className='h-full bg-cover' /> */}
            </div>
          )}
          <div className="flex flex-col items-start flex-0">
            <div className="flex items-start self-stretch">
              <div className="px-6 pt-6 pb-4 gap-4 flex flex-col items-start flex-0 slef-stretch">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-Gray-600 text-2xl font-semibold leading-8">
                      {applicationData.name}
                    </span>
                  </div>
                  <span className="text-Gray-600 text-sm font-medium leading-5">
                    {applicationData.email}
                  </span>
                  <span className="text-Gray-600 text-sm font-semibold leading-5">
                    {applicationData.phone}
                  </span>
                  <span className="text-Gray-600 text-sm font-semibold leading-5">
                    {applicationData.rent}
                  </span>
                  <span className="text-Brand-700 text-sm font-semibold leading-5">
                    {applicationData.leaseAgreement}
                  </span>
                  <span className="text-Gray-600 text-sm font-medium leading-5">
                    {applicationData.moveDate}
                  </span>
                </div>
                {applicationData.process === 'schedule' && (
                  <div className="flex flex-col items-start gap-0.5 slef-stretch">
                    <span className="text-Brand-500 text-sm font-semibold leading-5">
                      {applicationData.moveIn}
                    </span>
                    <div className="flex items-start gap-3 self-stretch">
                      <span className="flex justify-center items-center text-Brand-700 text-sm font-semibold leading-5 gap-1.5">
                        Move in
                      </span>
                      <span className="flex justify-center items-center text-Brand-700 text-sm font-semibold leading-5 gap-1.5">
                        Change
                      </span>
                      <span className="flex justify-center items-center text-Brand-700 text-sm font-semibold leading-5 gap-1.5">
                        Cancel
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between items-center self-stretch">
                <div className="flex px-6 pb-2 pt-6 flex-col items-end gap-2 self-stretch">
                  <Badge
                    classNames={{
                      root: clsx(
                        statusClassName,
                        'felx px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid'
                      ),
                      label: clsx(statusClassName, 'text-center text-xs font-medium leading-18'),
                    }}
                  >
                    {applicationData.status}
                  </Badge>
                  {applicationData.qtgGuarantee == true ? (
                    <Badge
                      classNames={{
                        root: `flex px-1.5 py-0.5 items-center rounded-[6px] border-solid border-[1px] ${
                          applicationData.status === 'QTG Qualified'
                            ? 'border-Indigo-200 bg-Indigo-50'
                            : 'border-Success-200 bg-Success-50'
                        }`,
                        label: `text-xs text-center font-medium leading-18 ${
                          applicationData.status === 'QTG Qualified'
                            ? 'text-Indigo-700'
                            : 'text-Success-700'
                        }`,
                      }}
                    >
                      QTG guaranteed
                    </Badge>
                  ) : (
                    buttonText?.map((text, index) => (
                      <span
                        key={index}
                        onClick={()=> setScheduleMoveInModalOpen(true)}
                        className={clsx(
                          'flex justify-center items-center text-sm font-semibold leading-5',
                          text === 'Guarantee lease' ? 'text-Success-700' : 'text-Brand-700'
                        )}
                      >
                        {text}
                      </span>
                    ))
                  )}
                  <div className="flex justify-center items-center gap-1.5">
                    <span
                      className={`text-sm font-semibold leading-5 ${
                        applicationData.lease === 'Guarantee lease'
                          ? 'text-Success-700'
                          : 'text-Brand-700'
                      }`}
                    >
                      {applicationData.lease}
                    </span>
                  </div>
                </div>
                <div className="flex h-13 px-6 py-4 flex-col justify-center items-end gap-1 self-stretch">
                  <span className="flex justify-center items-center text-Brand-700 text-sm font-semibold leading-5 gap-1.5" onClick={()=> setScheduleMoveInModalOpen(true)}>
                    {textToShow}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`flex flex-col items-center self-stretch border-t-[1px] border-solid border-Gray-200 ${isOpen ? 'border-b-[1px] border-solid border-Gray-200' : ''}`}
            >
              <div className="flex py-4 px-6 justify-between items-center self-stretch">
                <div className="flex justify-center items-center gap-1.5">
                  <span className="text-Gray-600 text-sm font-semibold leading-5">
                    {applicationData.applyDate}
                  </span>
                </div>
                <div className="flex justify-center items-centre gap-0.5 cursor-pointer" onClick={toggleCollapse}>
                  <span className="text-Brand-700 text-sm font-semibold leading-5">
                    View details
                  </span>
                  {!isOpen ? (
                    <ChevronDownIcon height={20} width={20} stroke="#363F72" />
                  ) : (
                    <ChevronUp />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Collapse className="" in={isOpen}>
          <ApplicationProfileDetails />
        </Collapse>
      </CardSection>
    </Card>
    <ScheduleMoveInModal onClose={() => setScheduleMoveInModalOpen(false)} open ={scheduleMoveInModalOpen} />
    </>
  );
}
