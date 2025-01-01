import {
  ArrowNarrowDownIcon,
  ArrowNarrowUpIcon,
} from '@assets/iconComponents';
import { Badge, Button, Table } from '@mantine/core';
import { CustomPagination } from '@utils/CustomPagination';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';

interface Lease {
  id: number;
  name: string;
  address: string;
  rent: string;
  unit: string;
  property: string;
  date: string;
  status: string;
  guaranteed: string;
}

const mockLeases: Lease[] = [
  {
    id: 1,
    name: 'Emily Johnson',
    unit: '202',
    rent: '$1,500',
    property: 'Greenwood Apartments',
    address: '456 Oak St, San Francisco CA',
    date: '03/15/2024',
    status: 'active',
    guaranteed: 'guaranteed',
  },
  {
    id: 2,
    name: 'Michael Brown',
    unit: '303',
    rent: '$1,800',
    property: 'Riverdale Condos',
    address: '789 Pine St, Seattle WA',
    date: '05/10/2024',
    status: 'active',
    guaranteed: 'disqualified',
  },
  {
    id: 3,
    name: 'Sophia Williams',
    unit: '404',
    rent: '$2,000',
    property: 'Lakeside Residences',
    address: '101 Maple St, Austin TX',
    date: '06/22/2024',
    status: 'to expire',
    guaranteed: 'guaranteed',
  },
  {
    id: 4,
    name: 'James Smith',
    unit: '505',
    rent: '$2,200',
    property: 'Sunnybrook Apartments',
    address: '202 Birch St, Denver CO',
    date: '07/30/2024',
    status: 'to expire',
    guaranteed: 'pre-Qualified',
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    unit: '606',
    rent: '$1,750',
    property: 'Mountain View Apartments',
    address: '303 Cedar St, Portland OR',
    date: '08/25/2024',
    status: 'active',
    guaranteed: 'qualified',
  },
  {
    id: 6,
    name: 'Daniel Lee',
    unit: '707',
    rent: '$1,600',
    property: 'Downtown Lofts',
    address: '404 Elm St, Chicago IL',
    date: '09/05/2024',
    status: 'scheduled',
    guaranteed: 'approved',
  },
  {
    id: 7,
    name: 'Isabella Garcia',
    unit: '808',
    rent: '$2,500',
    property: 'Harborview Villas',
    address: '505 Walnut St, Miami FL',
    date: '10/15/2024',
    status: 'expired',
    guaranteed: 'guaranteed',
  },
  {
    id: 8,
    name: 'Benjamin Clark',
    unit: '909',
    rent: '$1,900',
    property: 'Seaside Apartments',
    address: '606 Spruce St, Boston MA',
    date: '11/01/2024',
    status: 'non-active',
    guaranteed: 'guaranteed',
  },
  {
    id: 9,
    name: 'Ava Davis',
    unit: '1010',
    rent: '$1,650',
    property: 'City Heights',
    address: '707 Fir St, Philadelphia PA',
    date: '12/10/2024',
    status: 'cancelled',
    guaranteed: 'guaranteed',
  },
  {
    id: 10,
    name: 'Liam Wilson',
    unit: '1111',
    rent: '$2,100',
    property: 'Suburban Retreat',
    address: '808 Pine St, Dallas TX',
    date: '01/20/2025',
    status: 'active',
    guaranteed: 'guaranteed',
  },
];

const fetchApplications = (): Promise<Lease[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLeases);
    }, 1000);
  });
};

type DisplayMode =
  | 'view all'
  | 'active'
  | 'qualified'
  | 'approved'
  | 'guaranteed'
  | 'expired'
  | 'disqualified'
  | 'scheduled'
  | 'non-active'
  | 'cancelled'
  | 'to expire'
  | 'pre-Qualified';
type SortColumns = 'date' | 'unit' | 'guaranteed';

const badgeClasses = (status: DisplayMode) => {
  switch (status) {
    case 'disqualified':
    case 'expired':
      return 'bg-Error-50 border-Error-200 text-Error-700';

    case 'guaranteed':
    case 'active':
      return 'bg-Success-50 border-success-200 text-Success-700';

    case 'pre-Qualified':
    case 'qualified':
    case 'approved':
    case 'scheduled':
      return 'bg-Indigo-50 border-Indigo-200 text-Indigo-700';

    case 'to expire':
      return 'bg-Warning-50 border-Warning-200 text-Warning-700';

    default:
      return 'bg-Gray-50 border-Gray-200 text-Gray-700';
  }
};

const buttonVariants = (mode: DisplayMode, currentMode: DisplayMode) =>
  mode === currentMode ? 'filled' : 'default';

