import { Image, Modal } from '@mantine/core';

interface Props {
  viewImage: boolean;
  setviewImage: (value: boolean) => void;
  imageurl: string;
}

const ViewImageModal = ({ viewImage, setviewImage, imageurl }: Props) => {
  return (
    <Modal
      size={'lg'}
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-xl modal-scroll ',
        header: 'w-24 float-right bg-transparent ',
        body: 'px-5 pb-10 ',
        close: 'text-gray-400 ',
      }}
      opened={viewImage}
      onClose={() => setviewImage(false)}
    >
      <div>
        <Image src={imageurl} className={'rounded w-full max-h-96 object-contain'} />
      </div>
    </Modal>
  );
};

export default ViewImageModal;
