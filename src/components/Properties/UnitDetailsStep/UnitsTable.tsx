import React, { useEffect, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { CrossedTitle } from '@components/CrossedTitle';
import { Button, Table, TagsInput, Input, Pagination } from '@mantine/core';
import {
  AlertCircleIcon,
  ArrowNarrowLeftIcon,
  ArrowRightIcon,
  XCloseIcon,
} from '@assets/iconComponents';
import { UnitDetailsForm, unitDetailsSchema } from './schemas';
import { StepButtons } from '../StepButtons';
import { SINGLE_UNIT_VALUE } from '@constants/singleUnit.constants';
import { MULTI_UNIT_VALUE } from '@constants/multiUnit.constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomTittle } from '@components/CustomTitte';
import { UnitModelDataInterface } from '@interfaces/property.interface';
import { useNavigate } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@stores/authSlice';
import { getUnitGroupModel, selectApiData, updateUnitTable } from '@stores/propertySlice';
import { UnknownAction } from '@reduxjs/toolkit';
import { CustomInput } from '@utils/CustomInput';
import clsx from 'clsx';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
// create dummy data for unit model and unit details

export function UnitTable({ step, handlers }: Props) {
  const [activePage, setActivePage] = useState(1);
  const [edit, setEdit] = useState(false);
  const [tableData, setTableData] = useState<any[]>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const propertyData = useSelector(selectApiData);

  const [unitModelData, setUnitModelData] = useState<UnitModelDataInterface[]>([]);
  const initialValues = {
    isSingle: true,
    single: [SINGLE_UNIT_VALUE],
    multiple: [MULTI_UNIT_VALUE],
  };
  const methods = useForm({
    resolver: yupResolver<any>(unitDetailsSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = methods;

  const onSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const allUnits = unitModelData.reduce((acc, property) => {
        if (property?.units) {
          return acc.concat(property.units as any);
        }
        return acc;
      }, [] as UnitModelDataInterface[]);
      await dispatch(
        updateUnitTable(allUnits as unknown as UnitModelDataInterface[]) as unknown as UnknownAction
      );

      dispatch(setLoading(false));
      handlers.increment();
    } catch (error) {
      dispatch(setLoading(false));
      console.log('error', error);
    }
  };

  const handleContinue = async () => {
    await handleSubmit(onSubmit)();
  };

  const handleExit = () => {
    // handleSubmit(onSubmit)();
    // navigate(APP_PATHS.properties.get());
  };
  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const getUnitGroupModelData = async () => {
    let id = (propertyData as unknown as { id?: string })?.id ?? '';
    const result = (await dispatch(getUnitGroupModel(id) as unknown as UnknownAction)) as any;

    if (result?.payload !== undefined) {
      // Filter the result array by unit_type
      const filteredUnitModelData = result.payload.filter(
        (unitModel: UnitModelDataInterface) => unitModel.unit_type === 'multiple'
      );

      setUnitModelData(filteredUnitModelData);
      setTableData(filteredUnitModelData[0]?.units ?? []);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    try {
      getUnitGroupModelData();
    } catch (e) {
      dispatch(setLoading(false));
    }
  }, []);

  const udateTableData = (parentId: any, id: any, updatedData: any) => {
    setUnitModelData((prevUsers: any) =>
      prevUsers?.map((main: any) => {
        if (main?.id === parentId) {
          return {
            ...main,
            units: main.units.map((child: any) =>
              child?.id === id ? { ...child, ...updatedData } : child
            ),
          };
        } else return main;
      })
    );
  };

  return (
    <div className="flex flex-col">
      <div className="p-6">
        <CustomTittle heading="Unit details" />
        {unitModelData?.length > 0 &&
          unitModelData?.map((item, index) => (
            <div key={item.id}>
              <div className="leading-7 rounded-lg font-semibold text-lg	 flex items-center mt-3 justify-center text-center text-gray-900 bg-gray-50 p-2">
                {item?.unit_info?.name}
              </div>
              <div className="border border-gray-960 border-solid rounded-xl mt-5">
                <Table
                  withColumnBorders
                  classNames={{
                    thead: '!bg-gray-50',
                    table: 'rounded-xl',
                    th: 'text-xs font-medium leading-11 text-gray-600 ps-4 pe-2 py-3 font-medium	',
                    td: 'p-0',
                  }}
                >
                  <Table.Thead>
                    <Table.Tr className="rounded-t-xl">
                      <Table.Th className="rounded-tl-xl ">Unit name</Table.Th>
                      <Table.Th>Unit address</Table.Th>
                      <Table.Th>Market rent</Table.Th>
                      <Table.Th className="rounded-tr-xl">Amenities</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {(item?.units?.length as any) > 0 &&
                      item?.units?.map((element, index) => (
                        <Table.Tr>
                          <Table.Td className="w-44">
                            <div className="text-sm font-normal leading-5	text-gray-900">
                              <CustomInput
                                onMouseDown={() => {
                                  setEdit(true);
                                }}
                                type="text"
                                classNames={{
                                  input: clsx('!border-none !shadow-none h-10	'),
                                }}
                                value={element.unit_name}
                                onChange={(e) => {
                                  udateTableData(item.id, element.id, {
                                    unit_name: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </Table.Td>
                          <Table.Td className="w-96">
                            <div className="text-sm font-normal leading-5 text-gray-900">
                              <CustomInput
                                type="text"
                                className="w-full"
                                classNames={{
                                  input: clsx('!border-none !shadow-none '),
                                }}
                                value={element.address}
                                onChange={(e) => {
                                  udateTableData(item.id, element.id, {
                                    address: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </Table.Td>
                          <Table.Td className="w-44">
                            <div className="text-sm font-normal leading-5 text-gray-900">
                              <CustomInput
                                type="text"
                                className="w-full"
                                classNames={{
                                  input: clsx('!border-none !shadow-none '),
                                }}
                                value={element.market_rent}
                                onChange={(e) => {
                                  udateTableData(item.id, element.id, {
                                    market_rent: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </Table.Td>
                          <Table.Td className="w-72 flex items-center content-center gap-2 flex-0 flex-wrap">
                            <TagsInput
                              onChange={(value: string[]) => {
                                udateTableData(item.id, element.id, { amenities: value });
                              }}
                              rightSection={
                                errors.amenities ? (
                                  <AlertCircleIcon className="size-4 text-error-500" />
                                ) : (
                                  ''
                                )
                              }
                              classNames={{
                                input: clsx('!border-none !shadow-none '),
                              }}
                              className="custom-tag"
                              defaultValue={element.amenities}
                            />
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
                <div className="!bg-gray-50 p-5 border-t border-gray-960 border-solid"></div>
              </div>
            </div>
          ))}
      </div>
      <StepButtons step={step} handlers={handlers} onContinue={onSubmit} onExit={handleExit} />
    </div>
  );
}
