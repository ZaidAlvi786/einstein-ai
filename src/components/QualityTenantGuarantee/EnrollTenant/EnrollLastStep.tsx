import { CheckDone01Icon, CheckIcon, CheckIcon01, CheckIcon02 } from '@assets/iconComponents';
import SvgCheckCircle from '@assets/iconComponents/CheckCircle';
import SvgCheckDone01 from '@assets/iconComponents/CheckDone01';
import SvgStepCheckComplete from '@assets/iconComponents/StepCheckComplete';
import { Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';

const EnrollLastStep = () => {
  const [isLoading, setIsLoading] = useState(true);
  const underReview = false;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="p-6 text-center">
      {underReview ? (
        <div className=" flex flex-col items-center gap-4">
          <SvgCheckCircle />
          <div className="text-4xl text-Gray-900 font-semibold">Under review</div>
          <div className="text-Gray-600 text-xl font-normal leading-7">
            We sucsefully recived tenant information, however, we were unable to verify and aprove
            instanly, we will review it witheen 48 hors and let know however if it is been aprooved.
          </div>
        </div>
      ) : (
        <div>
          {isLoading ? (
            <div className=" flex flex-col items-center gap-4">
              <Loader color="#3E4784" />
              <div className="text-4xl text-Gray-900 font-semibold">Processing</div>
              <div className="text-Gray-600 text-xl font-normal leading-7">
                Processing your application is underway. We appreciate your patience.
              </div>
            </div>
          ) : (
            <div className=" flex flex-col items-center gap-4">
              <SvgCheckCircle />
              <div className="text-4xl text-Gray-900 font-semibold">
                Tenant enrolled sucsefully!
              </div>
              <div className="text-Gray-600 text-xl font-normal leading-7">
                We will review your application and notefy you...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnrollLastStep;
