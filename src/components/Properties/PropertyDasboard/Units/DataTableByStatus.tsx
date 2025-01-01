import { useEffect, useState } from 'react';
import { Button, Input, Table, Loader } from '@mantine/core';
import SvgPlus from '@assets/iconComponents/Plus';
import SvgEdit01 from '@assets/iconComponents/Edit01';
import { CustomPagination } from './Pagination';
import { SearchLgIcon } from '@assets/iconComponents';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleModelUnits, getSingleUnits, getUnitMixDetails } from '@stores/propertySlice';
import { UnitModelDataInterface, SingleUnitInterface } from '@interfaces/property.interface';
import { UnitsTableHead } from './UnitsTableHead';
import { UnitsTableBody } from './UnitsTableBody';
import AddUnit from './AddUnit';
import { UnknownAction } from '@reduxjs/toolkit';
export function DataTableByStatus() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [prevousIds, setPrevousIds] = useState<any[]>([]);
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [unitsTableData, setUnitsTableData] = useState<UnitModelDataInterface[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const singleUnitDetails = useSelector(getSingleModelUnits) as unknown as SingleUnitInterface;

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  console.log(currentPage, 'page');
  const handlePageChange = (name: string, page: number) => {
    let lastId = unitsTableData[unitsTableData.length - 1].id;
    let firstId = unitsTableData[0].id;
    if (name === 'Next') {
      setPrevousIds(prevousIds.includes(firstId) ? prevousIds : [...prevousIds, firstId]);
      filterUnits('page', lastId);
    } else if (name === 'Previous') {
      let prevId = prevousIds[page - 1];
      console.log('checkId', prevId);
      filterUnits('page', prevId);
    }
  };
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      filterUnits('search');
    }
  };
  console.log(prevousIds, 'prevousIds');

  const editBulkProperty = async () => {
    navigate(`${APP_PATHS.properties.get()}/${id}/bulk-edit`);
  };
  const filterUnits = async (page: string, lastId?: string) => {
    setIsLoader(true);
    let data = {
      id: id,
      lastId: page === 'page' ? lastId : '' ,
      searchQuery: page === 'search' ? searchQuery : '',
      limit: 10,
    };
    console.log("datadatadata", data);
    
    const result = await dispatch(
      getSingleUnits(data as unknown as string) as unknown as UnknownAction
    );
    if (result) {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    if (singleUnitDetails.unitResponse) {
      setUnitsTableData(singleUnitDetails.unitResponse);
    }
  }, [singleUnitDetails]);
  const getUnitDetail = (unitId: string) => {
    navigate(`${APP_PATHS.properties.get()}/${id}/units/${unitId}`);
  };

  return (
    <>
      <div className="h-px bg-Gray-200 self-stretch"></div>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <div className="flex items-start self-stretch gap-4">
          <div className="flex flex-col justify-center items-start self-stretch flex-0 gap-1 w-full">
            <span className="text-Gray-900 self-stretch text-3xl font-semibold leading-38">
              {singleUnitDetails?.unitResponse?.length ?? 0} units
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              classNames={{
                section: 'w-5 h-5 m-0',
                root: 'flex gap-1.5 px-4 py-2.5 justify-center rounded-[8px] drop-shadow-xs text-base h-11',
                inner: 'flex gap-1.5 justify-center drop-shadow-xs text-base',
              }}
              className="bg-white border-[1px] border-Gray-300 border-solid text-Gray-700 drop-shadow-xs  text-base font-semibold"
              leftSection={<SvgEdit01 />}
              variant="default"
              // onClick={() => editBulkProperty()}
            >
              Bulk edit
            </Button>
            <Button
              classNames={{
                section: 'w-5 h-5 m-0',
                root: 'flex gap-1.5 px-4 py-2.5 justify-center rounded-[8px] drop-shadow-xs text-base h-11',
                inner: 'flex gap-1.5 justify-center drop-shadow-xs text-base',
              }}
              className="bg-white border-[1px] border-Gray-300 border-solid text-Gray-700 drop-shadow-xs  text-base font-semibold"
              leftSection={<SvgPlus />}
              variant="default"
              onClick={() => setAddUnitOpen(true)}
            >
              Add unit
            </Button>
          </div>
        </div>
      </div>
    
        
          <div className="flex items-start gap-8 self-stretch">
            <div className="flex flex-col items-start gap-1.5">
              <Input
                placeholder="Search name, rent, address."
                classNames={{
                  input:
                    ' placeholder:text-gray-500 px-7 overflow-hidden text-ellipsis h-auto focus:outline-none focus:shadow-none line-clamp-1 leading-7 text-gray-500 text-base border-0 shadow-none font-normal',
                  section: 'left-3 h-5 w-5 top-sm-9',
                  wrapper:
                    'h-11 w-3.2 gap-2 px-3.5 py-2.5 flex items-center rounded-[8px] border-[1px] border-solid border-Gray-300 bg-white drop-shadow-xs',
                }}
                leftSection={<SearchLgIcon />}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
            <Button.Group
              classNames={{
                group:
                  'flex items-start h-11 flex-0 rounded-[8px] border-solid drop-shadow-xs w-full border-Gray-300 w-full',
              }}
            >
              <Button
                className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0"
                classNames={{
                  label: 'text-Gray-800 text-sm font-semibold leading-5',
                  section:
                    'flex py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Gray-700 border-Gray-200 bg-Gray-50',
                  root: 'h-11 rounded-s-[8px] bg-white',
                }}
                variant="default"
                rightSection="294"
                styles={() => ({
                  label: {
                    color: 'rgba(24,34,48,1)', // Change the color specifically for the "View all" text
                  },
                })}
              >
                View all
              </Button>
              <Button
                className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0"
                classNames={{
                  label: 'text-Gray-700 text-sm font-semibold leading-5',
                  section:
                    'flex py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Brand-700 border-Brand-200 bg-Brand-50',
                  root: 'h-11 bg-white',
                }}
                variant="default"
                rightSection="134"
              >
                Occupied
              </Button>
              <Button
                className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0"
                classNames={{
                  label: 'text-Gray-700 text-sm font-semibold leading-5',
                  section:
                    'flex py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Error-700 border-Error-200 bg-Error-50',
                  root: 'h-11 rounded-e-[8px] hover:bg-transparent bg-white',
                }}
                variant="default"
                rightSection="134"
              >
                Vacant
              </Button>
            </Button.Group>
          </div>
          <Button.Group
            classNames={{
              group:
                'flex items-star max-h-11 flex-0 rounded-8px border-solid drop-shadow-xs w-full border-Gray-300',
            }}
          >
            <Button
              classNames={{
                label: 'text-Gray-800 text-sm font-semibold leading-5',
                section:
                  'flex ml-0 py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Gray-700 border-Gray-200 bg-Gray-50',
                root: 'h-11 rounded-s-[8px] bg-white',
                inner: 'flex py-2 pl-3.4 pr-4 justify-center items-center gap-2 flex-0',
              }}
              className="flex h-full pr-4 justify-center items-center gap-2 flex-0"
              variant="default"
              rightSection="294"
              styles={() => ({
                label: {
                  color: 'rgba(24,34,48,1)', // Change the color specifically for the "View all" text
                },
              })}
            >
              View all
            </Button>
            <Button
              className="flex h-full justify-center items-center gap-2 flex-0"
              classNames={{
                label: 'text-Gray-700 text-sm font-semibold leading-5',
                section:
                  'flex ml-0 py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Indigo-700 border-Indigo-200 bg-Indigo-50',
                root: 'h-11 bg-white',
                inner: 'flex py-2 pl-3.4 pr-4 justify-center items-center gap-2 flex-0',
              }}
              variant="default"
              rightSection="134"
            >
              QTG eligible
            </Button>
            <Button
              className="flex h-full justify-center items-center gap-2 flex-0"
              classNames={{
                label: 'text-Gray-700 text-sm font-semibold leading-5',
                section:
                  'flex ml-0 py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Success-700 border-Success-200 bg-Success-50',
                root: 'h-11 bg-white',
                inner: 'flex py-2 pl-3.4 pr-4 justify-center items-center gap-2 flex-0',
              }}
              variant="default"
              rightSection="134"
              styles={() => ({
                section: {
                  borderColor: 'rgba(171,239,243,1)', // Set the border color directly
                },
              })}
            >
              QTG guaranteed
            </Button>
            <Button
              className="flex h-full justify-center items-center gap-2 flex-0"
              classNames={{
                label: 'text-Gray-700 text-sm font-semibold leading-5',
                section:
                  'flex ml-0 py-0.5 px-1.5 items-center rounded-[6px] border-[1px] border-solid text-Brand-700 border-Brand-200 bg-Brand-50',
                root: 'h-11 rounded-e-[8px] hover:bg-transparent bg-white',
                inner: 'flex py-2 pl-3.4 pr-4 justify-center items-center gap-2 flex-0',
              }}
              variant="default"
              rightSection="134"
            >
              QTG pending
            </Button>
          </Button.Group>

          {isLoader ? (
            <div className="text-center w-full h-full my-10">
              <span className="right-2/4 absolute mt-1">
                <Loader size={30} color="#3E4784 " />
              </span>
            </div>
          ) : (
            unitsTableData.length > 0 && (    <div className="container mx-auto">
              <Table
                withTableBorder
                withRowBorders
                classNames={{
                  table:
                    'text-gray-600 !rounded-[12px] border-separate border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs',
                  td: 'align-middle border-solid border-[#dee2e6] border-b-[1px]',
                  th: 'align-middle p-0',
                  tfoot: 'border-t-[1px] border-solid border-[#dee2e6]',
                  tbody: 'border-t-[1px] border-solid border-[#dee2e6]',
                }}
              >
                <UnitsTableHead />
                <UnitsTableBody
                  selectedRows={selectedRows}
                  tableData={unitsTableData}
                  setSelectedRows={setSelectedRows}
                  getUnitDetail={getUnitDetail}
                />
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Th colSpan={6}>
                      <CustomPagination
                        total={Math.ceil(Number(singleUnitDetails.no_of_units) / rowsPerPage)}
                        page={currentPage}
                        setCurrentPage={setCurrentPage}
                        onPageChange={handlePageChange}
                      />
                    </Table.Th>
                  </Table.Tr>
                </Table.Tfoot>
              </Table>
            </div>
          )
        )}
   

      {addUnitOpen && (
        <AddUnit addUnitOpen={addUnitOpen} setAddUnitOpen={setAddUnitOpen} property_id={id!} />
      )}
    </>
  );
}
