import { createRequest } from '@api/Base.api';
import { ArrowNarrowDownIcon, SearchLgIcon } from '@assets/iconComponents';
import { mockedTableData } from '@components/mocks';
import { Status } from '@components/StatusDouble';
import { API } from '@constants/api.constant';
import { Button, Input, Table, Loader } from '@mantine/core';
import { CustomPagination } from '@utils/CustomPagination';
import { useEffect, useState } from 'react';
const applicationMock = {
  id: '',
  applicant_name: '',
  unit_id: '',
  status: [''],
  unit_address: '',
  unit_rent: '',
  unit_name: '',
};
export function PropertyApplicationTab() {
  const [selectTab, setSelectTab] = useState('Any');
  const [isLoader, setIsLoader] = useState(true);
  const [applications, setApplications] = useState<(typeof applicationMock)[]>([]);
  const [limiter, setLimiter] = useState(10);
  const [page, setPage] = useState(1);
  const tableData = mockedTableData;
  const handlePageChange = (page: number) => {
    console.log(`Current page: ${page}`);
  };

  useEffect(() => {
    getApplicationsByStatus(selectTab, limiter, page);
  }, [limiter, page]);

  const getApplicationsByStatus = (status: string, limiter: Number, page: Number) => {
    setIsLoader(true);
    setSelectTab(status);
    createRequest(
      `${API.APPLICATIONS.STATUS}/${status}/property/0fb0958d-457d-429b-a12f-de5fd2f14b7f?limit=${limiter}&page=${page}`,
      'GET'
    )
      .then((res) => {
        setApplications(res);
        setIsLoader(false);
      })
      .catch((err) => {
        setIsLoader(false);
        console.log(err, 'err');
      });
  };

  return (
    <div className="flex items-start flex-0 self-stretch">
      <div className="flex flex-col items-start gap-6 flex-0 self-stretch pt-10 px-8 pb-10">
        <div className="w-full">
          <Button.Group
            classNames={{
              group:
                'flex items-start h-11 flex-0 rounded-[8px] border-solid drop-shadow-xs w-full border-Gray-300 w-full',
            }}
          >
            <Button
              className="flex min-h-10 py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2"
              classNames={{
                label: 'text-gray-800 text-sm font-semibold leading-[18px]',
                section:
                  'flex py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-[#363F72] border-gray-300 bg-Gray-50 ',
                root: `rounded-s-[8px] ${selectTab === 'Any' ? ' bg-gray-50' : 'bg-white'}`,
              }}
              variant="default"
              rightSection={applications.length> 0 ? applications.length.toString() : "0"}
              onClick={() => {
                getApplicationsByStatus('Any', limiter, page);
              }}
            >
              All
            </Button>
            <Button
              className="flex py-2  min-h-10 h-full pl-3.4 pr-4 justify-center items-center gap-2"
              classNames={{
                label: 'text-Gray-700 text-sm font-semibold leading-[18px]',
                section:
                  'flex py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-success-700 border-success-200 bg-success-50',
                root: `!border-l-[0px] ${selectTab === 'Qualified' ? ' bg-gray-50 border-right-Gray-300' : 'bg-white'}`,
              }}
              variant="default"
              rightSection={
                applications.filter(
                  (app) => app.status.includes('Qualified') || app.status.includes('Approved')
                ).length ? (
                  applications.filter(
                    (app) => app.status.includes('Qualified') || app.status.includes('Approved')
                  ).length.toString()
                ) : (
                  '0'
                )
              }
              onClick={() => getApplicationsByStatus('Qualified', limiter, page)}
            >
              Qualified/Aprroved
            </Button>
            <Button
              className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2"
              classNames={{
                label: 'text-Gray-700 text-sm font-semibold leading-[18px]',
                section:
                  'flex py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Indigo-700 border-Indigo-200 bg-Indigo-50',
                root: `!border-l-[0px]  h-11 rounded-e-[8px]  ${selectTab === 'Accepted' ? ' bg-gray-50 border-right-Gray-300' : 'bg-white'}`,
              }}
              variant="default"
              rightSection={applications
                .filter((app) => app.status.includes('Accepted'))
                .length.toString()}
              onClick={() => getApplicationsByStatus('Accepted', limiter, page)}
            >
              Accepted
            </Button>

            <Button
              className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 "
              classNames={{
                label: 'text-Gray-700 text-sm font-semibold leading-[18px]',
                section:
                  'flex py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Error-700 border-Error-200 bg-Error-50',
                root: ` !border-l-[0px]  h-11 rounded-e-[8px] ${selectTab === 'Disqualified' ? ' bg-gray-50 border-right-Gray-300' : 'bg-white'}`,
              }}
              variant="default"
              rightSection={applications
                .filter((app) => app.status.includes('Disqualified'))
                .length.toString()}
              onClick={() => getApplicationsByStatus('Disqualified', limiter, page)}
            >
              Disqualified
            </Button>

            <Button
              className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2"
              classNames={{
                label: 'text-Gray-700 text-sm font-semibold leading-[18px]',
                section:
                  'flex py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-gray-700 border-[#EAECF0] bg-gray-50',
                root: `!border-l-[0px]  h-11 rounded-e-[8px]  ${selectTab === 'cancelled' ? ' bg-gray-50 border-right-Gray-300' : 'bg-white'}`,
              }}
              variant="default"
              rightSection={applications
                .filter((app) => app.status.includes('cancelled'))
                .length.toString()}
              onClick={() => getApplicationsByStatus('cancelled', limiter, page)}
            >
              Cancelled
            </Button>
          </Button.Group>
        </div>
        <div className="flex items-start gap-2.5 self-stretch">
          <Input
            className="w-[350px]"
            placeholder="Search unit, name, address."
            classNames={{
              input:
                ' placeholder:text-gray-500 px-7 overflow-hidden text-ellipsis h-auto focus:outline-none focus:shadow-none line-clamp-1 leading-7 text-gray-500 text-base border-0 shadow-none font-normal',
              section: 'left-3 h-5 w-5 top-sm-9',
              wrapper:
                'h-11 gap-2 px-3.5 py-2.5 flex items-center rounded-[8px] border-[1px] border-solid border-Gray-300 bg-white drop-shadow-xs',
            }}
            leftSection={<SearchLgIcon />}
          />
        </div>
        <div className="flex flex-col items-start self-stretch">
          <Table
            withTableBorder
            withRowBorders
            classNames={{
              table:
                'text-gray-600 !rounded-[12px] border-separate border-[1px] border-solid border-Gray-960 bg-white drop-shadow-xs relative',
              td: 'align-middle border-solid border-[#dee2e6] border-b-[1px]',
              th: 'align-middle p-0',
              tfoot: 'border-t[1px] border-solid border-[#dee2e6]',
              tbody: 'border-t-[1px] border-solid border-[#dee2e6]',
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="!rounded-ss-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
                  <div className="px-6 py-3 flex items-center h-11 gap-1 text-Gray-600 font-medium text-xs">
                    Unit
                    <ArrowNarrowDownIcon className="size-4" />
                  </div>
                </Table.Th>
                <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
                  <div className="flex px-3 items-center h-11 gap-1 text-Gray-600 font-medium text-xs">
                    Date
                    <ArrowNarrowDownIcon className="size-4" />
                  </div>
                </Table.Th>
                <Table.Th className="!bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]">
                  <div className="flex px-3 items-center h-11 gap-1 text-Gray-600 font-medium text-xs">
                    Status
                    <ArrowNarrowDownIcon className="size-4" />
                  </div>
                </Table.Th>
                <Table.Th className="!rounded-tr-[12px] !bg-Gray-blue-25 border-solid border-[#dee2e6] border-b-[1px]" />
              </Table.Tr>
            </Table.Thead>
            {isLoader ? (
              <div className="text-center w-full h-5">
                <span className="right-2/4 absolute mt-1">
                  <Loader size={20} color="#3E4784 " />
                </span>
              </div>
            ) : (
              <Table.Tbody>
                {applications && applications.length > 0 ? (
                  applications.map((element, index) => (
                    <Table.Tr className="bg-white" key={index}>
                      <Table.Td className="px-6 py-4">
                        <div className="flex flex-col self-stretch">
                          <div className="text-sm text-[#0C111D] font-regular leading-5">
                            {element?.unit_name}
                          </div>
                          <div className="text-sm text-Gray-600 font-medium leading-5">
                            {element?.unit_rent} - $200
                          </div>
                          <div className="text-xs text-Gray-600 font-regular leading-[18px]">
                            {element.unit_address}
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div className="text-sm text-Gray-600 font-regular leading-5">
                          {new Date().toLocaleDateString()}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div className="flex  items-center w-fit self-stretch">
                          <Status statusValues={element.status} tab="application" />
                        </div>
                      </Table.Td>
                      <Table.Td className="px-6 py-4">
                        <div className="flex items-end justify-center self-stretch flex-col">
                          {/* {element.leaseType.map((lease: string, index: number) => ( */}
                          <div
                            key={index}
                            className="text-sm font-semibold leading-5  text-Gray-600"
                          >
                            Test
                            {/* {lease} */}
                          </div>
                          {/* ))} */}
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr className="bg-white">
                    <Table.Td colSpan={4} className="text-center py-4">
                      No data available
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            )}
            <Table.Tfoot>
              <Table.Tr>
                <Table.Th colSpan={6}>
                  <CustomPagination total={page} onPageChange={handlePageChange} />
                </Table.Th>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </div>
      </div>
    </div>
  );
}
