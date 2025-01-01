import { UseFormReturn } from 'react-hook-form';
import { CustomInput } from '@utils/CustomInput';
import { Select } from '@mantine/core';
import { ArrowDown, CardIcon } from '@assets/iconComponents';
import { useDisclosure } from '@mantine/hooks';
import { PaymentDetailsForm } from './schemas';
import { statesList } from '@constants/app.constant';
import CardIcons from '@utils/CardIcons';
interface Props {
  methods: UseFormReturn<PaymentDetailsForm>;
}

export function CreditCardFields({ methods }: Props) {
  const {
    register,
    clearErrors,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  return (
    <div className="flex flex-col">
      <div className="col-span-2">
        <div className="grid grid-cols-3 gap-4 mt-5">
          <CustomInput
            label="Name on card*"
            className="col-span-2"
            placeholder="Enter name on card"
            {...register(`creditCard.name`)}
            error={errors.creditCard?.name?.message}
          />
          <CustomInput
            label="Date of expiry*"
            placeholder="mm / yyyy"
            {...register(`creditCard.date`)}
            error={errors.creditCard?.date?.message}
          />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <CustomInput
            leftSection={<CardIcons />}
            label="Card number*"
            className="col-span-3"
            type="number"  min="0"
            placeholder="1234 1234 1234 1234"
            {...register(`creditCard.cardNumber`)}
            value={getValues('creditCard.cardNumber') || ''}
            error={errors.creditCard?.cardNumber?.message}
          />
          <CustomInput
            label="CVV*"
            type="number"  min="0"
            placeholder="***"
            max={3}
            {...register(`creditCard.cvv`)}
            value={getValues('creditCard.cvv') || ''}
            error={errors.creditCard?.cvv?.message}
          />
        </div>
        <h4 className="mt-4 text-sm-semibold text-center h-9	text-gray-600 bg-gray-50 p-2">
          Billing Address
        </h4>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <CustomInput
            label="Address 1*"
            placeholder=" Enter address 1"
            {...register(`creditCard.address1`)}
            error={errors.creditCard?.address1?.message}
          />
          <CustomInput
            label="Address 2"
            placeholder="Enter address 2"
            {...register(`creditCard.address2`)}
            error={errors.creditCard?.address2?.message}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <CustomInput
            label="City*"
            placeholder="Enter City"
            {...register(`creditCard.city`)}
            error={errors.creditCard?.city?.message}
          />
          <Select
            {...register(`creditCard.state`)}
            label="State*"
            placeholder="Select State"
            checkIconPosition="right"
            rightSection={<ArrowDown />}
            data={statesList}
            onChange={(value: string | null) => {
              setValue(`creditCard.state`, value ?? '');
              clearErrors('creditCard.state');
            }}
            error={errors.creditCard?.state?.message}
          />
          <CustomInput
            {...register(`creditCard.zip`)}
            label="Zip Code*"
            placeholder="Enter Zip Code"
            error={errors.creditCard?.zip?.message}
            value={getValues('creditCard.zip') || ''}
            type="number"  min="0"
          />
        </div>
      </div>
    </div>
  );
}
