"use client"

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
  Button,
  Tooltip,
} from "@nextui-org/react";
import Moreicon from "@/app/assets/svg/more-icon.svg";
import Heart from "@/app/assets/svg/heart.svg";
import Archiveicon from "@/app/assets/svg/archive.svg";
import Checkboxicon from "@/app/assets/svg/checkbox-icon.svg";
import Shareicon from "@/app/assets/svg/share-icon.svg";
import Copyicon from "@/app/assets/svg/notification-copy-icon.svg";
import { useState } from "react";
import {
  useAcceptInvitationForSharedChatMutation,
  useArchiveAllNotificationsMutation,
  useDeclineInvitationForSharedChatMutation,
  useGetUsersNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkUserNotificationMutation,
  useUpdateUserChatStatusMutation,
  useUpdateUserWorkspaceStatusMutation,
} from "@/app/lib/features/chat/chatApi";
import { useAuth } from "@/app/authContext/auth";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";
import groupDataByDate from "@/app/utils/dateAndTime/groupDataByDate";
import { useRouter } from "next/navigation";

// const groupNotificationDataByDate = (data) => {
//   const now = moment();
//   const sevenDaysAgo = now.clone().subtract(7, "days");

//   const categorizedNotifications = data.reduce(
//     (acc, notification) => {
//       const createdAt = moment("2024-09-12T12:41:03.618000");

//       if (notification.is_archived) {
//         acc.archived.push(notification);
//       } else if (createdAt.isAfter(sevenDaysAgo)) {
//         acc.lastSevenDays.push(notification);
//       } else {
//         acc.older.push(notification);
//       }

//       return acc;
//     },
//     { lastSevenDays: [], older: [], archived: [] }
//   );

//   return categorizedNotifications;
// };

const groupNotificationDataByDate = (data) => {
  const groupedData = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    previousMonths: {},
    archived: [], // New array for archived notifications
  };

  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "day").startOf("day");
  const lastWeekStart = moment().subtract(1, "week").startOf("week");
  const lastMonthStart = moment().subtract(1, "month").startOf("month");

  data.forEach((item) => {
    // Check if the notification is archived
    if (item.is_archived) {
      groupedData.archived.push(item);
      return; // Skip further grouping checks for archived notifications
    }

    // Parse the date and ensure validity
    const itemDate = moment(
      item.created_at,
      ["YYYY-MM-DD", "YYYY-MM-DD hh:mm:ss", "MM-DD-YYYY"],
      false
    );
    if (!itemDate.isValid()) {
      return;
    }

    const itemDay = itemDate.clone().startOf("day");

    if (itemDay.isSame(today, "day")) {
      groupedData.today.push(item);
    } else if (itemDay.isSame(yesterday, "day")) {
      groupedData.yesterday.push(item);
    } else if (
      itemDay.isSameOrAfter(lastWeekStart) &&
      itemDay.isBefore(today)
    ) {
      groupedData.lastWeek.push(item);
    } else if (
      itemDay.isSameOrAfter(lastMonthStart) &&
      itemDay.isBefore(lastWeekStart)
    ) {
      groupedData.lastMonth.push(item);
    } else {
      const monthYear = itemDate.format("MMMM YYYY");
      if (!groupedData.previousMonths[monthYear]) {
        groupedData.previousMonths[monthYear] = [];
      }
      groupedData.previousMonths[monthYear].push(item);
    }
  });

  const historyList = [];

  if (groupedData.today.length > 0) {
    historyList.push({
      title: "Today",
      items: groupedData.today,
    });
  }

  if (groupedData.yesterday.length > 0) {
    historyList.push({
      title: "Yesterday",
      items: groupedData.yesterday,
    });
  }

  if (groupedData.lastWeek.length > 0) {
    historyList.push({
      title: "Last Week",
      items: groupedData.lastWeek,
    });
  }

  if (groupedData.lastMonth.length > 0) {
    historyList.push({
      title: "Last Month",
      items: groupedData.lastMonth,
    });
  }

  for (const [month, items] of Object.entries(groupedData.previousMonths)) {
    historyList.push({
      title: month,
      items: items,
    });
  }

  if (groupedData.archived.length > 0) {
    historyList.push({
      title: "Archived",
      items: groupedData.archived,
    });
  }

  return historyList;
};

