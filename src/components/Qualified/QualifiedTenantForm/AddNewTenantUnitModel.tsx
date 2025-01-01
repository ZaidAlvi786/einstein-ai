import { Button, Modal, Select } from '@mantine/core';
import { ArrowDown, Home06Icon } from '@assets/iconComponents';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import CustomInput from '@utils/CustomInput';

interface Props {
  addUnitTenantModalOpen: boolean;
  setAddUnitTenantModalOpen: (item: boolean) => void;
}

export function AddNewTenantUnitModel({
  addUnitTenantModalOpen,
  setAddUnitTenantModalOpen,
}: Props) {
  return (
    <Modal
      size="xl"
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-[12px] modal-scroll ',
        header: 'w-24 float-right bg-transparent',
        body: 'p-0 ',
        close: 'text-gray-400',
      }}
      opened={addUnitTenantModalOpen}
      onClose={() => {
        setAddUnitTenantModalOpen(false);
      }}
    >
      <div>
        <div className="bg-cover w-full my-3 relative  ">
          <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
          <Home06Icon className="ms-6.2 mt-3 h-37.47 w-9" />
        </div>
        <div className="p-5 pt-2">
          <div className="leading-7 font-semibold text-lg	 text-gray-900 ">Add unit</div>
          <div className="text-sm font-bold text-Gray-600 mt-2">
            <span className="text-sm font-normal text-Gray-600">Adding unit to</span> Withesthone
            Apartments - 123 Main St. New York NY 11111.
          </div>
          <form>
            <fieldset className="grid grid-cols-2 gap-5 mt-4">
              <CustomInput label="Name" placeholder="What is your title?" />
              <Select
                classNames={{
                  option: 'mb-0.5 rounded-[8px]',
                  dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                }}
                label="Unit model"
                placeholder="What is your title?"
                checkIconPosition="right"
                comboboxProps={{ dropdownPadding: 0 }}
                rightSection={<ArrowDown />}
                data={['Phoenix Baker', 'Olivia Rhye', 'Lana Steiner']}
              />
            </fieldset>
            <fieldset className="grid grid-cols-2 gap-5 mt-4">
              <CustomInput label="Address 1*" placeholder="What is your title?" />
              <CustomInput label="Address 2" placeholder="What is your title?" />
            </fieldset>
            <fieldset className="grid grid-cols-3 gap-5 mt-4">
              <CustomInput label="City*" placeholder="What is your title?" />
              <Select
                classNames={{
                  option: 'mb-0.5 rounded-[8px]',
                  dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                }}
                label="State*"
                placeholder="What is your title?"
                checkIconPosition="right"
                comboboxProps={{ dropdownPadding: 0 }}
                rightSection={<ArrowDown />}
                data={['Phoenix Baker', 'Olivia Rhye', 'Lana Steiner']}
              />
              <CustomInput label="Zip*" placeholder="00000" />
            </fieldset>
            <fieldset className="grid grid-cols-4 gap-5 mt-4">
              <CustomInput label="Bedroom*" placeholder="0" />
              <CustomInput label="Bathroom*" placeholder="0" />
              <CustomInput label="Market rent" placeholder="0" />
              <CustomInput label="Sq. feet*" placeholder="0" />
            </fieldset>
            <div className="grid-cols-2 grid gap-5 mt-10">
              <Button
                variant="outline"
                onClick={() => {
                  setAddUnitTenantModalOpen(false);
                }}
                className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setAddUnitTenantModalOpen(false);
                }}
                variant="outline"
                className="rounded-[8px] h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
