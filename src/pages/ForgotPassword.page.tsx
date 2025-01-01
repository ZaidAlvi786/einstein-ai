import { CheckEmail } from '@components/Auth/ForgotPassword/CheckEmail';
import { Email } from '@components/Auth/ForgotPassword/Email';
import { useCounter } from '@mantine/hooks';
export function ForgotPassword() {
  const [step, handlers] = useCounter(0, { min: 0, max: 1 });
  return (
    <>
      {step === 0 && <Email handlers={handlers} />}
      {step === 1 && <CheckEmail handlers={handlers} />}
    </>
  );
}
