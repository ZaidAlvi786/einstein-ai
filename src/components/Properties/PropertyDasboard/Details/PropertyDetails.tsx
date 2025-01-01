import { Badge, Card, Loader, Select, TagsInput, Textarea } from '@mantine/core';
import { Edit01Icon, ArrowDown, SaveIcon, XCloseIcon } from '@assets/iconComponents';
// import { FileUpload } from './FileDropzone';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createRequest } from '@api/Base.api';
import { API } from '@constants/api.constant';
import CustomInput from '@utils/CustomInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { propertyDetailsSchema } from '@components/Properties/PropertyDetailsStep/schemas';
import { statesList } from '@constants/app.constant';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUpdateProperty } from '@stores/propertySlice';
import { UnknownAction } from '@reduxjs/toolkit';
import { FileDropzone } from './FileDropzone';

// TypeScript types for property data
interface AddressInfo {
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip_code: string;
  association_with_property: string;
}

interface PropertyDetailsResponse {
  id: string;
  name: string;
  units: number;
  photos: string[];
  description: string;
  unit_type: string | null;
  market_rent: string | null;
  tenants: number | null;
  amenities: string[];
  address_info: AddressInfo;
}

export function PropertyDetails({ contactData }: any) {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetailsResponse | null>(null);

  const [editPropertyDetails, setEditPropertyDetails] = useState<boolean>(false);
  const [detailsLoader, setDetailsLoader] = useState<boolean>(false);

  const [editPropertyDescription, setEditPropertyDescription] = useState<boolean>(false);
  const [descLoader, setDescLoader] = useState<boolean>(false);

  const [editPropertyAmenities, setEditPropertyAmenities] = useState<boolean>(false);
  const [amenitiesLoader, setAmenitiesLoader] = useState<boolean>(false);

  const [editPropertyPhotos, setEditPropertyPhotos] = useState<boolean>(false);
  const [photosLoader, setPhotosLoader] = useState<boolean>(false);

  const methods = useForm({
    resolver: yupResolver(propertyDetailsSchema),
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
  const state = watch('state');

  const getPropertyDetails = (property_id: string) => {
    createRequest(`${API.PROPERTY.GET}/${property_id}`, 'GET')
      .then((res: any) => {
        setPropertyDetails(res);

        // setValue("unit_type", res.unit_type)
        setValue('name', res.name);
        setValue('address_1', res.address_info.address_1);
        setValue('address_2', res.address_info.address_2);
        setValue('state', res.address_info.state);
        setValue('zip_code', res.address_info.zip_code);
        setValue('city', res.address_info.city);
        setValue('description', res.description);
        setValue('amenities', res.amenities);
        setValue('photos', res.photos ?? []);
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  };

  useEffect(() => {
    if (id) {
      getPropertyDetails(id);
    }
  }, [id]);

  const handleSubmitDetails = async () => {
    try {
      setDetailsLoader(true);
      await trigger(['name', 'address_1', 'address_2', 'city', 'state', 'zip_code']);
      if (
        errors.name ||
        errors.address_1 ||
        errors.address_2 ||
        errors.city ||
        errors.state ||
        errors.zip_code
      ) {
        toast.error('Please fix errors');
        return;
      }
      const formData = new FormData();
      const propertyDetailsData: { [key: string]: any } = getValues();
      formData.append('unit_type', propertyDetailsData.unit_type);
      formData.append('name', propertyDetailsData.name);
      formData.append('address_1', propertyDetailsData.address_1);
      formData.append('address_2', propertyDetailsData.address_2);
      formData.append('city', propertyDetailsData.city);
      formData.append('state', propertyDetailsData.state);
      formData.append('zip_code', propertyDetailsData.zip_code);

      const res = await createRequest(
        `${API.PROPERTY.UPDATE}/${id}`,
        'PUT',
        formData,
        'multipart/form-data'
      );
      setPropertyDetails(res);

      dispatch(setUpdateProperty(res as any) as unknown as UnknownAction);
      setEditPropertyDetails(false);
    } catch (error) {
      console.log(error, 'err');
    } finally {
      setDetailsLoader(false);
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
      const propertyDetailsData: { [key: string]: any } = getValues();
      formData.append('amenities', propertyDetailsData.amenities);
      const res = await createRequest(
        `${API.PROPERTY.UPDATE}/${id}`,
        'PUT',
        formData,
        'multipart/form-data'
      );
      setPropertyDetails(res);
      setEditPropertyAmenities(false);
    } catch (error) {
      console.log(error, 'err');
    } finally {
      setAmenitiesLoader(false);
    }
  };

  const handleSubmitDescription = async () => {
    try {
      setDescLoader(true);
      await trigger(['description']);
      if (errors.description) {
        toast.error('Please fix errors');
        return;
      }
      const formData = new FormData();
      const propertyDetailsData: { [key: string]: any } = getValues();
      formData.append('description', propertyDetailsData.description);

      const res = await createRequest(
        `${API.PROPERTY.UPDATE}/${id}`,
        'PUT',
        formData,
        'multipart/form-data'
      );
      setPropertyDetails(res);
      setEditPropertyDescription(false);
    } catch (error) {
      console.log(error, 'err');
    } finally {
      setDescLoader(false);
    }
  };

  const handleSubmitPhotos = () => {
    setPhotosLoader(true);
    const formData = new FormData();
    const propertyDetailsData: { [key: string]: any } = getValues();

    // Filter out strings and retain only binary file types in the "photos" array
    const newPhotos =
      propertyDetailsData.photos?.filter((item: any) => !(typeof item === 'string')) || [];

    if (newPhotos.length === 0) {
      toast.info('Please upload photo');
      setPhotosLoader(false);
      return;
    }

    // Append each binary file individually to the FormData
    newPhotos.forEach((file: File) => {
      formData.append('photos', file);
    });

    createRequest(`${API.PROPERTY.UPDATE}/${id}`, 'PUT', formData, 'multipart/form-data')
      .then((res: any) => {
        setPropertyDetails(res);
        setValue('photos', res.photos ?? []);
        setPhotosLoader(false);
      })
      .catch((err) => {
        console.log(err, 'err');
        setPhotosLoader(false);
      });
  };

  const handleEditPhotosPosition = () => {
    setPhotosLoader(true);

    const photosArray: unknown = getValues('photos');

    createRequest(`${API.PROPERTY.UPDATE}/update-property-photos/${id}`, 'PUT', photosArray)
      .then(() => {
        setEditPropertyPhotos(false);
        setPhotosLoader(false);
      })
      .catch((err) => {
        console.log(err, 'err');
        setPhotosLoader(false);
      });
  };

  return (
    <>
      <div className="flex flex-col items-start gap-5 self-stretch">
        <div className="flex items-start gap-4 self-stretch">
          <div className="flex flex-col items-start justify-center gap-1 flex-0 self-stretch">
            <span className="text-Gray-900 text-xl leading-xl-1 font-semibold">
              Property Details
            </span>
          </div>
        </div>
        <div className="flex items-start self-stretch gap-8">
          <div className="flex flex-col items-start gap-4 flex-0">
            <div className="flex flex-col items-start gap-5 self-stretch">
              <div className="flex items-start self-stretch gap-4 p-2.5">
                <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
                  <span className="text-Gray-900 text-sm font-semibold leading-5">
                    Property details
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex  justify-center items-center gap-2 rounded-[8px]">
                    {!editPropertyDetails && (
                      <Edit01Icon
                        className="cursor-pointer  text-Gray-600 "
                        onClick={() => setEditPropertyDetails(true)}
                      />
                    )}
                    {editPropertyDetails &&
                      (detailsLoader ? (
                        <Loader size="xs" color="grey" />
                      ) : (
                        <>
                          <SaveIcon className="cursor-pointer " onClick={handleSubmitDetails} />
                          <XCloseIcon
                            onClick={() => setEditPropertyDetails(false)}
                            className="size-5 cursor-pointer"
                            stroke="#475467"
                          />
                        </>
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
              {!editPropertyDetails && propertyDetails && (
                <Card.Section
                  classNames={{
                    section: 'flex flex-col items-start gap-2.5 p-4 self-stretch',
                  }}
                >
                  <Badge
                    classNames={{
                      root: 'flex items-center py-0.5 px-1.5 rounded-[6px] border-[1px] border-solid border-Brand-200 bg-Brand-50',
                      label:
                        'text-Brand-700 text-center text-xs font-medium leading-18 normal-case',
                    }}
                  >
                    Multi-family
                    {/* {propertyDetails.unit_type} */}
                  </Badge>
                  <div className="flex items-start gap-2.5 self-stretch">
                    <span className="text-Gray-900 text-sm font-semibold leading-5">
                      {propertyDetails.name}
                    </span>
                  </div>
                  <span className="text-Gray-900 text-sm font-regular leading-5">
                    {`${propertyDetails.address_info.address_1}${propertyDetails.address_info.address_2 ? `, ${propertyDetails.address_info.address_2}` : ''}, ${propertyDetails.address_info.city ?? '--'}, ${propertyDetails.address_info.state ?? '--'} ${propertyDetails.address_info.zip_code}`}
                  </span>
                  <span className="text-Gray-700 text-sm font-medium leading-5">
                    {contactData?.phone_number}
                  </span>
                  <span className="text-Gray-700 text-sm font-medium leading-5">
                    {contactData?.email}
                  </span>
                </Card.Section>
              )}
              {editPropertyDetails && (
                <Card.Section
                  classNames={{
                    section: 'flex flex-col items-start gap-2.5 p-4 self-stretch',
                  }}
                >
                  <Select
                    disabled
                    // {...register('unit_type')}
                    // onChange={(value: string | null) => {
                    //   setValue('unit_type', value ?? '');
                    //   clearErrors('unit_type');
                    // }}
                    // error={!!errors.unit_type}
                    classNames={{
                      option: ' rounded-[8px]',
                      dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                      input: '!h-6 !w-32  !text-xs min-h-6',
                    }}
                    placeholder="Select"
                    checkIconPosition="right"
                    comboboxProps={{ dropdownPadding: 0 }}
                    rightSection={<ArrowDown />}
                    defaultValue="Multi-family"
                    data={['Multi-family', 'Single-family']}
                  />
                  <CustomInput
                    {...register('name')}
                    placeholder="Enter name"
                    classNames={{
                      input: '!p-0.5 !h-5 !w-44  !text-sm rounded-none !leading-5 min-h-5',
                    }}
                    error={!!errors.name}
                  />
                  <div className="flex">
                    <CustomInput
                      {...register('address_1')}
                      placeholder="Enter address"
                      classNames={{
                        input: 'p-0.5 !h-5 !w-24  !text-sm rounded-none leading-5  min-h-5',
                      }}
                      error={!!errors.address_1}
                    />
                    <CustomInput
                      {...register('address_2')}
                      placeholder="Enter address"
                      classNames={{
                        input: 'p-0.5 !h-5 !w-24  !text-sm rounded-none mx-3 leading-5  min-h-5',
                      }}
                    />
                  </div>
                  <div className="flex">
                    <CustomInput
                      {...register('city')}
                      placeholder="Enter address"
                      classNames={{
                        input: 'p-0.5 !h-5 !w-20  !text-sm rounded-none leading-5  min-h-5',
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
                      {...register('zip_code')}
                      placeholder="Enter address"
                      classNames={{ input: 'p-0.5 !h-5  !text-sm rounded-none min-h-5 !w-14' }}
                      error={!!errors.zip_code}
                    />
                  </div>

                  <CustomInput
                    placeholder="212-111-4444"
                    classNames={{
                      input: 'p-0.5 !h-5 w-24  !text-sm rounded-none leading-5  min-h-5',
                    }}
                    value={contactData?.phone_number}
                    disabled
                  />
                  <CustomInput
                    placeholder="Enter email"
                    classNames={{
                      input: 'p-0.5 !h-5 !w-32 !text-sm rounded-none leading-5  min-h-5',
                    }}
                    value={contactData?.email}
                    disabled
                  />
                </Card.Section>
              )}
            </Card>
            <div className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex flex-col items-start h-10 justify-center gap-5 self-stretch">
                <div className="flex items-start self-stretch gap-4">
                  <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
                    <span className="text-Gray-900 text-sm font-semibold leading-5">
                      Property Photos
                    </span>
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
                          <>
                            <SaveIcon
                              className="cursor-pointer"
                              onClick={handleEditPhotosPosition}
                            />
                            <XCloseIcon
                              onClick={() => setEditPropertyPhotos(false)}
                              className="size-5 cursor-pointer"
                              stroke="#475467"
                            />
                          </>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 ">
                <FileDropzone
                  methods={methods}
                  isDisable={!editPropertyPhotos}
                  onImageUpload={handleSubmitPhotos}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 flex-0">
            <div className="flex flex-col items-start gap-5 self-stretch">
              <div className="flex items-start self-stretch gap-4  p-2.5">
                <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
                  <span className="text-Gray-900 text-sm font-semibold leading-5">
                    Property description
                  </span>
                </div>
                <div className="flex  flex-col items-center gap-3">
                  <div className="flex  justify-center items-center gap-2 rounded-[8px]">
                    {!editPropertyDescription && (
                      <Edit01Icon
                        className="cursor-pointer  text-Gray-600"
                        onClick={() => setEditPropertyDescription(true)}
                      />
                    )}
                    {editPropertyDescription &&
                      (descLoader ? (
                        <Loader size="xs" color="grey" />
                      ) : (
                        <>
                          <SaveIcon className="cursor-pointer" onClick={handleSubmitDescription} />
                          <XCloseIcon
                            onClick={() => setEditPropertyDescription(false)}
                            className="size-5 cursor-pointer"
                            stroke="#475467"
                          />
                        </>
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
                {!editPropertyDescription && propertyDetails?.description && (
                  <span className="text-Gray-600 text-sm font-regular leading-5">
                    {propertyDetails.description}
                  </span>
                )}
                {editPropertyDescription && (
                  <Textarea
                    {...register('description')}
                    placeholder="Enter a description"
                    classNames={{
                      input:
                        '!h-sm-2 flex items-center self-stretch p-0 border-0 line-clamp-1 shadow-none overflow-hidden flex-0 text-ellipsis text-Gray-600 text-sm font-regular leading-5 ',
                      root: 'flex flex-col items-start gap-1.5 flex-0 w-full',
                      wrapper: 'w-full',
                    }}
                    className="col-span-1"
                    error={errors.description?.message}
                  />
                )}
              </Card.Section>
            </Card>
            <div className="flex flex-col items-start gap-5 self-stretch">
              <div className="flex items-start self-stretch gap-4 p-2.5">
                <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
                  <span className="text-Gray-900 text-sm font-semibold leading-5">
                    Property amenities
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex  justify-center items-center gap-2 rounded-[8px]">
                    {!editPropertyAmenities && (
                      <Edit01Icon
                        className="cursor-pointer  text-Gray-600 "
                        onClick={() => setEditPropertyAmenities(true)}
                      />
                    )}
                    {editPropertyAmenities &&
                      (amenitiesLoader ? (
                        <Loader size="xs" color="grey" />
                      ) : (
                        <>
                          <SaveIcon className="cursor-pointer" onClick={handleSubmitAmenities} />
                          <XCloseIcon
                            onClick={() => setEditPropertyAmenities(false)}
                            className="size-5 cursor-pointer"
                            stroke="#475467"
                          />
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center content-center gap-1.5 self-stretch flex-wrap">
              {!editPropertyAmenities &&
                propertyDetails?.amenities.map((amenity: any, index: any) => (
                  <Badge
                    key={index}
                    classNames={{
                      root: 'flex justify-center items-center py-0.5 px-sm-9 rounded-[6px] border-[1px] border-solid border-Gray-300 bg-white h-6',
                      label:
                        '!text-Gray-700 text-center text-sm font-medium leading-5  normal-case ',
                    }}
                  >
                    {amenity}
                  </Badge>
                ))}
              {editPropertyAmenities && (
                <TagsInput
                  value={amenities}
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
          </div>
        </div>
      </div>
    </>
  );
}
