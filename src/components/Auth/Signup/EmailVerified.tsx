import { ArrowBack, CheckCircle } from '@assets/iconComponents';
import { Button } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { setNextSignupState } from '@stores/authSlice';
import { StepPagination } from './StepPagination';
import { StepStatus } from './StepStatus';

interface props {
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}

export function EmailVerified({ handlers }: props) {
  const dispatch = useDispatch();
  const continueNext = () => {
    handlers.increment();
    dispatch(setNextSignupState());
  };
  const goBack = () => {
    handlers.decrement();
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex flex-col relative pt-29 pb-24 items-center w-full max-w-full min-h-screen bg-[url(/src/assets/patterns/radial-lines.svg)] bg-top-12.8  bg-no-repeat">
          <div className="w-full px-15">
            <Button
              onClick={goBack}
              leftSection={<ArrowBack />}
              className="hover:bg-white rounded-lg border bg-white flex gap-1.5 py-2.5 px-4 border-gray-300 border-solid shadow-sm"
            >
              {/* <ArrowBack /> */}
              <span className="text-gray-700 text-base font-semibold">Back</span>
            </Button>
          </div>
          <div className="flex flex-col items-center px-8 self-strech ">
            <div className="flex flex-col items-center self-strech gap-8">
              <div className="flex flex-col items-center gap-6 self-strech">
                <div className="w-14 h-14 border-solid flex justify-center items-center shadow-input border border-gray-300 rounded-xl">
                  <CheckCircle />
                </div>
                <div className="flex flex-col gap-3 items-center self-strech">
                  <div className="text-gray-900 text-center text-3xl font-semibold leading-xxxl">
                    Email verified
                  </div>
                  <div className="text-gray-600 text-base font-normal">
                    Your email has been successfully verified.
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full items-center gap-8 self-strech">
                <Button
                  onClick={continueNext}
                  size="md"
                  className="bg-brand-970 w-full hover:bg-brand-960 text-base font-semibold rounded-lg"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center absolute bottom-10">
            <StepPagination />
          </div>
        </div>
        <div className="flex max-w-lgSm flex-col w-full min-h-screen">
          <StepStatus />
        </div>
      </div>
    </>
  );
}
