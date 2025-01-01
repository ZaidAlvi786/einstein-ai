import { UnitsTab } from '@components/Properties/PropertyDasboard/Units/Index';
import { Header } from '@components/Properties/PropertyDasboard/Header';
import { useEffect, useState } from 'react';
import { GuaranteedMonthlyRent } from '@components/Properties/PropertyDasboard/GuaranteedMonthlyRent';
import { Badge, Tabs } from '@mantine/core';
import { PropertyDetailsTab } from '@components/Properties/PropertyDasboard/Details';
import { PropertyApplicationTab } from '@components/Properties/PropertyDasboard/Applications/Index';
import { RightSideBar } from '@components/Properties/PropertyDasboard/RightSideBar';
import { createRequest } from '@api/Base.api';
import { API } from '@constants/api.constant';
import {
  getMultipleModelUnits,
  getSingleModelUnits,
  getUnitDetailsListByProperty,
  getUnitMixDetails,
} from '@stores/propertySlice';
import { UnknownAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MultipleUnitInterface, SingleUnitInterface } from '@interfaces/property.interface';

export function PropertyDetailsPage() {
  const [propertyTab, setPropertyTab] = useState<string>('units');
  const [applicationsCount, setApplicationsCount] = useState<any>(0);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const singleUnitDetails = useSelector(getSingleModelUnits) as unknown as SingleUnitInterface;
  const multipleUnitDetails = useSelector(
    getMultipleModelUnits
  ) as unknown as MultipleUnitInterface;

  useEffect(() => {
    getApplicationsByStatus('any', 10, 1);
    dispatch(getUnitDetailsListByProperty(id as string) as unknown as UnknownAction);
  }, []);

  const getApplicationsByStatus = (status: string, limiter: Number, page: Number) => {
    createRequest(
      `${API.APPLICATIONS.STATUS}/${status}/property/0fb0958d-457d-429b-a12f-de5fd2f14b7f?limit=${limiter}&page=${page}`,
      'GET'
    )
      .then((res) => {
        setApplicationsCount(res);
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  };

  return (
    <div className="flex items-start self-stretch">
      <div className="flex flex-col items-start flex-0 self-stretch">
        <header className="w-full">
          <Header propertyData={{ name: 'Whitestone Apartments' }} />
        </header>
        <Tabs
          keepMounted={false}
          value={propertyTab}
          onChange={(val) => setPropertyTab?.(val || propertyTab)}
          classNames={{
            root: 'flex w-full pt-4 flex-col items-start self-stretch ',
            panel: 'w-full !pt-0',
            list: 'px-8',
          }}
          color="teal"
          defaultValue="first"
        >
          <Tabs.List
            classNames={{
              list: 'before:border-0 flex justify-center items-center self-stretch',
            }}
          >
            <Tabs.Tab
              classNames={{
                tab: `flex h-11 p-3 justify-center items-center gap-2 flex-0 ${propertyTab === 'units' ? 'border-b-2' : 'border-b border-solid border-Gray-200'}`,
              }}
              value="units"
              color="#3E4784"
              size={2}
            >
              <div className="flex justify-center items-center gap-2">
                <span
                  className={`text-sm font-semibold leading-5 ${propertyTab === 'units' ? 'text-Brand-700' : 'text-Gray-500'}`}
                >
                  Units
                </span>
                {Number(singleUnitDetails?.no_of_units) > 0 || multipleUnitDetails?.length > 0 ? (
                  <Badge
                    classNames={{
                      root: 'bg-Gray-50 flex items-center py-0.5 px-1.5 text-center border border-solid border-Gray-200',
                      label: 'text-Gray-700 text-center text-xs leading-18 font-medium',
                    }}
                    variant="outline"
                    size="lg"
                    radius="md"
                  >
                    {Number(singleUnitDetails.no_of_units) + multipleUnitDetails.length}
                  </Badge>
                ) : (
                  ''
                )}
              </div>
            </Tabs.Tab>
            <Tabs.Tab
              classNames={{
                tab: `flex h-11 p-3 justify-center items-center gap-2 flex-0 ${propertyTab === 'applications' ? 'border-b-2' : 'border-b border-solid border-Gray-200'}`,
              }}
              value="applications"
              color="#3E4784"
              size={2}
            >
              <div className="flex justify-center items-center gap-2">
                <span
                  className={`text-sm font-semibold leading-5 ${propertyTab === 'applications' ? 'text-Brand-700' : 'text-Gray-500'}`}
                >
                  Applications
                </span>
                {applicationsCount.length ? (
                  <Badge
                    classNames={{
                      root: 'bg-Gray-50 flex items-center py-0.5 px-1.5 text-center border border-solid border-Gray-200',
                      label: 'text-Gray-700 text-center text-xs leading-18 font-medium',
                    }}
                    variant="outline"
                    size="lg"
                    radius="md"
                  >
                    {applicationsCount.length}
                  </Badge>
                ) : (
                  ''
                )}
              </div>
            </Tabs.Tab>
            <Tabs.Tab
              classNames={{
                tab: `flex h-11 p-3 justify-center items-center gap-2 flex-0 ${propertyTab === 'details' ? 'border-b-2' : 'border-b border-solid border-Gray-200'}`,
              }}
              value="details"
              color="#3E4784"
              size={2}
            >
              <div className="flex justify-center items-center gap-2">
                <span
                  className={`text-sm font-semibold leading-5 ${propertyTab === 'details' ? 'text-Brand-700' : 'text-Gray-500'}`}
                >
                  Details
                </span>
              </div>
            </Tabs.Tab>
          </Tabs.List>
          <div className="flex items-start flex-0 self-stretch">
            <Tabs.Panel value={'units'} pt="xs">
              <UnitsTab />
            </Tabs.Panel>
            <Tabs.Panel value={'applications'} pt="xs">
              <PropertyApplicationTab />
            </Tabs.Panel>
            <Tabs.Panel value={'details'} pt="xs">
              <PropertyDetailsTab />
            </Tabs.Panel>
          </div>
        </Tabs>
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1 ">
        <div className="flex items-start self-stretch flex-col bg-brand-960 text-md-semibold h-screen hidden 1024:block overflow-y-scroll no-scrollbar z-[2]">
          <GuaranteedMonthlyRent />
          <RightSideBar />
        </div>
      </div>
    </div>
  );
}
