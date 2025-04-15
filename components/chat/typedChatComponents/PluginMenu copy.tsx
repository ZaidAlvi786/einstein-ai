import { useAuth } from "@/app/authContext/auth";
import useDebounce from "@/app/hooks/useDebounce";
import {
  useCreateEmptyChatMutation,
  useGenerateDataTokenForToolsMutation,
  useGetUserToolsQuery,
  useSearchToolsQuery,
  useUnsubscribeToolMutation,
} from "@/app/lib/features/chat/chatApi";
import { setActiveChatModel } from "@/app/lib/features/chat/chatSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import {
  Avatar,
  Button,
  Image,
  Link,
  Skeleton,
  Tooltip,
} from "@nextui-org/react";
import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CancelSubscriptionModal from "@/components/billing/CancelSubscriptionModal";
import toast from "react-hot-toast";
import TogleBoxRightClick from "./TogleBoxRightClick";
import EarthIcon from "@/app/assets/svg/earth.svg";
import RightClickSearchPlugin from "../RightClickSearchPlugin";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const PluginMenu = ({ showDraggableModal }: any) => {
  const auth: any = useAuth();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const divRef: any = useRef(null);
  const chat_id: any = searchParams.get("chat");
  const group_id = searchParams.get("group");
  const workspace_id_local = localStorage.getItem("workspace_id");

  // states
  const [menuItems, setMenuItems] = useState<any>([]);
  console.log("🚀 ~ menuItems:", menuItems);
  const staticTool = [
    {
      name: "Static1",
      introtext: "",
      price: {},
      category: "gpt",
      url: "",
      logo: "https://chat-media-einstein.s3.amazonaws.com/image/bb0a7f16-55ed-459b-bef4-e002e64fc1ae.png",
      chat_model: "6764a75dfbd0e79d365310b2",
      image_upload_support: false,
      id: "111111",
      subscription_id: "677cb740d1a8c307c604057a",
      is_trial: true,
      tooltipContent: "",
      iconSrc:
        "https://chat-media-einstein.s3.amazonaws.com/image/bb0a7f16-55ed-459b-bef4-e002e64fc1ae.png",
      modelName: "static1",
      isCustomModel: true,
    },
    {
      name: "Static2",
      introtext: "",
      price: {},
      category: "gpt",
      url: "",
      logo: "https://chat-media-einstein.s3.amazonaws.com/image/01d8e03a-5296-4be2-aae1-11f6cda973f4.png",
      chat_model: "6764a75dfbd0e79d365310b2",
      image_upload_support: false,
      id: "22222",
      subscription_id: "677cb740d1a8c307c604057a",
      is_trial: true,
      tooltipContent: "",
      iconSrc:
        "https://chat-media-einstein.s3.amazonaws.com/image/01d8e03a-5296-4be2-aae1-11f6cda973f4.png",
      modelName: "static1",
      isCustomModel: true,
    },
  ];
  const [pinnedPlugins, setPinnedPlugins] = useState([...staticTool]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [showBorder, setShowBorder] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [removeToolSubsId, setRemoveToolSubsId] = useState(null);
  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [visibleDropdownId, setVisibleDropdownId] = useState<string | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [searchToolsData, setSearchToolsData] = useState<any>([]);
  const [height, setHeight] = useState(0);
  console.log("🚀 ~ height:", height);
  console.log("🚀 ~ searchToolsData:", searchToolsData);
  const [activeId, setActiveId] = useState(null);
  const [draggingItem, setDraggingItem] = useState<any>(null);

  // Api Call
  const { data: getUserToolsData, isLoading: getUserToolsLoading } =
    useGetUserToolsQuery(
      {}
      // { skip: !(auth?.user?.email && auth?.user?.fullname) }
    );
  const [UnsubscribeTool, isMutationLoading] = useUnsubscribeToolMutation();

  const [CreateEmptyChat] = useCreateEmptyChatMutation();
  const [GenerateDataTokenForTools] = useGenerateDataTokenForToolsMutation();

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight); // Get height after mount
    }
  }, [menuItems]);

  useEffect(() => {
    if (!menuOpen) {
      setShowBorder(false);
    } else {
      // setTimeout(() => {
      setShowBorder(true);
      // }, 300);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (getUserToolsData?.subscribed_tools?.length > 0) {
      const subscribedTools = getUserToolsData?.subscribed_tools?.map(
        (item: any) => ({
          ...item,
          id: item?.id,
          tooltipContent: item?.introtext,
          iconSrc: item?.logo,
          modelName: item?.name, // Retain for compatibility if needed
          isCustomModel: true,
        })
      );

      const pinnedIds = new Set(pinnedPlugins.map((ele: any) => ele?.id));

      const filteredSubscribedTools = subscribedTools.filter(
        (tool: any) =>
          !pinnedPlugins.some((plugin: any) => plugin.id === tool.id)
      );
      setMenuItems((prev: any) => {
        return [...filteredSubscribedTools];
      });
    }
  }, [getUserToolsLoading, getUserToolsData]);

  useEffect(() => {
    if (chat_id === "new") {
      handleCreateEmptyChat();
    } else {
      setChatId(chat_id);
    }
  }, [chat_id]);

  const handleCreateEmptyChat = () => {
    try {
      const data = {
        workspace_id: workspace_id_local,
        group_id: group_id ?? "",
        chat_title: "",
      };
      CreateEmptyChat(data).then((res) => {
        setChatId(res.data.chat_id);
      });
    } catch (error) {
      console.log("error:", error);
    }
  };

  // Generate token for custom tools
  const generateTokenForCustomTools = (model: any) => {
    const data = {
      tool_id: model?.id ?? "",
      chat_id: chatId,
      workspace_id: workspace_id_local,
      group_id: group_id,
      send_to_chat: true,
    };
    // if (model.category === "widget") {
    if (model.category === "plugin" || model.category === "widget") {
      showDraggableModal(model);
      return;
    }
    GenerateDataTokenForTools(data)
      .unwrap()
      .then((response) => {
        const token = response?.data ?? "";
        dispatch(setActiveChatModel({ ...model, token }));
      })
      .catch((error) => {
        // toast.error(error?.data?.message);
        console.log("#### Error #### ", error);
        dispatch(setActiveChatModel({ ...model, token: "" }));
      })
      .finally(() => {
        setMenuOpen(false);
      });
  };

  // Handle activating a modal/model
  const activeModalHandler = (model: any) => {
    setMenuOpen(false);
    if (model.category === "plugin" || model.category === "widget") {
      return showDraggableModal(model);
    }
    if (model?.isCustomModel) {
      generateTokenForCustomTools(model);
    } else {
      if (model?.modelName === "Auto select") {
        const randomSelectedModel = getRandomModel(menuItems);
        dispatch(setActiveChatModel(randomSelectedModel));
      } else {
        dispatch(setActiveChatModel(model));
      }
    }
  };

  function getRandomModel(menuItems: any) {
    // Filter out the "Auto select" model
    const filteredModels = menuItems.filter(
      (item: any) => item.modelName !== "Auto select"
    );

    // Get a random index within the filtered array length
    const randomIndex = Math.floor(Math.random() * filteredModels.length);

    // Return the randomly selected model
    return filteredModels[randomIndex];
  }

  const handleContextMenu = (e: any, toolId: any) => {
    e.preventDefault(); // Prevent default right-click menu
    setVisibleDropdownId(toolId);
  };

  const openCancelSubsModal = (model: any) => {
    console.log("🚀  openCancelSubsModal  model:", model);
    setRemoveToolSubsId(model);
    setIsConfirm(true);
  };

  const handleRemove = (id: any) => {
    try {
      UnsubscribeTool({ subscription_id: id })
        .unwrap()
        .then((response) => {
          toast.success(response?.message);
          setTimeout(() => {
            window.location.reload();
          }, 700);
        })
        .catch((error) => {
          toast.error(
            (error?.data?.detail ?? error?.message) || "Something went wrong"
          );
        });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    const item =
      menuItems.find((item: any) => item.id === event.active.id) ||
      pinnedPlugins.find((item: any) => item.id === event.active.id);
    setDraggingItem(item);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggingItem(null);

    if (active && over && active.id !== over.id) {
      const activeId = active.id;
      const overId = over.id;

      const oldIndexMenuItems = menuItems.findIndex(
        (item: any) => item.id === activeId
      );
      const newIndexMenuItems = menuItems.findIndex(
        (item: any) => item.id === overId
      );
      const oldIndexPinned = pinnedPlugins.findIndex(
        (item: any) => item.id === activeId
      );
      const newIndexPinned = pinnedPlugins.findIndex(
        (item: any) => item.id === overId
      );

      if (oldIndexMenuItems !== -1 && newIndexMenuItems !== -1) {
        setMenuItems(
          arrayMove(menuItems, oldIndexMenuItems, newIndexMenuItems)
        );
      } else if (oldIndexPinned !== -1 && newIndexPinned !== -1) {
        setPinnedPlugins(
          arrayMove(pinnedPlugins, oldIndexPinned, newIndexPinned)
        );
      } else if (oldIndexMenuItems !== -1 && newIndexPinned !== -1) {
        setMenuItems(
          menuItems.filter((_: any, index: any) => index !== oldIndexMenuItems)
        );
        setPinnedPlugins([...pinnedPlugins, menuItems[oldIndexMenuItems]]);
      } else if (oldIndexPinned !== -1 && newIndexMenuItems !== -1) {
        setPinnedPlugins(
          pinnedPlugins.filter((_, index) => index !== oldIndexPinned)
        );
        setMenuItems([...menuItems, pinnedPlugins[oldIndexPinned]]);
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
    >
      <div className="fixed right-4 top-[50%] translate-y-[-50%] flex items-end justify-end flex-col gap-3">
        <div
          className={`bg-[#272727] ${
            menuOpen ? "rounded-[25px]" : "rounded-[52px]"
          } min-h-[190px] h-fit mr-4`}
          style={{ zIndex: "99999999999" }}
        >
          <div className="flex items-start h-full">
            {menuOpen && (
              <div
                // className={`${
                //   menuOpen
                //     ? "animate-slideInFromRight"
                //     : "animate-slideOutToRight pointer-events-none"
                // } mt-3 ml-3 mb-3 h-[95%] min-h-[165px] w-[200px]`}
                className={`mt-3 ml-3 mb-3 h-[95%] min-h-[165px] w-[210px]`}
                style={{
                  borderRight:
                    searchText?.length > 0 &&
                    searchToolsData?.tools?.length >= 4 &&
                    showBorder
                      ? "1px solid #565656"
                      : "none",
                }}
              >
                <ToolsBox
                  menuItems={menuItems}
                  activeModalHandler={activeModalHandler}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  searchToolsData={searchToolsData}
                  setSearchToolsData={setSearchToolsData}
                  height={height}
                />
              </div>
            )}
            <div className="pt-3 pb-3">
              <div
                className="flex flex-col gap-3 pl-2 pr-2 items-center justify-between h-full"
                style={{
                  borderLeft:
                    (searchText?.length === 0 ||
                      searchToolsData?.tools?.length < 4) &&
                    showBorder
                      ? "1px solid #565656"
                      : "none",
                }}
              >
                <div
                  className="flex flex-col gap-3 items-center min-h-[135px]"
                  ref={divRef}
                >
                  <SortableContext
                    id="pinned-plugins"
                    items={pinnedPlugins.map((tool: any) => tool.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {pinnedPlugins?.length > 0
                      ? pinnedPlugins.map((tool: any) => {
                          return (
                            // <Tooltip
                            //   showArrow={true}
                            //   content={tool.modelName}
                            //   classNames={{
                            //     base: "before:bg-[#2F2F2F]",
                            //     content: "text-white bg-[#2F2F2F]",
                            //   }}
                            //   placement="left"
                            // >
                            <div
                              onContextMenu={(e) =>
                                handleContextMenu(e, tool.id)
                              }
                            >
                              <SortableAvatar
                                key={tool.id}
                                id={tool.id}
                                src={tool.logo}
                                alt={tool.modelName}
                                onClick={() => activeModalHandler(tool)}
                                category={tool.category}
                              />
                              <TogleBoxRightClick
                                tool={tool}
                                visibleDropdownId={visibleDropdownId}
                                setVisibleDropdownId={setVisibleDropdownId}
                                openCancelSubsModal={openCancelSubsModal}
                              />
                            </div>
                            // </Tooltip>
                            // <SortableAvatar
                            //   key={tool.id}
                            //   id={tool.id}
                            //   src={tool.iconSrc}
                            //   alt={tool.modelName}
                            //   onClick={() => activeModalHandler(tool)}
                            //   category={tool.category}
                            // />
                          );
                        })
                      : null}
                  </SortableContext>
                </div>
                <Avatar
                  onClick={() => setMenuOpen(!menuOpen)}
                  src={menuOpen ? "/svg/menuOpen.svg" : "/svg/more-Icon.svg"}
                  alt={"More Tools"}
                  showFallback={true}
                  radius="sm"
                  draggable={false}
                  className={`${classNames(
                    "w-[27px] h-[27px] bg-transparent cursor-pointer p-1"
                  )}`}
                  fallback={
                    <Image
                      src="/svg/user.svg"
                      alt="tools-logo-img"
                      width={50}
                      height={50}
                    />
                  }
                />
              </div>
            </div>
          
          </div>
        </div>
       
        <div
          className="relative flex justify-end"
          style={{ marginRight: menuItems?.length === 0 ? "17px" : "25px" }}
        >
          <button
            onClick={() => router.push("/marketplace")}
            className="bg-[#272727] text-white w-10 hover:w-[140px] absolute h-10 rounded-full flex hover:justify-start items-center justify-center overflow-hidden group transition-all duration-300"
            style={{ transformOrigin: "right center" }}
          >
            <span className="mb-[3px] whitespace-nowrap transition-all duration-300 group-hover:pl-4 text-[30px] text-[#CDCDCD]">
              +
            </span>
            <span className="absolute right-5 opacity-0 text-[14px] font-[500] group-hover:opacity-100 group-hover:translate-x-0 translate-x-[100%] whitespace-nowrap transition-all duration-300">
              Add AI Tools
            </span>
          </button>
        </div>

        <CancelSubscriptionModal
          isOpenCancelSubsModal={isOpenCancelSubsModal}
          setisOpenCancelSubsModal={(v: any) => setisOpenCancelSubsModal(v)}
          setIsConfirm={setIsConfirm}
          isConfirm={isConfirm}
          handleCancelSubscription={() => handleRemove(removeToolSubsId)}
          isMutationLoading={isMutationLoading}
        />
      </div>
      <DragOverlay>
        {draggingItem ? (
          <div className="drag-overlay">
            <img
              src={draggingItem.logo}
              alt={draggingItem.modelName}
              className="h-10 w-10 rounded-full"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const ToolsBox = ({
  menuItems,
  activeModalHandler,
  searchText,
  setSearchText,
  searchToolsData,
  setSearchToolsData,
  height,
}: any) => {
  const auth: any = useAuth();
  const router = useRouter();
  const SearchRightClickOption = useRef<any>(null);
  const [searchType, setSearchType] = useState("all");
  const [selectSearchTool, setSelectSearchTool] = useState<any>(null);
  const debouncedSearchTerm = useDebounce(searchText, 500);
  const [visibleDropdownId, setVisibleDropdownId] = useState<string | null>(
    null
  );
  const [isConfirm, setIsConfirm] = useState(false);
  const [removeToolSubsId, setRemoveToolSubsId] = useState(null);
  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const { data: toolsData, isFetching: toolsLoading } = useSearchToolsQuery({
    search: debouncedSearchTerm,
    page_number: "1",
    per_page: searchToolsData?.total_tools || 20,
    type: searchType,
    user_id: auth?.user?.userID,
  });
  const [UnsubscribeTool, isMutationLoading] = useUnsubscribeToolMutation();

  useEffect(() => {
    if (toolsData) {
      setSearchToolsData(toolsData);
    }
  }, [toolsData]);

  useEffect(() => {
    // Function to handle clicks outside the div
    function handleClickOutside(event: any) {
      if (
        SearchRightClickOption.current &&
        !SearchRightClickOption.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchHandler = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleContextMenu = (e: any, toolId: any) => {
    e.preventDefault(); // Prevent default right-click menu
    setVisibleDropdownId(toolId);
  };

  const openCancelSubsModal = (model: any) => {
    console.log("🚀  openCancelSubsModal  model:", model);
    setRemoveToolSubsId(model);
    setIsConfirm(true);
  };

  const handleRemove = (id: any) => {
    try {
      UnsubscribeTool({ subscription_id: id })
        .unwrap()
        .then((response) => {
          toast.success(response?.message);
          setTimeout(() => {
            window.location.reload();
          }, 700);
        })
        .catch((error) => {
          toast.error(
            (error?.data?.detail ?? error?.message) || "Something went wrong"
          );
        });
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const OnRightclickPinned = (tool: any) => {
    console.log("tool: ", tool);
  };

  const handleContextMenuSearch = (e: any, tool: any) => {
    e.preventDefault(); // Prevent the default context menu
    setMenuOpen(true);
    setSelectSearchTool(tool);
  };

  return (
    <div className="h-full">
      <div
        className="relative bg-[#1B1C1e] flex gap-1 items-center rounded-lg w-[95%] h-[24px] px-2 z-[2] mb-3"
        style={{ border: "1px solid #303030" }}
      >
        <Image
          src={"/svg/search.svg"}
          alt="search-img"
          width={12}
          height={12}
          fallbackSrc="/svg/search.svg"
          radius="none"
        />
        <input
          placeholder="Search plugins & models..."
          value={searchText}
          className="text-white placeholder:text-[#71716C] placeholder:font-bold !text-[10px] font-helvetica w-full bg-transparent outline-none rounded font-medium 2xl:text-base  leading-normal"
          name="search"
          onChange={searchHandler}
        />
      </div>
      {searchText.length === 0 ? (
        <SortableContext
          id="menu-items"
          items={menuItems.map((tool: any) => tool.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="grid grid-cols-4 gap-y-3 pr-3">
            {menuItems?.length > 0 ? (
              menuItems
                // ?.filter(
                //   (tool: any) => !menuItems.some((mi: any) => mi.id === tool.id)
                // )
                ?.map((tool: any) => (
                  // <Tooltip
                  //   showArrow={true}
                  //   content={tool.modelName}
                  //   classNames={{
                  //     base: "before:bg-[#2F2F2F]",
                  //     content: "text-white bg-[#2F2F2F]",
                  //   }}
                  //   placement="bottom"
                  // >
                  <div
                    onContextMenu={(e) => handleContextMenu(e, tool.id)}
                    className="flex flex-col items-center"
                  >
                    {/* <Avatar
                        key={tool.id}
                        src={tool.logo}
                        alt={tool.name}
                        showFallback={true}
                        draggable={false}
                        onClick={() => activeModalHandler(tool)}
                        className={`${
                          tool.category === "model" || tool.category === "gpt"
                            ? "rounded-md"
                            : ""
                        } h-[36px] w-[36px] bg-transparent cursor-pointer animate-flip-up`}
                        fallback={
                          <Image
                            src="/svg/user.svg"
                            alt="tools-logo-img"
                            width={50}
                            height={50}
                          />
                        }
                      /> */}
                    <SortableAvatar
                      key={tool.id}
                      id={tool.id}
                      src={tool.logo}
                      alt={tool.modelName}
                      onClick={() => activeModalHandler(tool)}
                      category={tool.category}
                    />
                    <div className="text-white text-[8px] ">
                      {tool.modelName?.length > 10
                        ? `${tool.modelName.slice(0, 7)}...` // Show 7 characters plus ellipsis
                        : tool.modelName}
                    </div>
                    <TogleBoxRightClick
                      tool={tool}
                      visibleDropdownId={visibleDropdownId}
                      setVisibleDropdownId={setVisibleDropdownId}
                      openCancelSubsModal={openCancelSubsModal}
                    />
                  </div>
                  // </Tooltip>
                ))
            ) : (
              <div
                className="flex justify-center items-center text-[9px] ml-0 w-full text-[#858584] gap-1"
                style={{
                  width: "max-content",
                  marginLeft: "30px",
                  marginTop: "45px",
                }}
              >
                {/* {auth?.user?.email && ( */}
                <Link href={`/marketplace`}>
                  <EarthIcon className="text-[#858584]" />
                  <span className="text-[#858584] text-sm	font-regular	font-helvetica ml-1">
                    Explore AI Tools
                  </span>
                </Link>
                {/* )} */}
              </div>
            )}
          </div>
        </SortableContext>
      ) : (
        <div>
          <div className="mb-2 flex gap-1">
            <div
              className={`spb-btn ${
                searchType === "all" ? "spb-btn-active" : ""
              }`}
              onClick={() => setSearchType("all")}
            >
              All
            </div>
            <div
              className={`spb-btn ${
                searchType === "user" ? "spb-btn-active" : ""
              }`}
              onClick={() => setSearchType("user")}
            >
              Your Tools
            </div>
            <div
              className={`spb-btn ${
                searchType === "community" ? "spb-btn-active" : ""
              }`}
              onClick={() => setSearchType("community")}
            >
              Community
            </div>
          </div>

          <div
            className={`relative overflow-scroll max-h-[680px]`}
            style={{
              scrollbarWidth: "none",
              height: height > 275 ? height - 20 + "px" : "350px",
            }}
          >
            {!toolsLoading ? (
              searchToolsData?.tools?.length > 0 ? (
                searchToolsData?.tools?.map((model: any) => {
                  return (
                    <div
                      ref={SearchRightClickOption}
                      onContextMenu={(e) => handleContextMenuSearch(e, model)}
                      key={model.id}
                      onClick={() =>
                        router.push(
                          `/marketplace/tools-details?tool_id=${model.id}`
                        )
                      }
                      className="items-center w-[94%] mb-2 relative flex gap-2 hover:bg-[#434343] px-[5px] py-[5px] rounded-[4px] cursor-pointer group"
                    >
                      <div>
                        <Avatar
                          src={model.logo}
                          alt={model.modelName}
                          showFallback={true}
                          radius="sm"
                          className={classNames("bg-transparent")}
                          fallback={
                            <Image
                              src="/svg/user.svg"
                              alt="tools-logo-img"
                              width={50}
                              height={50}
                            />
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-[10px] font-bold text-white">
                          {model.modelName || model.name}
                        </div>
                        <div className="text-[10px] font-normal text-[#BABABA]">
                          {model?.introtext?.length > 0
                            ? model.introtext.length > 22
                              ? `${model.introtext.slice(0, 22)}...`
                              : model.introtext
                            : model?.tooltipContent?.length > 22
                            ? `${model.tooltipContent.slice(0, 22)}...`
                            : model.tooltipContent}
                        </div>
                        <div className="flex gap-2.5 text-[10px] font-normal text-[#BABABA]">
                          <div
                            className=""
                            style={{
                              textTransform: "capitalize",
                            }}
                          >
                            {model.category ? model.category : "NotFound"}
                          </div>
                          <div className="flex items-center gap-1">
                            4.7{" "}
                            <Image
                              src={"/svg/rating.svg"}
                              alt="profile-pic"
                              width={12}
                              height={12}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            1.1m
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="9"
                              height="9"
                              viewBox="0 0 9 12"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.72218 8.28468L8.85735 8.92673C8.98544 9.48182 8.85896 10.0651 8.51247 10.5173C8.16598 10.9695 7.63567 11.2433 7.06637 11.264H1.83988C1.27058 11.2433 0.74027 10.9695 0.393778 10.5173C0.0472852 10.0651 -0.0791864 9.48182 0.0489041 8.92673L0.184072 8.28468C0.339535 7.41554 1.08667 6.77682 1.96941 6.75841H6.93684C7.81958 6.77682 8.56672 7.41554 8.72218 8.28468ZM7.06637 10.4136C7.35236 10.4103 7.6215 10.2778 7.79853 10.0531V10.0588C8.01575 9.78628 8.10038 9.43123 8.02944 9.09006L7.89428 8.44801C7.81928 7.9722 7.41817 7.61592 6.93684 7.59758H1.96942C1.48809 7.61592 1.08697 7.9722 1.01198 8.44801L0.876809 9.09006C0.807623 9.42943 0.892164 9.78203 1.10772 10.0531C1.28475 10.2778 1.55389 10.4103 1.83988 10.4136H7.06637Z"
                                fill="#E8E8E8"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M4.73472 5.632H4.17152C2.92733 5.632 1.91872 4.62339 1.91872 3.37921V1.89236C1.91722 1.39002 2.11611 0.907818 2.47132 0.552607C2.82653 0.197396 3.30873 -0.00149334 3.81107 8.44331e-06H5.09516C5.59751 -0.00149334 6.07971 0.197396 6.43492 0.552607C6.79013 0.907818 6.98902 1.39002 6.98751 1.89236V3.37921C6.98751 4.62339 5.9789 5.632 4.73472 5.632ZM3.81107 0.844808C3.23252 0.844808 2.76352 1.31381 2.76352 1.89236V3.37921C2.76352 4.15682 3.3939 4.7872 4.17152 4.7872H4.73472C5.51233 4.7872 6.14271 4.15682 6.14271 3.37921V1.89236C6.14271 1.61453 6.03235 1.34808 5.83589 1.15163C5.63944 0.955175 5.37299 0.844808 5.09516 0.844808H3.81107Z"
                                fill="#E8E8E8"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {selectSearchTool?.id === model?.id && (
                        <RightClickSearchPlugin
                          setMenuOpen={setMenuOpen}
                          menuOpen={menuOpen}
                          selectSearchTool={selectSearchTool}
                          setSearchText={setSearchText}
                          OnRightclickPinned={OnRightclickPinned}
                          activeModalHandler={activeModalHandler}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-[250px]">
                  <p className="text-[11px] text-[#AAAAAA] text-center font-medium">
                    No plugin or model matched
                  </p>
                </div>
              )
            ) : (
              <div>
                {Array.from({ length: 3 }, (i: any) => i + 1).map((key) => (
                  <div key={key} className="col-span-4 mt-3">
                    <Skeleton className="w-[94%] rounded-md">
                      <section className="h-[53px]"></section>
                    </Skeleton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <CancelSubscriptionModal
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        setisOpenCancelSubsModal={(v: any) => setisOpenCancelSubsModal(v)}
        setIsConfirm={setIsConfirm}
        isConfirm={isConfirm}
        handleCancelSubscription={() => handleRemove(removeToolSubsId)}
        isMutationLoading={isMutationLoading}
      />
    </div>
  );
};

const SortableAvatar = ({ id, src, alt, onClick, category }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Tooltip
        showArrow={true}
        content={alt}
        classNames={{
          base: "before:bg-[#2F2F2F]",
          content: "text-white bg-[#2F2F2F]",
        }}
        placement="left"
      >
        <div onClick={onClick}>
          <Avatar
            src={src}
            alt={alt}
            showFallback={true}
            radius="sm"
            draggable={false}
            className={`${
              category == "model" || category == "gpt" ? "rounded-full" : ""
            } ${classNames("h-[36px] w-[36px] bg-transparent cursor-pointer")}`}
            fallback={
              <Image
                src="/svg/user.svg"
                alt="tools-logo-img"
                width={50}
                height={50}
              />
            }
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default PluginMenu;
