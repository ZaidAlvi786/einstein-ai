import { UseFormReturn } from 'react-hook-form';
import { CustomInput } from '@utils/CustomInput';
import { Select } from '@mantine/core';
import { ArrowDown } from '@assets/iconComponents';
import { PaymentDetailsForm } from './schemas';
import { statesList } from '@constants/app.constant';

interface Props {
  methods: UseFormReturn<PaymentDetailsForm>;
}

export function BankDetails({ methods }: Props) {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = methods;

  return (
    <div className="flex flex-col">
      <div className="col-span-2">
        <div className="grid grid-cols-2 gap-4 mt-5">
          <CustomInput
            label="Account number*"
            placeholder="Enter account number"
            {...register(`bankAccount.accountNumber`)}
            error={errors.bankAccount?.accountNumber?.message}
          />
          <CustomInput
            label="Routing number*"
            placeholder="Enter routing number"
            {...register(`bankAccount.routingNumber`)}
            error={errors.bankAccount?.routingNumber?.message}
          />
          <Select
            {...register(`bankAccount.accountType`)}
            label="Account type"
            placeholder="Select type"
            checkIconPosition="right"
            rightSection={<ArrowDown />}
            data={
              [
                { value: 'checking', label: 'Checking' },
                { value: 'savings', label: 'Savings' },
              ] as { value: string; label: string }[]
            }
            onChange={(value: string | null) => {
              setValue(`bankAccount.accountType`, value ?? '');
              clearErrors(`bankAccount.accountType`);
            }}
            error={errors.bankAccount?.accountType?.message}
          />
          <CustomInput
            {...register(`bankAccount.nameOnAccount`)}
            label="Name on account*"
            placeholder="Enter name on account"
            error={errors.bankAccount?.nameOnAccount?.message}
          />
        </div>
      </div>
    </div>
  );
}
