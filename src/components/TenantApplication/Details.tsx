import { PlusIcon, Users01Icon, Users04Icon } from '@assets/iconComponents';
import { Badge, Card } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  CoApplicantForm,
  coApplicantInitialValue,
  detailFormInitialValue,
  rentalApplicationDetailForm,
  coApplicantDetailForm,
  DetailFormSchema,
} from './Schema';
import { DetailsFrom } from './Details/Form';
import { AddCoApplicantForm } from './Details/AddCoAppliaction';
import { ApplicantDetailCard } from './ApplicantDetailCard';
import { ApplicationFooter } from './ApplicationFooter';
import { useDispatch } from 'react-redux';
import { setTenantApplicationData } from '@stores/tenantApplicationSlice';

interface Props {
  handlers: {
    increment: () => void;
    decrement: () => void;
    set: (value: number) => void;
  };
  step: number;
}

export const Details = ({ handlers, step }: Props) => {
  const [coApplicantList, setCoApplicantList] = useState<CoApplicantForm[]>([]); // List of co-applicants
  const [formValues, setFormValues] = useState<CoApplicantForm[]>([]); // For form input
  const [indexToEdit, setIndexToEdit] = useState<number | null>(null); // Track which index is being edited
  const [activeButton, setActiveButton] = useState('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const dispatch = useDispatch();
  // Form methods
  const coApplicantMethods = useForm({
    resolver: yupResolver(coApplicantDetailForm),
    defaultValues: coApplicantInitialValue,
  });
  const getSchemaForStep = (step: number) => {
    switch (activeButton) {
      case 'lease':
        return { schema: rentalApplicationDetailForm, initialValues: detailFormInitialValue };
      case 'tenant':
        return { schema: rentalApplicationDetailForm, initialValues: detailFormInitialValue };
      default:
        return { schema: rentalApplicationDetailForm, initialValues: detailFormInitialValue };
    }
  };

  // Schema for the main rental application form (for DetailsFrom)
  const Form = getSchemaForStep(step);

  // UseForm hook for rental application details
  const methods = useForm({
    resolver: yupResolver(Form.schema),
    defaultValues: Form.initialValues,
  });
  // Add New Co-Applicant Form (not editing)
  const addCoApplicant = () => {
    setFormValues([...formValues, { ...coApplicantInitialValue }]);
    // Ensure no form is in edit mode
  };

  // Handle form submission
  const handleFormSubmit = (data: CoApplicantForm) => {
    if (showAddForm) {
      setCoApplicantList((prev) => [...prev, data]);
      setShowAddForm(false);
    } else if (indexToEdit !== null) {
        
      setCoApplicantList((prev) =>
        prev.map((applicant, index) => (index === indexToEdit ? data : applicant))
      );
      setShowEditForm(false);
    }
   
   
    setFormValues([]); // Clear the form
    setIndexToEdit(null); // Reset index after form submit
  };
  const handleDetailFromSubmit = (data: DetailFormSchema) => {
    if (showAddForm) {
      // setCoApplicantList((prev) => [...prev, data]);
      setShowAddForm(false);
    } else if (indexToEdit !== null) {
        
      // setCoApplicantList((prev) =>
      //   prev.map((applicant, index) => (index === indexToEdit ? data : applicant))
      // );
      setShowEditForm(false);
    }
   
   
    setFormValues([]); // Clear the form
    setIndexToEdit(null); // Reset index after form submit
  };

  // Edit Co-Applicant (prefill the form)
  const handleEdit = (index: number) => {
    const applicantToEdit = coApplicantList[index];
    setFormValues([applicantToEdit]); // Prefill the form with the selected co-applicant data
    setIndexToEdit(index); // Set the index being edited
  };

  // Delete Co-Applicant
  const handleDelete = (index: number) => {
    setCoApplicantList((prev) => prev.filter((_, i) => i !== index)); // Remove co-applicant from the list
    setIndexToEdit(null); // Reset index in case of deletion
  };
  useEffect(() => {
    console.log('coApplicantList',coApplicantList);
    
    dispatch(setTenantApplicationData({coApplicantdata:coApplicantList}));
  }, [coApplicantList.length>0]);

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
            section: 'flex flex-col items-start self-stretch p-6 border-b-[1px] border-solid border-Gray-200',
          }}
        >
          <Card.Section>
            <div className="flex flex-col items-start w-full gap-6">
              <div className="flex py-2 flex-col items-center gap-2 rounded-[8px] w-full bg-Gray-50">
                <span className="text-Gray-600 text-sm font-medium leading-5 text-center">
                  Your details
                </span>
              </div>
              <DetailsFrom methods={methods} /> {/* Use rentalApplication schema here */}
              {/* Add Co-Applicant Form */}
              {formValues.map((form, index) => (
                <AddCoApplicantForm
                  formData={form} // Passing the form data (prefilled or new)
                  onSubmit={handleFormSubmit}
                  onCancel={() => setFormValues([])} // Clear the form on cancel
                  index={indexToEdit || -1} // Edit-specific logic
                  methods={coApplicantMethods}
                  setShowAddForm={setShowAddForm}
                  setShowEditForm={setShowEditForm} // React Hook Form methods
                />
              ))}
              {/* Display Co-Applicants */}
              {coApplicantList.map((applicant, index) => (
                <ApplicantDetailCard
                  key={index}
                  applicant={applicant}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              {/* Add Co-Applicant Button */}
              <Card
                classNames={{
                  root: 'flex h-[70px] justify-center items-start gap-1 w-full rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white shadow-xs',
                  section: '',
                }}
              >
                <div className="flex flex-col justify-center w-full items-center gap-3 flex-0">
                  <div
                    className="flex justify-center items-center gap-3 cursor-pointer"
                    onClick={addCoApplicant}
                  >
                    <Users01Icon height={24} width={24} />
                    <div className="flex flex-col justify-center items-start">
                      <span className="text-Gray-600 text-base font-semibold leading-6">
                        Add co-applicant/occupants
                      </span>
                      <span className="w-[244px] text-Gray-600 text-xs font-normal leading-18">
                        You need to add each additional over 18
                      </span>
                    </div>
                    <PlusIcon width={24} height={24} />
                  </div>
                </div>
              </Card>
            </div>
          </Card.Section>
          <ApplicationFooter handlers= {handlers} />
        </Card>
      </div>
    </div>
  );
};
