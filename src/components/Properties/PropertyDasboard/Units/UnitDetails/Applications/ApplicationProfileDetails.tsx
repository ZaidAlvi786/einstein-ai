import { Edit01Icon, FileDownload, PdfFileIcon, PlusIcon, Trash01Icon, Users01Icon } from '@assets/iconComponents';
import { Button } from '@mantine/core';
import { ApplicationCarousel } from './ApplicationCarousel';
import { ApplicationAgreementCarousel } from './ApplicationAgreementCrousel';

const tenantCarouselData = {
  title: '3 tenants',
  cardData: [
    {
        id: 1,
        badge: 'Co-applicant',
        name: 'Calvin Brown',
        phone: '212-212-1100',
        email: 'calvin@email.com',
        
    },
    {
        id: 2,
        badge: 'Co-applicant',
        name: 'Calvin Brown',
        phone: '212-212-1100',
        email: 'calvin@email.com',
        
    },
    {
        id: 3,
        badge: 'Co-applicant',
        name: 'Calvin Brown',
        phone: '212-212-1100',
        email: 'calvin@email.com',
        
    },
    {
        id: 4,
        badge: 'Co-applicant',
        name: 'Calvin Brown',
        phone: '212-212-1100',
        email: 'calvin@email.com',
        
    }
  ]
  
  };
  const leaseCarouselData = {
    title: '12 Months lease agreement',
    leaseDate: 'Started: 04/04/2024 - Ends: 04/04/2025',
    cardData: [
        {   
            id: 1,
            name: '2024 lease agreement.pdf',
            size: '16 MB',
        },
        {   
            id: 2,
            name: '2024 lease agreement.pdf',
            size: '16 MB',
        },
        {   
            id: 3,
            name: '2024 lease agreement.pdf',
            size: '16 MB',
        },
        {   
            id: 4,
            name: '2024 lease agreement.pdf',
            size: '16 MB',
        }
    ]
  
  };
export function ApplicationProfileDetails() {
  return (
    <div className="flex py-10 px-6 flex-col items-start gap-8 self-stretch">
      <ApplicationCarousel carouselData={tenantCarouselData} />
      <ApplicationAgreementCarousel carouselData={leaseCarouselData} />
    </div>
  );
}
