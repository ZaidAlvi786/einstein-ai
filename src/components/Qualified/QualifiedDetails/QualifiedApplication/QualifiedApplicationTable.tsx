import { qualifiedApplicationTableData, qualifiedTableData } from '@components/mocks';
import {
  QualifiedApplicationTableBody,
  QualifiedTableBody,
  QualityPaymentTableBody,
} from '@components/Properties/PropertyDasboard/Units/UnitsTableBody';
import {
  QualifiedApplicationTableHead,
  QualifiedTableHead,
} from '@components/Properties/PropertyDasboard/Units/UnitsTableHead';
import { Table } from '@mantine/core';
import { CustomPagination } from '@utils/CustomPagination';
import React, { useState } from 'react';

const QualifiedApplicationTable = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const tableData = qualifiedApplicationTableData;
  const handlePageChange = (page: number) => {
    console.log(`Current page: ${page}`);
  };

  return (
    <div className="mt-4">
      <Table
        withTableBorder
        withRowBorders
        classNames={{
          table:
            'text-gray-600 !rounded-[12px] border-separate border-[1px] border-solid border-Gray-200 bg-white shadow-xs',
          td: 'align-middle border-solid border-[#dee2e6] border-b-[1px]',
          th: 'align-middle p-0',
          tfoot: 'border-t-[1px] border-solid border-[#dee2e6]',
          tbody: 'border-t-[1px] border-solid border-[#dee2e6]',
        }}
      >
        <QualifiedApplicationTableHead
          selectedRows={selectedRows}
          tableData={tableData}
          setSelectedRows={setSelectedRows}
        />
        <QualifiedApplicationTableBody
          selectedRows={selectedRows}
          tableData={tableData}
          setSelectedRows={setSelectedRows}
        />
        <Table.Tfoot>
          <Table.Tr>
            <Table.Th colSpan={6}>
              <CustomPagination total={10} onPageChange={handlePageChange} />
            </Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </div>
  );
};
export default QualifiedApplicationTable;
