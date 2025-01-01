import { AlertCircleIcon } from '@assets/iconComponents';
import { Alert, Button, Checkbox } from '@mantine/core';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
    setModalSize: (item: string) => void;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
  setEndLeaseModalModalOpen: (item: boolean) => void;
}
export function Agreement({setModalSize,handlers,setEndLeaseModalModalOpen}:Props) {
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
  const onSubmit = () => {
    handlers.increment()
    setModalSize('sm')
  }
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
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
      <div className="flex pt-0 pb-6 pt-8 px-6 items-start gap-3 self-stretch">
        <Button
          size="md"
          variant="outline"
          className="bg-white w-1/2 border-gray-300 text-gray-700 text-base font-semibold rounded-lg"
          classNames={{ label: 'text-gray-700' }}
        onClick={() => {setEndLeaseModalModalOpen(false)}}
        >
          Cancel
        </Button>
        <Button
                        size="md"
                        className="bg-brand-970 w-1/2 hover:bg-brand-960 text-base font-semibold rounded-lg"
                       onClick={onSubmit}
                    >
                        Continue
                    </Button>
      </div>
    </div>
  );
}
