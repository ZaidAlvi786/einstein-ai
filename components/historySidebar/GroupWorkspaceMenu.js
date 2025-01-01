import React from 'react';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { Avatar } from '@nextui-org/react';
import { useGetAllGroupByWorkspaceIdQuery } from '@/app/lib/features/chat/chatApi';

const GroupWorkspaceMenu = ({ item, key }) => {

    const { data } = useGetAllGroupByWorkspaceIdQuery(item?._id, { skip: !item?._id });
    
    return (data?.data?.length > 0 ?
        <Menu key={key} placement='right-end' allowHover offset={15}>
            <MenuHandler>
                <MenuItem className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center px-2 py-1">
                    <Avatar className="h-8 w-8" src={item?.image} showFallback radius="sm" />
                    <div>
                        <p className="font-bold text-white text-sm">{item?.name}</p>
                        <span className="font-medium text-xs text-[#818181]">{"Premium Plan 3 member"}</span>
                    </div>
                </MenuItem>
            </MenuHandler>
            <MenuList className='bg-[#2F2F2F] border-0 text-white shadow-md p-1.5'>
                {data?.data?.map((ele, index) => (
                    <MenuItem key={index} className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center">
                        <div>{ele?.name}</div>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
        :
        <MenuItem key={key} className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center px-2 py-1">
            <Avatar className="h-8 w-8" src={item?.image} showFallback radius="sm" />
            <div>
                <p className="font-bold text-white text-sm">{item?.name}</p>
                <span className="font-medium text-xs text-[#818181]">{"Premium Plan 3 member"}</span>
            </div>
        </MenuItem>
    );
}

export default GroupWorkspaceMenu;