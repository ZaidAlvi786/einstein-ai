import { Card } from '@mantine/core';
import { useState } from 'react';
import QualityTenantPaymentTabs from './QualityTenantPaymentTabs';
import QualityTenantEditPayment from './QualityTenantEditPayment';
import QualityTenantPaymentDetails from './QualityTenantPaymentDetails';

const QualityTenantPayment = () => {
  const [showPayment, setShowPayment] = useState<boolean>(false);
  return (
    <div className="mt-4">
      <Card
        withBorder
        classNames={{
          root: 'w-full p-7 flex flex-row gap-3 bg-white rounded-[12px] border-secondary border-solid border-[1px] drop-shadow-sm',
        }}
      >
        {showPayment ? (
          <QualityTenantEditPayment />
        ) : (
          <QualityTenantPaymentDetails setShowPayment={setShowPayment} />
        )}
      </Card>
      <QualityTenantPaymentTabs />
    </div>
  );
};

export default QualityTenantPayment;
