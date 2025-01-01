import { Table, Checkbox } from '@mantine/core';
import { ChangeEvent, useState } from 'react';
import { Status } from '@components/Status';
import { QualityTenantStatus } from '@components/QualityTenantStatus';
import { BankIcon01, VisaCardIcon } from '@assets/iconComponents';
import SvgView from '@assets/iconComponents/View';
import SvgDownload from '@assets/iconComponents/Download';
import SvgPdfFileIcon from '@assets/iconComponents/PdfFileIcon';
import { formatNumberToCurrency } from '@utils/currency';

interface Props {
  selectedRows: any[];
  tableData: any[];
  setSelectedRows: (rows: string[]) => void;
  getUnitDetail?: (id: string) => void;
}

export function UnitsTableBody({ selectedRows, tableData, setSelectedRows, getUnitDetail }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [moveUnitModalOpen, setMoveUnitModalOpen] = useState<boolean>(false);

  const setActionHandler = (val: string | null): void => {
    if (val === 'deleteUnit') {
      setDeleteModalOpen(true);
    } else if (val === 'moveUnit') {
      setMoveUnitModalOpen(true);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  };

  return (
    <>
      <Table.Tbody>
        {tableData.map((element) => (
          <Table.Tr
            onClick={() => getUnitDetail?.(element?.id)}
            className="bg-white cursor-pointer"
            key={element?.id}
            bg={selectedRows.includes(element.id) ? 'var(--mantine-color-blue-light)' : undefined}
          >
            <Table.Td className="px-6 py-4  min-w-[250px]">
              <div className="flex flex-col self-stretch">
                <div
                  className="text-sm text-Gray-800 font-semibold leading-5"
                  style={{
                    color: 'rgba(24,34,48,1)',
                  }}
                >
                  {element.unit_info?.name ?? '--'}
                </div>
                <div className="text-xs text-Gray-700 font-regular leading-18">
                  {element.unit_info?.address_1}
                </div>
                <div className="text-xs text-Gray-700 font-medium leading-18">
                  {formatNumberToCurrency(element.market_rent, 0)}
                </div>
              </div>
            </Table.Td>
            <Table.Td>
              <div className="flex items-center w-fit self-stretch  min-w-[100px]">
                <Status statusValue={element.status ?? 'Pre-Qualified'} tab="" />
              </div>
            </Table.Td>
            <Table.Td>
              {element.tenant ? (
                <div className="flex px-6 py-4 gap-3  items-center self-stretch">
                  {element.tenant.avatar ? (
                    <img
                      src={element.tenant.avatar}
                      className="size-10 rounded-[9999px]"
                      alt={element.tenant.name ?? '--'}
                    />
                  ) : (
                    <div className="size-10 rounded-[9999px] bg-gray-300 flex items-center justify-center">
                      {getInitials(element.tenant.name ?? '--')}
                    </div>
                  )}
                  <div className="flex flex-col text-sm font-regular leading-5">
                    <span className="text-Gray-900">{element.tenant.name || 'N/A'}</span>
                    <span className="text-Gray-600">{element.tenant.email || 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <div className="flex  px-6 py-4 gap-3  items-center self-stretch">
                  <span className="size-10"></span>
                  <span className="text-Gray-900 text-sm font-regular leading-5">Vacent</span>
                </div>
              )}
            </Table.Td>
            <Table.Td className="px-6 py-4  min-w-[200px]">
              <div className="flex flex-col items-end justify-center self-stretch flex-col">
                {/* {element.leaseType.map((lease: string, index: number) => ( */}
                <div
                  // key={index}
                  // className={`text-sm font-semibold leading-5 ${lease === 'Gurantee lease' ? 'text-Success-700' : 'text-Gray-600'} `}
                  className="text-sm font-semibold leading-5 text-Gray-600"
                  style={{
                    color: ' rgba(54,63,114,1)',
                  }}
                >
                  New Application
                </div>
                {/* ))} */}
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>

      {/* <MoveUnitModal
        moveUnitModalOpen={moveUnitModalOpen}
        setMoveUnitModalOpen={setMoveUnitModalOpen}
      /> */}
    </>
  );
}

export function QualityTenantTableBody({ selectedRows, tableData, setSelectedRows }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [moveUnitModalOpen, setMoveUnitModalOpen] = useState<boolean>(false);

  const setActionHandler = (val: string | null): void => {
    if (val === 'deleteUnit') {
      setDeleteModalOpen(true);
    } else if (val === 'moveUnit') {
      setMoveUnitModalOpen(true);
    }
  };
  const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  };
  return (
    <>
      <Table.Tbody>
        {tableData?.map((element, index) => (
          <Table.Tr
            className="bg-white"
            key={index}
            bg={selectedRows.includes(element.unit) ? 'var(--mantine-color-blue-light)' : undefined}
          >
            <Table.Td className="px-6 py-4">
              <div className="flex flex-col self-stretch">
                <div className="text-sm text-Gray-800 font-semibold leading-5">{element.unit}</div>
                <div className="text-xs text-Gray-700 font-regular leading-18">
                  {element.address}
                </div>
                <div className="text-xs text-Gray-700 font-medium leading-18">
                  {element.monthlyRent}
                </div>
              </div>
            </Table.Td>
            <Table.Td>
              <div className="flex items-center w-fit self-stretch">{element.monthlyRent} </div>
            </Table.Td>

            <Table.Td>
              <div className="flex  items-center  self-stretch w-[210px]">
                <QualityTenantStatus
                  text={element.statusMessage.name}
                  action={element.statusMessage.action}
                  statusValue={element.status}
                  tab=""
                />
              </div>
            </Table.Td>
            <Table.Td align="right">
              <div className="flex flex-col gap-1 w-[150px] items-center ">
                <Status statusValue={element.status} tab="" />
                <QualityTenantStatus
                  text={element.searchMessage.name}
                  action={element.searchMessage.action}
                  statusValue={element.status}
                  tab=""
                />
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>

      {/* <MoveUnitModal
        moveUnitModalOpen={moveUnitModalOpen}
        setMoveUnitModalOpen={setMoveUnitModalOpen}
      /> */}
    </>
  );
}

export function QualityPaymentTableBody({ selectedRows, tableData, setSelectedRows }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [moveUnitModalOpen, setMoveUnitModalOpen] = useState<boolean>(false);

  const setActionHandler = (val: string | null): void => {
    if (val === 'deleteUnit') {
      setDeleteModalOpen(true);
    } else if (val === 'moveUnit') {
      setMoveUnitModalOpen(true);
    }
  };
  const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  };
  return (
    <>
      <Table.Tbody>
        {tableData.map((element, index) => (
          <Table.Tr
            className="bg-white"
            key={index}
            bg={
              selectedRows.includes(element.invoiceNo)
                ? 'var(--mantine-color-blue-light)'
                : undefined
            }
          >
            <Table.Td className="px-3 py-4">
              <div className="flex flex-row items-center gap-2 self-stretch">
                <Checkbox />
                <SvgPdfFileIcon width={32} height={40} />
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-Gray-600 font-normal leading-18">
                    {element.invoiceTitle}
                  </div>
                  <div className="text-sm text-Gray-700 font-medium leading-18">
                    {element.invoiceNo}
                  </div>
                </div>
              </div>
            </Table.Td>
            <Table.Td>
              <div className="flex items-center gap-2 w-fit self-stretch">
                {element.paymentMethod.NotAvailable ? (
                  <div className="text-sm text-Gray-600 font-normal leading-18">NA</div>
                ) : element.paymentMethod.bank ? (
                  <BankIcon01 height="32" />
                ) : (
                  <VisaCardIcon />
                )}
                {!element.paymentMethod.NotAvailable && (
                  <div className="text-sm text-Gray-600 font-normal leading-5">**1234</div>
                )}
              </div>
            </Table.Td>

            <Table.Td className="">
              <div className="flex  items-center  self-stretch ">
                {element.paymentMethod.NotAvailable ? (
                  <QualityTenantStatus
                    text={element.statusMessage.name}
                    action={element.statusMessage.action}
                    statusValue={element.status}
                    tab=""
                  />
                ) : (
                  <Status statusValue={element.status} tab="" />
                )}
              </div>
            </Table.Td>
            <Table.Td align="right">
              <div className="flex flex-row gap-2  items-center">
                <SvgView className="cursor-pointer" />
                <SvgDownload className="cursor-pointer" />
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>

      {/* <MoveUnitModal
        moveUnitModalOpen={moveUnitModalOpen}
        setMoveUnitModalOpen={setMoveUnitModalOpen}
      /> */}
    </>
  );
}

export function QualifiedTableBody({ selectedRows, tableData, setSelectedRows }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [moveUnitModalOpen, setMoveUnitModalOpen] = useState<boolean>(false);

  const setActionHandler = (val: string | null): void => {
    if (val === 'deleteUnit') {
      setDeleteModalOpen(true);
    } else if (val === 'moveUnit') {
      setMoveUnitModalOpen(true);
    }
  };
  const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  };
  const handleSelectedRow = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    const isChecked = event.target.checked;
    const row = tableData.find((item) => item.id === id);

    if (row) {
      if (isChecked) {
        setSelectedRows([...selectedRows, row]);
      } else {
        setSelectedRows(selectedRows.filter((item) => item.id !== id));
      }
    }
  };

  return (
    <>
      <Table.Tbody>
        {tableData.map((element, index) => (
          <Table.Tr
            className="bg-white"
            key={element.id}
            // bg={
            //   selectedRows.includes(element.unit.title)
            //     ? 'var(--mantine-color-blue-light)'
            //     : undefined
            // }
          >
            <Table.Td className="px-3 py-4">
              <div className="flex flex-row items-center gap-2 self-stretch">
                <Checkbox
                  color="#3E4784"
                  checked={selectedRows.some((row) => row?.['id'] === element.id)}
                  onChange={(event) => handleSelectedRow(event, element.id)}
                />
                <div className="flex flex-col gap-0.2">
                  <div className="text-sm text-Gray-600 font-medium leading-18">
                    {element.unit.title}
                  </div>
                  <div className="text-sm text-Gray-700 font-semibold leading-18">
                    {element.unit.unitNumber}
                  </div>
                  <div className="text-xs text-Gray-600 font-normal leading-18">
                    {element.unit.apartment}
                  </div>
                  <div className="text-xs text-Gray-600 font-normal leading-18">
                    {element.unit.address}
                  </div>
                </div>
              </div>
            </Table.Td>
            <Table.Td>
              <div className="flex flex-row gap-2 text-Gray-600  font-medium text-sm items-center">
                {element.monthlyRent}
              </div>
            </Table.Td>
            <Table.Td className="">
              <div className="flex  items-center  self-stretch ">
                <Status statusValue={element.status} tab="" />
              </div>
            </Table.Td>
            <Table.Td align="right">
              <div className="text-sm text-Gray-600 font-semibold leading-18 pr-2">
                {element.enroll}
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>

      {/* <MoveUnitModal
        moveUnitModalOpen={moveUnitModalOpen}
        setMoveUnitModalOpen={setMoveUnitModalOpen}
      /> */}
    </>
  );
}

export function QualifiedApplicationTableBody({ selectedRows, tableData, setSelectedRows }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [moveUnitModalOpen, setMoveUnitModalOpen] = useState<boolean>(false);

  const setActionHandler = (val: string | null): void => {
    if (val === 'deleteUnit') {
      setDeleteModalOpen(true);
    } else if (val === 'moveUnit') {
      setMoveUnitModalOpen(true);
    }
  };
  const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  };
  return (
    <>
      <Table.Tbody>
        {tableData.map((element, index) => (
          <Table.Tr
            className="bg-white"
            key={index}
            bg={
              selectedRows.includes(element.unit.title)
                ? 'var(--mantine-color-blue-light)'
                : undefined
            }
          >
            <Table.Td className="px-3 py-4">
              <div className="flex flex-row items-center gap-0.2 self-stretch">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-Gray-600 font-medium leading-18">
                    {element.unit.title}
                  </div>
                  <div className="text-sm text-Gray-700 font-semibold leading-18">
                    {element.unit.unitPrice.from} - {element.unit.unitPrice.to}
                  </div>
                  <div className="text-xs text-Gray-600 font-normal leading-18">
                    {element.unit.apartment}
                  </div>
                  <div className="text-xs text-Gray-600 font-normal leading-18">
                    {element.unit.address}
                  </div>
                </div>
              </div>
            </Table.Td>
            <Table.Td>
              <div className="flex flex-row gap-2 text-Gray-600  font-normal text-sm items-center">
                {element.date}
              </div>
            </Table.Td>
            <Table.Td className="">
              <div className="flex  items-center gap-2  self-stretch ">
                {element.status.map((item: string, index: number) => (
                  <Status statusValue={item} tab="" key={index} />
                ))}
              </div>
            </Table.Td>
            <Table.Td align="right">
              <div className="flex flex-col gap-1">
                {element.action.map((item: string[]) => (
                  <div className="text-sm text-Gray-600 font-semibold leading-18 pr-2">{item}</div>
                ))}
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>

      {/* <MoveUnitModal
        moveUnitModalOpen={moveUnitModalOpen}
        setMoveUnitModalOpen={setMoveUnitModalOpen}
      /> */}
    </>
  );
}
