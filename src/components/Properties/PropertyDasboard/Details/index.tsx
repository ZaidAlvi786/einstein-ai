import { Box, Button, ScrollArea } from '@mantine/core';
import { ReactElement, useEffect, useRef, useState } from 'react';
// import { FileUpload } from './FileDropzone';
import { createRequest } from '@api/Base.api';
import { UsersX02Icon } from '@assets/iconComponents';
import { initialModalProps, paymentMethods, recievedAccountData } from '@components/mocks';
import { API } from '@constants/api.constant';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ManagerDetails } from './ManagerDetails';
import { OwnerDetails } from './OwnerDetails';
import { PaymentMethod } from './PaymentMethod';
import { PropertyDetails } from './PropertyDetails';

export function PropertyDetailsTab() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contactData, setContactData] = useState<any>(null);

  const [activeButton, setActiveButton] = useState('property');
  const [modalProps, setModalProps] = useState(initialModalProps);
  const [icon, setIcon] = useState<ReactElement | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const propertyRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  const contactsRefx = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleDeleteClick = () => {
    setModalProps({
      title: 'Delete property',
      desc: 'Are you sure you want to delete this property? This action cannot be undone.',
      bgColor: 'bg-Error-600',
      btnTitle: 'Delete',
      iconBg: 'bg-Error-100',
      borderColor: 'border-Error-50',
      hoverColor: 'hover:bg-Error-600',
    });
    setIcon(<UsersX02Icon className="shrink-0" />);
    setConfirmationModalOpen(true);
  };

  const handleDeleteProperty = async (id: any) => {
    try {
      const res = await createRequest(`${API.PROPERTY.DELETE}/${id}`, 'DELETE');
      if (res.message) {
        toast.success(res.message);
        navigate('/properties');
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const getContactDetails = async (id: string) => {
    try {
      const res = await createRequest(`${API.CONTACTS.GET}/property-contact/${id}`, 'GET');
      setContactData(res[0]);
    } catch (error) {
      console.log(error, 'err');
    }
  };

  useEffect(() => {
    if (id) {
      getContactDetails(id);
    }
  }, [id]);

  return (
    <div className="flex items-start self-stretch">
      <Box className="flex flex-col items-start self-stretch flex-0 gap-10 pt-10  px-8 border-bottom-[1px] border-solid border-Gray-200 border-0 bg-Gray-50 max-h-[60vh] overflow-y-scroll no-scrollbar">
        <div className="flex flex-col items-start gap-5 self-stretch">
          <Button.Group
            classNames={{
              group:
                'flex items-center justify-center self-stretch p-1 gap-1 flex-0 rounded-[10px] border-solid bg-white w-full border-Gray-200 w-full',
            }}
          >
            <Button
              className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0  !border-x-0 rounded-[6px]"
              classNames={{
                label: `text-sm font-semibold leading-5 ${activeButton === 'property' ? 'text-Gray-700' : 'text-Gray-500'}`,
                section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === 'property' ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 rounded-[6px] bg-Gray-100 shadow-sm' : 'bg-white !border-0'}`,
              }}
              variant="outline"
              onClick={() => {
                setActiveButton('property');
                scrollToSection(propertyRef);
              }}
            >
              Property
            </Button>
            <Button
              className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0   !border-x-0 rounded-[6px]"
              classNames={{
                label: `text-sm font-semibold leading-5 ${activeButton === 'contacts' ? 'text-Gray-700' : 'text-Gray-500'}`,
                section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === 'contacts' ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 rounded-[6px] bg-Gray-100 shadow-sm' : 'bg-white !border-0'}`,
              }}
              variant="outline"
              onClick={() => {
                setActiveButton('contacts');
                scrollToSection(contactsRef);
              }}
            >
              Contacts
            </Button>
            <Button
              className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0   !border-x-0 rounded-[6px]"
              classNames={{
                label: `text-sm font-semibold leading-5 ${activeButton === 'payments' ? 'text-Gray-700' : 'text-Gray-500'}`,
                section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === 'payments' ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 rounded-[6px] bg-Gray-100 shadow-sm' : 'bg-white !border-0'}`,
              }}
              variant="outline"
              onClick={() => {
                setActiveButton('payments');
                scrollToSection(paymentsRef);
              }}
            >
              Payments
            </Button>
            <Button
              className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0   !border-x-0 rounded-[6px] "
              classNames={{
                label: `text-sm font-semibold leading-5 ${activeButton === 'delete' ? 'text-Gray-700' : 'text-Gray-500'}`,
                section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === 'delete' ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 rounded-[6px] bg-Gray-100 shadow-sm' : 'bg-white !border-0'}`,
              }}
              variant="outline"
              onClick={() => {
                setActiveButton('delete');
                scrollToSection(deleteRef);
              }}
            >
              Delete
            </Button>
          </Button.Group>
        </div>
        <ScrollArea className="w-full" offsetScrollbars>
          <div className="flex flex-col items-start self-stretch flex-0 gap-10">
            <Box
              id="property"
              className="flex flex-col items-start gap-6 self-stretch"
              ref={propertyRef}
            >
              <PropertyDetails contactData={contactData} />
            </Box>

            <Box
              id="contacts-manager"
              className="flex flex-col items-start gap-6 self-stretch"
              ref={contactsRef}
            >
              {contactData && (
                <OwnerDetails ownerData={contactData?.property_owner} contactId={contactData.id} />
              )}
            </Box>

            <Box
              id="contacts"
              className="flex flex-col items-start gap-6 self-stretch"
              ref={contactsRefx}
            >
              {contactData && (
                <ManagerDetails
                  managerData={contactData?.property_manager}
                  contactId={contactData.id}
                />
              )}
            </Box>

            <Box
              id="payments"
              className="flex flex-col items-start gap-6 self-stretch"
              ref={paymentsRef}
            >
              <PaymentMethod paymentMethodData={paymentMethods} title="Payment methods" />
            </Box>

            <Box id="received-account" className="flex flex-col items-start gap-6 self-stretch">
              <PaymentMethod paymentMethodData={recievedAccountData} title="Receivabele account" />
            </Box>

            <Box
              id="delete"
              className="flex flex-col items-start gap-6 self-stretch"
              ref={deleteRef}
            >
              <Button
                variant="filled"
                color="red"
                classNames={{
                  root: 'flex px-3.5 py-2.5 justify-center items-center gap-1 rounded-[8px] border-[1px] border-solid border-Error-600 bg-Error-600 drop-shadow-xs',
                  inner: 'flex px-0.5 justify-center items-center',
                  label: 'text-white text-sm font-semibold leading-5',
                }}
                onClick={handleDeleteClick}
              >
                Delete property
              </Button>
            </Box>
          </div>
        </ScrollArea>
      </Box>
      <ConfirmationModal
        confirmationModalOpen={confirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen}
        confirmBtnDetail={modalProps}
        icon={icon}
        onConfirm={() => handleDeleteProperty(id)}
      />
    </div>
  );
}
