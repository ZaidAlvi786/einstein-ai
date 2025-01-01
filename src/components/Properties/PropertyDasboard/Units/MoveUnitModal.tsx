import { ArrowDown, PlusIcon } from '@assets/iconComponents';
import SvgArrowSquareRight from '@assets/iconComponents/ArrowSquareRight';
import { UnitModelDataInterface } from '@interfaces/property.interface';
import { Button, Menu, Modal } from '@mantine/core';
import { UnknownAction } from '@reduxjs/toolkit';
import { setLoading } from '@stores/authSlice';
import { getMultipleUnits, getUnitMixDetails, moveUnitsToModel, updateUnitDetailsUnits } from '@stores/propertySlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AddUnitModal } from './AddUnitModal';

interface Props {
  moveUnitModalOpen: boolean;
  setMoveUnitModalOpen: (item: boolean) => void;
  detailModel: UnitModelDataInterface;
  selectedRowsTable: any;
  setSelectedRowsTable: (item: any[]) => void;
  selectedRowsTable2: any;
  setSelectedRowsTable2: (item: any[]) => void;
}

export function MoveUnitModal({
  moveUnitModalOpen,
  setMoveUnitModalOpen,
  detailModel,
  selectedRowsTable,
  setSelectedRowsTable,
  selectedRowsTable2,
  setSelectedRowsTable2,
}: Props) {
  const dispatch = useDispatch();
  const [unit, setUnit] = useState({ name: '', id: '' });
  const [addUnitModalOpen, setAddUnitModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();

  const unitMixDetails = useSelector(getUnitMixDetails);

  const handelMove = async () => {
    dispatch(setLoading(true));

    if (detailModel?.units) {
      const unit_data = [...(selectedRowsTable ?? []), ...(selectedRowsTable2 ?? [])].map(
        (item: { id: any; unit_name: any; address: any; market_rent: any }) => ({
          id: item.id,
          name: item.unit_name,
          address: item.address,
          market_rent: item.market_rent,
        })
      );
      const body: any = { unit_data, model_data: { id: unit.id, unit_name: unit.name } };
      await dispatch(moveUnitsToModel(body as unknown as any) as unknown as UnknownAction);
    }

    const result = unitMixDetails.map((item) => {
      if (item.id === unit.id && item.units) {
        // Safely spread only if detailModel.units is an array
        const updatedUnits = [...item.units, ...selectedRowsTable, ...selectedRowsTable2];

        return { ...item, units: updatedUnits };
      }
      if (item.id === detailModel?.id) {
        if (item.units !== undefined && Array.isArray(item.units)) {
          const updatedUnits = item.units?.filter(
            // Check if the unit's id is not in selectedRowsTable
            (val) =>
              ![...selectedRowsTable, ...selectedRowsTable2].some(
                (row: { id: string }) => row.id === val.id
              )
          );
          return { ...item, units: updatedUnits ?? [] };
        }
      }

      return item;
    });
    setSelectedRowsTable([]);
    setSelectedRowsTable2([]);
    dispatch(updateUnitDetailsUnits(result));
    setMoveUnitModalOpen(false);
    dispatch(setLoading(false));
    dispatch(getMultipleUnits(id as unknown as string) as unknown as UnknownAction);

  };

  return (
    <>
      <Modal.Root size="sm" opened={moveUnitModalOpen} onClose={() => setMoveUnitModalOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body className="bg-[url(/src/assets/patterns/circle.svg)] bg-no-repeat bg-left-top p-[24px]">
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-[16px] items-start">
                <div className=" flex items-start justify-between w-full">
                  <div className="flex justify-center items-center w-[48px] h-[48px] bg-[#DCFAE6] rounded-[28px] border-[8px] border-solid border-[#ECFDF3] p-[12px] ">
                    <SvgArrowSquareRight className="shrink-0" />
                  </div>
                  <Modal.CloseButton />
                </div>
                <div>
                  <div className="text-gray-900 text-[18px] font-semibold leading-[28px]">
                    Move units to diffrent model
                  </div>
                  <div className="text-[14px] font-normal leading-[20px] text-gray-600">
                    You are about to move{' '}
                    {[...selectedRowsTable, ...selectedRowsTable2].length ?? 0} units to a diffrent
                    unit model Please select...
                  </div>
                </div>

                <div className="w-full">
                  <Menu>
                    <Menu.Target>
                      <Button
                        className="border-[2px] focus:shadow-test topMenuDropDown border-solid border-brand-110 hover:bg-white hover:text-black rounded-[12px] hover:rounded-[12px] bg-white justify-between h-11 bg-white text-black w-full "
                        rightSection={<ArrowDown />}
                      >
                        <span className="font-medium text-base w-full">
                          {unit.name || 'Select unit model'}
                        </span>
                      </Button>
                    </Menu.Target>

                    <Menu.Dropdown className="hover:bg-grey-50 flex flex-col gap-2">
                      {unitMixDetails
                        .filter((element) => element.unit_type === 'multiple')
                        .filter((val) => val.id !== detailModel.id)
                        .map((val) => (
                          <Menu.Item
                            onClick={() => setUnit({ name: val.unit_info?.name, id: val.id })}
                            key={val.id}
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
              </div>

              <div className="flex items-start gap-[12px] w-full pt-[30px]">
                <Button
                  variant="default"
                  className="w-6/12 rounded-[8px]"
                  onClick={() => setMoveUnitModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  className="w-6/12 border-[1px] border-solid border-[#3E4784] bg-[#3E4784] rounded-[8px]"
                  onClick={handelMove}
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