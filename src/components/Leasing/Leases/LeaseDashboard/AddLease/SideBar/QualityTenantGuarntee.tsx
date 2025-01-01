import { SuccessIcon } from '@assets/iconComponents';
import { TenantGuaranteeFeatures } from '@constants/app.constant';
import { Button } from '@mantine/core';
import { setShowSkipModal } from '@stores/addTenentSlice';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { MyContext } from '../AddLease';

const QualityTenant = () => {
  const {skipModal,setShowSkipModal} = useContext(MyContext);


  return (
    <div className="grid gap-4 px-6  mt-3">
      {' '}
      <div className="py-3  border-solid border-y-[1px] border-Success-700 ">
        <div className="text-center font-semibold	text-base text-success-800	">
          “Quality tenant” screening
        </div>
      </div>
      <div className='text-center text-sm font-semibold leading-5 text-Gray-600'>
      Enroll tenant into the QualityTenantGuarantee program 
      </div>
      <div className='text-grayBlue text-center font-semibold text-base leading-6'>
        Now only
      </div>
      <div className="flex  justify-between w-3/4 m-auto gap-3">
        <div className="text-5xl font-semibold ">%4</div>
                <div>
                    <div className=' text-grayBlue font-medium text-base leading-6'>
                    of monthly rent
                    </div>
                    <div className='text-Gray-600 leading-18 text-xs font-normal'>
                    Paid monthly with anuell comitment
                    </div>
                </div>
      </div>
      <div className="flex gap-4 flex-col flex-1 ">
        <ul className="list-disc font-semibold text-xs leading-18 text-Gray-700 ">
          {TenantGuaranteeFeatures.map((feature, index) => (
            <li key={index} className="list-disc">
              {feature}
            </li>
          ))}
        </ul>
      </div>
        <div className="flex text-sm tex-grayBlue leading-5 font-semibold justify-center cursor-pointer">
          See full details
        </div>
      <div className="font-normal text-sm text-gray-600  leading-5">
        The Rent Set Program will start 07/01/2024 for a 12 months perioud. After that it will auto
        renew on a anual bases unless canclled.
      </div>
      <Button
        variant="filled"
        className="border-solid border-[1px] border-success-600 bg-success-600 rounded-[8px] hover:bg-success-500 text-base font-semibold h-10 w-full "
        >
        Enroll
      </Button>
      <Button
        variant="outline"
        className="w-full border-gray-300 text-gray-700 rounded-lg h-10"
        onClick={()=>setShowSkipModal(true)}
      >
        Skip for now
      </Button>
    </div>
  );
};

export default QualityTenant;
