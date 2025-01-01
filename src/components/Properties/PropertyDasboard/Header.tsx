import { Button } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearHederData,
  getContactOfPropertyDetails,
  getMultipleUnits,
  getOwnerDetailsByPropertyId,
  getPropertyDetails,
  getSingleUnits,
  getUnitMixDetails,
  selectApiData,
} from '@stores/propertySlice';
import { setLoading } from '@stores/authSlice';
import { UnknownAction } from '@reduxjs/toolkit';
import SvgBuilding07 from '@assets/iconComponents/Building07';
import Building09 from '@assets/iconComponents/Building09';

interface HeaderProps {
  activeTab?: string | null;
  setActiveTab?: (value: string) => void;
  propertyData?: any;
}

export function Header({ activeTab, setActiveTab, propertyData }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const data = useSelector(selectApiData);
  const contact = useSelector(getContactOfPropertyDetails);
  const unitMixDetails = useSelector(getUnitMixDetails);
  const [propertyTab, setpropertyTab] = useState(activeTab || 'units');

  const handleAddTenat = () => {
    navigate(APP_PATHS.properties.addTenant.get());
  };

  const handleTabChange = (value: string | null) => {
    if (value !== null) {
      setpropertyTab(value);
      setActiveTab?.(value);
    }
  };

  useEffect(() => {
    let data = {
      id,
      lastId: '',
      searchQuery: '',
      limit: 10,
    };
    if (propertyData && id) {
      dispatch(setLoading(true));
      dispatch(getPropertyDetails(id as unknown as string) as unknown as UnknownAction);
      dispatch(getSingleUnits(data as unknown as string) as unknown as UnknownAction);
      dispatch(getMultipleUnits(id as unknown as string) as unknown as UnknownAction);
      dispatch(setLoading(false));
      dispatch(getOwnerDetailsByPropertyId(id as unknown as string) as unknown as UnknownAction);
    }
  }, [id]);

  useEffect(
    () =>
      // Cleanup function to be called on component unmount
      () => {
        dispatch(clearHederData());
      },
    []
  );
  return (
    <>
      <div className="flex gap-8 p-8 flex-col items-center self-stretch border-b-[2px] border-gray-200 border-solid">
        <div className="flex items-center self-stretch justify-between">
          <div className="flex flex-col items-start flex-0 self-stretch gap-8 justify-end">
            <div className="flex self-stretch gap-8 items-start pt-8">
              {propertyData ? (
                data && (
                  <>
                    <div className="flex justify-center items-center gap-2.5 p-3.5 w-35 h-35 rounded-[12px] bg-white shadow-md border border-solid border-gray-200">
                      <Building09 />
                    </div>

                    <div className="flex items-center flex-0 gap-12">
                      <ul className="flex flex-col gap-1 items-start self-stretch list-none">
                        <li className="font-semibold leading-9.5 text-3xl text-gray-900">
                          {data?.name ?? '--'}
                        </li>
                        <li className="text-base font-semibold text-gray-900">
                          {data?.address_info?.address_1
                            ? `${data?.address_info?.address_1}${data?.address_info?.address_2 ? `, ${data?.address_info?.address_2}` : ''}, ${data?.address_info?.city ?? '--'}, ${data?.address_info?.state ?? '--'}  ${data?.address_info?.zip_code ? data?.address_info?.zip_code : ''}`
                            : '--'}
                        </li>
                        {contact && (
                          <>
                            {' '}
                            <li className="text-base font-medium text-gray-700">
                              {contact[0]?.phone_number?.replace(/^\+1\s*/, '') ?? '--'}
                            </li>
                            <li className="text-base font-medium text-gray-700">
                              {contact[0]?.email ?? '--'}
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="flex justify-center items-center gap-2.5 p-3.5 w-35 h-35 rounded-[12px] bg-white shadow-md border border-solid border-gray-200">
                    <SvgBuilding07 />
                  </div>
                  <div className="flex items-center flex-0 gap-12">
                    <div className="flex flex-col gap-1 items-start self-stretch">
                      <div className="font-semibold leading-9.5 text-3xl text-gray-900">
                        All Properties
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-end gap-3 ">
            <Button
              variant="filled"
              className="h-9 border-solid border-success-600 bg-success-600 rounded-[8px] hover:bg-success-500"
              style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }}
            >
              Guarantee tenants
            </Button>

            <Button
              size="md"
              variant="outline"
              className="h-9 bg-white border-solid border-brand-300 text-sm text-[#363F72] text-base font-semibold rounded-[8px]"
              style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }}
              onClick={() => {
                navigate(APP_PATHS.leasing.application.new.get());
              }}
            >
              New Application
            </Button>

            <Button
              size="md"
              variant="outline"
              className="h-9 bg-white border-solid border-brand-300 text-sm text-[#363F72] text-base font-semibold rounded-[8px]"
              style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }}
              onClick={() => handleAddTenat()}
            >
              Add tenant
            </Button>

            <Button
              size="md"
              variant="outline"
              className="h-9 bg-white border-solid border-brand-300 text-sm text-[#363F72] text-base font-semibold rounded-[8px]"
              style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }}
            >
              Move in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
