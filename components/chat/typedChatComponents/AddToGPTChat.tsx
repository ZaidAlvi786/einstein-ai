import React, { Fragment, useEffect, useRef, useState } from "react";
import AddToGptIcon from "@/app/assets/svg/add_to_gpt_icon.svg";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Image,
  Input,
  Spinner,
} from "@nextui-org/react";
import {
  useAddContextToGptMutation,
  useAddToolModelGptMutation,
  useGetCreatorsGptQuery,
  useGetRandomImageriesQuery,
} from "@/app/lib/features/chat/chatApi";
import toast from "react-hot-toast";
import AddGptModel from "@/components/marketplace/AddGptModel";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Trashicon from "@/app/assets/svg/trash-icon.svg";
import { Transition } from "@headlessui/react";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";
import Settingicon from "@/app/assets/svg/Settingicon.svg";
import { useAuth } from "@/app/authContext/auth";
import { apiURL } from "@/config";
import axios from "axios";
import { useAppSelector } from "@/app/lib/hooks";

interface AddToGptChatProps {
  selectedText: string;
  setSelectedText: React.Dispatch<React.SetStateAction<string>>;
  showGogleIcon: boolean;
}

const AddToGPTChat: React.FC<AddToGptChatProps> = ({
  selectedText,
  setSelectedText,
  showGogleIcon,
}) => {
  const auth: any = useAuth();
  console.log('auth: ', auth);
  const { data: gptsList } = useGetCreatorsGptQuery(undefined);
  const [addContextToGpt] = useAddContextToGptMutation();
  const [addToolModelGpt, setAddToolModelGpt] = useState({
    open: false,
    category: "gpt",
  });
  const [editToolModelGpt, setEditToolModelGpt] = useState({
    open: false,
    isEditable: true,
    tool_details: null,
    category: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const workspaceMenuContainerRef = useRef<HTMLElement>();
  const [nameOfGPT, setNameOfGPT] = useState("");
  const [
    AddToolModelGpt,
    { isLoading: isSubmitting, error, isError, isSuccess },
  ] = useAddToolModelGptMutation();
  const handleToggleDropdown = (e: any) => {
    e?.preventDefault();
    setDropdownOpen((prev) => !prev);
  };
  const {
    data: randomImage,
    isFetching: randomImageLoading,
    refetch: refetchRandomImage,
  } = useGetRandomImageriesQuery("");
  useOnClickOutside(workspaceMenuContainerRef, () => setDropdownOpen(false));
   const activeChatModel = useAppSelector(
      (state: any) => state.chat.activeChatModel
    );

  const handleAddContextToGpt = async (e: any, tool_id: string) => {
    e.stopPropagation();
    if (selectedText?.length > 0) {
      try {
        let payload = {
          tool_id: tool_id,
          context: selectedText,
        };
        await addContextToGpt(payload).unwrap();
        toast.success("Context Added to GPT.");
        setSelectedText("");
      } catch (error) {
        toast.error("An error occurred while adding context to GPT.");
      }
    } else {
      toast.error("Select text to add context.");
    }
  };

  const handleDropdownToggle = (e: any) => {
    // e.stoppropagation()
    setDropdownOpen(!dropdownOpen);
  };

  const handleSubmit = async () => {
    if (nameOfGPT) {
      await AddToolModelGpt({
        name: nameOfGPT,
        category: addToolModelGpt.category,
        preview_url: [randomImage.random_image],
        tool_id: "",
        description: nameOfGPT,
        tags: [],
        is_agree: true,
        introtext: "",
        tool_monetization: "free",
        logo: randomImage.random_image,
        chat_model: activeChatModel?.id,
        url: "",
        prompt: "",
        context_window: [],
        is_public:false
      });
      
        toast.success("GPT created successfully.");
        setTimeout(() => {
          window.location.reload()
        }, 500);
      //   setDropdownOpen(false);
      //   setNameOfGPT('')
      // } catch (error) {
      //   console.log(error)
      //   toast.error("An error occurred while adding GPT model.");
      // } finally {
      //   setIsSubmitting(false)
      // }
    }
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
      toast.error(
        (error as any)?.data?.message ||
          "An error occurred while adding GPT model."
      );
    } else if (isSuccess) {
      toast.success("GPT model added successfully.");
      setNameOfGPT("");
      setAddToolModelGpt({ ...addToolModelGpt, open: false });
    }
  }, [isError, isSuccess]);

  return (
    <div className={`${showGogleIcon ? "opacity-100" : "opacity-0"}`}>
      <Button
        variant="bordered"
        onClick={handleToggleDropdown}
        className="border-0 min-w-max px-0 !outline-none flex-shrink-0 relative group transition-all w-9 h-9"
      >
        <AddToGptIcon className="text-white cursor-pointer" />
      </Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={dropdownOpen}
        ref={workspaceMenuContainerRef as React.Ref<HTMLElement>}
      >
        <div className="absolute border flex max-h-[300px] overflow-y-auto flex-col gap-2 border-gray-800/20 shadow p-3 px-3 right-0 left-0 z-50 mt-2 origin-top-right rounded-[12px] bg-[#121212] min-w-[252px] w-full trasnsition-card">
          <span className="text-[#858584] text-sm	font-regular	font-helvetica">
            {`Select GPT to add context to:`}
          </span>
          <div>
            {gptsList?.tools?.length > 0 ? (
              gptsList?.tools?.map((tool: any) => {
                return (
                  <div
                    key={tool?.id}
                    className={
                      "text-[#CCCCCC] flex items-center justify-between rounded-xl cursor-pointer text-sm font-helvetica !bg-transparent !border-0 p-2 hover:!bg-gray-500 hover:!bg-opacity-15"
                    }
                    onClick={(e) => {
                      handleAddContextToGpt(e, tool.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {" "}
                        <Avatar
                          src={tool?.logo}
                          alt={"tools-image"}
                          showFallback={true}
                          radius="sm"
                          className="2xl:h-[24px] 2xl:w-[24px] xl:h-[24px] xl:w-[24px] h-[24px] w-[24px] cursor-pointer bg-transparent rounded-full"
                          fallback={
                            <Image
                              src={"/svg/user.svg"}
                              alt="tools-logo-img"
                              width={50}
                              height={50}
                            />
                          }
                        />
                      </span>
                      {tool.name}
                    </div>
                    <span>
                      <Dropdown
                        className="font-helvetica"
                        classNames={{
                          content:
                            "bg-[#2F2F2F] min-w-48 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)] p-1.5",
                        }}
                        placement="bottom-start"
                        closeOnSelect={true}
                      >
                        <DropdownTrigger>
                          <div>
                            <EllipsisHorizontalIcon className="w-5 h-5 text-[#ABABAB]" />
                          </div>
                        </DropdownTrigger>
                        <DropdownMenu classNames={{ base: "p-0" }}>
                          <DropdownItem
                            className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                            onPress={() => {
                              setEditToolModelGpt({
                                open: true,
                                isEditable: true,
                                tool_details: tool,
                                category: 'gpt'
                              });
                            }}
                            startContent={
                              <>
                                <Settingicon />
                              </>
                            }
                          >
                            <p className="text-white text-sm flex items-center font-normal gap-[11px]">{`Settings`}</p>
                          </DropdownItem>

                          <DropdownItem
                            className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                            startContent={
                              <>
                                <Trashicon className="-left-[1px] relative" />
                              </>
                            }
                          >
                            <p className="text-[#E54637] text-sm flex items-center font-normal gap-[11px]">{`Delete`}</p>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </span>
                  </div>
                );
              })
            ) : (
              <span className={"text-[#CCCCCC] text-sm font-helvetica"}>
                {"No GPTs found."}
              </span>
            )}
          </div>
          {!addToolModelGpt.open ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent dropdown close
                setAddToolModelGpt({ ...addToolModelGpt, open: true });
              }}
              className="flex gap-2 items-center text-[#999] text-sm font-inter font-normal ml-1"
            >
              <div className="text-white w-[24px] h-[24px] flex items-center justify-center bg-[#A5A5A5] text-[16px] rounded">
                +
              </div>
              Create GPT
            </button>
          ) : (
            <Input
              autoFocus
              placeholder="Name of GPT"
              variant="underlined"
              classNames={{
                inputWrapper:
                  "border-none after:hidden m-0 !h-[auto] shadow-none ",
                innerWrapper: "!h-[auto] pb-0 bg-transparent",
                input:
                  "font-bold mb-0 text-[#585858] bg-transparent text-sm font-helvetica caret-white data-[has-start-content=true]:ps-2.5",
              }}
              value={nameOfGPT}
              onKeyDown={(e) => {
                if (e?.key === "Enter") {
                  handleSubmit();
                }
              }}
              onChange={(e) => setNameOfGPT(e.target.value)}
              endContent={
                isSubmitting ? (
                  <Spinner color="default" size="sm" />
                ) : (
                  <svg
                    onClick={() =>
                      setAddToolModelGpt({ ...addToolModelGpt, open: false })
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    className="cursor-pointer"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      fill="#6A6A6A"
                      d="M10.1665 9.00805L17.762 1.43822C18.0793 1.11791 18.0793 0.598995 17.762 0.278681C17.4503 -0.0473594 16.9355 -0.0571515 16.6118 0.256802L9.01628 7.82663L1.51839 0.256802C1.36467 0.0928811 1.15078 0 0.927025 0C0.703266 0 0.489378 0.0928811 0.335658 0.256802C0.0543006 0.566276 0.0543006 1.04123 0.335658 1.35071L7.83354 8.9096L0.238001 16.4685C-0.0793336 16.7888 -0.0793336 17.3077 0.238001 17.628C0.389074 17.784 0.596845 17.871 0.813092 17.8687C1.03351 17.8867 1.25202 17.8159 1.42074 17.6718L9.01628 10.102L16.6118 17.7593C16.7629 17.9153 16.9707 18.0022 17.1869 18C17.4029 18.001 17.6102 17.9142 17.762 17.7593C18.0793 17.439 18.0793 16.9201 17.762 16.5998L10.1665 9.00805Z"
                    />
                  </svg>
                )
              }
            />
          )}
        </div>
      </Transition>
      {/* <Dropdown
        isOpen={dropdownOpen}
        onOpenChange={handleDropdownToggle}
        placement="left-start"
        classNames={{
          base: "before:bg-default-200",
          content:
            "py-1 px-1 from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger>
          <Button
            variant="bordered"
            className="border-0 min-w-max px-0 !outline-none flex-shrink-0 relative group transition-all w-9 h-9"
          >
            <AddToGptIcon className="text-white cursor-pointer" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          classNames={{
            base: "bg-[#171717] !m-0",
          }}
          disabledKeys={["notfoundmodels", "notfoundgpts"]}
        >
          <DropdownSection classNames={{ base: "!m-0" }}>
            <DropdownItem
              isVirtualized={true}
              classNames={{
                title: "text-[#858584] text-sm	font-regular	font-helvetica",
                base: "!bg-transparent !border-0 !m-0",
              }}
            >
              {`Select GPT to add context to:`}
            </DropdownItem>
          </DropdownSection>
          <DropdownSection classNames={{ group: "!space-y-0.5" }}>
            {gptsList?.tools?.length > 0 ? (
              gptsList?.tools?.map((tool: any) => {
                return (
                  <DropdownItem
                    key={tool?.id}
                    classNames={{
                      title: "text-[#CCCCCC] text-sm font-helvetica",
                      base: "p-0 !bg-transparent !border-0 p-2 hover:!bg-gray-500 hover:!bg-opacity-15",
                    }}
                    startContent={
                      <Avatar
                        src={tool?.logo}
                        alt={"tools-image"}
                        showFallback={true}
                        radius="sm"
                        className="2xl:h-[24px] 2xl:w-[24px] xl:h-[24px] xl:w-[24px] h-[24px] w-[24px] cursor-pointer bg-transparent rounded-full"
                        fallback={
                          <Image
                            src={"/svg/user.svg"}
                            alt="tools-logo-img"
                            width={50}
                            height={50}
                          />
                        }
                      />
                    }
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown close
                      handleAddContextToGpt(e, tool.id);
                    }}
                    endContent={
                        <EllipsisHorizontalIcon className="w-5 h-5 text-[#ABABAB]" />
                    }
                  >
                    {tool.name}
                  </DropdownItem>
                );
              })
            ) : (
              <DropdownItem
                classNames={{
                  title: "text-[#CCCCCC] text-sm font-helvetica",
                  base: "p-0 my-2 mx-1 !bg-transparent !border-0",
                }}
                key={"notfoundmodels"}
              >
                {"No GPTs found."}
              </DropdownItem>
            )}
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              classNames={{
                title: "text-[#CCCCCC] text-sm font-helvetica",
                base: "p-0 mb-2 mx-1 !bg-transparent !border-0",
              }}
              startContent={
                <div className="text-white w-[24px] h-[24px] flex items-center justify-center bg-[#A5A5A5] text-[16px] rounded">
                  +
                </div>
              }
              onClick={(e) => {
                e.stopPropagation(); // Prevent dropdown close
                setshowAddGpt(true)
                setAddToolModelGpt({ ...addToolModelGpt, open: true });
              }}
            >
              Create GPT
              <Input endContent={<svg onClick={()=> setshowAddGpt(false)} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18" fill="none">
                                    <path fill="#6A6A6A" d="M10.1665 9.00805L17.762 1.43822C18.0793 1.11791 18.0793 0.598995 17.762 0.278681C17.4503 -0.0473594 16.9355 -0.0571515 16.6118 0.256802L9.01628 7.82663L1.51839 0.256802C1.36467 0.0928811 1.15078 0 0.927025 0C0.703266 0 0.489378 0.0928811 0.335658 0.256802C0.0543006 0.566276 0.0543006 1.04123 0.335658 1.35071L7.83354 8.9096L0.238001 16.4685C-0.0793336 16.7888 -0.0793336 17.3077 0.238001 17.628C0.389074 17.784 0.596845 17.871 0.813092 17.8687C1.03351 17.8867 1.25202 17.8159 1.42074 17.6718L9.01628 10.102L16.6118 17.7593C16.7629 17.9153 16.9707 18.0022 17.1869 18C17.4029 18.001 17.6102 17.9142 17.762 17.7593C18.0793 17.439 18.0793 16.9201 17.762 16.5998L10.1665 9.00805Z" />
                                </svg>}  /> 
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown> */}
      <AddGptModel open={editToolModelGpt} setOpen={setEditToolModelGpt} generateRandomImage={false}/>
    </div>
  );
};

export default AddToGPTChat;
