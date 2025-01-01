import { File06Icon, FileX02 } from "@assets/iconComponents"

export const Header = ()=>{
    return (
        <div className="flex items-center gap-8 self-stretch">
            <div className="flex w-[140px] h-[140] p-3.5 justify-center items-center gap-2.5 rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white shadow-md">
                <File06Icon width={100} height={100} />
            </div>
            <div className="flex items-center flex-0 gap-12">
                <div className="flex flex-col items-start gap-1">
                    <span className="text-Gray-900 text-lg font-semibold leading-7">
                    12 Months lease agreement
                    </span>
                    <span className="text-Gray-900 text-3xl font-semibold leading-38">
                    $2,000
                    </span>
                    <span className="text-Gray-700 text-base font-semibold leading-6">
                    Starts: 04/04/2024
                    </span>
                    <span className="text-Gray-700 text-base font-semibold leading-6">
                    Ends: 04/04/2025
                    </span>
                    <span className="text-Gray-600 text-base font-medium leading-6">
                    Scheduled move in: 04/07/2023
                    </span>
                </div>
            </div>
        </div>
    )
}