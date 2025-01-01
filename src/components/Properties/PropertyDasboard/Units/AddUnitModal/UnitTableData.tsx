import { AlertCircleIcon } from '@assets/iconComponents';
import { unitDetailsSchema } from '@components/Properties/UnitDetailsStep/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { Unit } from '@interfaces/property.interface';
import { Table, TagsInput } from '@mantine/core';
import { getResponseUnits } from '@stores/propertySlice';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

interface Props {
  tableData: Unit[]; // or you can specify the structure of tableData, e.g., { id: number, name: string }[]
  setTableData: React.Dispatch<React.SetStateAction<Unit[]>>; // adapt the type according to your state structure
}

export function UnitTableData({ tableData, setTableData }: Props) {
  const responseUnits = useSelector(getResponseUnits);

  const methods = useForm({
    resolver: yupResolver<any>(unitDetailsSchema),
  });

  const {
    formState: { errors },
  } = methods;

  const udateTableData = (id: any, updatedData: any) => {
    const updated = tableData?.map((unit: any) =>
      unit?.id === id ? { ...unit, ...updatedData } : unit
    );
    setTableData(updated);
  };

  useEffect(() => {
    setTableData(responseUnits?.units!);
  }, [responseUnits]);

  return (
    <div className="flex flex-col items-start self-stretch  mt-5 px-6 gap-5">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <Table
          withTableBorder
          withRowBorders
          withColumnBorders
          classNames={{
            table:
              'text-gray-600  flex-0 border border-solid border-Gray-200 drop-shadow-xs bg-white h-md-54',
            td: 'align-middle',
            th: 'align-middle',
          }}
        >
          <Table.Thead className="bg-gray-50">
            <Table.Tr className="bg-Gray-50 border-Gray-200">
              <Table.Th className="max-h-11 py-3 px-6 text-Gray-600 text-xs font-medium leading-18">
                Unit name
              </Table.Th>
              <Table.Th className="max-h-11 py-3 px-6 text-Gray-600 text-xs font-medium leading-18">
                Unit address
              </Table.Th>
              <Table.Th className="max-h-11 py-3 px-6 text-Gray-600 text-xs font-medium leading-18">
                Market rent
              </Table.Th>
              <Table.Th className="max-h-11 py-3 px-6 text-Gray-600 text-xs font-medium leading-18">
                Ameneties
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tableData?.map((element) => (
              <Table.Tr>
                <Table.Td className="w-44">
                  <div className="text-sm font-normal leading-5 text-gray-900">
                    <CustomInput
                      type="text"
                      classNames={{
                        input: clsx('!border-none !shadow-none h-10'),
                      }}
                      value={element.unit_name}
                      onChange={(e) => {
                        udateTableData(element.id, {
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
                        udateTableData(element.id, {
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
                        udateTableData(element.id, {
                          market_rent: e.target.value,
                        });
                      }}
                    />
                  </div>
                </Table.Td>
                <Table.Td className="w-72 flex items-center content-center gap-2 flex-0 flex-wrap">
                  <TagsInput
                    onChange={(value: string[]) => {
                      udateTableData(element.id, { amenities: value });
                    }}
                    rightSection={
                      errors.amenities ? <AlertCircleIcon className="size-4 text-error-500" /> : ''
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
      </div>
    </div>
  );
}
