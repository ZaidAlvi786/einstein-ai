import { useBlurSideBar } from "@/components/context/blurSideBarContext";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button, Image, Modal, ModalContent } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ToglTutorialPopup = ({ isOpen, setIsOpen }: any) => {
  const router = useRouter();
  const { setBlurSideBar } = useBlurSideBar();

  useEffect(() => {
    if (isOpen) {
      setBlurSideBar(true);
    }
  }, [isOpen]);
  const closeModal = () => {
    setIsOpen(false);
    localStorage.removeItem("showTutorialPopup");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <Modal
        key="create-tools-modal"
        size={"4xl"}
        isOpen={isOpen}
        onClose={closeModal}
        classNames={{
          base: "text-white bg-[#171717] z-[9999] p-6 pb-6",
          closeButton: "hover:bg-[#232323] active:bg-[#232323]",
        }}
        scrollBehavior="outside"
        isDismissable={false}
      >
        <ModalContent>
          {/* Modal Header */}
          <header className="flex justify-between items-center  pb-4 pt-4 border-b-2 border-[#bcbcbc5e]">
            <div>
              <h1 className="text-2xl font-bold">Welcome to Togl</h1>
              <p className="text-[#848484]">
                The world of AI at your fingertips.
              </p>
            </div>
            <Button
              // onClick={() => {
              //   router.push('/profile/buy-subscription');
              // }}
              onClick={() => {
                window.open("https://calendly.com/bmb-111/meeting", "_blank");
              }}
               className=" border-2 text-[12px] font-helvetica font-normal border-[#4895FF] rounded-lg bg-[#0A84FF] text-white flex items-center"
            >
              <Image
                radius="none"
                src={"/svg/giftIcon.svg"}
                width={15}
                height={15}
              />
              <span className="mt-1">Book a free consultation</span>
            </Button>
          </header>

          {/* Modal Body */}
          <div className="flex">
            {/* Sidebar */}

            {/* Main Content */}
            {/* <main className="flex-1 flex flex-col items-center justify-center py-10">
              <video
                src="https://youtu.be/2fXkP-eepPE"
                // src='./4114797-uhd_3840_2160_25fps.mp4'
                controls // Adds video controls (play, pause, volume, etc.)
                autoPlay // Automatically starts the video (autoplay may be blocked by some browsers)
                muted // Mutes the video by default
                loop // Loop the video continuously
                style={{ width: "100%", height: "auto" }} // Adjusts the video size
              />
            </main> */}
            <main className="flex-1 flex flex-col items-center justify-center py-5">
              <iframe
                width="850px"
                height="500px"
                src="https://www.youtube.com/embed/Vpx3P21EKlo?si=3lwhrsUi_pzC_y-N" // Embed URL for YouTube video
                title="Togl Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen // Enables fullscreen mode
                style={{ borderRadius: "16px" }} // Add styling if needed
              ></iframe>
            </main>
          </div>

          {/* Modal Footer */}
          <footer className="flex justify-around font-helvetica ">
            <Button
              onClick={closeModal}
              className="p-4 h-auto inline-block w-1/2 mx-2 rounded-xl border-2 bg-transparent border-[#BCBCBC] cursor-pointer"
            >
              <div className="flex gap-x-3 items-center pb-2">
                <Image
                  radius="none"
                  src={"/svg/calender.svg"}
                  width={17}
                  height={17}
                />
                <h3 className="text-base ">Start Using Togl</h3>
              </div>
              <div className="flex justify-between">
                <p className="text-[#A39780] text-sm text-start ">
                  Research, write, create images, videos, and
                  <br /> more with Togl.
                </p>
                <ArrowRightIcon className="h-6 w-6 text-[#A39780] " />
              </div>
            </Button>
            <Button
              onClick={() => {
                router.push("/marketplace");
                closeModal();
              }}
              className="p-4 h-auto inline-block w-1/2 mx-2 rounded-xl bg-transparent  border-2 border-[#BCBCBC] cursor-pointer"
            >
              <div className="flex gap-x-3 pb-2 items-center">
                <Image
                  radius="none"
                  src={"/more-icon.png"}
                  width={17}
                  height={17}
                />
                <h3 className="text-base">Add Your Tools</h3>
              </div>
              <div className="flex justify-between">
                <p className="text-[#A39780] text-sm text-start ">
                  Explore the marketplace and add tools to
                  <br /> your Togl bar.
                </p>
                <ArrowRightIcon className="h-6 w-6 text-[#A39780] " />
              </div>
            </Button>
          </footer>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ToglTutorialPopup;
