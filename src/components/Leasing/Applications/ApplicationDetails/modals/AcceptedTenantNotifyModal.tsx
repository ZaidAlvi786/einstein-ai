import {
  AlertCircleIcon,
  ChevronDownIcon,
  DefaultFileIcon,
  Delete01,
  EyeIcon,
  Mail01Icon,
  UploadCloud02Icon,
} from '@assets/iconComponents';
import { iconsByExtension } from '@constants/fileIconsByExtension.contant';
import { Avatar, Box, Button, Checkbox, Grid, Input, Modal, Select, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { TextEditor } from '@shared/components/TextEditor/TextEditor';
import { formatFileSize } from '@utils/formatFileSize';
import clsx from 'clsx';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface AcceptedTenantNotifyModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  qualityTenantGuarantee: boolean;
  securityDepositWaiver: boolean;
  office: boolean;
  email: boolean;
  applyFeeToTenant: string;
  officeAddress: string;
  openingHours: string;
  firstMonthRentDue: boolean;
  acceptedPaymentMethods: string;
  allowingSavingApartment: boolean;
  accountContactInfo: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
}

const initialNotifyEmail = `
  <p>Hi [First name].</p>
  <p></p>
  <p>We are glad to inform you that you are approved for renting our apartment at 123 Main St NY NY unit 101 for as low as $2,000/month.</p>
  <p></p>
  <p>The next step is to sign a 12-month lease agreement. This can be done in one of the following ways:</p>
  <p></p>
  <ul>
    <li>Visiting our office at 123 Main St. NY NY, Mon - Fri 9 am - 5 pm.</li>
    <li>Printing the attached lease agreement, signing it, and emailing it back.</li>
  </ul>
  <p></p>
  <p>Sincerely yours</p>
  <p></p>
  <p>Anna Ban</p>
  <p>Whitestone Apartments</p>
  <p>212-212-1100</p>
  <p>email@email.com</p>
`;

