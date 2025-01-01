import { Edit01Icon, PlusIcon, SaveIcon, XCloseIcon } from '@assets/iconComponents';
import SvgEdit01 from '@assets/iconComponents/Edit01';
import SvgTrash01 from '@assets/iconComponents/Trash01';
import { Badge, Button, Card, TagsInput, Textarea, Loader, CloseIcon } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import CustomInput from '@utils/CustomInput';
import { EditUnitDetailsArgs, UnitModelDataInterface } from '@interfaces/property.interface';
import {
  editUnitDetails,
  getMultipleUnits,
  getUnitMixDetails,
  updateUnitDetailsUnits,
  updateUnitTable,
} from '@stores/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import { setLoading } from '@stores/authSlice';
import { formatNumberToCurrency } from '@utils/currency';
import { toast } from 'react-toastify';
import { createRequest } from '@api/Base.api';
import { API } from '@constants/api.constant';
import { unitDetailsSchema } from '@components/Properties/PropertyDetailsStep/schemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import { MoveUnitModal } from './MoveUnitModal';
import { DeleteUnitModal } from './DeleteUnitModal';
import { UnitModelDataTable } from './UnitModelDataTable';
import AddUnitToModal from './AddUnitToModal';
import { FileDropzone } from '../Details/FileDropzone';

type UnitData = {
  description: string;
  name: string;
  bed: number;
  bath: number;
  size: number;
  rent: number;
  parking: string;
  amenities: string[];
};
type FieldType = 'textarea' | 'input' | 'number';

