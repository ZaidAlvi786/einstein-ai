import UnitDetail from './UnitDetail';
import Steps from './Stepper';
import AddTenantForm from './TenantForm/AddTenantForm';
import { useCounter } from '@mantine/hooks';
import LeaseDetailForm from './LeaseDetailForm';
import TenantIdentificationForm from './TenantIdentificationForm';
import ProofOfIncome from './ProofOfIncome';
import QualityTenantGurantee from './QualityTenantGurantee';
import TenantCoTenant from './SideBar/TenantCoTenant';
import QualityTenant from './SideBar/QualityTenantGuarntee';
import SkipModal from './Modals/SkipModal';

const AddTenant = () => {
  const [step, handlers] = useCounter(1, { min: 1, max: 5 });

  return (
    <>
      <div className="grid grid-cols-7 ">
        <div className=" col-span-5 bg-Gray-50 px-8 pt-6 pb-8">
          <div className="mt-5 text-Gray-900 font-semibold text-3xl">Add Tenant</div>
          <div className="mt-1 text-Gray-600 font-normal text-base ">
            Update your photo and personal details here.
          </div>
          <div className="my-10 mx-20">
            <Steps step={step - 1} />
          </div>
          <div className="border-solid border border-gray-960 rounded-[12px] bg-white mx-9 ">
            {step === 1 && <AddTenantForm step={step} handlers={handlers} />}
            {step === 2 && <LeaseDetailForm step={step} handlers={handlers} />}
            {step === 3 && <TenantIdentificationForm step={step} handlers={handlers} />}
            {step === 4 && <ProofOfIncome step={step} handlers={handlers} />}
            {step === 5 && <QualityTenantGurantee step={step} handlers={handlers} />}
          </div>
        </div>
        <div className="col-span-2 bg-white ">
          <UnitDetail />
          {step > 1 && <TenantCoTenant />}
          {step===5 && <QualityTenant />}
        </div>
      </div>
      <SkipModal step={step} handlers={handlers} />
    </>
  );
};

export default AddTenant;
