import { DateIcon, ShieldOffIcon, ShieldTickIcon } from '@assets/iconComponents';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '@utils/CustomInput';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { landlordSchema } from '../AmendLease/schema';
import { Alert, Checkbox, Group, Stack, Switch } from '@mantine/core';

const switches = [
  {
    label: 'Open claim',
    value: 'open-claim',
    description: 'Save my login details for next time.',
  },
  {
    label: 'Claim Security deposit',
    value: 'claim-security-deposit',
    description:
      'A security deposit claim will be started, you will need to submit some missing info on the next page in order to process the claim.',
  },
];
interface Props {
    type: string;
}
export function TenantForm({type}:Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(landlordSchema),
  });
  const [checked, setChecked] = useState(true);
  const [switchStates, setSwitchStates] = useState(switches.map(() => false));
  const [checkboxStates, setCheckboxStates] = useState([true, true, true]);
  useEffect(() => {
    if (type !== 'QTG Qualified') {
      setSwitchStates(switches.map(() => false));
      setCheckboxStates([false, false, false]);
    }
  }, [type]);
  const icon = (
    <span className=" flex items-center justify-center outline-2 outline rounded-[24px] outline-[#3e47841a] outline-offset-4">
      {type === 'QTG Qualified' ? (
        <ShieldTickIcon
        width={20}
        height={20}
        opacity={100}
        stroke="#3E4784"
        className="outline-2 outline rounded-[24px] outline-[#3e47844d] outline-offset-1"
      />
      ):(
        <ShieldOffIcon
        width={20}
        height={20}
        opacity={100}
        stroke="#3E4784"
        className="outline-2 outline rounded-[24px] outline-[#3e47844d] outline-offset-1"
      />
      )} 
    </span>
  );
  const label = (
    <div className="flex flex-col ga-1 items-start self-stretch">
      <span className="text-Gray-700 text-sm font-semibold leading-5">
       {type === 'QTG Qualified' ? 'This lease is under the QTG': 'Lease is not under under the QTG'} 
      </span>
      <span className="text-Gray-600 text-sm font-normal leading-5">
        {type === 'QTG Qualified' ? 'You are...': 'Unfurtently lease is not under the QTG program so rent is not covered. To avoid this in the futre make sure all curent leases are properly enrolled into the program.'}
      </span>
    </div>
  );
  const checkboxes = [
    {
      label: 'Tenant left without approval from landlord',
      description: 'Save my login details for next time.',
      checked: true,
    },
    {
      label: 'I have the right to collect the remaining rent from tenant',
      description: 'Save my login details for next time.',
      checked: true,
    },
    {
      label: 'I hereby give over collection right of the first two months of rent to Rent Set',
      description: 'Save my login details for next time.',
      checked: true,
    },
  ];
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
            label="Date of abortment"
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
      <div className="flex py-2 w-full flex-col items-center gap-2 rounded-[8px] border-[1px] border-solid border-Gray-200 bg-Gray-100 drop-shadow-xs">
          <span className="text-Gray-600 text-center text-sm font-medium leading-5">
          Quality Tenant Guarantee
          </span>
        </div>
      <Alert
        classNames={{
          root: 'flex p-4 items-start gap-3 self-stretch rounded-[12px] border-[1px] border-solid border-Gray-300 bg-white drop-shadow-xs',
          body: 'flex flex-col items-start self-stretch gap-3',
          message: 'flex flex-col items-start self-stretch gap-3'
        }}
        variant="light"
        title={label}
        icon={icon}
      >
        <Switch.Group>
          <Group>
            {switches.map((item) => (
              <Switch
                key={item.value}
                value={item.value}
                label={item.label}
                description={item.description}
              />
            ))}
          </Group>
        </Switch.Group>
        <div className="flex py-2 w-full flex-col items-center gap-2 rounded-[8px] border-[1px] border-solid border-Gray-200 bg-Gray-100 drop-shadow-xs">
          <span className="text-Gray-600 text-center text-sm font-medium leading-5">
            Acnolgments
          </span>
        </div>

        <Stack>
          {checkboxes.map((item, index) => (
            <Checkbox
              key={index}
              checked={item.checked}
              onChange={(event) => console.log(event.currentTarget.checked)}
              label={
                <div className="flex flex-col items-start">
                  <span className="text-Gray-700 text-sm font-medium">{item.label}</span>
                  <span className="text-Gray-600 text-sm font-normal">{item.description}</span>
                </div>
              }
              classNames={{
                input: `${item.checked ? '!bg-Brand-600 !border-Brand-600' : ''}`,
              }}
            />
          ))}
        </Stack>
      </Alert>
    </div>
  );
}
