import { ChevronDownIcon, ChevronUp, Users01Icon, Users04Icon } from '@assets/iconComponents';
import { Badge, Card, CardSection, Collapse, Image } from '@mantine/core';
import { TenantProfileDetails } from './TenantProfileDetails';
import { useState } from 'react';
import clsx from 'clsx';
import { MoveAppartmentModal } from './MoveAppartmentModal/Index';
import { CancelMoveInModal } from './CancelMoveInModal/Index';
import { MoveOutTenantModal } from './MoveOutTenantModal/Index';
import { CancelLeaseModal } from './CancelLeaseModal/Index';

interface Props {
  tenantData: {
    name: string;
    email: string;
    phone: string;
    leaseAgreement: string;
    moveDate: string;
    status: string;
    lease: string;
    noticeStatus: string;
    renew: string;
    moveApartment: string;
    moveOut: string;
    expireDate: string;
    img: string;
    badge: string;
    process:string;
    rent:string;
  };
  index: number;
  isOpen: boolean;
  toggleCollapse: () => void;
}
interface Status {
    text: string;
    value: string;
    variant: 'success' | 'error' | 'neutral' | 'inprogress' | 'schedueled'|'warning';
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
  ];
  
  const getClassNameByStatus = (status?: Status, tab?: string) => {
    const variant = status?.variant;
      // Add your specific logic for "application" tab here, or return a default class
      if (variant === 'success') return 'bg-Success-50 border-Success-200 text-Success-700';
      if (variant === 'error') return 'bg-Error-50 border-Error-200 text-Error-700';
      if (variant === 'neutral' && status?.text !== 'Qualified')
        return 'bg-Indigo-50 border-Indigo-200 text-Indigo-700';
      if (variant === 'schedueled') return 'bg-Bran-50 border-Brand-200 text-Brand-700';
      if (variant === 'neutral' && status?.text === 'Qualified')
        return 'bg-Success-50 border-Success-200 text-Success-700';
      if (variant === 'inprogress') return 'bg-Gray-50 border-Gray-200 text-Gray-700';
      if (variant === 'warning') return 'bg-Warning-50 border-Warning-200 text-Warning-700';
  };

