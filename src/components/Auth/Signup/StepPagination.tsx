import { selectSignupState } from "@stores/authSlice";
import { useSelector } from "react-redux";

export function StepPagination() {
    const activeState = useSelector(selectSignupState)


    const rederPagintion = () => {
        const linesArr = [];

        for (let i = 0; i < 4; i++) {
            linesArr.push(
                <div
                    key={i}
                    className={`flex-0 h-2 rounded ${activeState === i ? 'bg-[#363F72]' : ' bg-[#EAECF0]'}`}
                ></div>
            );
        }

        return linesArr;
    };

    return (<>
        <div className="w-full max-w-xs flex  justify-center items-center gap-3">{rederPagintion()}</div>
    </>);
} 