import { AlertCircleIcon, DateIcon } from '@assets/iconComponents';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import { landlordSchema } from '../AmendLease/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Alert, Checkbox } from '@mantine/core';
import { useState } from 'react';

interface Props {
    type: string;
}
export function LadnlordForm({type}:Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(landlordSchema),
  });

  const [checked, setChecked] = useState(true);
  const icon = (
    <span className=" flex items-center justify-center outline-2 outline rounded-[24px] outline-[#d92d201a] outline-offset-4">
      <AlertCircleIcon
        width={20}
        height={20}
        opacity={100}
        className="outline-2 outline rounded-[24px] outline-[#d92d204d] outline-offset-1"
      />
    </span>
  );
  const icon2 = (
    <span className=" flex items-center justify-center outline-2 outline rounded-[24px] outline-[#3e47841a] outline-offset-4">
      <AlertCircleIcon
        width={20}
        height={20}
        opacity={100}
        stroke='#3E4784'
        className="outline-2 outline rounded-[24px] outline-[#3e47844d] outline-offset-1"
      />
    </span>
  );
  const label = (
    <div className="flex flex-col ga-1 items-start self-stretch">
      <span className="text-Gray-700 text-sm font-semibold leading-5">
        This lease is under the QTG
      </span>
      <span className="text-Gray-600 text-sm font-normal leading-5">
        Per our agrremnt a lease can’t be early terminated unless landlord has a new tenat to put in
        place.
      </span>
    </div>
  );
  const checkboxLabel = (
    <div className="flex flex-col items-start flex-0">
      <span className="text-Gray-700 text-sm font-medium leading-5">
        Add new tenant and end curent lease
      </span>
      <span className="text-Gray-600 text-sm font-normal leading-5">
        After finishin adding new lease, the exsiting lease will immtely be nended and tenants
        mooved out.
      </span>
    </div>
  );
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <fieldset className="grid-cols-2 w-full grid gap-6 ">
        <div className="flex flex-col col-span-1 items-start gap-2 flex-0">
          <CustomInput
            classNames={{
              root: 'flex flex-col items-start gap-1.5 self-stretch',
              label: '!mb-0',
              wrapper: 'w-full',
            }}
            leftSection={<DateIcon className="size-5" />}
            label="Move out date"
            placeholder="04/06/2024"
            {...register('moveOutDate')}
          />
        </div>
        <div className="flex flex-col items-start gap-2 col-span-1 flex-0">
          <CustomInput
            classNames={{
              root: 'flex flex-col items-start gap-1.5 self-stretch',
              label: '!mb-0',
              wrapper: 'w-full',
            }}
            label="Reason given (optional)"
            placeholder="Reason given for moving out"
            {...register('reason')}
          />
        </div>
      </fieldset>
      {type === 'QTG Qualified' ? (
           <Alert
           classNames={{
             root: 'flex p-4 items-start gap-4 self-stretch rounded-[12px] border-[1px] border-solid border-Error-300 bg-white drop-shadow-xs',
           }}
           variant="light"
           title={label}
           icon={icon}
         >
           <Checkbox
             classNames={{
               input: `${checked ? '!bg-Error-600 !border-Error-600' : ''}`,
             }}
             checked={checked}
             onChange={(event) => setChecked(event.currentTarget.checked)}
             defaultChecked
             label={checkboxLabel}
           />
           <div className="flex items-start gap-1">
             <span className="text-Gray-700 text-sm font-medium leading-5">Speciel case?</span>
             <span className="text-Gray-700 text-sm font-normal underline leading-5">
               Contact costmuer soppurt
             </span>
           </div>
         </Alert>
          ):(
            <Alert
              classNames={{
                root: 'flex p-4 items-start gap-4 self-stretch bg-white',
                label: 'text-Gray-700 text-sm font-semibold leading-5'
              }}
              variant="light"
              title='Tenant will be mooved out and lease will be ended itemtedly'
              icon={icon2}
            ></Alert>
          )}
    </div>
  );
}