const NotificationTypeAndIcon = [
  { key: "like", icon: <Heart />, title: "" },
  { key: "share", icon: <Shareicon />, title: "Shared" },
];

const getNotificationTypeAndIcon = (type, key) => {
  const Item =
    NotificationTypeAndIcon?.find((item) => item?.key === type) ?? {};
  if (key === "icon") {
    return Item?.icon ?? <></>;
  } else if (key === "title") {
    return Item?.title ?? "-";
  } else {
    return null;
  }
};

const ShowNotificationTypeAndIconList = [
  "shared_chat_invite",
  "shared_chat_request",
  "workspace",
  "workspace_add_request",
  "shared_chat_status_change",
];

const IsShowNotificationTypeAndIcon = (type) => {
  const show = ShowNotificationTypeAndIconList?.includes(type);
  return show ? true : false;
};
const IsShowActiveDeclineButton = (type) => {
  const show =
    type == "shared_chat_invite"
      ? true
      : type == "shared_chat_request"
      ? true
      : type == "workspace_add_request"
      ? true
      : type == "workspace_user_approval_pending"
      ? true
      : false;
  return show;
};

const NotificationItemComponent = ({ data, section }) => {
  const [NotificationLoading, setNotificationLoading] = useState({
    notification_id: "",
    loading: false,
    type: "",
  });
  const [AcceptInvitationForSharedChat] =
    useAcceptInvitationForSharedChatMutation();
  const [DeclineInvitationForSharedChat] =
    useDeclineInvitationForSharedChatMutation();
  const [UpdateUserChatStatus] = useUpdateUserChatStatusMutation();
  const [UpdateUserWorkspaceStatus] = useUpdateUserWorkspaceStatusMutation();
  const [markUserNotification] = useMarkUserNotificationMutation();
  const auth = useAuth();
  const { data: notificationsData, refetch } = useGetUsersNotificationsQuery(
    { page_number: 1, per_page: 1000, notification_type: "all" },
    { skip: !auth?.user?.email || !auth?.user?.fullname }
  );
  const router = useRouter();

  const HandleChatInviteAcceptanceOrDecline = (
    notification_id,
    type,
    chat_id,
    notification_type,
    notification_details
  ) => {
    if (notification_type === "shared_chat_request") {
      setNotificationLoading({ notification_id, loading: true, type });
      const payload = {
        shared_chat_id: chat_id,
        participant_id: notification_details?.source_id,
        notification_id: notification_id,
        status: type === "accept" ? "active" : "declined",
      };
      UpdateUserChatStatus(payload)
        .unwrap()
        .then((response) => {
          if (response?.status === 200) {
            toast.success(response?.message);
            // refetch()
          } else {
            toast.error(response?.message);
          }
        })
        .catch((error) => {
          toast.error(error?.data?.message);
        })
        .finally(() => {
          setNotificationLoading({
            notification_id: "",
            loading: false,
            type: "",
          });
          refetch()
        });
      // } else if (notification_type === "workspace_add_request") {
    } else if (
      notification_type === "workspace_user_approval_pending" ||
      notification_type === "workspace_add_request"
    ) {
      setNotificationLoading({ notification_id, loading: true, type });
      const payload = {
        workspace_id: chat_id,
        // participant_id: notification_details?.source_id,
        participant_id:
          notification_type === "workspace_user_approval_pending"
            ? notification_details?.user_id
            : notification_details?.source_id,
        notification_id: notification_id,
        status: type === "accept" ? "active" : "declined",
      };
      UpdateUserWorkspaceStatus(payload)
        .unwrap()
        .then((response) => {
          if (response?.status === 200) {
            toast.success(response?.message);
          } else {
            toast.error(response?.message);
          }
        })
        .catch((error) => {
          toast.error(error?.data?.message);
        })
        .finally(() => {
          setNotificationLoading({
            notification_id: "",
            loading: false,
            type: "",
          });
          refetch()
        });
    } else {
      if (type === "accept") {
        setNotificationLoading({ notification_id, loading: true, type });

        const data = {
          params: {
            chat_id,
            notification_id,
          },
        };

        AcceptInvitationForSharedChat(data)
          .unwrap()
          .then((response) => {
            if (response?.status === 200) {
              toast.success(response?.message);
            } else {
              toast.error(response?.message);
            }
          })
          .catch((error) => {
            toast.error(error?.data?.message);
          })
          .finally(() => {
            setNotificationLoading({
              notification_id: "",
              loading: false,
              type: "",
            });
            refetch();
          });
      }
      if (type === "decline") {
        setNotificationLoading({ notification_id, loading: true, type });

        const data = {
          params: {
            chat_id,
            notification_id,
          },
        };

        DeclineInvitationForSharedChat(data)
          .unwrap()
          .then((response) => {
            if (response?.status === 200) {
              toast.success(response?.message);
            } else {
              toast.error(response?.message);
            }
          })
          .catch((error) => {
            toast.error(error?.data?.message);
          })
          .finally(() => {
            setNotificationLoading({
              notification_id: "",
              loading: false,
              type: "",
            });
            refetch();
          });
      }

      return (
        <div
          className='mt-7 flex gap-4 cursor-pointer'
          onClick={() => {
            if (data.type === "model") {
              router.push(
                "/marketplace/tools-details?tool_id=" + data.destination_id
              );
            }
          }}
        >
          asdasdasd
          <div className='relative'>
            <div className='w-[32px] h-[32px] bg-[#141414] rounded-full text-white	font-helvetica flex justify-center items-center shrink-0 text-xs'>
              {/* <Badge isInvisible={(IsShowNotificationTypeAndIcon(data?.notification_type))} classNames={{ badge: "h-6 bg-[#141414] border-[#141414]" }} content={getNotificationTypeAndIcon("like", "icon")} placement="bottom-right"> */}
              <Avatar
                src={data?.source_data?.profile_picture_url}
                showFallback={true}
                color='primary'
                name={
                  data?.source_data?.full_name?.slice(0, 1)?.toUpperCase() ??
                  data?.notification_text?.slice(0, 1)?.toUpperCase()
                }
                className='w-8 h-8'
              />
              {/* </Badge> */}
            </div>
          </div>
          <div className='flex items-start justify-between w-[87%]'>
            <div className='flex flex-col items-start justify-start gap-1 w-[80%]'>
              {data?.source_data?.full_name && (
                <p className='text-white text-xs font-helvetica'>
                  {data?.source_data?.full_name}
                  {data?.extra_data?.status === "active"
                    ? "Accepted"
                    : "Declined"}
                </p>
              )}
              <div className='flex text-white text-xs gap-1 items-center mb-2 w-[100%]'>
                {/* {(!IsShowNotificationTypeAndIcon(data?.notification_type)) && (<>
                            <p className='font-helvetica'>{getNotificationTypeAndIcon("like", "title")}</p>
                            <span className='w-[3px] h-[3px] bg-white rounded-full' />
                        </>)} */}
                <Tooltip
                  placement='top'
                  content={
                    <div className=' text-[#FFF] font-helvetica font-small'>
                      {data?.notification_text}
                    </div>
                  }
                  classNames={{
                    content: ["bg-[#2E353C]"],
                  }}
                  delay={0}
                  closeDelay={0}
                >
                  <p className='font-helvetica truncate max-w-50'>
                    {data?.notification_text}
                  </p>
                </Tooltip>
              </div>
              {IsShowActiveDeclineButton(data?.notification_type) &&
                !data?.extra_data && (
                  <>
                    <div className='flex gap-2'>
                      <Button
                        color='default'
                        size='sm'
                        radius='sm'
                        className='text-[12px] font-helvetica not-italic font-normal leading-normal data-[focus-visible=true]:outline-0 data-[focus-visible=true]:outline-offset-0'
                        variant='bordered'
                        isLoading={
                          NotificationLoading.notification_id === data?.id &&
                          NotificationLoading.type === "accept" &&
                          NotificationLoading.loading
                        }
                        onPress={() =>
                          HandleChatInviteAcceptanceOrDecline(
                            data?.id,
                            "accept",
                            data?.destination_id,
                            data?.notification_type,
                            data
                          )
                        }
                      >
                        {`Accept`}
                      </Button>
                      <Button
                        color='default'
                        size='sm'
                        radius='sm'
                        className='text-[12px] font-helvetica not-italic font-normal leading-normal data-[focus-visible=true]:outline-0 data-[focus-visible=true]:outline-offset-0'
                        variant='bordered'
                        isLoading={
                          NotificationLoading.notification_id === data?.id &&
                          NotificationLoading.type === "decline" &&
                          NotificationLoading.loading
                        }
                        onPress={() =>
                          HandleChatInviteAcceptanceOrDecline(
                            data?.id,
                            "decline",
                            data?.destination_id,
                            data?.notification_type,
                            data
                          )
                        }
                      >
                        {`Decline`}
                      </Button>
                    </div>
                  </>
                )}
            </div>
            <div className='flex items-center gap-2'>
              <p className='text-white text-xs font-helvetica'>
                {moment(data?.created_at).format("MMM DD")}
              </p>
              <span
                className={`w-2 h-2 ${
                  data?.is_read ? "bg-transparent" : "bg-[#337CE1]"
                } rounded-full block`}
              ></span>
            </div>
          </div>
        </div>
      );
    }
  };

  const formattedTime = (created_at) => {
    const time = moment.utc(created_at).local(); // Parse as UTC, then convert to local
    const now = moment(); // Current local time
    // If the time is within the same minute, display 'Just now'
    if (now.diff(time, "minutes") < 1) {
      return "Just now";
    }
    // If the time is within the last hour, display "x minutes ago"
    if (now.diff(time, "hours") < 1) {
      return time.fromNow(); // "x minutes ago"
    }
    // Otherwise, display the time in "h:mm A" format
    return time.format("h:mm A"); // Example: "2:30 PM"
  };

  // const createMultipleQueryString = useCallback(
  //   (paramsToUpdate) => {
  //     const newParams = new URLSearchParams(searchParams);

  //     Object.keys(paramsToUpdate).forEach((param) => {
  //       newParams.set(param, paramsToUpdate[param]);
  //     });

  //     return newParams.toString();
  //   },
  //   [searchParams]
  // );

  const handleNotificationClick = (data) => {
    if (data.notification_type === "model" || data.notification_type === "gpt" || data.notification_type === "plugin") {
      router.push("/marketplace/tools-details?tool_id=" + data.destination_id);
    }
    if (!data.is_read) {
      const param = {
        notification_id: data.id,
      };
      markUserNotification(param)
        .unwrap()
        .then((response) => {
          refetch();
        })
        .catch((error) => {
          toast.error(error?.data?.message);
        });
    }
  };
  return (
    <div
      className='mt-7 flex gap-4 cursor-pointer hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-xl'
      onClick={() => handleNotificationClick(data)}
    >
      <div className='relative'>
        <div className='w-[32px] h-[32px] bg-[#141414] rounded-full text-white	font-helvetica flex justify-center items-center shrink-0 text-xs'>
          {/* <Badge
            isInvisible={IsShowNotificationTypeAndIcon(data?.notification_type)}
            classNames={{ badge: "h-6 bg-[#141414] border-[#141414]" }}
            content={getNotificationTypeAndIcon("like", "icon")}
            placement="bottom-right"
          > */}
          <Avatar
            src={data?.source_data?.profile_picture_url}
            showFallback={true}
            color='primary'
            name={
              data?.source_data?.full_name?.slice(0, 1)?.toUpperCase() ??
              data?.notification_text?.slice(0, 1)?.toUpperCase()
            }
            className='w-8 h-8'
          />
          {/* </Badge> */}
        </div>
      </div>
      <div className='flex items-start justify-between w-full'>
        <div className='flex flex-col items-start justify-start gap-1'>
          {data?.source_data?.full_name && (
            <div className='flex items-center gap-1'>
              <p className='text-white text-xs font-helvetica'>
                {data?.source_data?.full_name}{" "}
              </p>
              {(data?.extra_data?.status === "active" ||
                data?.extra_data?.status === "declined") && (
                <span className='w-[3px] h-[3px] bg-white rounded-full' />
              )}
              <p className='text-white text-xs font-helvetica'>
                {data?.extra_data?.status === "active"
                  ? "Accepted"
                  : data?.extra_data?.status === "declined"
                  ? "Declined"
                  : ""}
              </p>
            </div>
          )}
          <div className='flex text-white text-xs items-center mb-2'>
            {!IsShowNotificationTypeAndIcon(data?.notification_type) && (
              <>
                <p className='font-helvetica'>
                  {getNotificationTypeAndIcon("like", "title")}
                </p>
                {/* <span className="w-[3px] h-[3px] bg-white rounded-full" /> */}
              </>
            )}
            <p className='font-helvetica truncate max-w-50 whitespace-normal'>
              {data?.notification_text}
            </p>
          </div>
          {IsShowActiveDeclineButton(data?.notification_type) &&
            !data?.extra_data && (
              <>
                <div className='flex gap-2'>
                  <Button
                    color='default'
                    size='sm'
                    radius='sm'
                    className='text-[12px] font-helvetica not-italic font-normal leading-normal data-[focus-visible=true]:outline-0 data-[focus-visible=true]:outline-offset-0'
                    variant='bordered'
                    isLoading={
                      NotificationLoading.notification_id === data?.id &&
                      NotificationLoading.type === "accept" &&
                      NotificationLoading.loading
                    }
                    onPress={() =>
                      HandleChatInviteAcceptanceOrDecline(
                        data?.id,
                        "accept",
                        data?.destination_id,
                        data?.notification_type,
                        data
                      )
                    }
                  >
                    {`Accept`}
                  </Button>
                  <Button
                    color='default'
                    size='sm'
                    radius='sm'
                    className='text-[12px] font-helvetica not-italic font-normal leading-normal data-[focus-visible=true]:outline-0 data-[focus-visible=true]:outline-offset-0'
                    variant='bordered'
                    isLoading={
                      NotificationLoading.notification_id === data?.id &&
                      NotificationLoading.type === "decline" &&
                      NotificationLoading.loading
                    }
                    onPress={() =>
                      HandleChatInviteAcceptanceOrDecline(
                        data?.id,
                        "decline",
                        data?.destination_id,
                        data?.notification_type,
                        data
                      )
                    }
                  >
                    {`Decline`}
                  </Button>
                </div>
              </>
            )}
        </div>
        <div className='flex items-center gap-2'>
          <p className='text-white text-xs font-helvetica min-w-max'>
            {/* {moment(data?.created_at).format("MMM DD")} */}
            {/* {moment(data?.created_at).fromNow()} */}
            {/* {formattedTime(data?.created_at)} */}
            {section?.title == "Last Month" || section?.title == "Last Week"
              ? moment(data?.created_at).format("MMM DD")
              : formattedTime(data?.created_at)}
          </p>
          <span
            className={`w-2 h-2 ${
              data?.is_read ? "bg-transparent" : "bg-[#337CE1]"
            } rounded-full block`}
          ></span>
        </div>
      </div>
    </div>
  );
};

