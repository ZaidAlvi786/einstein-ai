import React from "react";
import { Input, Spinner } from "@nextui-org/react";
import SearchIcon from "@/app/assets/svg/search-icon.svg";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setSharedChatsSearchValue } from "@/app/lib/features/sharedChats/sharedChatsSlice";

const SidebarSearchBoxComponent = () => {
  const dispatch = useAppDispatch();
  const searchValue = useAppSelector(
    (state) => state.sheredChats.sharedChatsSearchValue
  );
  const isLoading = useAppSelector(
    (state) => state.sheredChats.isSharedChatsSearchLoading
  );

  const HandleChangeOnSearch = (value) => {
    const searchValue = value?.trimStart() ?? "";
    dispatch(setSharedChatsSearchValue(searchValue));
  };

  const HandleCleareSearch = () => {
    dispatch(setSharedChatsSearchValue(""));
  };

  return (
    <>
      <Input
        type='text'
        placeholder='Search'
        classNames={{
          label: "text-white",
          input: [
            "bg-[#232323]",
            "placeholder:text-[#6A6A6A]",
            "text-[12.39px] 2k:text-[14px] 4k:text-[28px] 4k:placeholder:text-[28px] 2k:placeholder:text-[14px]",
            "placeholder:font-normal",
            "font-inter",
            "group-data-[has-value=true]:text-white",
            "font-normal text-[#6A6A6A] text-sm",
          ],
          inputWrapper: [
            "bg-[#232323]",
            "rounded-[8px] 4k:rounded-[16px]",
            "data-[hover=true]:bg-[#232323]",
            "group-data-[focus=true]:bg-[#232323]",
            "group-data-[has-value=true]:text-white",
            "h-[30.98px] 4k:h-[70px] 2k:h-[35px]",
            "!min-h-[30.98px] 4k:!min-h-[70px] 2k:min-h-[35px]",
          ],
        }}
        isClearable={true}
        value={searchValue}
        onValueChange={HandleChangeOnSearch}
        onClear={HandleCleareSearch}
        startContent={
          <Image
            src={"/svg/search-icon.svg"}
            alt="searchIcon"
            width={12}
            height={12}
            className='text-2xl text-[#6A6A6A] pointer-events-none flex-shrink-0 4k:w-[30px] 4k:h-[32px] 2k:w-[15px] 2k:h-[16px] w-[13.28px] h-[14.16px]'
          />
        }
        endContent={
          isLoading ? (
            <Spinner color='white' size='sm' className='flex items-center' />
          ) : (
            <></>
          )
        }
      />
    </>
  );
};

export default SidebarSearchBoxComponent;
