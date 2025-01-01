import {
  ArrowNarrowDownIcon,
  ArrowNarrowUpIcon,
  DotsVerticalIcon,
  SearchSmIcon,
} from '@assets/iconComponents';
import { ActionIcon, Badge, Button, Input, Table } from '@mantine/core';
import { CustomPagination } from '@utils/CustomPagination';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';
import VerifyIncome from './VerifyIncome';
import VerifyId from './VerifyId';

interface Application {
  id: number;
  name: string;
  address: string;
  rent: string;
  unit: string;
  property: string;
  date: string;
  status: DisplayMode[];
}

const mockApplications: Application[] = [
  {
    id: 1,
    name: 'Emily Johnson',
    unit: '202',
    rent: '$1,500',
    property: 'Greenwood Apartments',
    address: '456 Oak St, San Francisco CA',
    date: '03/15/2024',
    status: ['new'],
  },
  {
    id: 2,
    name: 'Michael Brown',
    unit: '303',
    rent: '$1,800',
    property: 'Riverdale Condos',
    address: '789 Pine St, Seattle WA',
    date: '05/10/2024',
    status: ['screening'],
  },
  {
    id: 3,
    name: 'Sophia Williams',
    unit: '404',
    rent: '$2,000',
    property: 'Lakeside Residences',
    address: '101 Maple St, Austin TX',
    date: '06/22/2024',
    status: ['qualified'],
  },
  {
    id: 4,
    name: 'James Smith',
    unit: '505',
    rent: '$2,200',
    property: 'Sunnybrook Apartments',
    address: '202 Birch St, Denver CO',
    date: '07/30/2024',
    status: ['approved'],
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    unit: '606',
    rent: '$1,750',
    property: 'Mountain View Apartments',
    address: '303 Cedar St, Portland OR',
    date: '08/25/2024',
    status: ['accepted'],
  },
  {
    id: 6,
    name: 'Daniel Lee',
    unit: '707',
    rent: '$1,600',
    property: 'Downtown Lofts',
    address: '404 Elm St, Chicago IL',
    date: '09/05/2024',
    status: ['disqualified'],
  },
  {
    id: 7,
    name: 'Isabella Garcia',
    unit: '808',
    rent: '$2,500',
    property: 'Harborview Villas',
    address: '505 Walnut St, Miami FL',
    date: '10/15/2024',
    status: ['scheduled'],
  },
  {
    id: 8,
    name: 'Benjamin Clark',
    unit: '909',
    rent: '$1,900',
    property: 'Seaside Apartments',
    address: '606 Spruce St, Boston MA',
    date: '11/01/2024',
    status: ['screening'],
  },
  {
    id: 9,
    name: 'Ava Davis',
    unit: '1010',
    rent: '$1,650',
    property: 'City Heights',
    address: '707 Fir St, Philadelphia PA',
    date: '12/10/2024',
    status: ['qualified', 'accepted'],
  },
  {
    id: 10,
    name: 'Liam Wilson',
    unit: '1111',
    rent: '$2,100',
    property: 'Suburban Retreat',
    address: '808 Pine St, Dallas TX',
    date: '01/20/2025',
    status: ['approved', 'accepted'],
  },
];

const fetchApplications = (): Promise<Application[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockApplications);
    }, 1000);
  });
};

type DisplayMode =
  | 'all'
  | 'new'
  | 'qualified'
  | 'approved'
  | 'accepted'
  | 'screening'
  | 'disqualified'
  | 'scheduled';
type SortColumns = 'date' | 'unit';

const badgeClasses = (status: DisplayMode) => {
  switch (status) {
    case 'approved':
    case 'qualified':
      return 'bg-Success-50 border-success-200 text-Success-700';
    case 'accepted':
      return 'bg-Indigo-50 border-Indigo-200 text-Indigo-700';
    default:
      return 'bg-Brand-50 border-Brand-200 text-Brand-700';
  }
};

const buttonVariants = (mode: DisplayMode, currentMode: DisplayMode) =>
  mode === currentMode ? 'filled' : 'default';

