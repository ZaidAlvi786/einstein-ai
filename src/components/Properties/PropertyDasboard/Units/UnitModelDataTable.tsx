import { ArrowNarrowDownIcon } from '@assets/iconComponents';
import { Unit } from '@interfaces/property.interface';
import { Checkbox, Table, TextInput } from '@mantine/core';
import { formatNumberToCurrency } from '@utils/currency';
import { useState, useEffect } from 'react';

export function UnitModelDataTable({
  onRowSelect,
  showEditTable,
  selectedRows,
  onUpdateData,
  unitTableData, // Accept unitTableData as a prop
}: {
  onRowSelect: (rows: any[]) => void;
  showEditTable: boolean;
  selectedRows: any[];
  onUpdateData: (data: any[]) => void;
  unitTableData: Unit[] | []; // Prop type for unitTableData
}) {
  // Local state to manage table data
  const [localTableData, setLocalTableData] = useState<any[]>([]);

  const handleInputChange = (id: number, key: string, value: string) => {
    setLocalTableData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [key]: value, edited: true } : row))
    );
  };

  // Update localTableData when unitTableData prop changes
  useEffect(() => {
    // Only call onUpdateData when localTableData actually changes
    if (JSON.stringify(localTableData) !== JSON.stringify(unitTableData)) {
      onUpdateData(localTableData);
    }
  }, [localTableData]);

  useEffect(() => {
    setLocalTableData(unitTableData);
  }, [unitTableData]);

  return (
    <Table
      withTableBorder
      withRowBorders
      classNames={{
        table:
          'text-gray-600 flex-0 border-[1px] !h-fit border-solid border-Gray-200 drop-shadow-xs bg-white h-md-54',
        td: 'align-middle',
        th: 'align-middle',
      }}
    >
      <Table.Thead className="bg-gray-50">
        <Table.Tr className="bg-Gray-50 border-Gray-200">
          <Table.Th className="py-3 px-6 flex items-center gap-3 self-stretch h-full min-h-11">
            {showEditTable ? (
              <div className="flex items-center gap-1">
                <span className="text-Gray-600 text-xs font-medium leading-18">Name</span>
                <ArrowNarrowDownIcon className="size-4" />
              </div>
            ) : (
              <>
                <Checkbox
                  checked={selectedRows.length === unitTableData.length}
                  onChange={(event) =>
                    onRowSelect(event.currentTarget.checked ? unitTableData : [])
                  }
                  indeterminate={
                    !!selectedRows.length && selectedRows.length !== unitTableData.length
                  }
                  color="#3e4784"
                />
                <div className="flex items-center gap-1">
                  <span className="text-Gray-600 text-xs font-medium leading-18">Name</span>
                  <ArrowNarrowDownIcon className="size-4" />
                </div>
              </>
            )}
          </Table.Th>
          <Table.Th className="max-h-11 py-3 px-6 text-Gray-600 text-xs font-medium leading-18">
            Address
          </Table.Th>
          <Table.Th className="max-h-11 py-3 px-6 text-Gray-600 text-xs font-medium leading-18">
            Market rent
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {localTableData.map((element) => (
          <Table.Tr
            className="border-Gray-200"
            key={element.id}
            bg={
              selectedRows.some((row) => row.id === element.id) && !showEditTable
                ? 'var(--mantine-color-blue-light)'
                : undefined
            }
          >
            <Table.Td className="py-3 px-6  h-sm-72">
              <div className="flex items-center gap-3 self-stretch">
                {showEditTable ? (
                  <TextInput
                    placeholder="Enter name"
                    value={element.unit_name}
                    onChange={(e) =>
                      handleInputChange(element.id, 'unit_name', e.currentTarget.value)
                    }
                    classNames={{
                      input: '!text-Gray-900 border-0 shadow-none !text-sm rounded-none !leading-5',
                    }}
                  />
                ) : (
                  <>
                    <Checkbox
                      aria-label="Select row"
                      checked={selectedRows.some((selected) => selected.id === element.id)}
                      onChange={(event) =>
                        onRowSelect(
                          event.currentTarget.checked
                            ? [...selectedRows, element]
                            : selectedRows.filter((row) => row.id !== element.id)
                        )
                      }
                      color="#3e4784"
                    />
                    <div className="text-Gray-900 text-sm leading-5 font-medium">
                      {element.unit_name}
                    </div>
                  </>
                )}
              </div>
            </Table.Td>
            <Table.Td className="h-sm-72 py-3 px-6 text-Gray-600 font-normal text-sm leading-5">
              {showEditTable ? (
                <TextInput
                  placeholder="Enter address"
                  value={element.address}
                  onChange={(e) => handleInputChange(element.id, 'address', e.currentTarget.value)}
                  classNames={{
                    input: 'border-0 shadow-none !text-sm rounded-none !leading-5',
                  }}
                />
              ) : (
                element.address
              )}
            </Table.Td>
            <Table.Td className="h-sm-72 py-3 px-6 text-Gray-600 font-normal text-sm leading-5">
              {showEditTable ? (
                <TextInput
                  placeholder="Enter market rent"
                  value={element.market_rent}
                  onChange={(e) =>
                    handleInputChange(element.id, 'market_rent', e.currentTarget.value)
                  }
                  classNames={{
                    input: 'border-0 shadow-none !text-sm rounded-none !leading-5',
                  }}
                />
              ) : (
                formatNumberToCurrency(element.market_rent, 0)
              )}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
