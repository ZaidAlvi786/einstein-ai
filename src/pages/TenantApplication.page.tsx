import { GetStarted } from '@components/Auth/Signup/GetStarted';
import { EmailOTP } from '@components/Auth/Signup/EmailOTP';
import { useCounter } from '@mantine/hooks';
import { EmailVerified } from '@components/Auth/Signup/EmailVerified';
import { Portfolio } from '@components/Auth/Signup/Portfolio';
import { AddProperty } from '@components/Auth/Signup/AddProperty';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { APP_PATHS } from '@routes/app-paths';
import { Details } from '@components/TenantApplication/Details';
import { Employment } from '@components/TenantApplication/Employment';
import { Address } from '@components/TenantApplication/Address';

export function TenantApplicationPage() {
  const [step, handlers] = useCounter(0, { min: 0, max: 4 });

  
  return (
    <>
      {step === 0 && <Details handlers={handlers}  step={step} />}
      {step === 1 && <Employment handlers={handlers}  step={step} />}
      {step === 2 && <Address handlers={handlers}  step={step} />}
    </>
  );
}
