import { LogoWhiteTitle, StepInprogress, StepUncheck } from "@assets/iconComponents";
import SvgMail01 from "@assets/iconComponents/Mail01";
import SvgStepCheckComplete from "@assets/iconComponents/StepCheckComplete";
import { stepSignupData } from "@constants/app.constant";
import { Stepper } from "@mantine/core";
import { selectSignupState } from "@stores/authSlice";
import { useSelector } from "react-redux";


export function StepStatus() {
    const activeState = useSelector(selectSignupState)
    return (<>
        <div className="flex flex-col justify-between items-start flex-0 self-stretch bg-[#293056] min-h-screen">
            <div className="flex flex-col items-start self-stretch gap-20 p-8">
                <div>
                    <LogoWhiteTitle />
                </div>
                <div>
                    <Stepper completedIcon={<SvgStepCheckComplete/>} progressIcon={<StepInprogress/>} icon={<StepUncheck/>}
                    classNames={{ stepLabel: 'text-white text-base font-semibold mt-1.5',verticalSeparator: 'border-[#3E4784]',
                             stepDescription: 'text-brand-110 text-base font-normal',  
                             stepIcon: 'bg-inherit	border-[#3E4784]', step: 'pt-1 pr-0 pb-8 pl-0' }}
                              active={activeState} size="sm" orientation="vertical">
                        {stepSignupData.map((item, index) => (
                            <Stepper.Step classNames={{stepIcon: `${activeState === index ? 'border-[#3E4784] shadow-custom-for-step-ring': 'border-none'}`}}
                             key={index} label={item.label} description={item.desc} />

                        ))}
                    </Stepper>
                </div>
            </div>
            <div className="flex h-24 p-8 justify-between items-end self-stretch">
                <div className="text-brand-110 text-sm leading-5 font-normal">
                    © Untitled UI 2077
                </div>
                <div className="text-brand-110 text-sm font-normal">
                    <div className="flex gap-1 items-center leading-5">
                        <SvgMail01 /> help@untitledui.com

                    </div>
                </div>
            </div>
        </div>
    </>);
}