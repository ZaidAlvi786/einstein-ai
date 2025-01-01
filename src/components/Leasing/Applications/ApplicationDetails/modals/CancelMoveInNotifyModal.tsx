import { AlertCircleIcon, EyeIcon, Mail01Icon } from '@assets/iconComponents';
import { Avatar, Box, Button, Checkbox, Input, Modal, Switch, Text } from '@mantine/core';
import { TextEditor } from '@shared/components/TextEditor/TextEditor';
import clsx from 'clsx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CancelMoveInNotifyModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  didNotPass: boolean;
  unableToVerifyIncome: boolean;
  unableToVerifyID: boolean;
  apartmentUnavailable: boolean;
  otherReasonSelected: boolean;
  otherReasonContent: string;
  sendCopy: boolean;
  allowingSavingApartment: boolean;
  accountContactInfo: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
}

const initialNotifyEmail = `
  <p>Hi [First Name].</p>
  <p></p>
  <p>We are glad to inform you that you passed our tenant quality screening and based of your stated monthly income you are approved for renting our apartment at 123 Main St NY NY unit 101 for low as $2,000/month.</p>
  <p>This is what we will need from you in order to proceed further:</p>
  <p></p>
  <ul>
    <li>A copy of a government issued photo ID.</li>
    <li>Proof of income - This can be any kind of documentation showing that your monthly earning is above $4,000 (two times of monthly rent).</li>
  </ul>
  <p></p>
  <p>Please submit it at one of the following options.</p>
  <p></p>
  <ul>
    <li>Online at this link</li>
    <li>Replying to this email</li>
    <li>Visiting our office at 123 Main St. NY NY, Mon - Fri 9 am -5 pm.</li>
  </ul>
  <p></p>
  <p>Once we receive it, we will verify it and if approved we will let you know how to proceed with the lease.</p>
  <p></p>
  <p>Sincerely yours,</p>
  <p></p>
  <p>Anna Ban</p>
  <p>Whitestone Apartments</p>
  <p>212-212-1100</p>
  <p>email@email.com</p>
`;

export const CancelMoveInNotifyModal: React.FC<CancelMoveInNotifyModalProps> = ({
  open,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const [previewEmail, setPreviewEmail] = useState(false);
  const [closingReason, setClosingReason] = useState<string | null>(null);

  const handleTogglePreviewEmail = () => {
    setPreviewEmail((prev) => !prev);
  };

  const [notifyEmail, setNotifyEmail] = useState('');
  const handleEmailChange = (content: string) => {
    setNotifyEmail(content);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    onClose();
  };

  const closingReasons = [
    { key: 'didNotPass', label: "Didn't pass screening criteria" },
    { key: 'unableToVerifyIncome', label: 'Unable to verify income' },
    { key: 'unableToVerifyID', label: 'Unable to verify ID' },
    { key: 'apartmentUnavailable', label: 'Apartment unavailable' },
  ];

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
            Let tenant know that they are declined. Please note, they are certain government laws...
          </Text>
        </Box>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="py-6 px-10 flex flex-col gap-6 border-b border-solid border-Gray-200">
          <Box className="py-2 px-0 bg-Gray-50 font-medium text-[14px] leading-[20px] text-center text-Gray-600">
            Reason for closing
          </Box>

          <Box className="flex flex-col gap-5">
            <Box component="label" className="flex gap-3 cursor-pointer">
              <Checkbox color="#3E4784" {...register('apartmentUnavailable')} />
              <Box className="flex flex-col gap-1">
                <Box className="flex gap-1">
                  <Text className="text-Gray-700 text-[14px] leading-[20px] font-semibold">
                    Apartment unavailable
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box component="label" className="flex gap-3 cursor-pointer">
              <Checkbox color="#3E4784" {...register('didNotPass')} />
              <Box className="flex flex-col gap-1">
                <Box className="flex gap-1">
                  <Text className="text-Gray-700 text-[14px] leading-[20px] font-semibold">
                    Didn't pass screening criterias
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box component="label" className="flex gap-3 cursor-pointer">
              <Checkbox color="#3E4784" {...register('unableToVerifyIncome')} />
              <Box className="flex flex-col gap-1">
                <Box className="flex gap-1">
                  <Text className="text-Gray-700 text-[14px] leading-[20px] font-semibold">
                    Unable to verify income
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box component="label" className="flex gap-3 cursor-pointer">
              <Checkbox color="#3E4784" {...register('unableToVerifyID')} />
              <Box className="flex flex-col gap-1">
                <Box className="flex gap-1">
                  <Text className="text-Gray-700 text-[14px] leading-[20px] font-semibold">
                    Unable to verify ID
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box component="label" className="flex gap-3 cursor-pointer">
            <Checkbox color="#3E4784" {...register('otherReasonSelected')} />
            <Box className="flex flex-1 gap-3">
              <Box className="flex flex-1">
                <Box className="flex flex-col gap-1.5 flex-1">
                  <Text className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                    Other
                  </Text>
                  <Input
                    placeholder="Type custome reason"
                    classNames={{
                      input: clsx({ 'bg-Gray-50': watch('otherReasonSelected') !== true }),
                    }}
                    readOnly={watch('otherReasonSelected') !== true}
                    {...register('otherReasonContent')}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="py-2 px-0 flex gap-4 items-center">
            <Switch />
            <Text className="text-Gray-700 text-[14px] leading-[20px] font-semibold">
              Send a copy of screening report
            </Text>
          </Box>

          <Box className="ppy-2 px-0 bg-Gray-50 font-medium text-[14px] leading-[20px] text-center text-Gray-600">
            Senders info
          </Box>

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

          {/* <Box className="p-4 rounded-[12px] border border-solid border-red flex gap-2 items-center">
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
          </Box> */}
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
