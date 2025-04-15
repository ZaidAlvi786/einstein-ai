import { Modal, ModalContent } from "@nextui-org/react";
import React, { useEffect } from "react";
import ImageDownload from "./ImageDownload";
import { useBlurSideBar } from "@/components/context/blurSideBarContext";

interface ViewImagePopupProps {
  isOpen: boolean;
  image: string;
  onClose: () => void;
}

const ViewImagePopup: React.FC<ViewImagePopupProps> = ({
  isOpen,
  image,
  onClose,
}) => {
  const { blurSideBar, setBlurSideBar } = useBlurSideBar();

  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) {
      setBlurSideBar(true);
    }
  }, [isOpen]);

  return (
    <Modal
      size="xl"
      key="create-tools-modal"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="outside"
      hideCloseButton
      classNames={{
        base: "!m-auto",
      }}
    >
      <ModalContent>
        <img
          src={image}
          alt="Enlarged"
          style={{ width: "100%", height: "100%", borderRadius: "5px" }}
        />
        <div className="absolute top-0 right-2">
          <ImageDownload imgUrl={image} />
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ViewImagePopup;
