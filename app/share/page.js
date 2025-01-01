"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../authContext/auth";
import HandleLocalStorageState from "@/app/utils/localStorage/localStorageState";
import { useCreateRecordForSharedRoomMutation } from "../lib/features/chat/chatApi";
import { Modal, ModalBody, ModalContent, Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";

const ShareChatsPage = () => {
  const searchParams = useSearchParams();
  const auth = useAuth();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [CreateRecordForSharedRoom] = useCreateRecordForSharedRoomMutation();

  const GetShareChatLink = () => {
    setIsSubmitting(true);

    const data = { token };

    CreateRecordForSharedRoom(data)
      .unwrap()
      .then((response) => {
        if (response.status === 200) {
          router.push("/");
        }
      })
      .catch((error) => {
        toast.error(error?.data?.message);
        console.log("####_error_#### ", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (token) {
      if (auth && auth?.user && auth?.user?.email && auth?.user?.fullname) {
        GetShareChatLink();
      } else {
        const savedTokenValue = HandleLocalStorageState(
          "share_chat_token",
          token,
          "set"
        );
        router.push("/register");
      }
    } else {
      router.push("/");
    }
  }, [token]);

  return (
    <>
      <div className="h-calc-120px overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-7 mt-10 text-white">
          <div className="mb-8">
            <h2 className="text-white text-4xl mb-3 font-medium font-helvetica">
              Calling Function Every 300ms
            </h2>
            <p className="text-[#6b6b6b] text-lg font-medium font-helvetica">
              September 10, 2024
            </p>
          </div>
          <div className="max-w-max break-words text-[16px] text-[#FFF] font-helvetica font-normal leading-8 bg-[#272727] rounded-[20px] py-1 px-5 ml-auto mb-8">
            <p className="font-helvetica">
              set on function to call in every 300 mili second in userEffect ?
            </p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-full shrink-0">
              <Image
                src={"/models/gpt4.png"}
                alt="modal-img"
                width={27}
                height={27}
              />
            </div>
            <div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed top-auto bottom-0 left-1/2 -translate-x-1/2 h-20 w-full flex items-center justify-center bg-[#121212]">
          <a
            href="#"
            className="bg-[#3A3A3A] text-[#E9E9E9] font-medium text-base py-3 px-6 rounded-full font-helvetica"
          >
            Sign up to chat
          </a>
        </div>
      </div>

      {isSubmitting && (
        <Modal
          isOpen={isSubmitting}
          backdrop={"blur"}
          size={"2xl"}
          hideCloseButton={true}
          className="bg-transparent shadow-none"
        >
          <ModalContent>
            <ModalBody className="flex justify-center items-center">
              <Spinner color="white" classNames={{ wrapper: "w-20 h-20" }} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ShareChatsPage;
