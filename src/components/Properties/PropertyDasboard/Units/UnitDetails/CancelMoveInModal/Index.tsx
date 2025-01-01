import { AlertCircleIcon, XCircleIcon, XCloseIcon } from '@assets/iconComponents';
import { Alert, Button, Group, Modal, Switch } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
interface Props {
  cancelMoveInModal: boolean;
  setCancelMoveInModal: (item: boolean) => void;
  leaseAgreement: string;
}
export function CancelMoveInModal({
  cancelMoveInModal,
  setCancelMoveInModal,
  leaseAgreement,
}: Props) {
  const icon = (
    <span className=" flex items-center justify-center outline-2 outline rounded-[24px] outline-[#3e47841a] outline-offset-4">
      <AlertCircleIcon
        width={20}
        height={20}
        stroke="#3E4784"
        className="outline-2 outline rounded-[24px] outline-[#3e47844d] outline-offset-1"
      />
    </span>
  );
  const label = (
    <div className="flex flex-col ga-1 items-start self-stretch">
      <span className="text-Gray-700 text-sm font-semibold leading-5">Lease in place</span>
      <span className="text-Gray-600 text-sm font-normal leading-5">
        Tenant alredy signed a 12 month lease agreemnt, pleae select what should happen with it.
      </span>
    </div>
  );
  return (
    <div>
      <Modal.Root
        size="md"
        classNames={{
          content: 'rounded-xl',
          close: 'text-gray-400',
        }}
        opened={cancelMoveInModal}
        onClose={() => setCancelMoveInModal(false)}
      >
        <Modal.Overlay />
        {/* <Modal.Overlay /> */}
        <Modal.Content>
          <Modal.Header className="bg-[url(/src/assets/patterns/circle.svg)] bg-no-repeat flex flex-col items-start gap-4 bg-left-top p-0 relative">
            {/* <Agreement setModalSize= {setModalSize}/> */}
            <div className="flex px-6 pt-6 flex-col items-start gap-4 self-stretch">
              <span className="flex h-12 w-12 items-center justify-center rounded-[28px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
                <span className="h-full flex w-full p-2 justify-center items-center flex-0">
                  <XCircleIcon stroke="#344054" height={24} width={24} />
                </span>
              </span>
              <div className="flex flex-col items-start gap-1 self-stretch">
                <span className="text-Gray-900 text-lg font-semibold leading-7">
                  Cancel move in
                </span>
                <span className="text-Gray-600 text-sm font-regular leading-5">
                  Please select apratment you will wish to move too.
                </span>
              </div>
            </div>
            <div className="flex h-11 w-11 p-2 justify-center items-center absolute right-4 top-4 rounded-[8px]">
              <XCloseIcon
                height={24}
                width={24}
                stroke="#98A2B3"
                onClick={() => {
                  setCancelMoveInModal(false);
                }}
                className="cursor-pointer"
              />
            </div>
          </Modal.Header>
          <Modal.Body
            classNames={{
              body: '!pb-0 pt-5',
            }}
            className="flex px-6 flex-col items-start gap-5 self-stretch"
          >
            <fieldset className="grid-cols-1 w-full grid gap-6 ">
              <div className="flex flex-col items-start gap-2 col-span-1 flex-0">
                <CustomInput
                  classNames={{
                    root: 'flex flex-col items-start gap-1.5 self-stretch',
                    label: '!mb-0',
                    wrapper: 'w-full',
                  }}
                  label="Reason given (optional)"
                  placeholder="Reason given for moving out"
                />
              </div>
            </fieldset>
            {leaseAgreement === '12 month lease agreement' && (
              <Alert
                classNames={{
                  root: 'flex p-4 items-start gap-3 self-stretch rounded-[12px] border-[1px] border-solid border-Gray-300 bg-white drop-shadow-xs',
                  body: 'flex flex-col items-start self-stretch gap-3',
                  message: 'flex flex-col items-start self-stretch gap-3',
                }}
                variant="light"
                title={label}
                icon={icon}
              >
                <Switch
                  key="cancelLease"
                  value="Cancel lease"
                  label="Cancel lease"
                  description="This will terminate the lease."
                />
              </Alert>
            )}

            <Switch.Group>
              <Group>
                <Switch
                  className="w-full"
                  key="close"
                  value="Close application"
                  label="Close application"
                  description="Mark application as cllosed."
                />
                {leaseAgreement !== '12 month lease agreement' && (
                  <Switch
                    className="w-full"
                    key="notifyTenant"
                    value="Notify tenant"
                    label="Notify tenant"
                    description="Let tenant know that the application is closed, (you will be able to etid the masage on the next screen)."
                  />
                )}
              </Group>
            </Switch.Group>

            <div className="flex pt-0  pb-6 items-start gap-3 self-stretch">
              <Button
                size="md"
                variant="outline"
                className="bg-white w-1/2 border-gray-300 text-gray-700 text-base font-semibold rounded-lg"
                classNames={{ label: 'text-gray-700' }}
                onClick={() => {
                  setCancelMoveInModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="md"
                className="bg-Brand-600 w-1/2 hover:bg-Brand-600 text-base font-semibold rounded-lg"
              >
                Confirm
              </Button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      
    </div>
  );
}