export function TenantProfile({
  tenantData,
  index,
  isOpen,
  toggleCollapse,
}: Props) {
    const status = statuses.find((item) => item.value === tenantData.process);
  const statusText = status?.text ?? 'Unknown status';
  const statusClassName = getClassNameByStatus(status);
  const [moveAppartmentModalOpen,setMoveAppartmentModalOpen] = useState(false)
  const [cancelMoveInModal, setCancelMoveInModal] = useState(false);
  const [moveOutTenantModal, setMoveOutTenantModal] = useState(false);
  const [cancelLeaseModal, setCancelLeaseModal] = useState(false);
  return (
    <>
    <Card
      classNames={{
        root: 'flex w-full flex-col items-start self-stretch rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs',
        section: 'flex flex-col items-start self-stretch',
      }}
    >
      <CardSection>
        <div className='flex items-start self-stretch'>
        {tenantData.img == null ? (
          <div className="flex w-md-1 flex-col justify-center relative bg-Gray-100 border-solid border-Gray-200 border-[1px] border-r-[0px] items-center gap-2.5 self-stretch">
            <Badge classNames={{
                root: clsx(statusClassName,'felx px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid'),
                label: clsx(statusClassName,'text-center text-xs font-medium leading-18')
            }} className='absolute top-6 left-6'>
                {tenantData.process}
            </Badge>
            <Users04Icon stroke='#475467' width={80} height={80} />
            <Badge classNames={{
                    root: 'felx px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid border-Brand-200 bg-Brand-50',
                    label:
                      'text-Brand-700 text-center text-xs font-medium leading-18',
                  }} className='absolute bottom-6 left-6'>
                {tenantData.process}
            </Badge>
          </div>
        ) : (
          <div
            className="flex relative w-md-1 flex-col justify-center items-center gap-2.5 self-stretch bg-center bg-no-repeat bg-cover bg-gray-300"
            style={{
              backgroundImage: `url(${tenantData.img}), linear-gradient(lightgray 50%, #E0E0E0)`,
            }}
          >
            <Badge classNames={{
                root: clsx(statusClassName,'felx px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid'),
                label: clsx(statusClassName,'text-center text-xs font-medium leading-18')
            }} className='absolute top-6 left-6'>
                {tenantData.process}
            </Badge>
            <Badge classNames={{
                    root: 'felx px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid border-Brand-200 bg-Brand-50',
                    label:
                      'text-Brand-700 text-center text-xs font-medium leading-18',
                  }} className='absolute bottom-6 left-6'>
                {tenantData.process}
            </Badge>
            {/* <Image src={tenantData.img} alt="" className='h-full bg-cover' /> */}
          </div>
        )}
        <div className="flex flex-col items-start flex-0">
          <div className="flex items-start self-stretch">
            <div className="flex p-6 flex-col items-start gap-1 flex-0 slef-stretch">
              {tenantData.badge !== null && (
                <Badge
                  classNames={{
                    root: 'felx px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid border-Gray-200 bg-Gray-50',
                    label:
                      'text-Gray-700 text-center text-xs font-medium leading-18',
                  }}
                >
                  {tenantData.badge}
                </Badge>
              )}
              <div className="flex items-center gap-2">
                <span className="text-Gray-600 text-2xl font-semibold leading-8">
                  {tenantData.name}
                </span>
              </div>
              <span className="text-Gray-600 text-sm font-medium leading-5">
                {tenantData.email}
              </span>
              <span className="text-Gray-600 text-sm font-semibold leading-5">
                {tenantData.phone}
              </span>
              <span className="text-Brand-700 text-sm font-semibold leading-5">
                {tenantData.leaseAgreement}
              </span>
              <span className="text-Gray-600 text-sm font-medium leading-5">
                {tenantData.moveDate}
              </span>
            </div>
            <div className="flex flex-col justify-between items-center self-stretch">
              <div className="flex px-6 pb-2 pt-6 flex-col items-end gap-0.5 self-stretch">
                <Badge
                  classNames={{
                    root: `flex px-1.5 py-0.5 items-center rounded-[6px] border-solid border-[1px] ${
                      tenantData.status === 'QTG Qualified'
                        ? 'border-Indigo-200 bg-Indigo-50'
                        : 'border-Success-200 bg-Success-50'
                    }`,
                    label: `text-xs text-center font-medium leading-18 ${
                      tenantData.status === 'QTG Qualified'
                        ? 'text-Indigo-700'
                        : 'text-Success-700'
                    }`,
                  }}
                >
                  {tenantData.status}
                </Badge>
                <div className="flex justify-center items-center gap-1.5">
                  <span
                    className={`text-sm font-semibold leading-5 ${
                      tenantData.lease === 'Guarantee lease'
                        ? 'text-Success-700'
                        : 'text-Brand-700'
                    }`}
                  >
                    {tenantData.lease}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1.5">
                  <span className="text-sm font-semibold leading-5 text-Brand-700">
                    {tenantData.noticeStatus}
                  </span>
                </div>
              </div>
              <div className="flex px-6 py-4 flex-col items-end gap-0.5 self-stretch">
                <div className="flex justify-center items-center gap-1.5">
                  <span className="text-sm font-semibold leading-5 text-Brand-700 cursor-pointer">
                    {tenantData.renew}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1.5">
                  <span className="text-sm font-semibold leading-5 cursor-pointer text-Brand-700 cursor-pointer" onClick={()=> setMoveAppartmentModalOpen(true)}>
                    {tenantData.moveApartment}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1.5">
                  <span className="text-sm font-semibold leading-5 text-Brand-700 cursor-pointer" onClick={()=>{setCancelLeaseModal(true)}}>
                    {tenantData.moveOut}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`flex flex-col items-center self-stretch border-t-[1px] border-solid border-Gray-200 ${isOpen ? 'border-b-[1px] border-solid border-Gray-200' : ''}`}>
            <div className="flex py-4 px-6 justify-between items-center self-stretch">
              <div className="flex justify-center items-center gap-1.5">
                <span className="text-Gray-600 text-sm font-semibold leading-5">
                  {tenantData.expireDate}
                </span>
              </div>
              <div
                className="flex justify-center items-centre gap-0.5 cursor-pointer"
                onClick={toggleCollapse}
              >
                <span className="text-Brand-700 text-sm font-semibold leading-5">
                  View details
                </span>
                {!isOpen ?(
                    <ChevronDownIcon height={20} width={20} stroke="#363F72" />
                ):(
                    <ChevronUp />
                )} 
              </div>
            </div>
          </div>
        </div>
        </div>
        <Collapse className='' in={isOpen}>
          <TenantProfileDetails type={tenantData.status} />
        </Collapse>
      </CardSection>
    </Card>
    <MoveAppartmentModal moveAppartmentModalOpen={moveAppartmentModalOpen} setMoveAppartmentModalOpen={setMoveAppartmentModalOpen} />
    <CancelMoveInModal setCancelMoveInModal={setCancelMoveInModal} cancelMoveInModal = {cancelMoveInModal} leaseAgreement={tenantData.leaseAgreement} />
    <MoveOutTenantModal setMoveOutTenantModal= {setMoveOutTenantModal} moveOutTenantModal= {moveOutTenantModal} />
    <CancelLeaseModal setCancelLeaseModal= {setCancelLeaseModal} cancelLeaseModal= {cancelLeaseModal} />
    </>
  );
}
