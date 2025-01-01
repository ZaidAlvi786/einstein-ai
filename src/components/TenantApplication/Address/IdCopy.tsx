import { DocumnetUpload } from '../DocumentUpload';

const IdCopy = () => {

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Copy of ID
        </div>
        <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
        Upload copy of ID. (this can be a passport, drivers lissence or any other goverment issued photo ID)
        </div>
        <DocumnetUpload />
      </div>
    </>
  );
};

export default IdCopy;