export const LeasesList: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('view all');
  const [sortColumn, setSortColumn] = useState<SortColumns>('unit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      setLoading(true);
      const data = await fetchApplications();
      setLeases(data);
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
    return [...leases]
      .filter((lease) => displayMode === 'view all' || lease.status.includes(displayMode))
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
  }, [leases, displayMode, sortColumn, sortDirection]);

  const countleaseByStatus = useMemo(() => {
    const statusCount: { [key in DisplayMode]?: number } = {};

    leases.forEach((lease) => {
      const status = lease.status as DisplayMode;
      if (statusCount[status]) {
        statusCount[status]!++;
      } else {
        statusCount[status] = 1;
      }
    });

    return statusCount;
  }, [leases]);

  const handlePageChange = (page: number) => {
    console.log(`Current page: ${page}`);
  };

  const navigate = useNavigate();
  const handleApplicationClick = (id: number) => () => {
    navigate(`/leases/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <Button.Group>
        {['view all', 'active', 'scheduled', 'expired', 'non-active'].map((mode) => (
          <Button
            key={mode}
            variant={buttonVariants(mode as DisplayMode, displayMode)}
            className={`flex-1 ${mode === displayMode ? 'bg-white text-gray-800 border-[1px] border-solid border-Gray-300 hover:bg-gray-50 hover:text-gray-800' : 'bg-Gray-50'}`}
            onClick={() => handleButtonClick(mode as DisplayMode)}
            rightSection={
              <Badge
                classNames={{
                  root: `rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center ${badgeClasses(mode as DisplayMode)}`,
                  label: 'text-center text-xs leading-18 font-medium capitalize',
                }}
                variant="outline"
              >
                {mode === 'view all'
                  ? leases.length
                  : countleaseByStatus[mode as DisplayMode]}
              </Badge>
            }
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </Button.Group>
      <div className="overflow-hidden rounded-lg shadow-xs border-[1px] border-solid border-Gray-200">
        <Table className="min-w-full" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Td onClick={() => handleSort('unit')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center gap-1">
                  <span className='text-Gray-600 text-xs font-medium leading-18'>Unit</span>
                  {sortColumn === 'unit' &&
                    (sortDirection === 'asc' ? <ArrowNarrowUpIcon width={16} height={16} stroke='#475467' /> : <ArrowNarrowDownIcon width={16} height={16} stroke='#475467' />)}
                </div>
              </Table.Td>
              <Table.Td onClick={() => handleSort('guaranteed')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center gap-1">
                  <span className='text-Gray-600 text-xs font-medium leading-18'>Guaranteed</span>
                  {sortColumn === 'unit' &&
                    (sortDirection === 'asc' ? <ArrowNarrowUpIcon width={16} height={16} stroke='#475467' /> : <ArrowNarrowDownIcon width={16} height={16} stroke='#475467' />)}
                </div>
              </Table.Td>
              <Table.Td onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center gap-1">
                  <span className='text-Gray-600 text-xs font-medium leading-18'>End date</span>
                  {sortColumn === 'date' &&
                    (sortDirection === 'asc' ? <ArrowNarrowUpIcon width={16} height={16} stroke='#475467' /> : <ArrowNarrowDownIcon width={16} height={16} stroke='#475467' />)}
                </div>
              </Table.Td>
              <Table.Td className='text-Gray-600 text-xs font-medium leading-18'>Status</Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedApplications
              .filter(
                (application) =>
                  displayMode === 'view all' || application.status.includes(displayMode)
              )
              .map(({ id, name, address, rent, unit, property, guaranteed, date, status }) => (
                <Table.Tr className="bg-white cursor-pointer" key={`${name}-${unit}`} onClick={handleApplicationClick(id)}>
                  <Table.Td className="px-4 py-6 flex flex-col gap-0.5 align-middle">
                    <span className="font-medium text-sm leading-5 text-Gray-700">{name}</span>
                    <span className="font-semibold text-sm leading-5 text-Gray-700">
                      {`${unit} - ${rent}`}
                    </span>
                    <span className="font-normal text-xs leading-18 text-Gray-600">{property}</span>
                    <span className="font-normal text-xs leading-18 text-Gray-600">{address}</span>
                  </Table.Td>
                  <Table.Td className="align-middle">
                    <div className="flex gap-1">
                      <Badge
                        classNames={{
                          root: `rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center ${badgeClasses(guaranteed as DisplayMode)}`,
                          label: 'text-center text-xs leading-18 font-medium capitalize',
                        }}
                        variant="outline"
                        key={guaranteed}
                      >
                        {guaranteed}
                      </Badge>
                    </div>
                  </Table.Td>
                  <Table.Td className="align-middle font-normal leading-5 text-Gray-600">
                    {date}
                  </Table.Td>
                  <Table.Td className="align-middle">
                    <div className="flex gap-1">
                      <Badge
                        classNames={{
                          root: `rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center ${badgeClasses(status as DisplayMode)}`,
                          label: 'text-center text-xs leading-18 font-medium capitalize',
                        }}
                        variant="outline"
                        key={status}
                      >
                        {status}
                      </Badge>
                    </div>
                  </Table.Td>
                  <Table.Td
                    className="align-middle  gap-0.5 font-semibold text-sm leading-5 text-Gray-600 cursor-pointer"
                    align="right"
                  >
                    <div className="flex flex-col">
                      {(guaranteed === 'approved' ||
                        guaranteed === 'qualified' ||
                        guaranteed === 'pre-qualified') && (
                        <span className="text-Success-700">Guarantee lease</span>
                      )}

                      <span>Renew lease</span>
                      <span>End lease</span>
                    </div>
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
