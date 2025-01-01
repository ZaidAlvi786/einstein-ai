import UnitDetail from '@components/Leasing/NewApplication/UnitDetail';
import Steps from '@components/Leasing/NewApplication/./Stepper';
import ApplicantInputs from '@components/Leasing/NewApplication/./ApplicantForm/ApplicantForm';
import { useCounter } from '@mantine/hooks';
import ApplicantDetailForm from '@components/Leasing/NewApplication/./ApplicantDetailForm';
import ApplicantIdentificationForm from '@components/Leasing/NewApplication/./ApplicantIdentificationForm';
import ApplicationProssesing from '@components/Leasing/NewApplication/ApplicationProssesing';
import CoApplicant from '@components/Leasing/NewApplication/./SideBar/CoApllicant';
export function NewApplication() {
  const [step, handlers] = useCounter(1, { min: 1, max: 4 });

  return (
    <>
      <div className="grid grid-cols-7 ">
        <div className=" col-span-5 bg-Gray-50 px-8 pt-6 pb-8">
          <div className="mt-5 text-Gray-900 font-semibold text-3xl">New application</div>
          <div className="mt-1 text-Gray-600 font-normal text-base ">
            Update your photo and personal details here.
          </div>
          <div className="my-10 mx-20">
            <Steps step={step - 1} />
          </div>
          <div className="border-solid border border-gray-960 rounded-[12px] bg-white mx-9 ">
            {step === 1 && <ApplicantInputs step={step} handlers={handlers} />}
            {step === 2 && <ApplicantDetailForm step={step} handlers={handlers} />}
            {step === 3 && <ApplicantIdentificationForm step={step} handlers={handlers} />}
            {step === 4 && <ApplicationProssesing step={step} handlers={handlers} />}
          </div>
        </div>
        <div className="col-span-2 bg-white ">
          <UnitDetail />
          {step > 1 && <CoApplicant />}
        </div>
      </div>
    </>
  );
}
