import { PlusIcon, Users01Icon, Users04Icon } from '@assets/iconComponents';
import { Badge, Button, Card } from '@mantine/core';
import { ApplicationFooter } from './ApplicationFooter';
import {
  currentAddressFormSchema,
  CurrentAddressFormSchema,
  currentAddressInitialValue,
  landlordInitialValue,
  landlordSchema,
  LandlordSchema,
} from './Schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applicantData, setTenantApplicationData } from '@stores/tenantApplicationSlice';
import { EmploymentDetailCard } from './Employment/EmploymentDetailCard';
import { CurrentAddressForm } from './Address/CurrentAddressForm';
import { LandlordReferenceForm } from './Address/LandlordReferenceForm';
import IdCopy from './Address/IdCopy';

interface Props {
  handlers: {
    increment: () => void;
    decrement: () => void;
    set: (value: number) => void;
  };
  step: number;
}
export const Address = ({ handlers, step }: Props) => {
  const methods = useForm({
    resolver: yupResolver(currentAddressFormSchema),
    defaultValues: currentAddressInitialValue,
  });
  const referenceMethods = useForm({
    resolver: yupResolver(landlordSchema),
    defaultValues: landlordInitialValue,
  });
  const dispatch = useDispatch();
  const selector = useSelector(applicantData);
  const [employmentList, setEmploymentList] = useState<CurrentAddressFormSchema[]>([]); // List of co-applicants
  const [formValues, setFormValues] = useState<CurrentAddressFormSchema[]>([
    currentAddressInitialValue,
  ]); // For form input
  const [referenceList, setReferenceList] = useState<LandlordSchema[]>([]); // List of co-applicants
  const [referenceFrom, setReferenceFrom] = useState<LandlordSchema[]>([
    landlordInitialValue,
  ]);
  const [indexToEdit, setIndexToEdit] = useState<number | null>(null); // Track which index is being edited
  const [activeButton, setActiveButton] = useState('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [submitTrigger, setSubmitTrigger] = useState(false);
  const [formsData, setFormsData] = useState<any[]>([]);
  const addEmployment = () => {
    setFormValues([...formValues, { ...currentAddressInitialValue }]);
    setReferenceFrom([...referenceFrom, { ...landlordInitialValue }]);
    // Ensure no form is in edit mode
  };
  // Handle form submission
  const handleFormSubmit = (data: CurrentAddressFormSchema) => {
    console.log(data, 'gggggg');

    if (indexToEdit == null) {
      console.log('jjjjjjj');

      setEmploymentList((prev) => [...prev, data]);
      setShowAddForm(false);
    } else if (indexToEdit !== null) {
      console.log();

      setEmploymentList((prev) =>
        prev.map((applicant, index) => {
          // Log the current applicant and index
          console.log('Current applicant:', applicant);
          console.log('Index:', index);

          // Check if this is the one to edit and update accordingly
          return index === indexToEdit ? data : applicant;
        })
      );

      setShowEditForm(false);
    }
    setFormValues([currentAddressInitialValue]); // Clear the form
    setIndexToEdit(null); // Reset index after form submit
  };
  const handleReferenceFormSubmit = (data: LandlordSchema) => {
    console.log(data, 'ddddddddd');

    if (indexToEdit === null) {
      setReferenceList((prev) => [...prev, data]);
      setShowAddForm(false);
    } else if (indexToEdit !== null) {
      setReferenceList((prev) =>
        prev.map((applicant, index) => (index === indexToEdit ? data : applicant))
      );
      setShowEditForm(false);
    }
    setReferenceFrom([landlordInitialValue]); // Clear the form
    setIndexToEdit(null); // Reset index after form submit
  };

  // Edit Co-Applicant (prefill the form)
  const handleEdit = (index: number) => {
    const applicantToEdit = employmentList[index];
    setFormValues([applicantToEdit]); // Prefill the form with the selected co-applicant data
    setIndexToEdit(index); // Set the index being edited
  };

  // Delete Co-Applicant
  const handleDelete = (index: number) => {
    setEmploymentList((prev) => prev.filter((_, i) => i !== index)); // Remove co-applicant from the list
    setIndexToEdit(null); // Reset index in case of deletion
  };
  useEffect(() => {
    const combinedList = [...employmentList, ...referenceList];
    // Assuming we want only the first item for demonstration purposes:
    const combinedObject: any = combinedList.reduce(
      (acc, item) => {
        acc = { ...acc, ...item };
        return acc;
      },
      {} as {
        id?: string;
        firstName: string;
        lastName: string;
        email: string;
        title: string;
        phoneNumber: string;
        employmentStatus: string;
        jobDescription: string;
        length: string;
        companyName: string;
        companyWebsite: string;
        monthlyWage: string;
      }
    );
    setFormsData([combinedObject]);
    dispatch(setTenantApplicationData(combinedObject));
  }, [referenceList.length]);
  useEffect(() => {
    console.log(selector, 'ttttttttttttt');
  }, [handlers.increment]);
  return (
    <div className="flex min-w-[480px] py-md-1 flex-col items-center flex-0 self-stretch bg-Gray-50 min-h-screen">
      <div className="flex px-8 flex-col items-center gap-10">
        <header className="flex max-w-[640px] flex-col items-start gap-5 self-stretch">
          <div className="flex items-start content-start gap-5 self-stretch flex-wrap">
            <div className="flex min-w-[320px] items-center gap-5 flex-0">
              <div className="flex w-16 h-16 justify-center rounded-[200px] border-[4px] border-solid border-white bg-Gray-100 shadow-lg shrink-0">
                <Users04Icon
                  className="shrink-0"
                  height={48}
                  width={48}
                  stroke="#475467"
                  strokeWidth={4}
                />
              </div>
              <div className="flex flex-col items-start gap-1 flex-0">
                <div className="flex items-center gap-2">
                  <span className="text-Gray-900 text-3xl font-semibold leading-38">
                    Rental application
                  </span>
                  <Badge
                    classNames={{
                      root: 'flex px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid border-Gray-200 bg-Gray-50',
                      label: 'text-Gray-700 text-center text-xs font-medium leading-18',
                    }}
                  >
                    Primary-applicant
                  </Badge>
                </div>
                <span className="text-Gray-600 text-base font-normal leading-6">
                  Update your photo and personal details here.
                </span>
              </div>
            </div>
          </div>
        </header>
        {/* Rental Application Form */}
        <Card
          classNames={{
            root: 'flex min-w-[640px] flex-col items-start rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white shadow-xs',
            section:
              'flex flex-col items-start self-stretch p-6 border-b-[1px] border-solid border-Gray-200',
          }}>
          <Card.Section>
            <div className="flex flex-col items-start w-full gap-6">
              {formsData.length &&
                formsData?.map((data, index) => (
                  <EmploymentDetailCard
                    key={index}
                    data={data}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}

              {formValues?.map((form, index) => (
                <CurrentAddressForm
                  formData={form} // Passing the form data (prefilled or new)
                  onSubmit={handleFormSubmit}
                  onCancel={() => setFormValues([])} // Clear the form on cancel
                  index={indexToEdit || -1} // Edit-specific logic
                  methods={methods}
                  setShowAddForm={setShowAddForm}
                  setShowEditForm={setShowEditForm} // React Hook Form methods
                  submitTrigger={submitTrigger}
                  setSubmitTrigger={setSubmitTrigger}
                />
              ))}
              {referenceFrom.map((form, index) => (
                <LandlordReferenceForm
                  formData={form} // Passing the form data (prefilled or new)
                  onSubmit={handleReferenceFormSubmit}
                  onCancel={() => setFormValues([])} // Clear the form on cancel
                  index={indexToEdit || -1} // Edit-specific logic
                  methods={referenceMethods}
                  setShowAddForm={setShowAddForm}
                  setShowEditForm={setShowEditForm} // React Hook Form methods
                  submitTrigger={submitTrigger}
                  setSubmitTrigger={setSubmitTrigger}
                />
              ))}
              <Button onClick={() => setSubmitTrigger(true)}>Add</Button>
              <Card
                classNames={{
                  root: 'flex h-[70px] justify-center items-start gap-1 w-full rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white shadow-xs',
                  section: '',
                }}>
                <div className="flex flex-col justify-center w-full items-center gap-3 flex-0">
                  <div
                    className="flex justify-center items-center gap-3 cursor-pointer"
                    onClick={addEmployment}>
                    <Users01Icon height={24} width={24} />
                    <div className="flex flex-col justify-center items-start">
                      <span className="text-Gray-600 text-base font-semibold leading-6">
                        Add additional address
                      </span>
                      <span className='text-Gray-600 text-center text-xs font-normal leading-18'>
                      You will need to provide a minume of 3 years resdtental history
                      </span>
                    </div>
                    <PlusIcon width={24} height={24} />
                  </div>
                </div>
              </Card>
              <IdCopy />
            </div>
          </Card.Section>
          <ApplicationFooter handlers={handlers} />
        </Card>
      </div>
    </div>
  );
};
