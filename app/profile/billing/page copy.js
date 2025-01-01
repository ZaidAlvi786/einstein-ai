"use client";
import React, { useState, useMemo } from 'react'
import { Button, Card, CardBody, CardHeader, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { useGetCustomersCardsQuery, useGetPlatformPlansQuery, useGetUserInvoiceHistoryQuery } from '@/app/lib/features/payment/paymentApi';
import { useAuth } from '@/app/authContext/auth';
import AddCardFormModal from '@/components/billing/AddCardFormModal';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import RecurringIcon from '@/app/assets/svg/icon-recurring.svg';
import OneTimeChargesIcon from '@/app/assets/svg/icon-one-time-charges.svg';
import ActionIcon from '@/app/assets/svg/action-icon.svg';
import moment from 'moment';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
const NextInvoiceDate = dynamic(() => import('@/components/billing/NextInvoiceDate'), { ssr: false });

const Billing = () => {
  const auth = useAuth();
  const { data: cardsList, isFetching: cardsListLoading } = useGetCustomersCardsQuery({ user_id: auth?.user?.userID }, { skip: (!auth?.user?.userID && !auth?.user?.email) });
  const { data: InvoiceHistory } = useGetUserInvoiceHistoryQuery({ user_id: auth?.user?.userID }, { skip: !auth?.user?.userID });
  const { data: PlatformPlans } = useGetPlatformPlansQuery();
  const [OpenCardModal, setOpenCardModal] = useState({ open: false, mode: "", card_details: null });
  const router = useRouter();

  const classNames = useMemo(() => ({
    table: ["mb-16", "border-spacing-y-4", "border-separate"],
    th: ["bg-transparent", "text-white", "helvetica-font", "font-medium", "text-[10px]", "leading-[14px]", '[&>tr:last-child]:!mt-0', '[&>tr:last-child]:!h-0'],
    thead: "[&>tr:last-child]:hidden"
  }), []);

  const overViewClassNames = useMemo(() => ({
    th: ["bg-transparent", "text-white", "helvetica-font", "font-medium", '[&>tr:last-child]:!mt-0', '[&>tr:last-child]:!h-0', 'border-[#404040]', 'border-b-1'],
    thead: "[&>tr:last-child]:hidden",
    tr: ["outline-0", ""],
    tbody: "m-6",
  }), []);

  const navigateToBuySubscription = () => {
    if (cardsList?.payment_methods?.length > 0) {
      router.push('/profile/buy-subscription');
    } else {
      toast.error("Please First Add Your Card Details.");
    }
  };

  const getCardLogoImage = (name) => {
    switch (name) {
      case 'Visa':
        return 'https://i.imgur.com/ekLkVPr.png';
      case 'Mastercard':
        return 'https://i.imgur.com/bbPHJVe.png';
      case 'American Express':
        return 'https://i.imgur.com/8fl43Df.png';
      case 'RuPay':
        return 'https://i.imgur.com/4iZ6frQ.png';
      default:
        return 'Image not found';
    }
  };

  return (<>
    <div className='max-w-[865px] w-full mx-auto px-6 flex flex-col lg:justify-normal min-[1800px]:justify-center'>
      <div className='mb-8 pt-8'>
        <h2 className='text-[32px] text-white font-medium helvetica-font mb-[14px]'>{`Billing`}</h2>
        <p className='helvetica-font text-sm text-[#B5B5B5] font-medium'>{`Effortlessly handle your billing and invoices right here.`}</p>
      </div>
      <div className='flex items-start gap-4 w-full'>
        <div className='w-full gap-4 flex flex-col'>
          <div>
            <NextInvoiceDate />
          </div>
          <div>
            <Card className="planning-card shadow-billingCard rounded-3xl py-[20px] px-[22px] h-fit ">
              <CardHeader className="font-bold flex helvetica-font justify-between p-0">
                <p className="text-sm leading-5">Overview</p>
              </CardHeader>
              <CardBody className='p-0'>
                <Table removeWrapper classNames={overViewClassNames}>
                  <TableHeader>
                    <TableColumn className='px-0'>CATEGORY</TableColumn>
                    <TableColumn className='px-0'>BILLING TYPE</TableColumn>
                    <TableColumn className='px-0'>COST</TableColumn>
                  </TableHeader>
                  <TableBody className='p-6'>
                    <TableRow key="0">
                      <TableCell className='flex items-center gap-[5px] px-0 py-[3px]'><RecurringIcon className="text-white" />Recurring</TableCell>
                      <TableCell className='px-0 py-[3px]'></TableCell>
                      <TableCell className='px-0 py-[3px]'></TableCell>
                    </TableRow>
                    <TableRow key="1">
                      <TableCell className='px-0 py-[3px]'>Einstein Ultra</TableCell>
                      <TableCell className='px-0 py-[3px]'>Monthly</TableCell>
                      <TableCell className='px-0 py-[3px]'>$9</TableCell>
                    </TableRow>
                    <TableRow key="2">
                      <TableCell className='px-0 py-[3px]'>Subscriptions</TableCell>
                      <TableCell className='px-0 py-[3px]'>Monthly</TableCell>
                      <TableCell className='px-0 py-[3px]'>$21</TableCell>
                    </TableRow>
                    <TableRow key="2" className=''>
                      <TableCell className='text-[14px] font-bold px-0 py-[3px] pb-[26px]'>Total</TableCell>
                      <TableCell className='px-0 py-[3px] pb-[26px]'></TableCell>
                      <TableCell className='text-[14px] font-bold px-0 py-[3px] pb-[26px]'>$30</TableCell>
                    </TableRow>

                    <TableRow key="3">
                      <TableCell className='flex items-center gap-[5px] px-0 py-[3px]  pb-[14px]'><OneTimeChargesIcon className="text-white" />One-Time Charges</TableCell>
                      <TableCell className='px-0 py-[3px]'></TableCell>
                      <TableCell className='px-0 py-[3px]'></TableCell>
                    </TableRow>

                    <TableRow key="4">
                      <TableCell className='px-0 py-[3px]'>Single Use Tools</TableCell>
                      <TableCell className='px-0 py-[3px]'>Next Invoice Only</TableCell>
                      <TableCell className='px-0 py-[3px]'>$3.50</TableCell>
                    </TableRow>

                    <TableRow key="5">
                      <TableCell className='px-0 py-[3px]'>Extra Queries</TableCell>
                      <TableCell className='px-0 py-[3px]'>Next Invoice Only</TableCell>
                      <TableCell className='px-0 py-[3px]'>$2.13</TableCell>
                    </TableRow>

                    <TableRow key="5">
                      <TableCell className='px-0 py-[3px]'>Extra Data</TableCell>
                      <TableCell className='px-0 py-[3px]'>Next Invoice Only</TableCell>
                      <TableCell className='px-0 py-[3px]'>$1.25</TableCell>
                    </TableRow>

                    <TableRow key="">
                      <TableCell className='text-[14px] font-bold px-0 py-[3px]'>Total</TableCell>
                      <TableCell className='px-0 py-[3px]'></TableCell>
                      <TableCell className='text-[14px] font-bold px-0 py-[3px]'>$6.88</TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
                {/* <div className='pb-1 border-[#404040] border-b-1 flex items-center justify-between'>
                <h3 className='helvetica-font font-bold text-[10px] text-white'>CATEGORY</h3>
                <h3 className='helvetica-font font-bold text-[10px] text-white'>BILLING TYPE</h3>
                <h3 className='helvetica-font font-bold text-[10px] text-white'>COST</h3>
              </div>
              <div className='mt-6'>
                <h3 className='helvetica-font font-bold text-xs text-white'>Recurring</h3>
                <div className='flex items-center justify-between flex-col gap-[3px] mt-[10px]'>
                  <div className='flex items-center justify-between w-full'>
                    <h3 className='helvetica-font font-normal text-[14px] text-white'>Einstein Ultra</h3>
                    <h3 className='helvetica-font font-normal text-[14px] text-white'>Monthly</h3>
                    <h3 className='helvetica-font font-normal text-[14px] text-white'>$9</h3>
                  </div>
                  <div className='flex items-center justify-between w-full'>
                    <h3 className='helvetica-font font-normal text-[14px] text-white'>Subscriptions</h3>
                    <h3 className='helvetica-font font-normal text-[14px] text-white'>Monthly</h3>
                    <h3 className='helvetica-font font-normal text-[14px] text-white'>$21</h3>
                  </div>
                  <div className='flex items-center justify-between w-full'>
                    <h3 className='helvetica-font text-[14px] font-bold text-white'>Total</h3>

                    <h3 className='helvetica-font font-bold text-[14px] text-white'>$30</h3>
                  </div>
                </div>
              </div> */}
              </CardBody>
            </Card>
          </div>
        </div>
        <div className='w-full gap-4 flex flex-col'>
          <div className='flex-1'>
            {cardsListLoading ? (
              <Skeleton className={`rounded-3xl h-fit`}>
                <div className="h-[140px] w-full"></div>
              </Skeleton>
            ) : (
              <Card className="planning-card shadow-billingCard rounded-3xl h-fit px-[22px] py-[20px]">
                <CardHeader className="font-bold flex helvetica-font justify-between p-0">
                  <p className="text-sm leading-5">Payment Method</p>
                </CardHeader>
                <CardBody className='p-0'>
                  {cardsList?.payment_methods?.length > 0 ?
                    cardsList?.payment_methods?.slice(0, 1)?.map((card, key) => (
                      <div key={key} className='rounded pt-[16px] flex justify-between w-full'>
                        <div className='flex gap-[11px]'>
                          <div className='w-14 h-14'>
                            <img className="h-full w-full object-contain" src={getCardLogoImage(card?.card_type)} alt="Logo" />
                          </div>
                          <div className=''>
                            <p className='font-medium	 text-[14px] leading-[14px] helvetica-font mb-[5px]'>{card?.card_type}</p>
                            <p className='font-medium	 text-[14px] leading-[14px] helvetica-font mb-[5px]'>**** **** **** {card?.card_number}</p>
                            <p className='font-medium	 text-[14px] leading-[14px] helvetica-font mb-[5px]'>Expiry on {card?.card_expired}</p>
                            <div className='flex items-center gap-1 font-medium text-[14px] leading-[14px] helvetica-font mb-[5px]'><EnvelopeIcon className="text-[#818181] h-4 w-4" />{card?.email}</div>
                          </div>
                        </div>
                        <Button
                          variant="light"
                          className='border border-solid border-gray-200 rounded helvetica-font font-bold text-[10px] leading-[14px]'
                          onClick={() => setOpenCardModal({ open: true, mode: "edit", card_details: card })}
                        >
                          {`Manage`}
                        </Button>
                      </div>
                    ))
                    :
                    <div className='rounded py-4 flex justify-center w-full'>
                      <Button
                        variant="light"
                        className='border border-solid border-gray-200 rounded helvetica-font font-bold leading-[14px]'
                        onClick={() => setOpenCardModal({ open: true, mode: "add", card_details: null })}
                      >
                        {`Add Card`}
                      </Button>
                    </div>
                  }
                </CardBody>
              </Card>
            )}
          </div>
          <div className='flex-1'>
            <Card className="planning-card shadow-billingCard rounded-3xl h-fit py-[15px] px-[23px]">
              <CardHeader className="font-bold flex helvetica-font justify-between p-0">
                <p className="text-sm leading-5">Recurring Charges</p>
              </CardHeader>
              <CardBody className='flex items-center gap-[13px] justify-between p-0'>
                <div className='flex items-center justify-between w-full'>
                  <p className='text-sm font-normal helvetica-font'>Einstein Ultra</p>
                  <Button className="w-[54px] h-[24px] min-w-unit-0 text-black bg-white text-[10px] font-bold rounded" onClick={navigateToBuySubscription}>
                    Manage
                  </Button>
                </div>

                <div className='flex items-center justify-between w-full'>
                  <p className='text-sm font-normal helvetica-font'>12 Subscriptions</p>
                  <Button className="w-[54px] h-[24px] min-w-unit-0 text-black bg-white text-[10px] font-bold rounded" onClick={navigateToBuySubscription}>
                    Manage
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className='flex-1'>
            <Card className="planning-card shadow-billingCard rounded-3xl h-fit">
              <CardHeader className="font-bold flex helvetica-font justify-between py-[15px] px-[23px]">
                <p className="text-sm leading-5">One-Time Charges</p>
              </CardHeader>
              <CardBody className='flex items-center gap-[17px] justify-between pb-[15px] px-[23px]'>
                <div className='flex items-center justify-between w-full'>
                  <p className='text-sm font-normal helvetica-font'>Single Use Tools</p>
                  <Button variant="light" className='border border-solid border-gray-200 rounded helvetica-font font-bold text-[10px] min-w-unit-0 h-unit-0 py-[10px] px-[17px]'>
                    Info
                  </Button>
                </div>

                <div className='flex items-center justify-between w-full'>
                  <p className='text-sm font-normal helvetica-font'>Extra Queries</p>
                  <Button variant="light" className='border border-solid border-gray-200 rounded helvetica-font font-bold text-[10px] min-w-unit-0 h-unit-0 py-[10px] px-[17px]'>
                    Info
                  </Button>
                </div>

                <div className='flex items-center justify-between w-full'>
                  <p className='text-sm font-normal helvetica-font'>Extra Data</p>
                  <Button variant="light" className='border border-solid border-gray-200 rounded helvetica-font font-bold text-[10px] min-w-unit-0 h-unit-0 py-[10px] px-[17px]'>
                    Info
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between mt-16 mb-4">
          <p className="text-white font-bold helvetica-font text-base">{`Past Invoices`}</p>
          <Button className="h-[24px] min-w-unit-0 text-[#F9F9F9] bg-[#999999] text-[10px] font-bold rounded py-2 px-3">
            {`Download`}
          </Button>
        </div>
        <div>
          <Table removeWrapper classNames={classNames} className='helvetica-font'>
            <TableHeader>
              <TableColumn className='h-auto'>Invoice ID</TableColumn>
              <TableColumn className='h-auto text-center'>Billing Date</TableColumn>
              <TableColumn className='h-auto text-center'>Plan</TableColumn>
              <TableColumn className='h-auto text-center w-52'>Amount</TableColumn>
              <TableColumn className='h-auto text-center w-[70px]'>Status</TableColumn>
              <TableColumn className='h-auto w-[52px]'></TableColumn>
            </TableHeader>
            {InvoiceHistory?.data?.length > 0 ?
              <TableBody>
                {InvoiceHistory?.data?.map((item) => (
                  <TableRow key={item.id} className='rounded-3xl pb-4 planning-card shadow-billingCard'>
                    <TableCell className="font-normal text-[14px] leading-[14px] text-white py-3.5 ps-[18px] rounded-l-3xl">{item?.invoice_id}</TableCell>
                    <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-3.5">{moment(item?.created_at).format("DD MMM YYYY")}</TableCell>
                    <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-3.5">{PlatformPlans?.find((p) => p?.id === item?.plan_id)?.plan_name ?? "-"}</TableCell>
                    <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-3.5">{`$ ${item?.invoice_amount}`}</TableCell>
                    <TableCell className="font-normal text-[14px] leading-[14px] text-white py-3.5">
                      <div className='bg-[#E1FFDC] text-[#41BA3D] font-bold text-[10px] leading-[14px] border-none py-1 px-6 w-fit rounded-full'>{"Paid"}</div>
                    </TableCell>
                    <TableCell className="font-normal text-[14px] leading-[14px] text-white py-3.5 rounded-r-3xl pr-[25px]">
                      <ActionIcon className="text-[#E6E6E6] ml-auto cursor-pointer" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              :
              <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
            }
          </Table>
        </div>
      </div>
    </div>

    {/* Manage Cards */}
    <AddCardFormModal OpenCardModal={OpenCardModal} setOpenCardModal={setOpenCardModal} />
  </>);
}

export default Billing