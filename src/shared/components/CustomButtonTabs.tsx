import { Button } from "@mantine/core";
import { useState } from "react";

export function CustomButtonTabs({setActiveButton,activeButton,tabsTitle}:any) {
    
    return (
          <div className="flex flex-col items-start gap-5 self-stretch w-full">
            <Button.Group
              classNames={{
                group:
                  'flex items-center justify-center self-stretch p-1 gap-1 rounded-[10px] border-[1px] border-solid bg-white w-full border-Gray-200 w-full drop-shadow-xs',
              }}
            >
              <Button
                className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0  !border-x-0 rounded-[6px]"
                classNames={{
                  label: `text-sm font-semibold leading-5 ${activeButton === tabsTitle.tab1 ? 'text-Gray-700' : 'text-Gray-500'}`,
                  section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                  root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === tabsTitle.tab1 ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 rounded-[6px] bg-Gray-100 shadow-sm' : 'bg-white !border-0'}`,
                }}
                variant="outline"
                onClick={() => {
                  setActiveButton(tabsTitle.tab1);
                }}
              >
                {tabsTitle.tab1}
              </Button>
              <Button
                className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0   !border-x-0 rounded-[6px]"
                classNames={{
                  label: `text-sm font-semibold leading-5 ${activeButton === tabsTitle.tab2 ? 'text-Gray-700' : 'text-Gray-500'}`,
                  section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                  root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === tabsTitle.tab2 ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 rounded-[6px] bg-Gray-100 shadow-sm' : 'bg-white !border-0'}`,
                }}
                variant="outline"
  
                onClick={() => {
                  setActiveButton(tabsTitle.tab2);
                }}
              >
                {tabsTitle.tab2}
              </Button>
              <Button
                className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0   !border-x-0 rounded-[6px]"
                classNames={{
                  label: `text-sm font-semibold leading-5 ${activeButton === tabsTitle.tab3 ? 'text-Gray-700' : 'text-Gray-500'}`,
                  section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                  root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === tabsTitle.tab3 ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 rounded-[6px] bg-Gray-100 shadow-sm' : 'bg-white !border-0'}`,
                }}
                variant="outline"
                onClick={() => {
                  setActiveButton(tabsTitle.tab3);
                }}
              >
                {tabsTitle.tab3}
              </Button>
            </Button.Group>
          </div>
    );
}