const NotificationDrawer = ({
  shouldShowNotificationMenu,
  notificationMenuContainerRef,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.webSocket.messages);
  const { data: notificationsData, refetch } = useGetUsersNotificationsQuery(
    { page_number: 1, per_page: 1000, notification_type: "all" },
    { skip: !auth?.user?.email || !auth?.user?.fullname }
  );
  const [MarkAllNotificationsRead] = useMarkAllNotificationsReadMutation();
  const [ArchiveAllNotifications] = useArchiveAllNotificationsMutation();
  const Notifications = groupNotificationDataByDate(
    notificationsData?.notifications ?? []
  );
  // const Notifications = dispatch(
  //   groupDataByDate(notificationsData?.notifications ?? [])
  // );

  const sidebarSize = useAppSelector((state) => state.sidebarResize.width);

  const handleDropdownMenu = (currentKey) => {
    if (currentKey === "mark-all-notifications-read") {
      MarkAllNotificationsRead()
        .unwrap()
        .then((response) => {
          toast.success(response?.message);
        })
        .catch((error) => {
          toast.error(error?.data?.message ?? error?.message);
        });
    } else if (currentKey === "archive-all-notifications") {
      ArchiveAllNotifications()
        .unwrap()
        .then((response) => {
          toast.success(response?.message);
        })
        .catch((error) => {
          toast.error(error?.data?.message ?? error?.message);
        });
    }
  };

  useEffect(() => {
    if (messages && messages?.type === "notification") {
      refetch();
    }
  }, [messages]);

  return (
    <>
      <div
        ref={notificationMenuContainerRef}
        className={`max-w-[388px] w-full overflow-y-auto bg-[#141414] fixed trasnsition-card py-6 px-4 h-full z-[99]`}
        style={{
          left: shouldShowNotificationMenu
            ? `${sidebarSize}px`
            : `-${sidebarSize + 30}px`,
        }}
      >
        <div className='flex items-center justify-between'>
          <p className='text-white font-medium text-sm font-helvetica'>{`Notifications`}</p>
          <Dropdown
            classNames={{
              content:
                "bg-[#2F2F2F] min-w-24 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]",
            }}
            onOpenChange={setIsOpen}
          >
            <DropdownTrigger>
              <div
                variant='bordered'
                className={`cursor-pointer ${
                  isOpen ? "!border-[#2B6BDC] bg-[#2F2F2F]" : ""
                } p-0 border-transparent border-2 rounded hover:bg-[#2F2F2F]`}
              >
                <Moreicon />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='notification'
              variant='flat'
              closeOnSelect={true}
              disallowEmptySelection
              selectionMode='single'
              onSelectionChange={({ currentKey }) =>
                handleDropdownMenu(currentKey)
              }
            >
              <DropdownItem
                startContent={<Checkboxicon />}
                key={"mark-all-notifications-read"}
                className='text-white font-normal helvetica-font data-[hover=true]:bg-[#505050]'
              >{`Mark all as read`}</DropdownItem>
              <DropdownItem
                startContent={<Archiveicon />}
                key={"archive-all-notifications"}
                className='text-white font-normal helvetica-font data-[hover=true]:bg-[#505050]'
              >{`Archive all`}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {/* {Notifications?.lastSevenDays?.length > 0 && (
          <>
            <div>
              <p className="text-white mt-[14px] text-[10px]">Last 7 days</p>
              {Notifications?.lastSevenDays?.map((item, index) => (
                <NotificationItemComponent key={index} data={item} />
              ))}
            </div>
          </>
        )} */}

        {Notifications?.length > 0 && (
          <>
            {Notifications.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <p className='text-white mt-[14px] text-[10px]'>
                  {section.title}
                </p>
                {section.items.map((item, index) => (
                  <NotificationItemComponent
                    key={index}
                    data={item}
                    section={section}
                  />
                ))}
              </div>
            ))}
          </>
        )}
        {/* {Notifications?.older?.length > 0 && (
          <>
            <div>
              <p className="text-white mt-[14px] text-[10px]">one month ago</p>
              {Notifications?.older?.map((item, index) => (
                <NotificationItemComponent key={index} data={item} />
              ))}
            </div>
          </>
        )} */}
        {/* {Notifications?.archived?.length > 0 && (
          <>
            <div>
              <p className="text-white mt-[14px] text-[10px]">Archive</p>
              {Notifications?.archived?.map((item, index) => (
                <NotificationItemComponent key={index} data={item} />
              ))}
            </div>
          </>
        )} */}
        {/* {Notifications?.lastSevenDays?.length <= 0 &&
          Notifications?.older?.length <= 0 &&
          Notifications?.archived?.length <= 0 && (
            <>
              <div className="flex justify-center items-center h-calc-30px">
                <p className="text-[#999999]">{`You don’t have any notifications right now.`}</p>
              </div>
            </>
          )} */}
        {Notifications?.length <= 0 && (
          <>
            <div className='flex justify-center items-center h-calc-30px'>
              <p className='text-[#999999]'>{`You don’t have any notifications right now.`}</p>
            </div>
          </>
        )}
      </div>
      <ToastService />
    </>
  );
};

export default NotificationDrawer;
