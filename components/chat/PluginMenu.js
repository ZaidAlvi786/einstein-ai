"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  cn,
  Link,
  Skeleton,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import PluginToggle from "@/app/assets/svg/plugin-toggle.svg";
import SearchIcon from "@/app/assets/svg/search-modal.svg";
import useBoolean from "@/app/hooks/useBoolean";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setActiveChatModel } from "@/app/lib/features/chat/chatSlice";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";
import {
  useCreateEmptyChatMutation,
  useGenerateDataTokenForToolsMutation,
  useGetUserToolsQuery,
  useSearchToolsForAllCategoryQuery,
  useSearchToolsQuery,
  useUnsubscribeToolMutation,
} from "@/app/lib/features/chat/chatApi";
import { useAuth } from "@/app/authContext/auth";
import classNames from "classnames";
import MinusIcon from "@/app/assets/svg/close-icon.svg";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay, // Import DragOverlay
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RightClickSearchPlugin from "./RightClickSearchPlugin";
// import { Switch } from "antd";
import ToastService from "../Toaster/toastService";
import toast from "react-hot-toast";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import InformationCircleIcon from "@/app/assets/svg/Information-circle-icon.svg";
import PinIcon from "@/app/assets/svg/pin.svg";
import TrashIcon from "@/app/assets/svg/trash-icon.svg";
import { useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/app/hooks/useDebounce";
import CancelSubscriptionModal from "../billing/CancelSubscriptionModal";
import EarthIcon from "@/app/assets/svg/earth.svg";

// Define your menu items
const menuItems1 = [
  {
    id: 1,
    tooltipContent: "Auto selects the best model for you (coming soon!)",
    iconSrc: "/models/auto.png",
    modelName: "BananaClip",
  },
  {
    id: 6,
    tooltipContent: "Great for quick responses",
    iconSrc: "/models/mistral.png",
    modelName: "mistral",
    modelValue: "mistral",
  },
  {
    id: 7,
    tooltipContent: "Collect your thoughts with Claude",
    iconSrc: "/models/claude.png",
    modelName: "claude",
    modelValue: "claude",
  },
  // Additional items can be added here
];

const menuItems2 = [
  {
    id: 5,
    tooltipContent: "Great for quick and concise answers",
    iconSrc: "/models/gpt3.png",
    modelName: "gpt3",
    modelValue: "gpt3",
  },

  {
    id: 2,
    tooltipContent: "OpenAI’s top model, great with writing and math",
    iconSrc: "/models/gpt4.png",
    modelName: "gpt4",
    modelValue: "gpt4",
  },
  {
    id: 3,
    tooltipContent: "Googles top model, great with writing and math",
    iconSrc: "/models/gemini.png",
    modelName: "gemini",
    modelValue: "gemini",
  },
  {
    id: 4,
    tooltipContent: "Has access to the internet and is always up to date",
    iconSrc: "/models/perplexity.png",
    modelName: "perplexity",
    modelValue: "perplexity",
  },

  // Additional items can be added here
];

function getRandomModel(menuItems) {
  // Filter out the "Auto select" model
  const filteredModels = menuItems.filter(
    (item) => item.modelName !== "Auto select"
  );

  // Get a random index within the filtered array length
  const randomIndex = Math.floor(Math.random() * filteredModels.length);

  // Return the randomly selected model
  return filteredModels[randomIndex];
}

const LONG_PRESS_DURATION = 500;

// Sortable Item Component
const SortableItem = ({
  model,
  onClick,
  onRemove,
  isEditing,
  handleMouseDown,
  handleMouseUp,
  handleTouchStart,
  handleTouchEnd,
  menuItems,
  pinnedPlugins,
  setMenuItems,
  setPinnedPlugins,
  MAX_PINNED_PLUGINS,
  OnRightclickPinned,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: model.id });
  const [visible, setVisible] = useState(false); // State to control dropdown visibility
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for dropdown positioning
  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [removeToolSubsId, setRemoveToolSubsId] = useState(null);
  const openCancelSubsModal = (model) => {
    console.log("🚀  openCancelSubsModal  model:", model);
    setRemoveToolSubsId(model);
    setIsConfirm(true);
  };
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent default right-click menu
    setAnchorEl({ top: e.clientY, left: e.clientX }); // Set the dropdown position based on mouse position
    setVisible(true); // Show dropdown
  };

  // Close the dropdown
  const closeDropdown = () => {
    setVisible(false);
  };

  const handlePinToToglBar = (model, way) => {
    console.log("model: ", model);
    if ((way = "Pin to Toglbar")) {
      if (pinnedPlugins?.length >= MAX_PINNED_PLUGINS) {
        toast.error("Max limit of pinned plugins reached!");
      } else {
        const removeFromTogleBox = menuItems.filter(
          (item) => item.id !== model.id
        );
        setMenuItems([...removeFromTogleBox]);
        localStorage.setItem(
          "menuItemsOrder",
          JSON.stringify([...removeFromTogleBox])
        );
        setPinnedPlugins([...pinnedPlugins, model]);
        localStorage.setItem(
          "pinnedItemsOrder",
          JSON.stringify([...pinnedPlugins, model])
        );
      }
    }
  };

  const createMultipleQueryString = useCallback(
    (paramsToUpdate) => {
      const newParams = new URLSearchParams(searchParams);

      Object.keys(paramsToUpdate).forEach((param) => {
        newParams.set(param, paramsToUpdate[param]);
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const navigateToolDetailsPage = (model) => {
    router.push(
      "/marketplace/tools-details" +
        "?" +
        createMultipleQueryString({ tool_id: model.id })
    );
  };

  const isToolFromStatic = (model) => {
    const isStaticFrom1 = menuItems1.some((item) => item.id === model.id);
    const isStaticFrom2 = menuItems2.some((item) => item.id === model.id);
    return isStaticFrom1 || isStaticFrom2;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditing ? listeners : {})}
      className="relative "
    >
      <Tooltip
        showArrow={true}
        content={model.modelName}
        classNames={{
          base: "before:bg-[#2F2F2F]",
          content: "text-white bg-[#2F2F2F]",
        }}
      >
        <div
          className="2xl:h-[36px] 2xl:w-[36px] xl:h-[36px] xl:w-[36px] h-[36px] w-[36px] "
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onContextMenu={handleContextMenu} // Right-click event handler
        >
          <Avatar
            src={model.iconSrc}
            alt={model.modelName}
            showFallback={true}
            radius="sm"
            className={`${
              model.category == "model" || model.category == "gpt"
                ? "rounded-full"
                : ""
            } ${classNames(
              "2xl:h-[36px] 2xl:w-[36px] xl:h-[36px] shadow-custom xl:w-[36px] h-[36px] w-[36px] bg-transparent"
              // {
              //   pendulum: isEditing, // Apply pendulum animation when editing
              // }
            )}`}
            onClick={() => {
              if (isEditing) {
                // Prevent click during edit mode
                return;
              }
              onClick();
            }}
            fallback={
              <Image
                src="/svg/user.svg"
                alt="tools-logo-img"
                width={50}
                height={50}
              />
            }
          />
          {/* Uncomment and adjust if you want to show the remove button during editing
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(model.id);
              }}
              className="absolute top-[-4px] right-[-9px] bg-red-500 rounded-full p-1 hover:bg-red-600 h-[15px] w-[15px] flex justify-center items-center"
            >
              <MinusIcon /> 
            </button>
          )} */}
          <Dropdown
            classNames={{
              content:
                "py-[11px] px-[8px] rounded-[12px] bg-[#2F2F2F] min-w-[203px] min-h-[55px]",
            }}
            isOpen={visible}
            onClose={closeDropdown}
          >
            <DropdownTrigger>
              <button></button>
            </DropdownTrigger>
            <DropdownMenu
              classNames={{
                list: "gap-[13px]",
              }}
              aria-label="Dynamic Actions"
            >
              {!isToolFromStatic(model) && (
                <DropdownItem
                  classNames={{
                    base: "flex items-center gap-[8px] px-4 py-2 rounded-md cursor-pointer text-white", // Base styles for all items
                    hover: "bg-[#505050]", // Hover effect
                    focus: "outline-none bg-[#3D3D3D]", // Focus effect
                  }}
                  key="action1"
                  onClick={() => navigateToolDetailsPage(model)}
                >
                  <div className="flex items-center gap-[8px]">
                    <span className="w-[24px] h-[24px]">
                      <InformationCircleIcon width={24} height={24} />
                    </span>
                    <span className="text-[#fff] text-[14px] font-normal">
                      View Details
                    </span>
                  </div>
                </DropdownItem>
              )}
              <DropdownItem
                key="action2"
                // onClick={() => handlePinToToglBar(model, "Pin to Toglbar")}
                onClick={() => OnRightclickPinned(model)}
              >
                <div className="flex items-center gap-[8px]">
                  <span className="w-[24px] h-[24px]">
                    <PinIcon width={24} height={24} fill="#fff" />
                  </span>
                  <span className="text-[#fff] text-[14px] font-normal">
                    Pin to Toglbar
                  </span>
                </div>
              </DropdownItem>
              {model?.subscription_id && (
                <DropdownItem
                  key="action3"
                  onClick={() => openCancelSubsModal(model?.subscription_id)}
                >
                  <div className="flex items-center gap-[8px]">
                    <span className="w-[24px] h-[24px]">
                      <TrashIcon width={24} height={24} />
                    </span>
                    <span className="text-[#E54637] text-[14px] font-normal">
                      Remove Tool
                    </span>
                  </div>
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </Tooltip>
      <CancelSubscriptionModal
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        setisOpenCancelSubsModal={(v) => setisOpenCancelSubsModal(v)}
        setIsConfirm={setIsConfirm}
        isConfirm={isConfirm}
        handleCancelSubscription={() => onRemove(removeToolSubsId)}
        isMutationLoading={false}
      />
    </div>
  );
};

const PluginMenu = ({ showDraggableModal, messages }) => {
  const auth = useAuth();
  const containerRef = useRef();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  // const [menuItems, setMenuItems] = useState([...menuItems1]);
  const [menuItems, setMenuItems] = useState([]);
  console.log("menuItems: ", menuItems);
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectSearchTool, setSelectSearchTool] = useState(null);
  const debouncedSearchTerm = useDebounce(searchText, 500);
  const [searchType, setSearchType] = useState("all");

  useEffect(() => {
    if (messages?.status_code && messages?.status_code === 402) {
      const removedTrialToolBox = menuItems?.filter(
        (item) => item.id !== messages.tool_id
      );
      const removedTrialToolPin = pinnedPlugins?.filter(
        (item) => item.id !== messages.tool_id
      );
      setPinnedPlugins([...removedTrialToolPin]);
      setMenuItems([...removedTrialToolBox]);
    }
  }, [messages]);

  const handleContextMenu = (e, tool) => {
    e.preventDefault(); // Prevent the default context menu
    setPosition({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
    setSelectSearchTool(tool);
  };

  const {
    value: shouldShowPlugins,
    toggle: toggleShowPlugin,
    setTrue: closeShowPlugin,
  } = useBoolean(true);
  const activeChatModel = useAppSelector((state) => state.chat.activeChatModel);
  const { data: getUserToolsData, isLoading: getUserToolsLoading } =
    useGetUserToolsQuery(
      {},
      { skip: !(auth?.user?.email && auth?.user?.fullname) }
    );

  const [GenerateDataTokenForTools] = useGenerateDataTokenForToolsMutation();

  // const [pinnedPlugins, setPinnedPlugins] = useState([...menuItems2]);
  const [pinnedPlugins, setPinnedPlugins] = useState([]);

  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [animatePuddle, setAnimatePuddle] = useState(false);
  const [pluginmenuAnimation, setpluginmenuAnimation] = useState(false);
  const ignoreClickOutside = useRef(false); // Flag to ignore onClickOutside
  const isLongPress = useRef(false); // Flag to prevent onClick during long press

  const ignoreClickOutsideLower = useRef(false); // Flag to ignore onClickOutside for the lower card
  const isLongPressLower = useRef(false); // Flag to prevent onClick during long press for the lower card
  const longPressTimeoutLower = useRef(null);
  const router = useRouter();
  const [searchToolsData, setSearchToolsData] = useState([]);

  const [UnsubscribeTool, isMutationLoading] = useUnsubscribeToolMutation();
  const [CreateEmptyChat] = useCreateEmptyChatMutation();
  const [chatId, setChatId] = useState(null);
  const searchParams = useSearchParams();
  const chat_id = searchParams.get("chat");
  const group_id = searchParams.get("group");
  const workspace_id_local = localStorage.getItem("workspace_id");

  // Memoized filtered menu items based on search text
  const searchedMenuItems = useMemo(() => {
    return menuItems.filter((item) =>
      item.modelName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [menuItems, searchText]);

  const searchHandler = (e) => {
    setSearchText(e.target.value);
    setIsEditing(false);
  };

  useEffect(() => {
    if (shouldShowPlugins) {
      setAnimatePuddle(true);
      // Reset animation state after a short delay
      const timer = setTimeout(() => setAnimatePuddle(false), 600); // Match the animation duration
      return () => clearTimeout(timer); // Cleanup on unmount or re-run
    }
  }, [shouldShowPlugins]);

  // const { data: toolsData, isLoading: toolsLoading } =
  //   useSearchToolsForAllCategoryQuery({
  //     // page_number: currentPage,
  //     // per_page: 6,
  //     search: debouncedSearchTerm,
  //   });

  const { data: toolsData, isFetching: toolsLoading } = useSearchToolsQuery({
    search: debouncedSearchTerm,
    page_number: "1",
    per_page: searchToolsData?.total_tools || 20,
    type: searchType,
    user_id: auth?.user?.userID,
  });

  useEffect(() => {
    if (toolsData) {
      setSearchToolsData(toolsData);
    }
  }, [toolsData]);

  // Load order from localStorage on mount
  useEffect(() => {
    const savedMenuItemsOrder = localStorage.getItem("menuItemsOrder");
    const savedPinnedItemsOrder = localStorage.getItem("pinnedItemsOrder");

    if (savedMenuItemsOrder && savedMenuItemsOrder !== "undefined") {
      setMenuItems(JSON.parse(savedMenuItemsOrder));
    }
    if (savedPinnedItemsOrder && savedPinnedItemsOrder !== "undefined") {
      setPinnedPlugins(JSON.parse(savedPinnedItemsOrder));
    }
  }, []);

  // Update menu items with subscribed tools
  // useEffect(() => {
  //   if (getUserToolsData?.subscribed_tools?.length > 0) {
  //     const subscribedTools = getUserToolsData?.subscribed_tools?.map(
  //       (item) => ({
  //         ...item,
  //         id: item?.id,
  //         tooltipContent: item?.introtext,
  //         iconSrc: item?.logo,
  //         modelName: item?.name,
  //         isCustomModel: true,
  //       })
  //     );

  //     const pinnedModalName = new Set(
  //       pinnedPlugins.map((ele) => ele?.modelName?.toLowerCase())
  //     );

  //     const filteredSubscribedTools = subscribedTools.filter(
  //       (tool) =>
  //         !pinnedPlugins.some(
  //           (plugin) =>
  //             plugin.id === tool.id || plugin.modelName === tool.modelName
  //         )
  //     );
  //     console.log("filteredSubscribedTools: ", filteredSubscribedTools);
  //     console.log("pinnedPlugins: ", pinnedPlugins);

  //     console.log(filteredSubscribedTools);

  //     // Update the menu items
  //     setMenuItems((prev) => {
  //       // Create a set of model names already in the menu
  //       const existingModelNames = new Set(
  //         prev.map((ele) => ele?.modelName?.toLowerCase())
  //       );

  //       return [
  //         // Only keep `prev` items that are not part of `pinnedPlugins`
  //         ...prev.filter(
  //           (item) => !pinnedModalName.has(item?.modelName?.toLowerCase())
  //         ),
  //         // Add new items from filteredSubscribedTools
  //         ...filteredSubscribedTools.filter((item) => {
  //           const modelNameLower = item?.modelName?.toLowerCase();

  //           if (
  //             !existingModelNames.has(modelNameLower) &&
  //             !pinnedModalName.has(modelNameLower)
  //           ) {
  //             existingModelNames.add(modelNameLower);
  //             return true;
  //           }

  //           return false;
  //         }),
  //       ];
  //     });
  //     // setMenuItems((prev) => {
  //     //   const existingModelNames = new Set(
  //     //     prev.map((ele) => ele?.modelName?.toLowerCase())
  //     //   );
  //     //   console.log("existingModelNames: ", existingModelNames);

  //     //   return [
  //     //     ...prev,
  //     //     ...filteredSubscribedTools?.filter((item) => {
  //     //       const modelNameLower = item?.modelName?.toLowerCase();

  //     //       if (
  //     //         !existingModelNames.has(modelNameLower) &&
  //     //         !pinnedModalName.has(modelNameLower)
  //     //       ) {
  //     //         existingModelNames.add(modelNameLower);
  //     //         return true;
  //     //       }

  //     //       return false;
  //     //     }),
  //     //   ];
  //     // });
  //   }
  // }, [getUserToolsLoading, getUserToolsData, pinnedPlugins]);

  useEffect(() => {
    if (getUserToolsData?.subscribed_tools?.length > 0) {
      const subscribedTools = getUserToolsData?.subscribed_tools?.map(
        (item) => ({
          ...item,
          id: item?.id,
          tooltipContent: item?.introtext,
          iconSrc: item?.logo,
          modelName: item?.name, // Retain for compatibility if needed
          isCustomModel: true,
        })
      );

      const pinnedIds = new Set(pinnedPlugins.map((ele) => ele?.id));

      const filteredSubscribedTools = subscribedTools.filter(
        (tool) => !pinnedPlugins.some((plugin) => plugin.id === tool.id)
      );

      console.log("filteredSubscribedTools: ", filteredSubscribedTools);
      console.log("pinnedPlugins: ", pinnedPlugins);

      // Update the menu items
      // setMenuItems((prev) => {
      //   // Create a set of IDs already in the menu
      //   const existingIds = new Set(prev.map((ele) => ele?.id));

      //   return [
      //     // Only keep `prev` items that are not part of `pinnedPlugins`
      //     ...prev.filter((item) => !pinnedIds.has(item?.id)),
      //     // Add new items from filteredSubscribedTools
      //     ...filteredSubscribedTools.filter((item) => {
      //       if (!existingIds.has(item?.id) && !pinnedIds.has(item?.id)) {
      //         existingIds.add(item?.id);
      //         return true;
      //       }
      //       return false;
      //     }),
      //   ];
      // });
      setMenuItems((prev) => {
        // Create a set of IDs already in the menu
        const existingIds = new Set(prev.map((ele) => ele?.id));

        return [...filteredSubscribedTools];
      });
    }
  }, [getUserToolsLoading, getUserToolsData, pinnedPlugins]);

  // Set default active chat model if none is active
  useEffect(() => {
    if (Object.keys(activeChatModel)?.length <= 0 && pinnedPlugins.length > 1) {
      dispatch(setActiveChatModel(pinnedPlugins[0]));
    } else if (
      Object.keys(activeChatModel)?.length <= 0 &&
      menuItems.length > 1
    ) {
      dispatch(setActiveChatModel(menuItems[0]));
    }
  }, [activeChatModel, menuItems, dispatch]);

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
  const generateTokenForCustomTools = (model) => {
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
        closeShowPlugin();
      });
  };

  // Handle activating a modal/model
  const activeModalHandler = (model) => {
    if (model.category === "plugin" || model.category === "widget") {
      closeShowPlugin();
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
      if (!shouldShowPlugins) {
        toggleShowPlugin();
      }
    }
  };

  // Handle click outside to close edit mode and plugin modal
  useOnClickOutside(containerRef, () => {
    setMenuOpen(false);
    if (ignoreClickOutside.current) return;

    if (isEditing) {
      setIsEditing(false);
    } else {
      closeShowPlugin();
      setSearchText("");
    }
  });

  const MAX_PINNED_PLUGINS = 4; // Set the max limit for pinned plugins
  const MIN_PINNED_PLUGINS = 1;

  // dnd-kit Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      // coordinateGetter: sortableKeyboardCoordinates,
      coordinateGetter: { distance: 10 },
    })
  );

  // Drag state for DragOverlay
  const [activeId, setActiveId] = useState(null);
  const activeItem = useMemo(() => {
    return (
      menuItems.find((item) => item.id === activeId) ||
      pinnedPlugins.find((item) => item.id === activeId)
    );
  }, [activeId, menuItems, pinnedPlugins]);

  // Handle drag start event
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null); // Reset activeId

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Determine source and destination lists
    const sourceList = menuItems.find((item) => item.id === activeId)
      ? "menuItems"
      : "pinnedPlugins";
    const destinationList = menuItems.find((item) => item.id === overId)
      ? "menuItems"
      : "pinnedPlugins";

    // Max pinned plugins check
    if (
      pinnedPlugins.length >= MAX_PINNED_PLUGINS &&
      sourceList === "menuItems" &&
      destinationList === "pinnedPlugins"
    ) {
      toast.error("Too many tools pinned in your togl bar");
      return;
    }

    if (
      pinnedPlugins.length <= MIN_PINNED_PLUGINS &&
      sourceList === "pinnedPlugins" &&
      destinationList === "menuItems"
    ) {
      toast.error(
        // `At least ${MIN_PINNED_PLUGINS} pinned plugins required!`
        `At least ${MIN_PINNED_PLUGINS} tool must be pinned in your togl bar`
      );
      return;
    }

    if (sourceList === destinationList) {
      // Reordering within the same list
      if (sourceList === "menuItems") {
        const oldIndex = menuItems.findIndex((item) => item.id === activeId);
        const newIndex = menuItems.findIndex((item) => item.id === overId);
        const reordered = arrayMove(menuItems, oldIndex, newIndex);
        setMenuItems(reordered);
        localStorage.setItem("menuItemsOrder", JSON.stringify(reordered));
      } else {
        const oldIndex = pinnedPlugins.findIndex(
          (item) => item.id === activeId
        );
        const newIndex = pinnedPlugins.findIndex((item) => item.id === overId);
        const reordered = arrayMove(pinnedPlugins, oldIndex, newIndex);
        setPinnedPlugins(reordered);
        localStorage.setItem("pinnedItemsOrder", JSON.stringify(reordered));
      }
    } else {
      // Moving between lists
      let movingItem;
      if (sourceList === "menuItems") {
        movingItem = menuItems.find((item) => item.id === activeId);
        const newMenu = menuItems.filter((item) => item.id !== activeId);
        setMenuItems(newMenu);
        localStorage.setItem("menuItemsOrder", JSON.stringify(newMenu));

        if (pinnedPlugins.length >= MAX_PINNED_PLUGINS) {
          toast.error("Max limit of pinned plugins reached!");
          return;
        }

        const newPinned = [...pinnedPlugins];
        const overIndex = pinnedPlugins.findIndex((item) => item.id === overId);
        newPinned.splice(overIndex + 1, 0, movingItem);
        setPinnedPlugins(newPinned);
        localStorage.setItem("pinnedItemsOrder", JSON.stringify(newPinned));
      } else {
        movingItem = pinnedPlugins.find((item) => item.id === activeId);
        const newPinned = pinnedPlugins.filter((item) => item.id !== activeId);
        setPinnedPlugins(newPinned);
        localStorage.setItem("pinnedItemsOrder", JSON.stringify(newPinned));

        const newMenu = [...menuItems];
        const overIndex = menuItems.findIndex((item) => item.id === overId);
        newMenu.splice(overIndex + 1, 0, movingItem);
        setMenuItems(newMenu);
        localStorage.setItem("menuItemsOrder", JSON.stringify(newMenu));
      }
    }
  };

  const OnRightclickPinned = (tool) => {
    const tool_id = tool?.id;

    if (!tool_id) return;

    // Check if the tool is already in the pinned plugins
    const isPinned = pinnedPlugins.find((item) => item.id === tool_id);

    // Max pinned plugins check
    if (pinnedPlugins.length >= MAX_PINNED_PLUGINS && !isPinned) {
      toast.error("Too many tools pinned in your togl bar");
      return;
    }

    // Moving the item from menuItems to pinnedPlugins
    const movingItem = menuItems.find((item) => item.id === tool_id);

    if (movingItem) {
      // Remove the item from menuItems
      const updatedMenuItems = menuItems.filter((item) => item.id !== tool_id);
      setMenuItems(updatedMenuItems);
      localStorage.setItem("menuItemsOrder", JSON.stringify(updatedMenuItems));

      // Add the item to pinnedPlugins
      const updatedPinnedPlugins = [...pinnedPlugins, movingItem];
      setPinnedPlugins(updatedPinnedPlugins);
      localStorage.setItem(
        "pinnedItemsOrder",
        JSON.stringify(updatedPinnedPlugins)
      );
    } else {
      toast.error("Tool is already pinned.");
    }
    setSearchText("");
  };

  // Long press detection for upper plugins
  const longPressTimeout = useRef(null);

  const handleMouseDown = useCallback(() => {
    longPressTimeout.current = setTimeout(() => {
      setIsEditing(true);
      isLongPress.current = true;
      ignoreClickOutside.current = true;
      // Reset the ignore flag after a short delay
      setTimeout(() => {
        ignoreClickOutside.current = false;
      }, 100); // 100ms delay
    }, LONG_PRESS_DURATION);
  }, []);

  const handleMouseUp = useCallback(() => {
    clearTimeout(longPressTimeout.current);
  }, []);

  const handleTouchStart = useCallback(() => {
    longPressTimeout.current = setTimeout(() => {
      setIsEditing(true);
      isLongPress.current = true;
      ignoreClickOutside.current = true;
      // Reset the ignore flag after a short delay
      setTimeout(() => {
        ignoreClickOutside.current = false;
      }, 100); // 100ms delay
    }, LONG_PRESS_DURATION);
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(longPressTimeout.current);
  }, []);

  // Long press detection for lower pinned plugins
  const handleMouseDownLower = useCallback(() => {
    longPressTimeoutLower.current = setTimeout(() => {
      setIsEditing(true); // Use the same edit mode for both
      isLongPressLower.current = true;
      ignoreClickOutsideLower.current = true;
      // Reset the ignore flag after a short delay
      setTimeout(() => {
        ignoreClickOutsideLower.current = false;
      }, 100);
    }, LONG_PRESS_DURATION);
  }, []);

  const handleMouseUpLower = useCallback(() => {
    clearTimeout(longPressTimeoutLower.current);
  }, []);

  const handleTouchStartLower = useCallback(() => {
    longPressTimeoutLower.current = setTimeout(() => {
      setIsEditing(true); // Use the same edit mode for both
      isLongPressLower.current = true;
      ignoreClickOutsideLower.current = true;
      // Reset the ignore flag after a short delay
      setTimeout(() => {
        ignoreClickOutsideLower.current = false;
      }, 100);
    }, LONG_PRESS_DURATION);
  }, []);

  const handleTouchEndLower = useCallback(() => {
    clearTimeout(longPressTimeoutLower.current);
  }, []);

  const handleRemove = (id) => {
    try {
      UnsubscribeTool({ subscription_id: id })
        .unwrap()
        .then((response) => {
          toast.success(response?.message);
          setTimeout(() => {
            window.location.reload();
          }, 700);
          const removeFromTogleBox = menuItems.filter(
            (item) => item.subscription_id !== id
          );
          const removeFromTogleBar = pinnedPlugins.filter(
            (item) => item.subscription_id !== id
          );
          localStorage.setItem(
            "menuItemsOrder",
            JSON.stringify([...removeFromTogleBox])
          );
          localStorage.setItem(
            "pinnedItemsOrder",
            JSON.stringify([...removeFromTogleBar])
          );
        })
        .catch((error) => {
          toast.error(
            (error?.data?.detail ?? error?.message) || "Something went wrong"
          );
        });
    } catch (error) {
      console.log("error: ", error);
    }
    // if (fromPinned) {
    //   const filtered = pinnedPlugins.filter((item) => item.id !== id);
    //   setPinnedPlugins(filtered);
    //   localStorage.setItem("pinnedItemsOrder", JSON.stringify(filtered));
    // } else {
    //   const filtered = menuItems.filter((item) => item.id !== id);
    //   setMenuItems(filtered);
    //   localStorage.setItem("menuItemsOrder", JSON.stringify(filtered));
    // }
  };

  useEffect(() => {
    // Delay for 0.6 seconds before showing the text with opacity
    if (shouldShowPlugins) {
      const timer = setTimeout(() => {
        setpluginmenuAnimation(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowPlugins]);

  useEffect(() => {
    setpluginmenuAnimation(false);
  }, [shouldShowPlugins]);

  return (
    <div
      className="flex justify-center items-end w-[281.52px]"
      // ref={containerRef}
      ref={menuOpen ? null : containerRef}
    >
      <div
        className={`${"relative bg-[#272727] flex items-center w-[71.4%] h-[52px]"} ${
          !shouldShowPlugins
            ? "rounded-b-[26px] min-w-[218px] "
            : "rounded-full rounded-r-none min-w-[220px]"
        } ${animatePuddle ? "animate-puddle " : ""}`}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart} // Add onDragStart
          onDragEnd={handleDragEnd} // Update onDragEnd
        >
          {/* Plugin Search and List */}
          {!shouldShowPlugins && (
            <Card
              className={` animate-shade-in  bg-[#272727] text-white rounded-t-[26px]  absolute shadow-none px-[11px] pt-[14px] ${
                searchText?.length > 0
                  ? "bottom-[0px] rounded-b-[24px] h-[371px] z-[2]"
                  : "2xl:bottom-[52px] xl:bottom-[52px] bottom-[52px] rounded-b-[0px] max-h-[320px]"
              } ${!shouldShowPlugins ? "min-w-[218px]" : "min-w-[200px]"} ${
                searchText.length == "" ? "border-b-1 border-[#565656]" : ""
              }`}
            >
              <CardHeader className="p-0 mb-3 ">
                <div className="relative bg-[#1B1C1e] flex gap-1 items-center rounded-lg w-full h-[24px] px-2 z-[2]">
                  <Image
                    src={"/svg/search.svg"}
                    alt="search-img"
                    width={12}
                    height={12}
                  />
                  <input
                    placeholder="Search plugins & models..."
                    value={searchText}
                    className="text-white placeholder:text-[#71716C] placeholder:font-bold !text-[10px] font-helvetica w-full bg-transparent outline-none rounded font-medium 2xl:text-base  leading-normal"
                    name="search"
                    onChange={searchHandler}
                  />
                </div>
              </CardHeader>
              <CardBody
                onClick={() => setMenuOpen(false)}
                className={`pb-[10px] shadow-none p-0 overflow-y-auto `}
                // style={{ overflow: "auto" }}
              >
                <div>
                  <div
                  // className={`2xl:max-h-[192px] xl:max-h-[159px] mb-5 ${
                  //   isEditing ? "" : ""
                  // }`}
                  >
                    {searchText?.length === 0 ? (
                      <SortableContext
                        items={searchedMenuItems.map((item) => item.id)}
                        strategy={horizontalListSortingStrategy}
                      >
                        <div
                          className={`grid grid-cols-4 2xl:gap-[16px] gap-x-[16px] gap-y-[13px] mb-3 justify-start`}
                          style={{ padding: "0 2px" }}
                        >
                          {searchedMenuItems.length <= 0 ? (
                            <p className="text-sm text-[#AAAAAA] text-center font-medium w-max">
                              No plugin or model matched
                            </p>
                          ) : (
                            searchedMenuItems.map((model) => (
                              <div
                                className={`${
                                  isEditing ? "" : "liquid-drop"
                                } "flex items-center flex-col col-span-1"`}
                              >
                                <SortableItem
                                  key={model.id}
                                  model={model}
                                  onClick={() => activeModalHandler(model)}
                                  onRemove={(id) => handleRemove(id, false)}
                                  isEditing={isEditing}
                                  handleMouseDown={handleMouseDown}
                                  handleMouseUp={handleMouseUp}
                                  handleTouchStart={handleTouchStart}
                                  handleTouchEnd={handleTouchEnd}
                                  menuItems={menuItems}
                                  pinnedPlugins={pinnedPlugins}
                                  setMenuItems={setMenuItems}
                                  setPinnedPlugins={setPinnedPlugins}
                                  MAX_PINNED_PLUGINS={MAX_PINNED_PLUGINS}
                                  OnRightclickPinned={OnRightclickPinned}
                                />
                                {/* <p className="text-[8px] w-[40px] self-center text-center mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {model.modelName?.length > 10
                                      ? `${model.modelName.slice(0, 7)}...` // Show 7 characters plus ellipsis
                                      : model.modelName}
                                  </p> */}

                                <p
                                  className={`text-[8px] w-[36px] self-center text-center mt-1 whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-2000 ${
                                    !pluginmenuAnimation
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                >
                                  {model.modelName?.length > 10
                                    ? `${model.modelName.slice(0, 7)}...` // Show 7 characters plus ellipsis
                                    : model.modelName}
                                </p>
                              </div>
                            ))
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
                        <div className="relative">
                          {!toolsLoading ? (
                            searchToolsData?.tools?.length > 0 ? (
                              searchToolsData?.tools?.map((model) => {
                                return (
                                  <div
                                    onContextMenu={(e) =>
                                      handleContextMenu(e, model)
                                    }
                                    key={model.id}
                                    onClick={() =>
                                      router.push(
                                        `/marketplace/tools-details?tool_id=${model.id}`
                                      )
                                    }
                                    className="mb-2 relative flex gap-2 hover:bg-[#434343] px-[13px] py-[5px] rounded-[4px] cursor-pointer group"
                                  >
                                    <div>
                                      <Avatar
                                        src={model.logo}
                                        alt={model.modelName}
                                        showFallback={true}
                                        radius="sm"
                                        className={classNames(
                                          "2xl:h-[24x] 2xl:w-[24px] xl:h-[24px] xl:w-[24px] h-[24px] w-[24px] bg-transparent"
                                          // {
                                          //   pendulum: isEditing, // Apply pendulum animation when editing
                                          // }
                                        )}
                                        onClick={() => {
                                          // if (isEditing) {
                                          //   // Prevent click during edit mode
                                          //   return;
                                          // }
                                          onClick();
                                        }}
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
                                    <div className="flex flex-col gap-1">
                                      <div className="text-[10px] font-bold">
                                        {model.modelName}
                                      </div>
                                      <div className="text-[10px] font-normal text-[#BABABA]">
                                        {model?.introtext?.length > 0
                                          ? model.introtext.length > 29
                                            ? `${model.introtext.slice(
                                                0,
                                                29
                                              )}...`
                                            : model.introtext
                                          : model?.tooltipContent?.length > 29
                                          ? `${model.tooltipContent.slice(
                                              0,
                                              29
                                            )}...`
                                          : model.tooltipContent}
                                      </div>
                                      <div className="flex gap-5 text-[10px] font-normal text-[#BABABA]">
                                        <div
                                          className=""
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {model.category
                                            ? model.category
                                            : "NotFound"}
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
                                    {/* <Button
                                    
                                      className={`absolute right-0 mt-[4px] mr-[4px] !min-w-[28px] h-[11.5px] text-[4.6px] font-normal text-center rounded-[8.843px] !w-[28px] top-0 p-0 bg-[#0A84FF] text-white hidden group-hover:flex leading-[5px]`}
                                    >
                                      Add
                                    </Button> */}
                                    {selectSearchTool?.id === model?.id && (
                                      <RightClickSearchPlugin
                                        setMenuOpen={setMenuOpen}
                                        menuOpen={menuOpen}
                                        position={position}
                                        setPosition={setPosition}
                                        handleContextMenu={handleContextMenu}
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
                              <div>
                                <p className="text-sm text-[#AAAAAA] text-center font-medium">
                                  No plugin or model matched
                                </p>
                              </div>
                            )
                          ) : (
                            <div>
                              {Array.from({ length: 5 }, (_, i) => i + 1).map(
                                (_, key) => (
                                  <div key={key} className="col-span-4 mt-3">
                                    <Skeleton className="w-full rounded-md">
                                      <section className="h-[53px]"></section>
                                    </Skeleton>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Pinned Plugins */}
          <Card
            // className={`${
            //   shouldShowPlugins ? "gptModal" : ""
            // } w-[260px] 2xl:w-[260px] p-0 shadow-none bg-transparent text-white h-full ${
            //   shouldShowPlugins
            //     ? "rounded-b-[26px] border-t-1 border-[#565656] rounded-tr-[0px] rounded-tl-[0px]"
            //     : "rounded-full"
            // }`}
            className={` p-0 shadow-none bg-transparent text-white h-full  ${
              !shouldShowPlugins ? "w-[218px]" : "w-[220px]"
            } ${
              searchText?.length > 0
                ? "rounded-b-[26px] border-t-1 border-[#565656] rounded-tr-[0px] rounded-tl-[0px]"
                : "rounded-full"
            }`}
          >
            <CardBody
              className={`p-0 ${
                !shouldShowPlugins ? "overflow-hidden" : "overflow-hidden"
              }`}
              style={{ flexDirection: "row" }}
            >
              {pinnedPlugins?.length > 0 ? (
                <SortableContext
                  items={pinnedPlugins
                    .slice(0, MAX_PINNED_PLUGINS)
                    .map((item) => item.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div
                    className={`flex items-center z-[1] w-full ${
                      !shouldShowPlugins
                        ? "px-[13px] 2xl:gap-[15px] gap-[15px]"
                        : "pl-[11px] gap-[19px]"
                    }`}
                  >
                    {pinnedPlugins.slice(0, MAX_PINNED_PLUGINS).map((model) => (
                      <SortableItem
                        key={model.id}
                        model={model}
                        onClick={() => activeModalHandler(model)}
                        onRemove={(id) => handleRemove(id, true)}
                        isEditing={isEditing}
                        handleMouseDown={handleMouseDownLower}
                        handleMouseUp={handleMouseUpLower}
                        handleTouchStart={handleTouchStartLower}
                        handleTouchEnd={handleTouchEndLower}
                        menuItems={menuItems}
                        pinnedPlugins={pinnedPlugins}
                        setMenuItems={setMenuItems}
                        setPinnedPlugins={setPinnedPlugins}
                        MAX_PINNED_PLUGINS={MAX_PINNED_PLUGINS}
                        OnRightclickPinned={OnRightclickPinned}
                      />
                    ))}
                  </div>
                </SortableContext>
              ) : (
                <SortableContext
                  items={[]}
                  strategy={horizontalListSortingStrategy}
                >
                  {menuItems?.length > 0 ? (
                    <div className="flex justify-center items-center text-[9px] ml-0 w-full text-[#858584]">
                      <PinIcon width={24} height={24} fill="#858584" />
                      Right click and pinned tool from Togle box
                    </div>
                  ) : (
                    <div className="flex justify-center items-center text-[9px] ml-0 w-full text-[#858584] gap-1">
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
                </SortableContext>
              )}
            </CardBody>
          </Card>
          {/* DragOverlay for drag preview */}
          <DragOverlay>
            {activeItem ? (
              <div className="drag-overlay flex items-center space-x-2">
                <Avatar
                  src={activeItem.iconSrc}
                  alt={activeItem.modelName}
                  radius="sm"
                  className="2xl:h-[36px] 2xl:w-[36px] xl:h-[36px] xl:w-[36px] h-[36px] w-[36px] bg-transparent"
                />
                {/* <span className="text-white">{activeItem.modelName}</span> */}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <div
        className={`w-full pl-[14px] mr-4 flex justify-center h-[52px] toggle-tools bg-[${
          !shouldShowPlugins ? "transparent" : "bg-[#272727]"
        }] ${
          !shouldShowPlugins
            ? "bg-[#272727]"
            : " bg-[#272727] animate-shade-in duration-500 rounded-r-full pr-[7px]"
        }`}
      >
        {/* <button className="object-cover p-2" onClick={toggleShowPlugin}>
          <PluginToggle className="cursor-pointer h-full w-full text-[#C3C3C3] hover:text-white" />
        </button> */}
        {/* <Switch
          onChange={toggleShowPlugin}
          isSelected={!shouldShowPlugins}
          value={shouldShowPlugins}
          checked={shouldShowPlugins}
          style={{
            border: "1px solid white",
            borderRadius: "9999px",
            width: "30px",
            height: "22px",
          }}
          color="default"
          size="sm"
          width={"30px"}
        ></Switch> */}
        <Switch
          defaultSelected
          color="default"
          classNames={{
            wrapper:
              "border-1 border-[#fff] !bg-[transparent] !p-[2px] w-[26.524px] h-[17.205px] !mr-[7px]",
            thumb: cn(
              "w-[12.19px] h-[12.19px] border-1 shadow-lg",
              "bg-[#fff] border-[#fff]",
              "group-data-[selected=true]:ml-[0.5rem]"
            ),
          }}
          onChange={toggleShowPlugin}
          isSelected={shouldShowPlugins}
          value={shouldShowPlugins}
          checked={shouldShowPlugins}
        />
      </div>
      <ToastService />
    </div>
  );
};

export default PluginMenu;
