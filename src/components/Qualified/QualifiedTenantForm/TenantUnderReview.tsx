import { SvgReview, SvgStepSuccess } from '@assets/iconComponents';
import { Button } from '@mantine/core';
import React from 'react';

const TenantUnderReview = () => (
  <div className="p-6">
    <div className="flex flex-col items-center gap-4">
      <SvgReview />
      <div className="text-Gray-900 text-4xl font-semibold -tracking-wide">Under review</div>
    </div>
    <div className="text-Gray-600 text-xl font-normal leading-7 mt-6 text-center">
      We successfully received tenant information, however, we were unable to verify and approve
      instanly, we will review it within 48 hors and let know however if it is been approved.
    </div>
  </div>
);

export default TenantUnderReview;
