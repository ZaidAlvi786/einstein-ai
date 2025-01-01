"use client"
import React, { useState } from 'react';
import { Accordion, AccordionItem, Spinner } from '@nextui-org/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { useGetArchivedChatsByWorksSpaceIdQuery } from '@/app/lib/features/chat/chatApi';
import { useAppSelector } from '@/app/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import ChatListItem from './ChatListItem';
import { useEffect } from 'react';
import Image from "next/image";
const ChatHistoryList = ({ getHistoryDetail = () => { } }) => {

  const historyChatData = useAppSelector(state => state.chat.historyChatData);
  const activeWorkspace = useAppSelector(state => state.workspace.activeWorkspace);

  const searchParams = useSearchParams();
  const activeChatId = searchParams.get('chat');
  const [hoveredItem, setHoveredItem] = useState(null);

  return (<>
    {historyChatData.map((section, index) => (
      <Accordion
        key={index}
        defaultExpandedKeys={[`${index}`]}
        className="px-0 mb-3"
        itemClasses={{
          title: "text-[#ffffff] font-medium font-helvetica 4k:4k:text-[26px] 2k:text-[15px] text-[14.95px] pl-[8px] pr-[4px]",
          trigger: 'py-0 max-w-max !gap-0 items-baseline'
        }}
      >
        <AccordionItem
          key={index}
          aria-label={section.title}
          title={section.title}
          startContent={section.startContent}
          indicator={({ isOpen }) => (isOpen ? <Image src="/svg/chevronUp.svg"  alt="model-img" width={'4k' ? 14:7} height={'4k' ? 8:4} className="rotate-90 h-[4.27px] w-[7.2px] 4k:w-[14px] 4k:h-[8px] mt-1" /> : <Image src="/svg/chevronDown.svg"  alt="model-img" width={'4k' ? 14:7} height={'4k' ? 8:4} className=" rotate-0 sh-[4.27px] w-[7.2px] 4k:w-[14px] 4k:h-[8px] mt-1" />)}
        >
          <ul className='relative'>
            {section.items.map((item, itemIndex) => {
              const key = `${index}-${itemIndex}`;
              const isActive = activeChatId === item?.id;
              const showEllipsis = hoveredItem === key;
              return (
                <ChatListItem
                  key={key}
                  idKey={key}
                  setHoveredItem={setHoveredItem}
                  isActive={isActive}
                  item={item}
                  getHistoryDetail={getHistoryDetail}
                  showEllipsis={showEllipsis}
                  index={itemIndex}
                />
              )
            })}
          </ul>
        </AccordionItem>
      </Accordion>
    ))}
  </>);
};

export default ChatHistoryList;
