import { Button } from '@mantine/core';
import { PlusIcon } from '@assets/iconComponents';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMultipleModelUnits,
  getSingleModelUnits,
  getUnitDetailsListByProperty,
  getUnitMixDetails,
} from '@stores/propertySlice';
import { UnknownAction } from '@reduxjs/toolkit';
import { setLoading } from '@stores/authSlice';
import SvgHome03Icon from '@assets/iconComponents/Home-03';
import ModelCard from './ModelCard';
import { DataTableByStatus } from './DataTableByStatus';
import { AddUnitModal } from './AddUnitModal';
import { NoItemAdded } from '../NoItemAdded';
import AddUnit from './AddUnit';
import { MultipleUnitInterface, SingleUnitInterface } from '@interfaces/property.interface';

export function UnitsTab() {
  const [addUnitModalOpen, setAddUnitModalOpen] = useState(false);
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const singleUnitDetails = useSelector(getSingleModelUnits) as unknown as SingleUnitInterface;
  const multipleUnitDetails = useSelector(
    getMultipleModelUnits
  ) as unknown as MultipleUnitInterface;
  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(getUnitDetailsListByProperty(id as string) as unknown as UnknownAction);
    dispatch(setLoading(false));
  }, []);

  return (
    <>
      {multipleUnitDetails && multipleUnitDetails?.length > 0 || singleUnitDetails && singleUnitDetails?.unitResponse?.length > 0 ? (
        <div className="flex flex-col items-start flex-0 self-stretch pt-10 pb-8 px-8 gap-6 border-b-[1px] border-Gray-200 border-solid bg-Gray-50">
          <div className="flex flex-col items-start self-stretch gap-5">
            <div className="flex items-start self-stretch gap-4">
              <div className="flex flex-col justify-center items-start self-stretch flex-0 gap-1 w-full">
                <span className="text-Gray-900 self-stretch text-3xl font-semibold leading-38">
                  Unit mix
                </span>
              </div>
              <Button
                classNames={{
                  section: 'w-5 h-5 m-0',
                  root: 'flex gap-1.5 px-4 py-2.5 justify-center rounded-[8px] drop-shadow-xs text-base h-11',
                  inner: 'flex gap-1.5 justify-center drop-shadow-xs text-base',
                }}
                className="bg-white border-[1px] border-Gray-300 border-solid text-Gray-700 drop-shadow-xs text-base font-semibold"
                leftSection={<PlusIcon />}
                variant="default"
                onClick={() => setAddUnitModalOpen(true)}
              >
                Add unit model
              </Button>
            </div>
            <span className="hidden"></span>
          </div>
          <ModelCard />
          <DataTableByStatus />
        </div>
      ) : (
        <div>
          <NoItemAdded
            title="No added units"
            icon={<SvgHome03Icon width="48" height="48" />}
            desc="Your search “Landing page design” did not match any projects. Please try again."
          >
            <div className="flex space-x-4">
              <Button
                classNames={{
                  section: 'w-5 h-5 m-0',
                  root: 'flex gap-1.5 px-4 py-2.5 justify-center rounded-[8px] drop-shadow-xs text-base h-11',
                  inner: 'flex gap-1.5 justify-center drop-shadow-xs text-base',
                }}
                className="bg-white border-[1px] border-Gray-300 border-solid text-Gray-700 drop-shadow-xs  text-base font-semibold"
                leftSection={<PlusIcon />}
                variant="default"
                onClick={() => setAddUnitOpen(true)}
              >
                Add unit
              </Button>
              <Button
                classNames={{
                  section: 'w-5 h-5 m-0',
                  root: 'flex gap-1.5 px-4 py-2.5 justify-center rounded-[8px] drop-shadow-xs text-base h-11',
                  inner: 'flex gap-1.5 justify-center drop-shadow-xs text-base',
                }}
                className="border-[1px] border-solid border-[#3E4784] bg-[#3E4784] rounded-[8px] shadow"
                leftSection={<PlusIcon />}
                variant="filled"
                onClick={() => setAddUnitModalOpen(true)}
              >
                Add unit model
              </Button>
            </div>
          </NoItemAdded>
        </div>
      )}
      {addUnitOpen && (
        <AddUnit addUnitOpen={addUnitOpen} setAddUnitOpen={setAddUnitOpen} property_id={id!} />
      )}
      {addUnitModalOpen && (
        <AddUnitModal
          addUnitModalOpen={addUnitModalOpen}
          setAddUnitModalOpen={setAddUnitModalOpen}
          property_id={id!}
        />
      )}
    </>
  );
}
