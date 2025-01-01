import CustomInput from '@utils/CustomInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { otherProofOfIncomeSchema } from '../Schema';
import { DocumnetUpload } from '../DocumentUpload';

const OhterProofOfIncome = () => {
  const methods = useForm({
    resolver: yupResolver(otherProofOfIncomeSchema),
    // defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    ...form
  } = methods;
  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-sm	font-medium rounded-[8px] leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Other proof of income
        </div>
        <fieldset className="grid-cols-2 grid gap-6 ">
          <CustomInput
            label="Monthly income*"
            placeholder="Enter monthly income"
            {...register('monthlyIncome')}
            error={errors.monthlyIncome?.message}
            onBlur={() => form.trigger('monthlyIncome')}
          />

          <CustomInput
            label="Income source*"
            placeholder="Enter income source"
            {...register('sourceOfIncome')}
            error={errors.sourceOfIncome?.message}
            onBlur={() => form.trigger('sourceOfIncome')}
          />
        </fieldset>
        <div className="text-sm font-normal text-Gray-600 text-center w-3/4 mx-auto px-6 leading-5">
          Upload last 2 paystubs or any other recent prooof of income showing monthly income *2 of
          rent
        </div>
        <DocumnetUpload />
      </div>
    </>
  );
};

export default OhterProofOfIncome;
