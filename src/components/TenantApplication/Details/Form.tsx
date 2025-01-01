import CustomInput from "@utils/CustomInput"
import { DetailFormSchema } from "../Schema";
import { UseFormReturn } from "react-hook-form";
import { DateIcon, EmailIcon02 } from "@assets/iconComponents";
interface Props {
    methods: UseFormReturn<DetailFormSchema>;
  }
  
export const DetailsFrom = ({ methods }: Props)=>{
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        getValues,
        setValue,
        clearErrors,
        reset,
        ...form
      } = methods;
      
    return (
        <div className="flex flex-col gap-6 w-full items-start">
             <div className="grid grid-cols-2 w-full gap-6 ">
            <CustomInput
            className="col-span-1"
              label="First name*"
              placeholder="First name"
              {...register('firstName')}
             
              error={errors.firstName?.message}
            />
            <CustomInput className="col-span-1"
              label="Last name* "
              placeholder="Last name"
              {...register('lastName')}
              
              error={errors.lastName?.message}
            />
          </div>
          <div className="grid grid-cols-2 w-full gap-6 ">
            <CustomInput className="col-span-1"
            leftSection={<DateIcon className="size-5" />}
              label="Desired move-in date*"
              placeholder="Select date"
              {...register('moveInDate')}
             
              error={errors.moveInDate?.message}
            />
            <CustomInput className="col-span-1"
              label="Lease length* "
              placeholder="Enter lease length"
              {...register('leaseLength')}
              
              error={errors.leaseLength?.message}
            />
          </div>
          <div className="grid grid-cols-2 w-full gap-6 ">
            <CustomInput className="col-span-1"
              leftSection={<EmailIcon02 className="size-5" />}
              label="Email address"
              placeholder="Enter email address"
              {...register('email')}
              
              error={errors.email?.message}
            />
            <CustomInput className="col-span-1"
              label="Phone number"
              placeholder="Enter phone number"
              {...register('phoneNumber')}
             
              error={errors.phoneNumber?.message}
            />
          </div>
          <div className="grid grid-cols-2 w-full gap-6 ">
            <CustomInput className="col-span-1"
              label="Social security"
              placeholder="000-00-0000"
              {...register('socialSecurity')}
            />
            <CustomInput className="col-span-1"
            leftSection={<DateIcon className="size-5" />}
              label="Date of Birth"
              placeholder="Select day"
              {...register('birthDate')}
              
            />
          </div>
          
        </div>
    )
}