export const ApplicationsList: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('all');
  const [sortColumn, setSortColumn] = useState<SortColumns>('unit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);

  useEffect(() => {
    const getApplications = async () => {
      setLoading(true);
      const data = await fetchApplications();
      setApplications(data);
      setLoading(false);
    };

    getApplications();
  }, []);

  const handleButtonClick = (mode: DisplayMode) => {
    setDisplayMode(mode);
  };

  const handleSort = (column: SortColumns) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedApplications = useMemo(() => {
    return [...applications]
      .filter((application) => displayMode === 'all' || application.status.includes(displayMode))
      .sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
  }, [applications, displayMode, sortColumn, sortDirection]);

  const countApplicationsByStatus = useMemo(() => {
    const statusCount: { [key in DisplayMode]?: number } = {};

    applications.forEach((application) => {
      const uniqueStatuses = new Set(application.status);
      uniqueStatuses.forEach((status) => {
        if (statusCount[status]) {
          statusCount[status]!++;
        } else {
          statusCount[status] = 1;
        }
      });
    });

    return statusCount;
  }, [applications]);

  const handlePageChange = (page: number) => {
    console.log(`Current page: ${page}`);
  };

  const navigate = useNavigate();
  const handleApplicationClick = (id: number) => () => {
    navigate(`/leases/application/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <VerifyIncome open={open} close={setOpen} />
      <VerifyId open={openVerify} close={setOpenVerify} />
      <Button.Group>
        {['all', 'new', 'qualified', 'approved', 'accepted'].map((mode) => (
          <Button
            key={mode}
            variant={buttonVariants(mode as DisplayMode, displayMode)}
            className={`flex-1 ${mode === displayMode ? 'bg-white text-gray-800 border border-solid border-Gray-300 hover:bg-gray-50 hover:text-gray-800' : 'bg-Gray-50'}`}
            onClick={() => handleButtonClick(mode as DisplayMode)}
            rightSection={
              <Badge
                classNames={{
                  root: `rounded-[6px] border border-solid py-0.5 px-1.5 flex items-center ${badgeClasses(mode as DisplayMode)}`,
                  label: 'text-center text-[12px] leading-18 font-medium capitalize',
                }}
                variant="outline"
              >
                {mode === 'all'
                  ? applications.length
                  : countApplicationsByStatus[mode as DisplayMode]}
              </Badge>
            }
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
        <ActionIcon variant="default" size={36}>
          <DotsVerticalIcon />
        </ActionIcon>
      </Button.Group>
      <div className="overflow-hidden rounded-lg shadow-md border border-solid border-Gray-200">
        <Table className="min-w-full" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Td onClick={() => handleSort('unit')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center">
                  <span>Unit</span>
                  {sortColumn === 'unit' &&
                    (sortDirection === 'asc' ? <ArrowNarrowUpIcon /> : <ArrowNarrowDownIcon />)}
                </div>
              </Table.Td>
              <Table.Td onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center">
                  <span>Date</span>
                  {sortColumn === 'date' &&
                    (sortDirection === 'asc' ? <ArrowNarrowUpIcon /> : <ArrowNarrowDownIcon />)}
                </div>
              </Table.Td>
              <Table.Td>Status</Table.Td>
              <Table.Td align="right">
                <Input
                  placeholder="Search"
                  leftSection={<SearchSmIcon />}
                  className="max-w-[120px]"
                />
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedApplications
              .filter(
                (application) => displayMode === 'all' || application.status.includes(displayMode)
              )
              .map(({ id, name, address, rent, unit, property, date, status }) => (
                <Table.Tr
                  className="bg-white cursor-pointer"
                  key={`${name}-${unit}`}
                  onClick={handleApplicationClick(id)}
                >
                  <Table.Td className="px-4 py-6 flex flex-col gap-0.5 align-middle">
                    <span className="font-medium text-[14px] leading-[20px] text-Gray-700">
                      {name}
                    </span>
                    <span className="font-semibold text-[14px] leading-[20px] text-Gray-700">
                      {`${unit} - ${rent}`}
                    </span>
                    <span className="font-normal text-[12px] leading-[18px] text-Gray-600">
                      {property}
                    </span>
                    <span className="font-normal text-[12px] leading-[18px] text-Gray-600">
                      {address}
                    </span>
                  </Table.Td>
                  <Table.Td className="align-middle font-normal leading-[20px] text-Gray-600">
                    {date}
                  </Table.Td>
                  <Table.Td className="align-middle">
                    <div className="flex gap-1">
                      {status.map((item) => (
                        <Badge
                          classNames={{
                            root: `rounded-[6px] border border-solid py-0.5 px-1.5 flex items-center ${badgeClasses(item as DisplayMode)}`,
                            label: 'text-center text-[12px] leading-18 font-medium capitalize',
                          }}
                          variant="outline"
                          key={item}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </Table.Td>
                  <Table.Td
                    className="align-middle flex flex-col gap-0.5 font-semibold text-[14px] leading-[20px] text-Gray-600 cursor-pointer"
                    align="right"
                  >
                    <span onClick={()=>{setOpenVerify(true)}}>Sign lease</span>
                    <span>Schedule move in</span>
                    <span onClick={()=>{setOpen(true)}}>Verify income</span>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          <Table.Tfoot>
            <Table.Tr>
              <Table.Th colSpan={6}>
                <CustomPagination total={10} onPageChange={handlePageChange} />
              </Table.Th>
            </Table.Tr>
          </Table.Tfoot>
        </Table>
      </div>
    </div>
  );
};
