import { useCounter } from '@mantine/hooks';
import React, { createContext, useContext, useState } from 'react'
import Steps from './Stepper';
import AddLeaseForm from './AddLeaseForm/AddLeaseForm';
import LeaseDetailForm from './LeaseDetailForm';
import UnitDetail from './SideBar/UnitDetail';
import Applicant from './SideBar/Applicant';
import QualityTenantGurantee from './QualityTenantGurantee';
// import QualityTenant from '@components/Properties/Tenant/SideBar/QualityTenantGuarntee';
import ProofOfIncome from './ProofOfIncome';
import TenantIdentificationForm from './TenantIdentificationForm';
import SkipModal from './Modals/SkipModal';
import QualityTenant from './SideBar/QualityTenantGuarntee';

export const MyContext = createContext<any>(undefined);
const AddLease = () => {
  const[verifiedTenant,setVerifiedTenant]=useState(false)
  const [step, handlers] = useCounter(1, { min: 1, max: verifiedTenant?3:5 });
  const [skipModal,setShowSkipModal]=useState(false)

  return (
    <>
    <MyContext.Provider value={{verifiedTenant,skipModal,setShowSkipModal}}>
    <div className="grid grid-cols-7 ">
      <div className=" col-span-5 bg-Gray-50 px-8 pt-6 pb-8">
        <div className="mt-5 text-Gray-900 font-semibold text-3xl">Add Lease</div>
        <div className="mt-1 text-Gray-600 font-normal text-base ">
          Update your photo and personal details here.
        </div>
        <div className="my-10 mx-20">
          <Steps step={step - 1} verifiedTenant={verifiedTenant} />
        </div>
        <div className="border-solid border border-gray-960 rounded-[12px] bg-white mx-9 ">
          {step === 1 && <AddLeaseForm  step={step} handlers={handlers}  />}
          {step === 2 && <LeaseDetailForm  step={step} handlers={handlers} />}
          { verifiedTenant && step === 3 && <QualityTenantGurantee  step={step} handlers={handlers} />}
          {!verifiedTenant && step===3 && <ProofOfIncome  step={step} handlers={handlers}/>}
          {!verifiedTenant && step === 4 && <TenantIdentificationForm  step={step} handlers={handlers} />}
          { !verifiedTenant && step === 5 && <QualityTenantGurantee  step={step} handlers={handlers} />}
        </div>
      </div>
      <div className="col-span-2 bg-white ">
        <UnitDetail />
        {step > 1 && <Applicant verifiedTenant={verifiedTenant} />}
        {verifiedTenant && step === 3 && <QualityTenant />}
        {!verifiedTenant && step===5 &&  <QualityTenant /> }
      </div>
    </div>
    <SkipModal step={step} handlers={handlers} />
    </MyContext.Provider>
  </>
  )
}

export default AddLease