import { Button, Modal } from '@mantine/core';

interface Props {
  icon: any;
  //   title: string;
  //   desc: string;
  //   handleContinue: () => void;
  confirmationModalOpen: boolean;
  setConfirmationModalOpen: (item: boolean) => void;
  confirmBtnDetail?: {
    title: string;
    bgColor: string;
    btnTitle: string;
    desc: string;
    iconBg: string;
    borderColor: string;
    hoverColor: string;
  };
  concelBtnDetail?: { title: string; bgColor: string };
  onConfirm?: any
}

export function ConfirmationModal({
  confirmationModalOpen,
  setConfirmationModalOpen,
  icon,
  confirmBtnDetail,
  onConfirm
}: Props) {
  return (
    <Modal.Root
      size="sm"
      classNames={{
        content: 'rounded-xl',
        close: 'text-gray-400',
      }}
      opened={confirmationModalOpen}
      onClose={() => setConfirmationModalOpen(false)}
    >
      <Modal.Overlay />
      {/* <Modal.Overlay /> */}
      <Modal.Content>
        <Modal.Header className="bg-[url(/src/assets/patterns/circle.svg)] bg-no-repeat bg-left-top p-0">
          <div className="flex flex-col items-center self-stretch w-full">
            <div className="flex px-6 pt-6 flex-col gap-4 items-start self-stretch">
              <div
                className={`flex justify-center items-center w-12 h-12 ${confirmBtnDetail?.iconBg} rounded-xl-2 border-8 border-solid ${confirmBtnDetail?.borderColor} p-3`}
              >
                {icon}
              </div>
              <div className="flex flex-col items-start gap-1 self-stretch">
                <span className="text-Gray-900 text-lg font-semibold leading-7">
                  {confirmBtnDetail?.title}
                </span>
                <span className="text-Gray-600 font-sm font-regular leading-5">
                  {confirmBtnDetail?.desc}
                </span>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex h-11 w-11 p-2 justify-center items-center rounded-md">
              <Modal.CloseButton onClick={() => setConfirmationModalOpen(false)} />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex pt-8 flex-col items-start self-stretch">
            <div className="flex px-6 pb-6 gap-3 self-stretch">
              <Button
                variant="default"
                className="rounded-lg"
                onClick={() => setConfirmationModalOpen(false)}
                classNames={{
                  root: 'flex px-4 py-2.5 justify-center items-center gap-1.5 flex-0 drop-shadow-xs border border-solid border-Gray-300',
                  label: 'text-Gray-700 text-base font-semibold leading-6',
                }}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                classNames={{
                  root: 'flex px-4 py-2.5 justify-center items-center gap-1.5 flex-0',
                  label: 'text-white text-base font-semibold leading-6',
                }}
                className={`drop-shadow-xs border border-solid  border-${confirmBtnDetail?.bgColor}  ${confirmBtnDetail?.bgColor} ${confirmBtnDetail?.hoverColor} rounded-lg`}
                onClick={onConfirm}
              >
                {confirmBtnDetail?.btnTitle}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
