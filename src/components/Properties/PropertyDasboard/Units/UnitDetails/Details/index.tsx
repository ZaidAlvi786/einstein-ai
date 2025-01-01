import { createRequest } from '@api/Base.api';
import { ArrowDown, Edit01Icon, SaveIcon, UsersX02Icon } from '@assets/iconComponents';
import { FileDropzone } from '@components/Properties/PropertyDasboard/Details/FileDropzone';
import { API } from '@constants/api.constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { IUnitDetailsForm, UnitDetails } from '@interfaces/unitDetailsForm.interface';
import { Badge, Button, Card, Loader, Select, TagsInput, Textarea } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { unitFormSchema } from './schema';
import { toast } from 'react-toastify';
import { statesList } from '@constants/app.constant';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { initialModalProps } from '@components/mocks';

export function UnitDetailsTab() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [modalProps, setModalProps] = useState(initialModalProps);
  const [icon, setIcon] = useState<ReactElement | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const [unitDetails, setUnitDetails] = useState<UnitDetails>();

  const [editUnitDetails, setEditUnitDetails] = useState<boolean>(false);
  const [detailsLoader, setDetailsLoader] = useState<boolean>(false);
  const [editUnitDescription, setEditUnitDescription] = useState<boolean>(false);
  const [descLoader, setDescLoader] = useState<boolean>(false);
  const [editUnitAmenities, setEditUnitAmenities] = useState<boolean>(false);
  const [amenitiesLoader, setAmenitiesLoader] = useState<boolean>(false);
  const [editPropertyPhotos, setEditPropertyPhotos] = useState<boolean>(false);
  const [photosLoader, setPhotosLoader] = useState<boolean>(false);

  const methods = useForm({
    resolver: yupResolver(unitFormSchema),
  });
  const {
    register,
    setValue,
    clearErrors,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = methods;

  const amenities = (watch('amenities')?.length && watch('amenities')) || undefined;
  const unit_type = watch('unit_type');
  const state = watch('state');

  const getUnitDetails = async (unitId: string) => {
    try {
      const res = await createRequest(`${API.UNITS.GET}/${unitId}`, 'GET');
      if (res) {
        setUnitDetails(res);

        setValue('name', res.unit_info?.name);
        setValue('address_1', res.unit_info?.address_1);
        setValue('address_2', res.unit_info?.address_2);
        setValue('city', res.unit_info?.city);
        setValue('state', res.unit_info?.state);
        setValue('zip_code', res.unit_info?.zip_code);
        setValue('no_of_units', res.unit_info?.no_of_units);
        setValue('bedrooms', res.bedrooms);
        setValue('bathrooms', res.bathrooms);
        setValue('square_feet', res.square_feet);
        setValue('market_rent', res.market_rent);
        setValue('description', res.description);
        setValue('unit_type', res.unit_type);
        setValue('amenities', res.amenities);
        setValue('photos', res.photos ?? []);
      }
    } catch (error) {
      console.error(error, 'err');
    }
  };

  useEffect(() => {
    if (id) {
      getUnitDetails(id);
    }
  }, [id]);

  const handleSubmitDetails = async () => {
    try {
      setDetailsLoader(true);
      await trigger([
        'name',
        'bedrooms',
        'bathrooms',
        'square_feet',
        'market_rent',
        'unit_type',
        'no_of_units',
        'address_1',
        'address_2',
        'city',
        'state',
        'zip_code',
      ]);
      if (
        errors.name ||
        errors.bedrooms ||
        errors.bathrooms ||
        errors.square_feet ||
        errors.market_rent ||
        errors.unit_type ||
        errors.no_of_units ||
        errors.address_1 ||
        errors.address_2 ||
        errors.city ||
        errors.state ||
        errors.zip_code
      ) {
        return;
      }
      const formData = new FormData();
      let unitDetailsData: { [key: string]: any } = getValues();

      const unitInfo = {
        name: unitDetailsData['name'],
        no_of_units: unitDetailsData['no_of_units'],
        address_1: unitDetailsData['address_1'],
        address_2: unitDetailsData['address_2'],
        city: unitDetailsData['city'],
        state: unitDetailsData['state'],
        zip_code: unitDetailsData['zip_code'],
      };

      formData.append('unit_info', JSON.stringify(unitInfo));

      formData.append('unit_type', unitDetailsData['unit_type']);
      formData.append('bedrooms', unitDetailsData['bedrooms']);
      formData.append('bathrooms', unitDetailsData['bathrooms']);
      formData.append('square_feet', unitDetailsData['square_feet']);
      formData.append('market_rent', unitDetailsData['market_rent']);
      formData.append('market_rent', unitDetailsData['market_rent']);

      const res = await createRequest(
        `${API.UNITS.UPDATE}/${id}`,
        'PUT',
        formData,
        'multipart/form-data'
      );
      if (res) {
        setUnitDetails(res);
        setEditUnitDetails(false);
      }
    } catch (error) {
    } finally {
      setDetailsLoader(false);
    }
  };

  const handleSubmitPhotos = async () => {
    try {
      setPhotosLoader(true);
      const formData = new FormData();
      let unitDetailsData: { [key: string]: any } = getValues();

      // Filter out strings and retain only binary file types in the "photos" array
      const newPhotos =
        unitDetailsData['photos']?.filter((item: any) => !(typeof item === 'string')) || [];

      if (newPhotos.length === 0) {
        toast.info('Please upload photo');
        return;
      }

      // Append each binary file individually to the FormData
      newPhotos.forEach((file: File) => {
        formData.append('photos', file);
      });

      const res = await createRequest(
        `${API.UNITS.UPDATE}/${id}`,
        'PUT',
        formData,
        'multipart/form-data'
      );

      if (res) {
        setUnitDetails(res);
        setEditPropertyPhotos(false);
      }
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setPhotosLoader(false);
    }
  };

  const handleSubmitAmenities = async () => {
    try {
      setAmenitiesLoader(true);
      await trigger(['amenities']);
      if (errors.amenities) {
        return;
      }

      // Validate that amenities is not empty
      if (getValues().amenities?.length === 0) {
        toast.error('At least one amenity must be provided.');
        return;
      }

      const formData = new FormData();
      let unitDetailsData: { [key: string]: any } = getValues();
      formData.append('amenities', unitDetailsData['amenities']);
      const res = await createRequest(
        `${API.UNITS.UPDATE}/${id}`,
        'PUT',
        formData,
        'multipart/form-data'
      );
      if (res) {
        setUnitDetails(res);
        setEditUnitAmenities(false);
      }
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setAmenitiesLoader(false);
    }
  };

  const handleSubmitDesc = async () => {
    try {
      setDescLoader(true);
      await trigger(['description']);
      if (errors.description) {
        return;
      }

      const formData = new FormData();
      let unitDetailsData: { [key: string]: any } = getValues();
      formData.append('description', unitDetailsData['description']);

      const res = await createRequest(
        `${API.UNITS.UPDATE}/${id}`,
        'PUT',
        formData,
        'multipart/form-data'
      );
      if (res) {
        setUnitDetails(res);
        setEditUnitDescription(false);
      }
    } catch (error) {
    } finally {
      setDescLoader(false);
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
      const res = await createRequest(`${API.UNITS.DELETE}/${id}`, 'DELETE');
      if (res.message) {
        toast.success(res.message);
        const currentUrl = window.location.href;
        // Extract the propertyId and unitId from the URL
        const urlParts = currentUrl.split('/');
        const propertyId = urlParts[urlParts.indexOf('properties') + 1];
        navigate(`/properties/${propertyId}`);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-5 self-stretch">
        <div className="flex items-start self-stretch gap-8">
          <div className="flex flex-col items-start gap-4 flex-0">
            <div className="flex flex-col items-start gap-5 self-stretch">
              <div className="flex items-start self-stretch gap-4 p-2.5">
                <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
                  <span className="text-Gray-900 text-sm font-semibold leading-5">
                    Unit details
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center gap-2 rounded-[8px]">
                    {!editUnitDetails && (
                      <Edit01Icon
                        className="cursor-pointer  text-Gray-600 "
                        onClick={() => setEditUnitDetails(true)}
                      />
                    )}
                    {editUnitDetails &&
                      (detailsLoader ? (
                        <Loader size="xs" color="grey" />
                      ) : (
                        <SaveIcon className="cursor-pointer " onClick={handleSubmitDetails} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <Card
              withBorder
              classNames={{
                root: 'flex flex-col items-start self-stretch rounded-[8px] border-[1px] border-solid border-Gray-200 bg-white',
              }}
            >
              {!editUnitDetails && unitDetails && (
                <Card.Section
                  classNames={{
                    section: 'flex flex-col items-start gap-2 p-4 self-stretch',
                  }}
                >
                  <Badge
                    classNames={{
                      root: 'flex items-center py-0.5 px-1.5 rounded-[6px] border-[1px] border-solid border-Brand-200 bg-Brand-50',
                      label: 'text-Brand-700 text-center text-xs font-medium leading-18',
                    }}
                  >
                    {unitDetails.unit_type}
                  </Badge>
                  <span className="text-Gray-700 text-sm font-semibold leading-5">
                    {unitDetails.unit_info?.name}
                  </span>
                  <span className="text-Gray-700 text-sm font-regular leading-5">
                    {unitDetails.unit_info?.no_of_units} Units
                  </span>
                  <span className="text-Gray-700 text-sm font-regular leading-5">
                    {unitDetails.unit_info?.address_1} {unitDetails.unit_info?.address_2}
                  </span>
                  <span className="text-Gray-700 text-sm font-regular leading-5">
                    {unitDetails.unit_info?.city} {unitDetails.unit_info?.state}{' '}
                    {unitDetails.unit_info?.zip_code}
                  </span>
                  <span className="text-Gray-700 text-sm font-medium leading-5">
                    {`${unitDetails.bedrooms} Bed, ${unitDetails.bathrooms} Bath, ${unitDetails.square_feet} Sq ft.`}
                  </span>
                  <span className="text-Gray-700 text-sm font-medium leading-5">
                    {`${unitDetails.market_rent} market rent`}
                  </span>
                </Card.Section>
              )}
              {editUnitDetails && (
                <Card.Section
                  classNames={{
                    section: 'flex flex-col items-start gap-2.5 p-4 self-stretch',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Select
                      classNames={{
                        option: 'rounded-[8px]',
                        dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                        input: '!h-6 !w-32 !text-xs min-h-6',
                      }}
                      placeholder="Change model"
                      checkIconPosition="right"
                      rightSection={<ArrowDown />}
                      {...register('unit_type')}
                      value={unit_type}
                      onChange={(value: string | null) => {
                        setValue('unit_type', value ?? '');
                        clearErrors('unit_type');
                      }}
                      data={[
                        { label: 'Multiple', value: 'multiple' },
                        { label: 'Single', value: 'single' },
                      ]}
                      error={!!errors.unit_type}
                    />
                  </div>
                  <CustomInput
                    placeholder="Enter name"
                    {...register('name')}
                    classNames={{
                      input: '!p-0.5 !h-5 !w-44 !text-sm rounded-none !leading-5 min-h-5',
                    }}
                    error={!!errors.name}
                  />
                  <div className="flex">
                    <CustomInput
                      placeholder="Enter address"
                      {...register('address_1')}
                      classNames={{
                        input: 'p-0.5 !h-5 !w-24 !text-sm rounded-none leading-5 min-h-5',
                      }}
                      error={!!errors.address_1}
                    />
                    <CustomInput
                      placeholder="Enter address"
                      {...register('address_2')}
                      classNames={{
                        input: 'p-0.5 !h-5 !w-20 !text-sm rounded-none mx-3 leading-5 min-h-5',
                      }}
                      error={!!errors.address_2}
                    />
                  </div>
                  <div className="flex">
                    <CustomInput
                      placeholder="Enter city"
                      {...register('city')}
                      classNames={{
                        input: 'p-0.5 !h-5 !w-20 !text-sm rounded-none leading-5 min-h-5',
                      }}
                      error={!!errors.city}
                    />
                    <Select
                      classNames={{
                        input: 'p-0.5 !h-5 !w-20  !text-sm rounded-none mx-3  min-h-5',
                      }}
                      {...register('state')}
                      placeholder="Select State"
                      checkIconPosition="right"
                      rightSection={<ArrowDown />}
                      data={statesList}
                      value={state}
                      onChange={(value: string | null) => {
                        setValue('state', value ?? '');
                        clearErrors('state');
                      }}
                      error={!!errors.state}
                    />
                    <CustomInput
                      placeholder="Enter ZIP code"
                      {...register('zip_code')}
                      classNames={{
                        input: 'p-0.5 !h-5 !text-sm rounded-none min-h-5 !w-16',
                      }}
                      error={!!errors.zip_code}
                    />
                  </div>
                  <div className="flex items-start gap-1">
                    <CustomInput
                      placeholder="Units"
                      classNames={{
                        input: 'p-0.5 !h-5 w-16 !text-sm rounded-none leading-5 min-h-5',
                      }}
                      {...register('no_of_units')}
                      error={!!errors.no_of_units}
                    />
                    <span className="text-Gray-700 text-sm font-medium leading-5">Units</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <div className="flex items-start gap-1">
                      <CustomInput
                        placeholder="Bedrooms"
                        classNames={{
                          input: 'p-0.5 !h-5 w-16 !text-sm rounded-none leading-5 min-h-5',
                        }}
                        {...register('bedrooms')}
                        error={!!errors.bedrooms}
                      />
                      <span className="text-Gray-700 text-sm font-medium leading-5">Bedrooms</span>
                    </div>

                    <div className="flex items-start gap-1">
                      <CustomInput
                        placeholder="Bathrooms"
                        classNames={{
                          input: 'p-0.5 !h-5 w-16 !text-sm rounded-none leading-5 min-h-5',
                        }}
                        {...register('bathrooms')}
                        error={!!errors.bathrooms}
                      />
                      <span className="text-Gray-700 text-sm font-medium leading-5">Bathrooms</span>
                    </div>

                    <div className="flex items-start gap-1">
                      <CustomInput
                        placeholder="Square feet"
                        classNames={{
                          input: 'p-0.5 !h-5 w-16 !text-sm rounded-none leading-5 min-h-5',
                        }}
                        {...register('square_feet')}
                        error={!!errors.square_feet}
                      />
                      <span className="text-Gray-700 text-sm font-medium leading-5">
                        Square feet
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-Gray-700 text-sm font-medium leading-5">$</span>
                    <CustomInput
                      placeholder="Market rent"
                      classNames={{
                        input: 'p-0.5 !h-5 w-16 !text-sm rounded-none leading-5 min-h-5',
                      }}
                      {...register('market_rent')}
                      error={!!errors.market_rent}
                    />
                    <span className="text-Gray-700 text-sm font-medium leading-5">market rent</span>
                  </div>
                </Card.Section>
              )}
            </Card>
            <div className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex flex-col items-start h-10 justify-center gap-5 self-stretch">
                <div className="flex items-start self-stretch gap-4">
                  <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
                    <span className="text-Gray-900 text-sm font-semibold leading-5">Photos</span>
                  </div>
                  <div className="flex  flex-col items-center gap-3">
                    <div className="flex  justify-center items-center gap-2 rounded-[8px]">
                      {!editPropertyPhotos && (
                        <Edit01Icon
                          className="cursor-pointer  text-Gray-600"
                          onClick={() => setEditPropertyPhotos(true)}
                        />
                      )}
                      {editPropertyPhotos &&
                        (photosLoader ? (
                          <Loader size="xs" color="grey" />
                        ) : (
                          <SaveIcon className="cursor-pointer" onClick={handleSubmitPhotos} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 ">
                <FileDropzone methods={methods} isDisable={!editPropertyPhotos} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 flex-0">
            <div className="flex flex-col items-start gap-5 self-stretch">
              <div className="flex items-start self-stretch gap-4 p-2.5">
                <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
                  <span className="text-Gray-900 text-sm font-semibold leading-5">Amenities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex  justify-center items-center gap-2 rounded-[8px]">
                    {!editUnitAmenities && (
                      <Edit01Icon
                        className="cursor-pointer  text-Gray-600 "
                        onClick={() => setEditUnitAmenities(true)}
                      />
                    )}
                    {editUnitAmenities &&
                      (amenitiesLoader ? (
                        <Loader size="xs" color="grey" />
                      ) : (
                        <SaveIcon className="cursor-pointer" onClick={handleSubmitAmenities} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center content-center gap-sm-3 self-stretch flex-wrap">
              {!editUnitAmenities &&
                amenities?.map((amenity, index) => (
                  <Badge
                    key={index}
                    classNames={{
                      root: 'flex justify-center items-center py-0.5 px-sm-9 rounded-[6px] border-[1px] border-solid border-Gray-300 bg-white h-6',
                      label: '!text-Gray-700 text-center text-sm font-medium leading-5   ',
                    }}
                  >
                    {amenity}
                  </Badge>
                ))}
              {editUnitAmenities && (
                <TagsInput
                  value={(watch('amenities')?.length && watch('amenities')) || undefined}
                  onChange={(value: string[]) => {
                    setValue('amenities', value); // Directly use value without wrapping it in another array
                    clearErrors('amenities');
                  }}
                  classNames={{
                    input:
                      ' !h-sm-2  self-stretch  line-clamp-1 shadow-none overflow-hidden flex-0 text-ellipsis text-Gray-600 text-sm font-regular leading-5 ',
                    root: 'flex flex-col items-start gap-1.5 flex-0 w-full',
                    wrapper: 'w-full',
                  }}
                  className=" custom-tag w-full !border-0"
                  placeholder="Enter amenities"
                  error={
                    errors.amenities?.message ||
                    (errors.amenities?.length && 'Each tag must be 30 characters or less')
                  }
                />
              )}
            </div>
            <div className="flex flex-col items-start gap-5 self-stretch">
              <div className="flex items-start self-stretch gap-4  p-2.5">
                <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
                  <span className="text-Gray-900 text-sm font-semibold leading-5">Description</span>
                </div>
                <div className="flex  flex-col items-center gap-3">
                  <div className="flex  justify-center items-center gap-2 rounded-[8px]">
                    {!editUnitDescription && (
                      <Edit01Icon
                        className="cursor-pointer  text-Gray-600"
                        onClick={() => setEditUnitDescription(true)}
                      />
                    )}
                    {editUnitDescription &&
                      (descLoader ? (
                        <Loader size="xs" color="grey" />
                      ) : (
                        <SaveIcon className="cursor-pointer" onClick={handleSubmitDesc} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <Card
              withBorder
              classNames={{
                root: 'flex flex-col items-start self-stretch rounded-[8px] border-[1px] border-solid border-Gray-200 bg-white',
              }}
            >
              <Card.Section
                classNames={{
                  section: 'flex flex-col items-start gap-2.5 p-4 self-stretch',
                }}
              >
                {!editUnitDescription && unitDetails && (
                  <span className="text-Gray-600 text-sm font-regular leading-5">
                    {unitDetails.description}
                  </span>
                )}
                {editUnitDescription && (
                  <Textarea
                    placeholder="Add a short description..."
                    classNames={{
                      input:
                        '!h-sm-2 flex items-center self-stretch p-0 border-0 line-clamp-1 shadow-none overflow-hidden flex-0 text-ellipsistext-Gray-600 text-sm font-regular leading-5 ',
                      root: 'flex flex-col items-start gap-1.5 flex-0 w-full',
                      wrapper: 'w-full',
                    }}
                    className="col-span-1"
                    {...register('description')}
                    error={errors.description?.message}
                  />
                )}
              </Card.Section>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Button
          className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 rounded-[6px] "
          classNames={{
            label: `text-sm font-semibold leading-5 text-white}`,
            section: 'flex py-0.5 px-1.5 items-center !border-0 text-white',
            root: `h-9 flex justify-center py-2 px-3 items-center flex justify-center py-2 px-3 items-center gap-2 flex-0 rounded-[6px] shadow-sm`,
          }}
          variant="filled"
          color="red"
          onClick={handleDeleteClick}
        >
          Delete unit
        </Button>
      </div>
      <ConfirmationModal
        confirmationModalOpen={confirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen}
        confirmBtnDetail={modalProps}
        icon={icon}
        onConfirm={() => handleDeleteProperty(id)}
      />
    </>
  );
}
