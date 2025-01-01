import { Badge, Card, Group, Select, SelectProps, Button, Input, Modal } from '@mantine/core';
import {
  Building04Icon,
  Edit01Icon,
  Trash01Icon,
  Users03Icon,
  Users04Icon,
  UsersX02Icon,
  EmailIcon02,
  AlertCircleIcon,
  ArrowDown,
  CheckIcon02,
} from '@assets/iconComponents';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { ReactElement, useState } from 'react';
import { initialModalProps } from '@components/mocks';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import { useDisclosure } from '@mantine/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { propertyManagerSchema } from '@components/Properties/PropertyDetailsStep/schemas';
import { createRequest } from '@api/Base.api';

const initialValues = {
  company: true,
  company_name: null,
  first_name: '',
  last_name: '',
  title: '',
  phone_number: '',
  email: '',
};

export function ManagerDetails({ managerData, contactId }: any) {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [modalHeading, setModalHeading] = useState('');
  const [modalProps, setModalProps] = useState(initialModalProps);
  const [icon, setIcon] = useState<ReactElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const [managerDetailsData, setManagerDetailsData] = useState<any>(managerData || []);
  const [selectedManagerIndex, setSelectedManagerIndex] = useState<number | null>(null);

  const methods = useForm({
    resolver: yupResolver(propertyManagerSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
    clearErrors,
    watch,
    reset,
    ...form
  } = methods;

  const title = watch('title');

  const editDetails = (manager: any, index: number) => {
    setModalHeading('Edit');
    setSelectedManagerIndex(index);

    setValue('company', manager.company);
    setValue('first_name', manager?.first_name);
    setValue('last_name', manager?.last_name);
    setValue('title', manager?.title);
    setValue('email', manager?.email);
    setValue('phone_number', manager?.phone_number);
    open();
  };
  const handleDeleteClick = (index: number) => {
    setModalProps({
      title: 'Delete manager',
      desc: 'Are you sure you want to delete this manager? This action cannot be undone.',
      bgColor: 'bg-Error-600',
      btnTitle: 'Delete',
      iconBg: 'bg-Error-100',
      borderColor: 'border-Error-50',
      hoverColor: 'hover:bg-Error-600',
    });
    setIcon(<UsersX02Icon className="shrink-0" />);
    setConfirmationModalOpen(true);
    setSelectedManagerIndex(index);
  };

  const onSubmit = () => {};

  const handleContinue = async () => {
    handleSubmit(onSubmit)();
    const data = getValues();
    if (!isValid) {
      return;
    }

    let updatedManagers;
    if (selectedManagerIndex !== null) {
      // Update existing manager
      updatedManagers = [...managerDetailsData];
      updatedManagers[selectedManagerIndex] = data;
    } else {
      // Add new manager
      updatedManagers = [...managerDetailsData, data];
    }

    setManagerDetailsData(updatedManagers);
    await createRequest(`update-manager-details/${contactId}`, 'PUT', updatedManagers);

    setSelectedManagerIndex(null);
    close();
    reset(); // Reset form
  };

  const handleDeleteManager = async () => {
    try {
      if (selectedManagerIndex !== null) {
        const updatedManagers = [...managerDetailsData];
        updatedManagers.splice(selectedManagerIndex, 1); // Remove owner by index
        setManagerDetailsData(updatedManagers);
        const res = await createRequest(
          `update-manager-details/${contactId}`,
          'PUT',
          updatedManagers
        );
        res.status && setConfirmationModalOpen(false);
        setSelectedManagerIndex(null);
      } else {
        console.error('Invalid index to delete');
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group
      flex="1"
      className={clsx(
        'justify-between items-center gap-0 p-2.5 colors-gray-900  ',
        checked && ' bg-gray-50'
      )}
    >
      <span className="text-base font-medium">{option.label}</span>
      {checked && <CheckIcon02 />}
    </Group>
  );
  return (
    <>
      <div className="flex flex-col items-start gap-5 self-stretch">
        <div className="flex items-start gap-4 self-stretch">
          <div className="flex flex-col items-start justify-center gap-1 flex-0 self-stretch">
            <span className="text-Gray-900 text-xl leading-xl-1 font-semibold">
              Manager Details
            </span>
          </div>
        </div>
        <div className="flex items-start gap-6 self-stretch">
          <div className="flex flex-col items-start gap-3 flex-0">
            {managerDetailsData?.map((manager: any, index: number) => (
              <Card
                withBorder
                classNames={{
                  root: 'flex flex-col items-start self-stretch rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white shadow-2xl',
                }}
              >
                <Card.Section
                  classNames={{
                    section: 'flex items-start self-stretch',
                  }}
                >
                  <div className="flex w-md-1 flex-col justify-center items-center self-stretch gap-2.5 rounded-l-[12px] border-[1px] border-solid border-Gray-200 border-r-0 bg-Gray-100">
                    {manager.type === 'Company' ? (
                      <Building04Icon width={80} height={80} stroke="#475467" />
                    ) : (
                      <Users04Icon width={80} height={80} stroke="#475467" />
                    )}
                  </div>
                  <div className="flex flex-col items-start flex-0">
                    <div className="felx items-start self-stretch">
                      <div className="flex flex-col items-start self-stretch flex-0 gap-1 p-6">
                        <div className="flex items-center gap-1">
                          <span className="text-Gray-600 text-2xl font-semibold leading-8">
                            {`${manager.first_name} ${manager.last_name}`}
                          </span>
                          <Badge
                            key={index}
                            classNames={{
                              root: 'flex justify-center items-center py-0.5 px-1.5 rounded-[6px] border-[1px] border-solid border-Gray-200 bg-Gray-50',
                              label: 'text-Gray-700 text-center text-xs font-medium leading-18',
                            }}
                          >
                            {manager.title}
                          </Badge>
                        </div>
                        {manager?.address && (
                          <span className="text-Gray-600 text-sm font-medium leading-5">
                            {manager?.address}
                          </span>
                        )}
                        <span className="text-Gray-600 text-sm font-medium leading-5">
                          {manager?.email}
                        </span>
                        <span className="text-Gray-600 text-sm font-medium leading-5">
                          {manager?.phone_number}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex p-4 justify-end items-start self-stretch">
                    <div className="flex p-2 justify-center items-center gap-2 rounded-[8px]">
                      <Edit01Icon
                        className="cursor-pointer  text-Gray-600"
                        onClick={() => {
                          clearErrors();
                          editDetails(manager, index);
                        }}
                      />
                    </div>
                    <div className="flex p-2 justify-center items-center gap-2 rounded-[8px]">
                      <Trash01Icon
                        height={16}
                        width={16}
                        className="cursor-pointer  text-Gray-600"
                        onClick={() => {
                          handleDeleteClick(index);
                        }}
                      />
                    </div>
                  </div>
                </Card.Section>
              </Card>
            ))}
            <Card
              withBorder
              classNames={{
                root: 'flex !h-sm-1 p-4 justify-center gap-1 flex-col items-start self-stretch rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white shadow-2xl',
              }}
            >
              <Card.Section
                classNames={{
                  section:
                    'flex flex-col items-center gap-3 justify-center self-stretch flex-0 cursor-pointer',
                }}
                onClick={() => {
                  setModalHeading('Add');
                  methods.reset();
                  open();
                }}
              >
                <div className="flex justify-center items-center gap-3">
                  <span className="text-Brand-700 text-2xl font-semibold leading-8">Add</span>
                  <Users03Icon />
                </div>
              </Card.Section>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        size={640}
        classNames={{
          title: 'text-brand-960 font-semibold text-lg',
          content: 'rounded-[12px] ',
          header: 'w-24 float-right bg-transparent',
          body: 'p-0',
          close: 'text-gray-400',
        }}
        opened={opened}
        onClose={() => {
          setSelectedManagerIndex(null);
          close();
        }}
      >
        <div>
          <div className="bg-cover w-full my-3 relative">
            <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
            <Users04Icon className="ms-6.8 mt-3 size-9" />
          </div>
          <div className="p-6 pt-2">
            <div className="leading-7 font-semibold text-lg text-gray-900">
              {modalHeading} property manager
            </div>
            <div className="text-sm font-normal text-gray-600 mt-2">
              Share where you’ve worked on your profile.
            </div>
            <>
              <fieldset className="grid-cols-3 grid gap-5 mt-2">
                <CustomInput
                  label="First name*"
                  placeholder="First name"
                  {...register('first_name')}
                  error={errors.first_name?.message}
                />
                <CustomInput
                  label="Last name* "
                  placeholder="Last name"
                  {...register('last_name')}
                  error={errors.last_name?.message}
                />

                <Select
                  {...register('title')}
                  classNames={{
                    option: 'p-0 mb-0.5 rounded-[8px]',
                    dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                  }}
                  label="Title*"
                  placeholder="Select"
                  checkIconPosition="right"
                  comboboxProps={{ dropdownPadding: 0 }}
                  rightSection={<ArrowDown />}
                  value={title}
                  data={['Property manager', 'Leasing agent', 'Other']}
                  renderOption={renderSelectOption}
                  error={errors.title?.message}
                  onChange={(value) => {
                    setValue('title', value ?? '');
                    clearErrors('title');
                  }}
                />
              </fieldset>
              <fieldset className="grid-cols-2 grid gap-5 mt-6">
                <CustomInput
                  leftSection={<EmailIcon02 className="size-5" />}
                  label="Email address*"
                  placeholder="olivia@untitledui.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input.Wrapper
                  classNames={{
                    label: 'text-sm leading-5 font-medium text-gray-700 mb-1.5',
                  }}
                  label="Phone number*"
                  className="w-full "
                >
                  <Controller
                    name="phone_number"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        value={field.value}
                        size="sm"
                        radius="md"
                        error={errors.phone_number?.message}
                        className="w-full"
                        classNames={{
                          input: clsx(
                            ' !h-11 placeholder:text-gray-500',
                            errors.phone_number?.message && 'border-error-600 focus:shadow-error'
                          ),
                        }}
                        rightSection={
                          errors.phone_number?.message ? (
                            <AlertCircleIcon className="size-4 text-error-500 me-2.5" />
                          ) : (
                            ''
                          )
                        }
                        type="text"
                        component={IMaskInput}
                        onAccept={(value) => {
                          field.onChange(value);
                          setValue('phone_number', value);
                          if (!form.getFieldState('phone_number').invalid) {
                            clearErrors('phone_number');
                          }
                        }}
                        onBlur={() => form.trigger('phone_number')}
                        mask="+1 000-000-0000"
                        placeholder="212-212-1100"
                      />
                    )}
                  />

                  {errors.phone_number?.message && (
                    <p className="text-error-600 text-xs !mt-1 -mb-6">
                      {' '}
                      {errors.phone_number?.message}
                    </p>
                  )}
                </Input.Wrapper>
              </fieldset>
            </>

            <div className="grid-cols-2 grid gap-5 mt-10">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedManagerIndex(null);
                  close();
                }}
                className="border-gray-300 font-semibold h-11 rounded-[8px] text-gray-700  hover:bg-transparent hover:text-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="rounded-[8px] h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
                onClick={handleContinue}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        confirmationModalOpen={confirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen}
        confirmBtnDetail={modalProps}
        icon={icon}
        onConfirm={() => handleDeleteManager()}
      />
    </>
  );
}
