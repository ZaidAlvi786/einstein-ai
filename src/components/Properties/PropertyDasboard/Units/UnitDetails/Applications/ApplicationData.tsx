import { useState } from 'react';
import { ApplicationStatus } from './ApplicationStatus';
import { ApplicationProfile } from './ApplicationProfile';
import { NoApplication } from './NoApplication';
interface Props {
  applicationStatus: string;
  applicationsData: any[];
}
export function ApplicationData({ applicationStatus, applicationsData }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleCollapse = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='flex flex-col items-center gap-6 flex-0 self-stretch'>
      <ApplicationStatus applicationsStatus={applicationStatus} />
      {applicationsData.length ? (
        applicationsData.map((application, index) => (
          <div key={index} className="w-full">
            <ApplicationProfile
              key={index}
              applicationData={application}
              index={index}
              isOpen={openIndex === index}
              toggleCollapse={() => toggleCollapse(index)}
            />
          </div>
        ))
      ) : (
        <>
          <NoApplication
            btnTitle="New Application"
            btnTitle2="Add tenant"
            title="No open applications"
          />
        </>
      )}
    </div>
  );
}
