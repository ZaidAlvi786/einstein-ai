import { Checkbox, Input, Table, TextInput } from '@mantine/core';
import { ArrowNarrowDownIcon, SearchLgIcon } from '@assets/iconComponents';
import SearchSm from '@assets/iconComponents/SearchSm';
import { ChangeEvent, useEffect, useRef } from 'react';

interface Props {
  selectedRows: any[];
  tableData: any[];
  setSelectedRows: (rows: any[]) => void;
}

export function UnitsTableHead() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th className="!rounded-ss-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="px-3 py-3 flex items-center h-11 gap-1 text-Gray-600 font-medium text-xs">
            Unit
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center h-11 gap-1 text-Gray-600 font-medium text-xs">
            QT Guarantee
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]" />
        <Table.Th className="!rounded-tr-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]" />
      </Table.Tr>
    </Table.Thead>
  );
}

export function QualityTenantTableHead({ selectedRows, tableData, setSelectedRows }: Props) {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th className="!rounded-ss-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="px-3 py-3 flex items-center h-11 gap-1 text-Gray-600 font-medium text-xs">
            Name/Unit
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center  h-11 gap-1 text-Gray-600 font-medium text-xs">
            Guaranteed monthly rent
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center px-8  h-11 gap-1 text-Gray-600 font-medium text-xs">
            Status
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center justify-end px-12  h-11 gap-1 text-Gray-600 font-medium text-xs">
            <TextInput
              leftSection={<SearchLgIcon />}
              placeholder="Search"
              classNames={{
                input: 'h-3',
              }}
            />
          </div>
        </Table.Th>
        {/* <Table.Th className="!rounded-tr-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]" /> */}
      </Table.Tr>
    </Table.Thead>
  );
}
export function QualityPaymentTableHead({ selectedRows, tableData, setSelectedRows }: Props) {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th className="!rounded-ss-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="px-3 py-3 flex items-center  h-11 gap-2 text-Gray-600 font-medium text-xs">
            <Checkbox />
            Invoice
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center px-2  h-11 gap-1 text-Gray-600 font-medium text-xs">
            Payment method
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center px-2  h-11 gap-1 text-Gray-600 font-medium text-xs">
            Status
          </div>
        </Table.Th>
        <Table.Th className="!rounded-tr-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]" />
      </Table.Tr>
    </Table.Thead>
  );
}

export function QualifiedTableHead({ selectedRows, tableData, setSelectedRows }: Props) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Determine if all rows are selected
  const allRowsSelected = tableData.length > 0 && selectedRows.length === tableData.length;

  const isIndeterminate = () => {
    const checkedRows = tableData.filter((row) =>
      selectedRows.some((selectedRow) => selectedRow.id === row.id)
    );
    return checkedRows.length > 0 && checkedRows.length < tableData.length;
  };

  // Update checkbox indeterminate state
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate();
    }
  }, [selectedRows, tableData]);

  // Handle checkbox change
  const handleCheckedQualified = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedRows(tableData); // Select all rows
    } else {
      setSelectedRows([]); // Deselect all rows
    }
  };

  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th className="!rounded-ss-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="px-3 py-3 flex items-center  h-11 gap-2 text-Gray-600 font-medium text-xs">
            <Checkbox
              ref={checkboxRef}
              color="#3E4784"
              onChange={handleCheckedQualified}
              checked={allRowsSelected}
              indeterminate={isIndeterminate()}
            />
            Name/Unit
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center px-2  h-11 gap-1 text-Gray-600 font-medium text-xs">
            Monthly rent
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center px-2  h-11 gap-1 text-Gray-600 font-medium text-xs">
            Status
          </div>
        </Table.Th>
        <Table.Td
          align="right"
          className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]"
        >
          <Input
            placeholder="Search"
            leftSection={<SearchSm />}
            className="max-w-[140px] "
            classNames={{ input: 'h-3' }}
          />
        </Table.Td>
      </Table.Tr>
    </Table.Thead>
  );
}

export function QualifiedApplicationTableHead({ selectedRows, tableData, setSelectedRows }: Props) {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th className="!rounded-ss-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="px-3 py-3 flex items-center  h-11 gap-2 text-Gray-600 font-medium text-xs">
            Unit
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center px-2  h-11 gap-1 text-Gray-600 font-medium text-xs">
            Date
            <ArrowNarrowDownIcon className="size-4" />
          </div>
        </Table.Th>
        <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
          <div className="flex items-center px-2  h-11 gap-1 text-Gray-600 font-medium text-xs">
            Status
          </div>
        </Table.Th>
        <Table.Td
          align="right"
          className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]"
        />
      </Table.Tr>
    </Table.Thead>
  );
}
