import { Delete01, Edit01Icon, Users04Icon } from '@assets/iconComponents';
import { Badge, Card } from '@mantine/core';

interface Props {
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ApplicantDetailCard = ({ applicant, index, onEdit, onDelete }: Props) => {
  return (
    <Card
      classNames={{
        root: 'gap-1 w-full p-4 rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white shadow-xs',
      }}
    >
      <div className='flex items-start w-full gap-'>  
        <div className="flex items-center w-full gap-4 flex-0">
          <span className="flex w-14 h-14 rounded-[9999px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
            <span className="h-full flex w-full p-3.5 justify-center items-center flex-0">
              <Users04Icon width={28} height={28} />
            </span>
          </span>
          <div className="flex flex-col items-start gap-0.5 flex-0">
            <div className="flex flex-start gap-1.5">
              <span className="text-Gray-700 text-base font-medium leading-6">
                {applicant.firstName} {applicant.lastName}
              </span>
              <Badge
                classNames={{
                  root: 'flex px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid border-Gray-200 bg-Gray-50',
                  label: 'text-Gray-700 text-center text-xs font-medium leading-18',
                }}
              >
                Co-applicant
              </Badge>
            </div>
            <span className="text-Gray-600 text-base font-normal leading-6">
              {applicant.phoneNumber}
            </span>
            <span className="text-Gray-600 text-base font-normal leading-6">{applicant.email}</span>
          </div>
        </div>
        <div className='flex justify-end items-start'>
          <div className='flex p-2 justify-center items-center gap-2 rounded-[8px] cursor-pointer' onClick={() => onEdit(index)}>
            <Edit01Icon width={20} height={20} />
          </div>
          <div className='flex p-2 justify-center items-center gap-2 rounded-[8px] cursor-pointer' onClick={() => onDelete(index)}>
            <Delete01 width={20} height={20} />
          </div>
        </div>
      </div>
    </Card>
  );
};
