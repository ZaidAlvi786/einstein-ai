import CehckCircle from "@assets/iconComponents/CheckCircle";
import { Button } from "@mantine/core";
import { APP_PATHS } from "@routes/app-paths";
import { useNavigate } from "react-router-dom";


interface props {
    onClose: () => void;
}

export function VerifiedPhoneNumber({ onClose }: props) {
    const navigate = useNavigate();

    const verifiedSubmit = () => {
        onClose();
        navigate(APP_PATHS.login.get());

    } 
    return (<>
        <div className="bg-no-repeat bg-[url(/src/assets/patterns/radial-lines2.svg)] bg-top">
            <div className="flex flex-col items-center self-stretch px-6 pt-6">
                <div className="rounded-xxxl border-solid	border-8 border-[#F8F9FC] bg-[#EAECF5]">
                    <CehckCircle />
                </div>
                <div className="flex flex-col items-center self-stretch gap-1 py-5">
                    <div className="text-gray-900 text-center text-lg leading-7	 font-semibold">
                        Phone number verified.
                    </div>
                    <div className="text-gray-600 text-center font-normal text-sm leading-5">
                        Your phone number has been successfully verified.
                    </div>
                </div>
                <div className="pt-8 w-full">
                    <Button
                        size="md"
                        className="bg-brand-970 w-full hover:bg-brand-960 text-base font-semibold rounded-lg"
                        onClick={verifiedSubmit}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    </>);
}