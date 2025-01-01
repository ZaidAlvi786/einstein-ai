import { Button, Card, Input, Image, Badge, Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import apartmentImg from '@assets/img/apartment.jpg';
import { APP_PATHS } from '@routes/app-paths';
import {
  ArrowBlockRight,
  Home02Icon,
  PlusIcon,
  SearchLgIcon,
  Users01Icon,
} from '@assets/iconComponents';
import { useEffect, useState } from 'react';
import { createRequest } from '@api/Base.api';
import { API } from '@constants/api.constant';
import { formatNumberToCurrency } from '@utils/currency';

const baseUrl = import.meta.env.VITE_API_URL;

const cardMock = {
  id: 1,
  name: '',
  address: '',
  units: '',
  tenants: 3,
  market_rent: 0,
  photos: [apartmentImg],
  address_info: {
    address_1: '',
    address_2: '',
  },
  unit_type:'',
};

export function AllProperties() {
  const [properties, setProperties] = useState<(typeof cardMock)[]>([]);
  const [isLoader, setIsLoader] = useState(true);
  const [limiter, setLimiter] = useState(10);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const handleAddProperty = () => {
    navigate(APP_PATHS.properties.new.get());
  };
  const getAllProperties = (limiter: number, page: number, searchQuery: string) => {
    setIsLoader(true);
    createRequest(
      `${API.PROPERTY.GET}?limit=${limiter}&page=${page}&search=${encodeURIComponent(searchQuery)}`,
      'GET'
    )
      .then((res) => {
        console.log(res, 'res');
        setProperties(res);
        setIsLoader(false);
      })
      .catch((err) => {
        setIsLoader(false);
        console.log(err, 'err');
      });
  };

  useEffect(() => {
    getAllProperties(limiter, page, searchQuery);
    localStorage.removeItem('firstId');
  }, [limiter, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setPage(1); // Reset to the first page on new search
      getAllProperties(limiter, 1, searchQuery); // Trigger search
    }
  };

  const getPropertyById = (id: any) => {
    navigate(`${APP_PATHS.properties.get()}/${id}`);
  };

  return (
    <div className="px-5 py-10 flex flex-0 self-stretch items-start flex-col gap-6 border-b-gray-200 bg-gray-50">
      <div className="flex items-center w-full justify-between">
        <Input
          placeholder="Search unit, name, address."
          className="w-80"
          classNames={{
            input: 'h-11 placeholder:text-gray-500 text-gray-500 text-base font-normal',
            section: 'left-1',
          }}
          leftSection={<SearchLgIcon />}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
        />
        <Button
          classNames={{
            section: 'w-5 h-5 m-0',
            root: 'flex gap-1.5 px-4 py-2.5 justify-center rounded-[8px] drop-shadow-xs text-base h-11',
            inner: 'flex gap-1.5 justify-center drop-shadow-xs text-base',
          }}
          className="bg-brand-960 hover:bg-brand-970 text-base font-semibold"
          leftSection={<PlusIcon />}
          onClick={handleAddProperty}
        >
          New property
        </Button>
      </div>

      <div className="flex items-start content-start gap-y-4 self-stretch flex-wrap gap-4">
        {properties &&
          properties.map((property, index) => (
            <Card
              key={index}
              withBorder
              className="max-w-xs-2 p-0 cursor-pointer"
              classNames={{
                root: 'flex flex-col items-start bg-white rounded-[12px] border-secondary border-solid border-[1px] shadow-sm',
              }}
              onClick={() => getPropertyById(property.id)}
            >
              <Card.Section
                classNames={{
                  section: 'max-w-xs-2 me-0 ms-0 w-full h-176 mt-0',
                }}
              >
                <div className="relative">
                  <Image
                    classNames={{
                      root: 'bg-cover bg-no-repeat',
                    }}
                    height={176}
                    src={
                      property?.photos && property.photos.length > 0
                        ? `${baseUrl}${property.photos[0]}`
                        : apartmentImg
                    }
                    alt={property?.name}
                  />
               { property?.unit_type &&   
               <>
                {property?.unit_type==="Both"?
                  <> 
                  <Badge
                    classNames={{
                      root: 'ms-2 bg-transparent rounded-[6px] border-[1px] border-gray-300 border-solid',
                      label: 'text-xs font-medium leading-11  text-gray-700 capitalize',
                    }}
                    variant="light"
                    className="h-3.2 py-0.5 px-1.5 flex items-start rounded-[6px] border-brand-200 !bg-brand-50  absolute top-6 left-6"
                  >
                    Single Family
                  </Badge>
               <Badge
                    classNames={{
                      root: 'ms-2 bg-transparent rounded-[6px] border-[1px] border-gray-300 border-solid',
                      label: 'text-xs font-medium leading-11  text-gray-700 capitalize',
                    }}
                    variant="light"
                    className="h-3.2 py-0.5 px-1.5 flex items-start rounded-[6px] border-brand-200 !bg-brand-50  absolute top-6 left-[36%]"
                  >
                    Mulit Family
                  </Badge>
                  </>:
                  property?.unit_type==="Multiple"?
                  <Badge
                  classNames={{
                    root: 'ms-2 bg-transparent rounded-[6px] border-[1px] border-gray-300 border-solid',
                    label: 'text-xs font-medium leading-11  text-gray-700 capitalize',
                  }}
                  variant="light"
                  className="h-3.2 py-0.5 px-1.5 flex items-start rounded-[6px] border-brand-200 !bg-brand-50  absolute top-6 left-6"
                >
                  Mulit Family
                </Badge>:
                 <Badge
                 classNames={{
                   root: 'ms-2 bg-transparent rounded-[6px] border-[1px] border-gray-300 border-solid',
                   label: 'text-xs font-medium leading-11  text-gray-700 capitalize',
                 }}
                 variant="light"
                 className="h-3.2 py-0.5 px-1.5 flex items-start rounded-[6px] border-brand-200 !bg-brand-50  absolute top-6 left-6"
               >
                 Single Family
               </Badge>



               }
                
                 
               </>
                  }
                </div>
              </Card.Section>

              <div className="px-4 pt-5 pb-4 flex flex-col gap-4 max-w-xs-2 w-82">
                <div className="flex items-start self-stretch gap-4">
                  <div className="flex flex-col items-start gap-1 flex-0">
                    <span className="text-lg text-gray-700 font-medium leading-7">
                      {property?.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 leading-5">
                      {property?.address_info?.address_1} {property?.address_info?.address_2}
                    </span>
                  </div>
                </div>
                <div className="flex items-start content-between self-stretch flex-wrap gap-x-3 h-16">
                  <div className="flex items-start w-64.5 justify-between content-start flex-wrap gap-y-3 text-gray-600">
                    <div className="flex flex-wrap items-center content-center gap-2">
                      <Home02Icon className="text-gray-400" />
                      <span className="text-base font-medium">{property?.units} units</span>
                    </div>
                    <div className="flex flex-wrap items-center content-center gap-2">
                      <Users01Icon className="text-gray-400" />
                      <span className="text-base font-medium">{property?.tenants} Tenants</span>
                    </div>
                    <div className="flex flex-wrap items-center content-center gap-2">
                      <ArrowBlockRight className="text-gray-400" />
                      <span className="text-base font-medium">
                        {formatNumberToCurrency(property?.market_rent, 0)} monthly rent
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>

      <div className="flex flex-col items-center self-stretch gap-2.5">
        {isLoader ? (
          <Loader size={30} color="#3E4784" />
        ) : (
          <Button
            onClick={() => {
              setLimiter((prev) => prev + 10);
              // setPage((prev) => prev + 1);
            }}
            variant="filled"
            className="text-gray-400 bg-white border-gray-200 font-semibold rounded-[8px] hover:bg-white hover:text-gray-700"
          >
            Load more
          </Button>
        )}
      </div>

      {/* <div>
        <NoItemAdded
          title="No properties added"
          icon={<Building04Icon  width="48" height="48"/>}
          desc="Your search “Landing page design” did not match any projects. Please try again."
        >
          <div>
            <Button
              classNames={{
                section: 'w-5 h-5 m-0',
                root: 'flex gap-1.5 px-4 py-2.5 justify-center rounded-lg drop-shadow-xs text-base h-11',
                inner: 'flex gap-1.5 justify-center drop-shadow-xs text-base',
              }}
              className="bg-brand-960 hover:bg-brand-970 text-base font-semibold"
              leftSection={<PlusIcon />}
              onClick={handleAddProperty}
            >
              New property
            </Button>
          </div>
        </NoItemAdded>
      </div> */}
    </div>
  );
}
