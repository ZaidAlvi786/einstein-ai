import { createRequest } from '@api/Base.api';
import { ChevronDownIcon } from '@assets/iconComponents';
import { API } from '@constants/api.constant';
import { Button, Select, Table, TagsInput, Loader } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Unit {
  units: any;
  id: string;
  unit_name: string;
  address: string;
  rent: number;
  amenities: string[];
  market_rent: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  unit_model: string;
  unit_type: string;
}

export function BulkEditUnitModel() {
  const [isLoader, setIsLoader] = useState({ loader: true, saveLoader: false });
  const { id } = useParams<{ id: string }>();
  const [unitModelData, setUnitModelData] = useState<Unit[]>([]);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();

  const updateTableData = (id: string, updatedData: Partial<Unit>) => {
    setUnitModelData((prevData) =>
      prevData.map((unit) => (unit.id === id ? { ...unit, ...updatedData } : unit))
    );
  };

  useEffect(() => {
    if (id) {
      getUnitGroupModelData();
    }
  }, [id]);

  const getUnitGroupModelData = async () => {
    setIsLoader({ loader: true, saveLoader: false });
    const response = await createRequest(`${API.UNITS.GET_MULTIPLE_MODEL}/${id}`, 'GET');

    if (response) {
      setIsLoader({ loader: false, saveLoader: false });
      const getMultiple = response.filter(
        (unit_model: Unit) => unit_model.unit_type === 'multiple'
      );
      if (getMultiple.length > 0) {
        setUnitModelData(getMultiple?.[0]?.units ?? []);
      }
    }
    setIsLoader({ loader: false, saveLoader: false });
  };

  const updateUnits = async () => {
    setIsLoader({ saveLoader: true, loader: false });
    const response = await createRequest(API.UNITS.UPDATE_BULK, 'PUT', { units: unitModelData });

    if (response) {
      setIsLoader({ saveLoader: false, loader: false });
      setEdit(false);
    }
    setIsLoader({ saveLoader: false, loader: false });
  };

  const sharedTdClasses = clsx(
    'p-0',
    'border-t-0',
    'border-solid',
    'border-Gray-200',
    'border-b-[1px]'
  );

  const sharedInputClasses = clsx('!border-none', '!shadow-none', 'h-10');
  const grayBgClass = (condition: boolean) => (condition ? 'bg-Gray-50' : '');

  return (
    <div className="flex flex-col px-8 items-start gap-4 self-stretch pt-5">
      <div className="flex flex-col items-start gap-5 self-stretch">
        <div className="flex items-end gap-4 self-stretch">
          <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
            <span className="text-Gray-900 text-lg font-semibold leading-7">Bulk edit</span>
            <span className="text-Gray-600 text-ellipsis text-sm font-regular leading-5">
              Manage your team members and their account permissions here.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className=" font-semibold h-11 text-sm rounded-lg leading-5 text-Gray-600 hover:bg-transparent hover:text-gray-700 bg-transparent"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                if (unitModelData.length > 0) {
                  updateUnits();
                }
              }}
              className="w-44	rounded-lg h-11 hover:bg-Brand-600 hover:text-white bg-Brand-600 text-sm leading-5 text-white font-semibold ms-3 drop-shadow-xs"
            >
              {isLoader.saveLoader ? <Loader size={30} color="#fff" /> : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
      {isLoader.loader ? (
        <div className="text-center p-5 mx-auto">
          <Loader size={50} color="#3E4784" />
        </div>
      ) : unitModelData && unitModelData.length > 0 ? (
        <Table
          withColumnBorders
          classNames={{
            thead: '!bg-Gray-blue-25 border-b-[1px] border-solid border-Gray-200',
            table:
              '!rounded-xl border-separate border border-solid border-Gray-200 bg-white drop-shadow-xs',
            th: 'text-xs font-medium leading-11 text-gray-600 ps-4 pe-2 py-3 font-medium !bg-Gray-blue-25 border-x-0 border-t-0 border-b-[1px] border-solid border-Gray-200 p-0',
            td: sharedTdClasses,
          }}
        >
          <Table.Thead>
            <Table.Tr className="rounded-t-xl">
              <Table.Th className="rounded-tl-xl">Unit name</Table.Th>
              <Table.Th>Unit model</Table.Th>
              <Table.Th>Bed</Table.Th>
              <Table.Th>Bath</Table.Th>
              <Table.Th>Sqft</Table.Th>
              <Table.Th>Unit address</Table.Th>
              <Table.Th>Market rent</Table.Th>
              <Table.Th className="rounded-tr-xl">Amenities</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {unitModelData.map((element, index) => (
              <Table.Tr key={element.id}>
                <Table.Td
                  className={clsx('max-w-4', sharedTdClasses, {
                    'border-b-0': index === unitModelData.length - 1,
                  })}
                >
                  <CustomInput
                    onMouseDown={() => setEdit(true)}
                    type="text"
                    classNames={{ input: sharedInputClasses }}
                    value={element.unit_name || 'NA'}
                    onChange={(e) => updateTableData(element.id, { unit_name: e.target.value })}
                  />
                </Table.Td>
                <Table.Td
                  className={clsx('max-w-24	', sharedTdClasses, {
                    'border-b-0': index === unitModelData.length - 1,
                  })}
                >
                  <Select
                    checkIconPosition="right"
                    data={['Model A', 'Model B', 'Model C', 'Model D']}
                    classNames={{ input: 'border-none !shadow-none' }}
                    rightSection={<ChevronDownIcon />}
                    value={element.unit_model || 'Model A'} // Convert null to undefined
                    onChange={(value) => updateTableData(element.id, { unit_model: value || '' })} // Ensure value is handled properly
                  />
                </Table.Td>
                <Table.Td
                  className={clsx(sharedTdClasses, {
                    'border-b-0 w-3': index === unitModelData.length - 1,
                  })}
                >
                  <CustomInput
                    onMouseDown={() => setEdit(true)}
                    type="text"
                    classNames={{
                      input: clsx(sharedInputClasses, grayBgClass(!element.unit_name)),
                      wrapper: grayBgClass(!element.unit_name),
                      root: grayBgClass(!element.unit_name),
                    }}
                    value={element.bedrooms.toString()}
                    onChange={(e) =>
                      updateTableData(element.id, { bedrooms: parseInt(e.target.value, 10) })
                    }
                  />
                </Table.Td>
                <Table.Td
                  className={clsx(sharedTdClasses, {
                    'border-b-0 w-3': index === unitModelData.length - 1,
                  })}
                >
                  <CustomInput
                    onMouseDown={() => setEdit(true)}
                    type="text"
                    classNames={{
                      input: clsx(sharedInputClasses, grayBgClass(!element.unit_name)),
                      wrapper: grayBgClass(!element.unit_name),
                      root: grayBgClass(!element.unit_name),
                    }}
                    value={element.bathrooms.toString()}
                    onChange={(e) =>
                      updateTableData(element.id, { bathrooms: parseInt(e.target.value, 10) })
                    }
                  />
                </Table.Td>
                <Table.Td
                  className={clsx('w-20', sharedTdClasses, {
                    'border-b-0': index === unitModelData.length - 1,
                  })}
                >
                  <CustomInput
                    onMouseDown={() => setEdit(true)}
                    type="text"
                    classNames={{
                      input: clsx(sharedInputClasses, grayBgClass(!element.unit_name)),
                      wrapper: grayBgClass(!element.unit_name),
                      root: grayBgClass(!element.unit_name),
                    }}
                    value={element.square_feet.toString()}
                    onChange={(e) =>
                      updateTableData(element.id, { square_feet: parseInt(e.target.value, 10) })
                    }
                  />
                </Table.Td>
                <Table.Td
                  className={clsx('min-w-60', sharedTdClasses, {
                    'border-b-0': index === unitModelData.length - 1,
                  })}
                >
                  <CustomInput
                    type="text"
                    className="w-full"
                    classNames={{ input: clsx('!border-none !shadow-none') }}
                    value={element.address}
                    onChange={(e) => updateTableData(element.id, { address: e.target.value })}
                  />
                </Table.Td>
                <Table.Td
                  className={clsx(sharedTdClasses, {
                    'border-b-0 w-[6rem]': index === unitModelData.length - 1,
                  })}
                >
                  <CustomInput
                    type="text"
                    className="w-full"
                    classNames={{ input: clsx('!border-none !shadow-none') }}
                    value={element.market_rent.toString()}
                    onChange={(e) => updateTableData(element.id, { market_rent: e.target.value })}
                  />
                </Table.Td>
                <Table.Td
                  className={clsx('!m-w-36 flex items-center gap-2 px-2 py-2 ', sharedTdClasses, {
                    'border-b-0': index === unitModelData.length - 1,
                  })}
                >
                  <TagsInput
                    onChange={(value: string[]) => {
                      updateTableData(element.id, { amenities: value });
                    }}
                    classNames={{
                      input: clsx('!border-none !shadow-none m-w-36'),
                      wrapper: 'w-72',
                    }}
                    className="custom-tag"
                    defaultValue={element.amenities}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <h1 className="text-center m-auto font-semibold mt-10 text-2xl">No data found</h1>
      )}
    </div>
  );
}
