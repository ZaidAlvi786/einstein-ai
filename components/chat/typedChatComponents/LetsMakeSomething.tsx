import { cn, Switch } from '@nextui-org/react'
import React from 'react'

const LetsMakeSomething = () => {
  return (
    <div className=" rounded-[20px] max-w-[860px]  w-full mx-auto my-auto h-full flex justify-center flex-col 2xl:max-w-[1109px] xl:max-w-[860px] lg:max-w-[860px]">
    <>
    <div className="flex items-center justify-center z-49">
      <Switch
        defaultSelected
        color="default"
        classNames={{
          wrapper:
            "border-2 border-[#5F5F5F] !bg-[transparent] h-9 w-16",
          thumb: cn(
            "w-6 h-6 border-2 shadow-lg z-0",
            "bg-[#5F5F5F] border-[#5F5F5F]",
            "group-data-[selected=true]:ml-7",
          ),
        }}
      >
        <div className="text-[#5F5F5F] text-4xl font-normal font-helvetica">
          Let’s make something.
        </div>
      </Switch>
    </div>
  </>
  </div>
  )
}

export default LetsMakeSomething