"use client";

import { useEffect } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link,
} from "@nextui-org/react";
import Image from "next/image";


export default function MobileDialog() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnStyle = {
    borderRadius: "16px",
    width: "120px",
    height: "34px"

  }

  const descStyles = {
    width: "257px",
    color: "#FFF",
    fontSize: "28px",
    fontWeight: "600",
    lineHeight: "normal",
  }
  // useEffect(()=> {
  //     const agent = window.navigator.userAgent || window.opera;
  //     if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(agent) || /pixel/i.test(agent)) {
  //         onOpen();
  //     } else {
  //       onClose();
  //     }
  // }, []);

  return (
    <>
      <Modal
        hideCloseButton
        isOpen={isOpen}
        placement="center"
        size="xs"
        backdrop="blur"
        className=" overflow-auto bg-[#23272B]"
        isDismissable={false}
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col px-0 py-0">
                <div className="flex flex-row gap-1 items-center">
                  <Image
                    alt="logo"
                    width={34}
                    height={34}
                    src={"/logo.png"}
                    className="ml-3 mt-7"
                  />
                  <p className="text-[#FFF] text-base font-normal leading-normal font-nasalization mt-7">
                    Einstein
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col  rounded-2xl">
                  <div className="mt-4">
                    <p
                      style={descStyles}
                      className="text-[#D0D0D0] font-helvetica font-normal leading-7 tracking-[0.18px] text-[18px] text-center"
                    >
                      Mobile is not available yet. Check out our application on
                      desktop.
                    </p>
                  </div>

                  <div className="flex gap-6 justify-center	mt-6 mb-3">
                    <div>
                      <Button
                        as={Link}
                        href="https://einsteinmodel.com/"
                        isExternal
                        style={btnStyle}
                        color="primary"
                        className="bg-[#0a84ff]"
                      >
                        Learn More{" "}
                        <Image
                          alt="export icon"
                          width={16}
                          height={16}
                          src={"svg/export.svg"}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}