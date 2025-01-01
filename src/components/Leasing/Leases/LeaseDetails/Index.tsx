import { LeaseAgreementCarousel } from "@shared/components/LeaseAgreementCrousel";
import { TenantCarousel } from "@shared/components/TenantCarousel"
const tenantCarouselData = {
    title: '2 tenants',
    cardData: [
      {
          id: 1,
          badge: 'Co-applicant',
          name: 'Calvin Brown',
          phone: '212-212-1100',
          email: 'calvin@email.com',
          status: 'verified'
          
      },
      {
          id: 2,
          badge: 'Co-applicant',
          name: 'Calvin Brown',
          phone: '212-212-1100',
          email: 'calvin@email.com',
          status: 'verifing'
      },
      {
          id: 3,
          badge: 'Co-applicant',
          name: 'Calvin Brown',
          phone: '212-212-1100',
          email: 'calvin@email.com',
          status: 'verified'
          
      },
      {
          id: 4,
          badge: 'Co-applicant',
          name: 'Calvin Brown',
          phone: '212-212-1100',
          email: 'calvin@email.com',
          status: 'verifing'
          
      }
    ]
    
    };
    const leaseCarouselData = {
      title: 'Lease agreements',
      leaseDate: '',
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
export const LeaseDetailsOverview = ()=>{
    return (
        <div className="flex flex-col items-center gap-10 self-stretch">
            <LeaseAgreementCarousel carouselData={leaseCarouselData} type="" />
            <TenantCarousel carouselData={tenantCarouselData} />
        </div>
    )
}