export function ModelCardDetails({
  detailModel,
  setDetailModelOpen,
}: {
  detailModel: UnitModelDataInterface;
  setDetailModelOpen: (item: boolean) => void;
}) {
  const unitMixDetails = useSelector(getUnitMixDetails);
  const dispatch = useDispatch();
  const [unitToModalOpen, setUnitToModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [moveUnitModalOpen, setMoveUnitModalOpen] = useState<boolean>(false);
  const [editPropertyPhotos, setEditPropertyPhotos] = useState<boolean>(false);
  const [photosLoader, setPhotosLoader] = useState<boolean>(false);
  const [unitTableData, setUnitTableData] = useState<any[]>([]);

  // to edit table
  const [selectedRowsTable, setSelectedRowsTable] = useState<any[]>([]);
  const [selectedRowsTable2, setSelectedRowsTable2] = useState<any[]>([]);

  const [editedRowsTable, setEditedRowsTable] = useState<any[]>();
  const [editedRowsTable2, setEditedRowsTable2] = useState<any[]>();

  const [isTableEditing, setIsTableEditing] = useState(false);

  // State to track whether each section is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams<{ id: string }>();

  // State to hold the current values of the fields
  const [unitData, setUnitData] = useState({
    description: detailModel?.description ?? '--',
    name: detailModel?.unit_info?.name,
    bed: detailModel.bedrooms,
    bath: detailModel.bathrooms,
    size: detailModel?.square_feet,
    rent: detailModel.market_rent,
    parking: 'parking query',
    amenities: detailModel?.amenities,
  });

  const methods = useForm({
    resolver: yupResolver(unitDetailsSchema),
  });
  const { getValues, setValue } = methods;

  // Function to handle clicking the edit icon
  const handelModelEdit = async () => {
    dispatch(setLoading(true));

    // Create a new FormData instance
    const formData = new FormData();

    // Convert number values to strings before appending
    formData.append('property_id', String(detailModel.property_id));
    formData.append('bedrooms', String(unitData.bed));
    formData.append('bathrooms', String(unitData.bath));
    formData.append('square_feet', String(unitData.size));
    formData.append('market_rent', String(unitData.rent));
    formData.append('description', unitData.description);
    formData.append('amenities', String(unitData.amenities));

    // Append nested object (unit_info) as JSON string
    formData.append('unit_info', JSON.stringify({ ...detailModel.unit_info, name: unitData.name }));

    // Handle photos (assuming it's an array)
    detailModel.photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });

    formData.append('unit_type', String(detailModel.unit_type));

    // Dispatch action with FormData
    await dispatch(
      editUnitDetails({
        id: detailModel.id,
        userData: formData, // Pass the formData
      } as unknown as EditUnitDetailsArgs) as unknown as UnknownAction
    );

    setIsEditing(false);
    dispatch(setLoading(false));
  };

  // Function to handle changes in input fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof UnitData
  ) => {
    const { value } = e.target;
    setUnitData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setActionHandler = (val: string | null): void => {
    if (val === 'deleteUnit') {
      setDeleteModalOpen(true);
    } else if (val === 'moveUnit') {
      setMoveUnitModalOpen(true);
    }
  };

  const handleSubmitPhotos = (unitid: string) => {
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

    createRequest(`${API.UNITS.CREATE}/${unitid}`, 'PUT', formData, 'multipart/form-data')
      .then((res) => {
        dispatch(getMultipleUnits(id as string) as unknown as UnknownAction);
        setValue('photos', res.photos ?? []);
        setPhotosLoader(false);
      })
      .catch((err) => {
        console.log(err, 'err');
        setPhotosLoader(false);
      });
  };

  const handleEditPhotosPosition = (unitid: string) => {
    setPhotosLoader(true);

    const photosArray: unknown = getValues('photos');

    createRequest(`/update_unit_model_photos/${unitid}`, 'PUT', photosArray)
      .then((res) => {
        dispatch(getMultipleUnits(id as string) as unknown as UnknownAction);
        setValue('photos', res ?? []);
        setEditPropertyPhotos(false);
        setPhotosLoader(false);
      })
      .catch((err) => {
        console.log(err, 'err');
        setPhotosLoader(false);
      });
  };

  const renderField = (field: keyof UnitData, fieldType: FieldType) => {
    const value = unitData[field];
    if (!isEditing) {
      return (
        <div
          className={clsx('text-Gray-600 leading-5', {
            'font-semibold text-[16px]': field === 'name', // Apply font-weight 600 and font-size 14px for 'name' field
            'font-medium': field !== 'description' && field !== 'name', // Default font-medium for other fields except 'description' and 'name'
            'font-normal': field === 'description', // Font-normal for 'description'
            'text-sm': field !== 'name', // Text-sm for all fields except 'name'
          })}
        >
          {field === 'rent' ? formatNumberToCurrency(value as number, 0) : value}
        </div>
      );
    }

    switch (fieldType) {
      case 'textarea':
        return (
          <Textarea
            autosize
            minRows={4}
            maxRows={8}
            value={value}
            name={field}
            onChange={(e) => handleInputChange(e, field)}
            classNames={{
              input: clsx('border-[1px] !shadow-none'),
            }}
            style={{
              minWidth: '420px',
            }}
            readOnly={!isEditing}
          />
        );

      case 'input':
        return (
          <CustomInput
            type="text"
            value={value}
            name={field}
            onChange={(e) => handleInputChange(e, field)}
            classNames={{
              input: clsx('border-[1px] !shadow-none rounded-none h-4 !p-0'),
            }}
            style={{ width: 'fit-content' }}
            readOnly={!isEditing}
          />
        );
      case 'number':
        return (
          <CustomInput
            type="number"
            value={value}
            name={field}
            onChange={(e) => handleInputChange(e, field)}
            classNames={{
              input: clsx('border-[1px] !shadow-none rounded-none h-4'),
            }}
            readOnly={!isEditing}
            style={{ maxWidth: '70px' }}
          />
        );

      default:
        return (
          <CustomInput
            type="text"
            value={value}
            name={field}
            onChange={(e) => handleInputChange(e, field)}
            classNames={{
              input: clsx('border-[1px] !shadow-none rounded-none h-4 !p-0'),
            }}
            readOnly={!isEditing}
            style={{
              width: 'fit-content', // Automatically adjust to content width
            }}
          />
        );
    }
  };

  const handleUpdateDataTable = (data: any[]) => {
    setEditedRowsTable(data);
  };
  const handleUpdateDataTable2 = (data: any[]) => {
    setEditedRowsTable2(data);
  };

  // Function to handle clicking the edit icon
  const toggleEditTableMode = () => {
    setIsTableEditing((prev) => !prev);
  };

  const handleSaveClick = async () => {
    dispatch(setLoading(true));

    const tableData: any = [];
    [...(editedRowsTable ?? []), ...(editedRowsTable2 ?? [])]?.forEach((row) => {
      if (row?.edited) {
        tableData.push({
          id: row.id,
          unit_name: row.unit_name,
          market_rent: row.market_rent,
          address: row.address,
        });
      }
    });

    await dispatch(updateUnitTable(tableData as unknown as any[]) as unknown as UnknownAction);

    dispatch(
      updateUnitDetailsUnits([
        ...unitMixDetails.map((val) =>
          val.id === detailModel.id
            ? {
                ...val,
                units: val.units?.map((unit) => {
                  // Check if unit is in either editedRowsTable or editedRowsTable2
                  const editedUnit = [...(editedRowsTable ?? []), ...(editedRowsTable2 ?? [])].find(
                    (edited) => edited.id === unit.id
                  );

                  // Return edited unit if found, otherwise return existing unit
                  return editedUnit || unit;
                }),
              }
            : val
        ),
      ])
    );

    setIsTableEditing(false);
    dispatch(setLoading(false));
  };

  const handleOpenPopup = () => {
    setActionHandler('moveUnit');
  };

  useEffect(() => {
    // Update unitTableData when unitMixDetails or detailModel changes
    if (unitMixDetails && detailModel?.id) {
      const data =
        unitMixDetails
          .filter((element) => element.unit_type === 'multiple')
          .find((item) => item.id === detailModel.id)?.units ?? [];

      setUnitTableData(data);
    }
  }, [unitMixDetails, detailModel]);

  useEffect(() => {
    setUnitData({
      description: detailModel?.description ?? '--',
      name: detailModel?.unit_info?.name,
      bed: detailModel.bedrooms,
      bath: detailModel.bathrooms,
      size: detailModel?.square_feet,
      rent: detailModel.market_rent,
      parking: 'parking query',
      amenities: detailModel?.amenities,
    });

    if (detailModel.photos.length > 0) {
      setValue(
        'photos',
        detailModel.photos.map((photo) => `${photo}` as any)
      );
    }
    setSelectedRowsTable([]);
    setSelectedRowsTable2([]);
    setIsEditing(false);
    setIsTableEditing(false);
    handleUpdateDataTable([]);
    setEditPropertyPhotos(false);
  }, [detailModel]);

  const unitTables = useMemo(() => {
    // Calculate the midpoint
    const midpoint = Math.ceil(unitTableData.length / 2);
    // Split the data into two halves
    const firstHalf = unitTableData.slice(0, midpoint);
    const secondHalf = unitTableData.slice(midpoint);

    return (
      <>
        {firstHalf.length > 0 && (
          <UnitModelDataTable
            onRowSelect={setSelectedRowsTable}
            showEditTable={isTableEditing}
            selectedRows={selectedRowsTable}
            onUpdateData={(data) => handleUpdateDataTable(data)}
            unitTableData={firstHalf}
          />
        )}
        {secondHalf.length > 0 && (
          <UnitModelDataTable
            onRowSelect={setSelectedRowsTable2}
            showEditTable={isTableEditing}
            selectedRows={selectedRowsTable2}
            onUpdateData={(data) => handleUpdateDataTable2(data)}
            unitTableData={secondHalf}
          />
        )}
      </>
    );
  }, [unitTableData, isTableEditing, selectedRowsTable, selectedRowsTable2]);

  return (
    <Card
      withBorder
      classNames={{
        root: 'rounded-[12px] border-[1px] border-solid border-Gray-blue-300 w-full rounded-ss-none shadow-ring-brand-shadow-sm',
      }}
    >
      <Card.Section withBorder className="p-6 flex flex-col items-start gap-2 self-stretch">
        <div className="flex items-start gap-5 self-stretch">
          <div className="flex flex-col items-start gap-4 flex-0">
            <div className="flex justify-between items-start self-stretch">
              <div className="flex justify-between items-start gap-4 w-full">
                <div className="flex flex-col justify-center items-center gap-3 ">
                  <FileDropzone
                    methods={methods}
                    isDisable={!editPropertyPhotos}
                    onImageUpload={() => {
                      handleSubmitPhotos(detailModel.id);
                    }}
                  />
                </div>
                <div className="flex justify-center items-center gap-2 rounded-[8px] me-5">
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
                          onClick={() => {
                            handleEditPhotosPosition(detailModel.id);
                          }}
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
            <div className="text-sm font-medium leading-5 text-gray-600">Description</div>
            <div
              style={{ wordBreak: 'break-all' }}
              className="text-xs-1 font-normal  leading-5 text-gray-600"
            >
              {renderField('description', 'textarea')}
            </div>
          </div>
          <div className={`flex flex-col items-start gap-xs-1 flex-0 ${isEditing && 'mt-10'}`}>
            {renderField('name', 'input')}
            <div className="flex flex-col gap-1 items-start">
              <div className="text-gray-600 text-sm font-medium leading-5">
                <div className="flex items-center gap-1">
                  {renderField('bed', 'number')} Bed,
                  {renderField('bath', 'number')} Bath,
                  {renderField('size', 'number')} Sq ft.
                </div>
              </div>
              <div className="text-gray-600 text-sm font-medium leading-5">
                <div className="flex items-center gap-1">
                  {renderField('rent', 'number')} monthly rent
                </div>
              </div>
              <div className="text-gray-600 text-sm font-medium leading-5">
                {renderField('parking', 'input')}
              </div>
            </div>
            <div className="absolute right-5 top-5 flex justify-end items-start">
              {isEditing ? (
                <>
                  <Button
                    className=" font-semibold h-11 text-sm rounded-lg leading-5 text-Gray-600 hover:bg-transparent hover:text-gray-700 bg-transparent"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    classNames={{
                      section: 'w-5 h-5 m-0',
                      root: 'flex gap-1.5 px-4 py-2.5 justify-center rounded-[12px] drop-shadow-xs text-base h-11',
                      inner: 'flex gap-1.5 justify-center drop-shadow-xs text-base',
                    }}
                    className="bg-brand-960 hover:bg-brand-970 text-base font-semibold"
                    onClick={handelModelEdit}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <div className="flex justify-between gap-2">
                  <div className="flex p-2.5 justify-center items-center gap-2 rounded-[12px] w-full">
                    <SvgEdit01 onClick={() => setIsEditing(true)} className="cursor-pointer" />
                  </div>
                  <div className="flex p-2.5 justify-center items-center gap-2 rounded-[12px] w-full">
                    <SvgTrash01
                      onClick={() => setActionHandler('deleteUnit')}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="text-gray-600 text-sm-1 leading-5 font-semibold">Amenities</div>
            <div className="flex items-start self-stretch gap-xs-1 flex-wrap content-start">
              {isEditing ? (
                <TagsInput
                  maxTags={10}
                  value={unitData.amenities}
                  onChange={(value) => setUnitData({ ...unitData, amenities: value })}
                  classNames={{
                    input: clsx('border-[1px] !shadow-none h-36'),
                  }}
                />
              ) : (
                <div>
                  {unitData?.amenities?.map((tag, index) => (
                    <Badge
                      key={index}
                      className="text-gray-700 leading-18 py-0.5 px-2 mr-1 mb-1  bg-gray-50 border-solid border-[1px] border-Gray-200 text-xs font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center self-stretch">
          <span className="text-Gray-600 text-base leading-5 font-semibold">
            {detailModel?.units?.length ?? 0} units
          </span>
          <div className="flex  justify-end items-start gap-xs-2">
            {isTableEditing ? (
              <>
                <Button
                  className=" font-semibold h-11 text-sm rounded-lg leading-5 text-Gray-600 hover:bg-transparent hover:text-gray-700 bg-transparent"
                  onClick={() => {
                    setIsTableEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  className="border-[1px] border-solid border-[#3E4784] bg-[#3E4784] rounded-[8px]"
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
              </>
            ) : selectedRowsTable.length + selectedRowsTable2.length > 0 ? (
              <Button
                variant="filled"
                className="border-[1px] border-solid border-[#3E4784] bg-[#3E4784] rounded-[8px]"
                style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }}
                onClick={handleOpenPopup}
              >
                Change unit model
              </Button>
            ) : (
              <div className="flex justify-between gap-2">
                <div className="flex p-2.5 justify-center items-center gap-2 rounded-[12px] cursor-pointer">
                  <PlusIcon onClick={() => setUnitToModalOpen(true)} />
                </div>
                <div className="flex p-2.5 justify-center items-center gap-2 rounded-[12px] cursor-pointer">
                  <SvgEdit01 onClick={toggleEditTableMode} />
                </div>
              </div>
            )}
          </div>
        </div>
        {detailModel?.units?.length && (
          <div className="flex flex-start self-stretch">{unitTables}</div>
        )}
      </Card.Section>
      {deleteModalOpen && (
        <DeleteUnitModal
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          detailModel={detailModel}
          setDetailModelOpen={setDetailModelOpen}
        />
      )}
      {moveUnitModalOpen && (
        <MoveUnitModal
          moveUnitModalOpen={moveUnitModalOpen}
          setMoveUnitModalOpen={setMoveUnitModalOpen}
          detailModel={detailModel}
          selectedRowsTable={selectedRowsTable}
          setSelectedRowsTable={setSelectedRowsTable}
          selectedRowsTable2={selectedRowsTable2}
          setSelectedRowsTable2={setSelectedRowsTable2}
        />
      )}
      {unitToModalOpen && (
        <AddUnitToModal
          unit_model_id={detailModel.id}
          addUnitOpen={unitToModalOpen}
          setAddUnitOpen={setUnitToModalOpen}
        />
      )}
    </Card>
  );
}
