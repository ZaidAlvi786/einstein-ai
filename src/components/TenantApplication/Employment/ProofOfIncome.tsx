import { DocumnetUpload } from '../DocumentUpload';

const ProofOfIncome = () => {

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Proof of income
        </div>
        <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
          Upload last 2 paystubs or any other recent prooof of income showing monthly income *2 of
          rent
        </div>
        <DocumnetUpload />
      </div>
    </>
  );
};

export default ProofOfIncome;