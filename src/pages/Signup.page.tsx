import { GetStarted } from '@components/Auth/Signup/GetStarted';
import { EmailOTP } from '@components/Auth/Signup/EmailOTP';
import { useCounter } from '@mantine/hooks';
import { EmailVerified } from '@components/Auth/Signup/EmailVerified';
import { Portfolio } from '@components/Auth/Signup/Portfolio';
import { AddProperty } from '@components/Auth/Signup/AddProperty';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { APP_PATHS } from '@routes/app-paths';

export function SignupPage() {
  const [step, handlers] = useCounter(0, { min: 0, max: 4 });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(searchParams.get('google_signin')) {
       handlers.set(3);
       navigate(APP_PATHS.signup.get());
    }
  }, [searchParams.get('google_signin')]);
  
  return (
    <>
      {step === 0 && <GetStarted handlers={handlers} />}
      {step === 1 && <EmailOTP handlers={handlers} />}
      {step === 2 && <EmailVerified handlers={handlers} />}
      {step === 3 && <Portfolio handlers={handlers} />}
      {step === 4 && <AddProperty handlers={handlers} />}
    </>
  );
}
