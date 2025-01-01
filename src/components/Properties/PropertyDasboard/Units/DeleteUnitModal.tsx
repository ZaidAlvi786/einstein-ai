import { ArrowDown, CheckIcon02, PlusIcon } from '@assets/iconComponents';
import SvgDelete02 from '@assets/iconComponents/Delete02';
import { UnitModelDataInterface } from '@interfaces/property.interface';
import { Button, Menu, Modal } from '@mantine/core';
import { UnknownAction } from '@reduxjs/toolkit';
import { setLoading } from '@stores/authSlice';
import {
  deleteUnitDetails,
  getMultipleUnits,
  getUnitMixDetails,
  moveUnitsToModel,
  updateUnitDetailsUnits,
} from '@stores/propertySlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AddUnitModal } from './AddUnitModal';

interface Props {
  deleteModalOpen: boolean;
  setDeleteModalOpen: (item: boolean) => void;
  setDetailModelOpen: (item: boolean) => void;
  detailModel: UnitModelDataInterface;
}

export function DeleteUnitModal({
  deleteModalOpen,
  setDeleteModalOpen,
  detailModel,
  setDetailModelOpen,
}: Props) {
  const [unit, setUnit] = useState({ name: '', id: '' });
  const [addUnitModalOpen, setAddUnitModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const unitMixDetails = useSelector(getUnitMixDetails);

  const handelDelete = async () => {
    dispatch(setLoading(true));
    if (detailModel?.units) {
      const unit_data = detailModel.units.map((item) => ({
        id: item.id,
        name: item.unit_name,
        address: item.address,
        market_rent: item.market_rent,
      }));
      const body: any = { unit_data, model_data: { id: unit.id, unit_name: unit.name } };
      await dispatch(moveUnitsToModel(body as unknown as any) as unknown as UnknownAction);
    }

    await dispatch(
      deleteUnitDetails(detailModel.id as unknown as string) as unknown as UnknownAction
    );

    const updatedUnitModels = unitMixDetails
      .filter((element) => element.unit_type === 'multiple')
      .filter((item) => item.id !== detailModel?.id);

    const result = updatedUnitModels.map((item) => {
      if (item.id === unit.id && item.units) {
        let updatedUnits: any;

        // Properly check for 'undefined' using '===' instead of 'typeof'
        if (detailModel?.units !== undefined && Array.isArray(detailModel.units)) {
          // Safely spread only if detailModel.units is an array
          updatedUnits = [...item.units, ...detailModel.units];
        } else {
          updatedUnits = item.units;
        }

        return { ...item, units: updatedUnits };
      }

      return item;
    });

    dispatch(updateUnitDetailsUnits(result));
    setDeleteModalOpen(false);
    setDetailModelOpen(false);
    dispatch(setLoading(false));
    dispatch(getMultipleUnits(id as unknown as string) as unknown as UnknownAction);
  };

  return (
    <>
      <Modal.Root size="sm" opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body className="bg-[url(/src/assets/patterns/circle.svg)] bg-no-repeat bg-left-top p-[24px]">
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-[16px] items-start">
                <div className=" flex items-start justify-between w-full">
                  <div className="flex justify-center items-center w-12 h-12 bg-[#DCFAE6] rounded-[28px] border-[8px] border-solid border-[#ECFDF3] p-3 ">
                    <SvgDelete02 className="shrink-0" />
                  </div>
                  <Modal.CloseButton />
                </div>
                <div>
                  <div className="text-gray-900 text-[18px] font-semibold leading-[28px]">
                    Deleting {detailModel?.unit_info?.name ?? '--'}
                  </div>
                  {detailModel?.units && (
                    <div className="text-[14px] font-normal leading-[20px] text-gray-600">
                      {detailModel?.units?.length && detailModel?.units?.length > 0
                        ? `You have ${detailModel?.units?.length} units in this model, please select unit model where units should be moved to.`
                        : 'You have 0 units in this model.'}
                    </div>
                  )}
                </div>
                {detailModel?.units && (
                  <div className="w-full">
                    <Menu>
                      <Menu.Target>
                        <Button
                          className="border-[2px] focus:shadow-test topMenuDropDown border-solid border-brand-110 hover:bg-white hover:text-Gray-500 rounded-[8px] hover:rounded-[8px] bg-white justify-between h-11 bg-white text-Gray-500 w-full "
                          rightSection={<ArrowDown stroke="#667085" />}
                          disabled={!(detailModel?.units?.length && detailModel?.units?.length > 0)}
                        >
                          <span className="font-medium text-base w-full">
                            {unit.name || 'Select unit model'}
                          </span>
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown
                        classNames={{
                          dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                        }}
                        className="hover:bg-grey-50 flex flex-col gap-2 rounded-[8px] shadow-lg"
                      >
                        {unitMixDetails
                          .filter((element) => element.unit_type === 'multiple')
                          .filter((val) => val.id !== detailModel.id)
                          .map((val) => (
                            <Menu.Item
                              classNames={{ item: unit.id === val.id ? '!bg-gray-50' : '' }}
                              onClick={() => setUnit({ name: val.unit_info?.name, id: val.id })}
                              key={val.id}
                              rightSection={unit.id === val.id && <CheckIcon02 />}
                            >
                              <span className="font-medium text-base">{val.unit_info?.name}</span>
                            </Menu.Item>
                          ))}

                        <Menu.Item
                          leftSection={<PlusIcon className="size-5 text-brand-940" />}
                          className="pb-6"
                          onClick={() => setAddUnitModalOpen(true)}
                        >
                          <span className="font-medium text-base">New Unit Model</span>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                )}

                <div className="text-[14px] font-normal leading-[20px] text-gray-600">
                  {`You are about to ${detailModel?.units?.length && detailModel?.units?.length > 0 ? `move ${detailModel?.units?.length} units and` : ''} permanently delete ${detailModel?.unit_info?.name ?? 'unit'}. Are you sure you want to proceed? (This action can’t be undone.)`}
                </div>
              </div>

              <div className="flex items-start gap-[12px] w-full pt-[30px]">
                <Button
                  variant="default"
                  className="w-6/12 rounded-[8px]"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  className="w-6/12 border-[1px] border-solid border-[#3E4784] bg-[#3E4784] rounded-[8px]"
                  onClick={handelDelete}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
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