export const AcceptedTenantNotifyModal: React.FC<AcceptedTenantNotifyModalProps> = ({
  open,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const [previewEmail, setPreviewEmail] = useState(false);

  const handleTogglePreviewEmail = () => {
    setPreviewEmail((prev) => !prev);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    onClose();
  };

  const [notifyEmail, setNotifyEmail] = useState('');
  const handleEmailChange = (content: string) => {
    setNotifyEmail(content);
  };

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const handleDrop = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveUploadedFile = (file: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== file));
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-xl modal-scroll',
        header: 'w-24 float-right bg-transparent absolute top-0 right-0',
        body: 'p-0',
        close: 'text-gray-400 ',
      }}
      size={'xl'}
    >
      <Box className="p-6 pt-3 flex flex-col gap-4 border-b border-solid border-Gray-200">
        <Box className="flex justify-center">
          <Avatar
            size={60}
            color="#EAECF5"
            variant="filled"
            radius="xl"
            className="border-8 border-solid border-Brand-50"
          >
            <Mail01Icon width={25} height={25} stroke="#3E4784" />
          </Avatar>
        </Box>
        <Box className="text-center">
          <Text className="font-semibold text-[18px] leading-[28px] text-Gray-900">
            Notify Tenant
          </Text>
          <Text className="font-normal text-[14px] leading-[20px] text-Gray-600">
            Let tenant know that they are aprroved and invite them to sign a lease.
          </Text>
        </Box>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="py-6 px-10 flex flex-col gap-6 border-b border-solid border-Gray-200">
          <Box className="py-2 px-0 bg-Gray-50 text-center">Waive security deposit</Box>

          <Box className="flex flex-col gap-5">
            <Box className="flex gap-3">
              <Checkbox color="#3E4784" {...register('qualityTenantGuarantee')} />
              <Box className="flex flex-col gap-1">
                <Box className="flex gap-1">
                  <Text className="text-Gray-700 text-[14px] leading-[20px] font-semibold">
                    Quality Tenant Guarantee
                  </Text>
                  <Text className="text-Gray-600 text-[14px] leading-[20px] font-medium">
                    %4 of monthly rent/month
                  </Text>
                </Box>
                <Text className="text-Gray-600 text-[14px] leading-[20px] font-normal">
                  12 months rent guaranteed (up to $100,000), rent payment reporting, eviction
                  filing fees, eviction legal fees (up to $1,000), leasing assistance (up to half
                  months rent).
                </Text>
              </Box>
            </Box>
            <Box className="flex gap-3">
              <Checkbox color="#3E4784" {...register('securityDepositWaiver')} />
              <Box className="flex flex-col gap-1">
                <Box className="flex gap-1">
                  <Text className="text-Gray-700 text-[14px] leading-[20px] font-semibold">
                    Security deposit waiver add on
                  </Text>
                  <Text className="text-Gray-600 text-[14px] leading-[20px] font-medium">
                    %1 of monthly rent/month
                  </Text>
                </Box>
                <Text className="text-Gray-600 text-[14px] leading-[20px] font-normal">
                  Waive the security deposit requirement from tenant, in case of tenant damage we
                  will cover up to 1 months rent. FInal enrolment and submit payment details, upon
                  lease sgining.
                </Text>
              </Box>
            </Box>
          </Box>

          <Box className="flex gap-3">
            <Checkbox color="#3E4784" {...register('applyFeeToTenant')} />
            <Box className="flex flex-1 gap-3">
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Apply fee to tenant
                  </Text>
                  <Box className="flex rounded-[8px] border border-solid border-Gray-300 items-center">
                    <Box className="pl-2">
                      <Input
                        variant="unstyled"
                        size="xs"
                        classNames={{ input: 'border-none w-[30px] p-0 h-[10px]' }}
                        type="number"
                      />
                    </Box>
                    <Box className="py-2 px-3 text-[16px] leading-[24px] font-normal text-Gray-600 border-l border-solid border-Gray-300">
                      % of monthly rent
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Your fee
                  </Text>
                  <Box className="flex rounded-[8px] border border-solid border-Gray-300 items-center">
                    <Box className="py-2 px-3 text-[16px] leading-[24px] font-normal text-Gray-600 border-l">
                      0% of monthly rent
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Total monthly rent
                  </Text>
                  <Box className="flex rounded-[8px] border border-solid border-Gray-300 items-center">
                    <Box className="py-2 px-3 text-[16px] leading-[24px] font-normal text-Gray-600 border-l">
                      $000
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="py-2 px-0 bg-Gray-50 text-center">Lease signing options</Box>

          <Box className="flex gap-3">
            <Checkbox
              color="#3E4784"
              {...register('office', { required: true })}
              classNames={{ input: clsx({ 'border border-solid border-red': errors.office }) }}
            />
            <Box className="flex flex-1 gap-3">
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Office
                  </Text>
                  <Input
                    placeholder="Enter full address"
                    classNames={{ input: clsx({ 'bg-Gray-50': watch('office') !== true }) }}
                    readOnly={watch('office') !== true}
                    {...register('officeAddress')}
                  />
                </Box>
              </Box>
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Opening hours
                  </Text>
                  <Input
                    placeholder="Enter opening hours"
                    classNames={{ input: clsx({ 'bg-Gray-50': watch('office') !== true }) }}
                    readOnly={watch('office') !== true}
                    {...register('openingHours')}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="flex gap-3">
            <Checkbox
              color="#3E4784"
              {...register('email', { required: true })}
              classNames={{ input: clsx({ 'border border-solid border-red': errors.email }) }}
            />
            <Box className="flex flex-1 gap-3">
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Email
                  </Text>
                  <Dropzone
                    multiple={true}
                    disabled={!watch('email')}
                    onDrop={handleDrop}
                    onReject={() => {}}
                    maxSize={5 * 1024 ** 2}
                    className="border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer  "
                  >
                    <Box className="flex items-center justify-center ">
                      <Box className="flex items-center justify-center  border-gray-960 rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
                        <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
                      </Box>
                      <Box>
                        <Box>
                          <Text className="text-sm font-semibold text-Brand-700 leading-5">
                            Click to upload draft lease
                          </Text>
                          <Text className="text-sm font-normal text-Gray-600  leading-5">
                            {' '}
                            or drag and drop
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Dropzone>
                </Box>
              </Box>
            </Box>
          </Box>
          {uploadedFiles.length > 0 && (
            <Grid>
              {uploadedFiles.map((file) => (
                <Grid.Col span={6}>
                  <Box className="flex justify-between border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer ">
                    <Box className="flex gap-3">
                      {iconsByExtension[
                        file.name.split('.').pop()?.toLowerCase() as keyof typeof iconsByExtension
                      ] || <DefaultFileIcon />}
                      <Box>
                        <Box className="text-sm font-medium leading-5  text-Gray-700">
                          {file?.name}
                        </Box>
                        <Box className="text-sm font-normal leading-5  text-Gray-600">
                          {formatFileSize(file?.size)}{' '}
                        </Box>
                      </Box>
                    </Box>
                    <Delete01
                      onClick={() => handleRemoveUploadedFile(file)}
                      className="text-gray-700 cursor-pointer "
                    />
                  </Box>
                </Grid.Col>
              ))}
            </Grid>
          )}

          <Box className="py-2 px-0 bg-Gray-50 text-center">Other terms</Box>

          <Box className="flex gap-3">
            <Checkbox color="#3E4784" {...register('firstMonthRentDue')} />
            <Box className="flex flex-1 gap-3">
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    First months rent due upon lease signing
                  </Text>
                </Box>
              </Box>
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Accepted payment methods
                  </Text>
                  <Controller
                    name="acceptedPaymentMethods"
                    control={control}
                    rules={{ required: 'This filed is required' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select"
                        data={[
                          'Credit Card',
                          'Debit Card',
                          'PayPal',
                          'Apple Pay',
                          'Google Pay',
                          'Bank Transfer',
                          'Cash on Delivery',
                          'Bitcoin',
                          'Ethereum',
                        ]}
                        rightSection={
                          <ChevronDownIcon stroke="black" width={16} height={16} strokeWidth="3" />
                        }
                        classNames={{
                          input: clsx({
                            'border border-solid border-red': errors.acceptedPaymentMethods,
                          }),
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="flex gap-3">
            <Checkbox color="#3E4784" {...register('allowingSavingApartment')} />
            <Box className="flex flex-1 gap-3">
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Allowing saving apartment
                  </Text>
                  <Text className="font-normal text-[14px] leading-[20px] text-Gray-700">
                    Allow tenant to confirm intrest and save apartment for seven days untill lease
                    signing
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="py-2 px-0 bg-Gray-50 text-center">Senders info</Box>

          <Box className="flex gap-3">
            <Checkbox color="#3E4784" {...register('accountContactInfo')} />
            <Box className="flex flex-1 gap-3">
              <Box className="flex flex-1">
                <Box className="flex gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Account contact info
                  </Text>
                  <Text className="font-normal text-[14px] leading-[20px] text-Gray-700">
                    Contact info of leasing agant or proerty manger assoated with this proerty
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="flex gap-6">
            <Box className="flex flex-col gap-1.5 flex-1">
              <Text>First name</Text>
              <Input
                placeholder="Enter first name"
                {...register('firstName', { required: true })}
                classNames={{
                  input: clsx({ 'border border-solid border-red': errors.firstName }),
                }}
                rightSection={errors.firstName ? <AlertCircleIcon /> : <></>}
              />
            </Box>
            <Box className="flex flex-col gap-1.5 flex-1">
              <Text>Last name</Text>
              <Input
                placeholder="Enter last name"
                {...register('lastName', { required: true })}
                classNames={{
                  input: clsx({ 'border border-solid border-red': errors.lastName }),
                }}
                rightSection={errors.lastName ? <AlertCircleIcon /> : <></>}
              />
            </Box>
          </Box>

          <Box className="flex gap-6">
            <Box className="flex flex-col gap-1.5 flex-1">
              <Text>Email address</Text>
              <Input
                type="email"
                placeholder="Enter email address"
                leftSection={<Mail01Icon />}
                {...register('emailAddress', { required: true })}
                classNames={{
                  input: clsx({ 'border border-solid border-red': errors.emailAddress }),
                }}
                rightSection={errors.emailAddress ? <AlertCircleIcon /> : <></>}
              />
            </Box>
            <Box className="flex flex-col gap-1.5 flex-1">
              <Text>Phone number</Text>
              <Input
                placeholder="Enter phone number"
                {...register('phoneNumber', { required: true })}
                classNames={{
                  input: clsx({ 'border border-solid border-red': errors.phoneNumber }),
                }}
                rightSection={errors.phoneNumber ? <AlertCircleIcon /> : <></>}
              />
            </Box>
          </Box>

          {errors.firstName && errors.lastName && errors.emailAddress && errors.phoneNumber && (
            <Box className="p-4 rounded-[12px] border border-solid border-red flex gap-2 items-center">
              <Avatar
                size={45}
                variant="outline"
                color="#FCA5A5"
                className="border border-solid border-error-100 p-1.5"
              >
                <AlertCircleIcon width={20} height={20} />
              </Avatar>
              <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                Please enter at least one option where to sign the lease and senders contact info.
              </Text>
            </Box>
          )}
        </Box>

        <Box className="gap-6 py-8 px-10 flex flex-col">
          <Box className="flex flex-1 gap-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => onClose()}
              className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleTogglePreviewEmail}
              className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg flex-1"
              leftSection={<EyeIcon />}
            >
              Preview email
            </Button>
            <Button
              variant="outline"
              type="submit"
              className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3 flex-1"
            >
              Invite tenant
            </Button>
          </Box>
        </Box>

        <Box className="py-6 px-10">
          {previewEmail && (
            <TextEditor initialContent={initialNotifyEmail} onContentChange={handleEmailChange} />
          )}
        </Box>
      </form>
    </Modal>
  );
};
