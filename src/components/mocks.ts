import { ModalProps } from '@interfaces/property.interface';
import { IQualityTenantSliderData } from '@interfaces/qualityTenant.interface';

const tempTenantImgUrl =
  'https://hips.hearstapps.com/hmg-prod/images/oppenheimer-64b9bef1a7561.png?crop=0.8032278088144009xw:1xh;center,top';

export const mockedTableData = [
  {
    unit: '101',
    monthlyRent: '$1250',
    status: 'Guaranteed',
    address: '123 Main St, New York NY',
    tenant: {
      name: 'John Doe',
      email: 'olivia@untitledui.com',
      avatar: tempTenantImgUrl,
    },
    leaseType: ['Renew lease', 'End lease'],
  },
  {
    unit: '102',
    monthlyRent: '$1100',
    address: '123 Main St, New York NY',
    status: 'Disqualified',
    tenant: {
      name: 'Phoenix Baker',
      email: 'phoenix@untitledui.com',
      avatar: tempTenantImgUrl,
    },
    leaseType: ['Renew lease', 'End lease'],
  },
  {
    unit: '103',
    monthlyRent: '$1300',
    address: '123 Main St, New York NY',
    status: 'NA',
    tenant: null,
    leaseType: ['New Application', 'Add tenant'],
  },
  {
    unit: '104',
    monthlyRent: '$1150',
    address: '123 Main St, New York NY',
    status: 'Pre-Qualified',
    tenant: {
      name: 'Demi Wilkinson',
      email: 'michaeljohnson@example.com',
    },
    leaseType: ['Renew lease', 'End lease', 'Gurantee lease'],
  },
  {
    unit: '105',
    monthlyRent: '$1250',
    address: '123 Main St, New York NY',
    status: 'Qualified',
    tenant: {
      name: 'Candice Wu',
      email: 'candice@untitledui.com',
      avatar: tempTenantImgUrl,
    },
    leaseType: ['Renew lease', 'End lease', 'Gurantee lease'],
  },
  {
    unit: '105',
    monthlyRent: '$1250',
    address: '123 Main St, New York NY',
    status: 'Approved',
    tenant: {
      name: 'Natali Craig',
      email: 'natali@untitledui.com',
    },
    leaseType: ['Renew lease', 'End lease', 'Gurantee lease'],
  },
  {
    unit: '105',
    monthlyRent: '$1250',
    address: '123 Main St, New York NY',
    status: 'Pending',
    tenant: {
      name: 'Natali Craig',
      email: 'natali@untitledui.com',
    },
    leaseType: ['Renew lease', 'End lease', 'Gurantee lease'],
  },
];
export const qualityTenantTableData = [
  {
    unit: '101',
    monthlyRent: '$1250',
    status: 'Guaranteed',
    address: '123 Main St, New York NY',
    statusMessage: {
      name: 'Auto renews April 2025 ',
      action: 'Cancel',
    },
    searchMessage: {
      name: 'Make a claim',
      action: null,
    },
  },
  {
    unit: '102',
    monthlyRent: '$1100',
    address: '123 Main St, New York NY',
    status: 'Disqualified',
    statusMessage: {
      name: 'Auto renews April 2025 ',
      action: 'Cancel',
    },
    searchMessage: {
      name: 'Make a claim',
      action: 'view',
    },
  },
  {
    unit: '103',
    monthlyRent: '$1300',
    address: '123 Main St, New York NY',
    status: 'NA',
    statusMessage: {
      name: 'Auto renews April 2025 ',
      action: 'Cancel',
    },
    searchMessage: {
      name: 'Make a claim',
      action: 'view',
    },
  },
];

export const qualityPaymentTableData = [
  {
    invoiceNo: 'Invoice #007 – Dec 2022',
    invoiceTitle: 'Whitestone Apartments',
    paymentMethod: {
      NotAvailable: 'NA',
    },
    status: 'Unpaid',
    statusMessage: {
      name: 'UnPaid',
      action: 'Pay now',
    },
  },
  {
    invoiceNo: 'Invoice #007 – Dec 2022',
    invoiceTitle: 'Whitestone Apartments',
    paymentMethod: {
      visa: '**1234',
    },
    status: 'Paid',
  },
  {
    invoiceNo: 'Invoice #007 – Dec 2022',
    invoiceTitle: 'Whitestone Apartments',
    paymentMethod: {
      bank: '**1234',
    },
    status: 'Paid',
  },
  {
    invoiceNo: 'Invoice #007 – Dec 2022',
    invoiceTitle: 'Whitestone Apartments',
    paymentMethod: {
      visa: '**1234',
    },
    status: 'Paid',
  },
];

export const qualifiedTableData = [
  {
    id: 1,
    unit: {
      title: 'Olivia Rhye',
      unitNumber: '101',
      apartment: 'Whitestone Apartments',
      address: '123 Main St, New York NY',
    },
    monthlyRent: '$1,250',
    status: 'Qualified',
    enroll: 'Enroll',
  },
  {
    id: 2,
    unit: {
      title: 'Olivia Rhye',
      unitNumber: '101',
      apartment: 'Whitestone Apartments',
      address: '123 Main St, New York NY',
    },
    monthlyRent: '$1,250',
    status: 'Qualified',
    enroll: 'Enroll',
  },
  {
    id: 3,
    unit: {
      title: 'Olivia Rhye',
      unitNumber: '101',
      apartment: 'Whitestone Apartments',
      address: '123 Main St, New York NY',
    },
    monthlyRent: '$1,250',
    status: 'Qualified',
    enroll: 'Enroll',
  },
  {
    id: 4,
    unit: {
      title: 'Olivia Rhye',
      unitNumber: '101',
      apartment: 'Whitestone Apartments',
      address: '123 Main St, New York NY',
    },
    monthlyRent: '$1,250',
    status: 'Qualified',
    enroll: 'Enroll',
  },
];
export const qualifiedApplicationTableData = [
  {
    unit: {
      title: 'Olivia Rhye',
      unitPrice: {
        from: '101',
        to: '$1,250',
      },
      apartment: 'Whitestone Apartments',
      address: '123 Main St, New York NY',
    },
    date: '04/21/2024',
    status: ['Qualified', 'Accepted', 'Schedueled'],
    action: ['Sign lease', 'Scheduel move in', 'Verify income'],
  },
  {
    unit: {
      title: 'Olivia Rhye',
      unitPrice: {
        from: '101',
        to: '$1,250',
      },
      apartment: 'Whitestone Apartments',
      address: '123 Main St, New York NY',
    },
    date: '04/21/2024',
    status: ['Qualified', 'Accepted'],
    action: ['Sign lease', 'Scheduel move in'],
  },
  {
    unit: {
      title: 'Olivia Rhye',
      unitPrice: {
        from: '101',
        to: '$1,250',
      },
      apartment: 'Whitestone Apartments',
      address: '123 Main St, New York NY',
    },
    date: '04/21/2024',
    status: ['Qualified'],
    action: ['Accept', 'Verify income'],
  },
  {
    unit: {
      title: 'Olivia Rhye',
      unitPrice: {
        from: '101',
        to: '$1,250',
      },
      apartment: 'Whitestone Apartments',
      address: '123 Main St, New York NY',
    },
    date: '04/21/2024',
    status: ['Qualified', 'Accepted'],
    action: ['Accept'],
  },
];

export const unitTableData = [
  {
    id: 1,
    unit: '134',
    marketRent: '$950',
    address: '123 W Main St',
    ameneties: ['Label', 'Label'],
    type: 'Marketing',
  },
  {
    id: 2,
    unit: '135',
    marketRent: '$950',
    address: '123 W Main St',
    ameneties: ['Label', 'Label'],
    type: 'Marketing',
  },
  {
    id: 3,
    unit: '176',
    marketRent: '$950',
    address: '123 W Main St',
    ameneties: ['Label', 'Label'],
    type: 'Marketing',
  },
  {
    id: 4,
    unit: '178',
    marketRent: '$950',
    address: '123 W Main St',
    ameneties: ['Label', 'Label'],
    type: 'Marketing',
  },
  {
    id: 5,
    unit: '198',
    marketRent: '$950',
    address: '123 W Main St',
    ameneties: ['Label', 'Label'],
    type: 'Marketing',
  },
  {
    id: 6,
    unit: '199',
    marketRent: '$950',
    address: '123 W Main St',
    ameneties: ['Label', 'Label'],
    type: 'Marketing',
  },
  {
    id: 7,
    unit: '213',
    marketRent: '$950',
    address: '123 W Main St',
    ameneties: ['Label', 'Label'],
    type: 'Marketing',
  },
];

export const modelCardUnitsData = [
  {
    unit: 'Model A',
    rent: 67,
    bedrooms: 2,
    bathrooms: 1,
    sqFt: 648,
  },
  {
    unit: 'Model B',
    rent: 75,
    bedrooms: 3,
    bathrooms: 2,
    sqFt: 850,
  },
  {
    unit: 'Model C',
    rent: 80,
    bedrooms: 3,
    bathrooms: 2,
    sqFt: 900,
  },
  // {
  //   unit: 'Model D',
  //   rent: 14,
  //   bedrooms: 3,
  //   bathrooms: 2,
  //   sqFt: 1670,
  // },
];
export const ownerDetails = [
  {
    type: 'Company',
    name: 'Corey Smith',
    address: '123 Main St. New York NY 11100',
    email: 'corey@gmail.com',
    phone: '212-111-2323',
  },
  {
    type: 'President',
    name: 'Corey Smith',
    email: 'corey@gmail.com',
    phone: '212-111-2323',
  },
];

export const managerDetails = [
  {
    type: 'Company',
    name: 'Manager Management Llc',
    address: '123 Main St. New York NY 11100',
    email: 'corey@gmail.com',
    phone: '212-111-2323',
  },
  {
    type: 'Property manager',
    name: 'Corey Smith',
    email: 'corey@gmail.com',
    phone: '212-111-2323',
  },
  {
    type: 'Leasing agant',
    name: 'Corey Smith',
    email: 'corey@gmail.com',
    phone: '212-111-2323',
  },
];

export const paymentMethods = [
  {
    method: 'visa',
    title: 'Visa ending in 1234',
    expiryDate: 'Expiry 06/2024',
    active: true,
  },
  {
    method: 'bankTransfer',
    title: 'Business checking',
    expiryDate: '',
    active: false,
    accountNumber: '21323131',
  },
  {
    method: 'bankTransfer',
    title: 'Business checking',
    expiryDate: '',
    active: false,
    accountNumber: '21323131',
  },
];
export const recievedAccountData = [
  {
    method: 'visa',
    title: 'Visa ending in 1234',
    expiryDate: 'Expiry 06/2024',
    active: true,
  },
  {
    method: 'bankTransfer',
    title: 'Business checking',
    expiryDate: '',
    active: false,
    accountNumber: '21323131',
  },
];

export const initialModalProps: ModalProps = {
  title: 'Delete payment method',
  desc: 'Are you sure you want to delete this payment method? This action cannot be undone.',
  bgColor: 'Error-600',
  hoverColor: 'hover:bg-Error-600',
  btnTitle: 'Delete',
  iconBg: 'bg-Error-100',
  borderColor: 'border-Error-50',
};

export const tenantData = [
{
  name: 'Corey Smith',
  email: 'corey@email.com',
  phone: '212-111-2323',
  leaseAgreement: '12 month lease agreement',
  moveDate: 'Moved in March 2 2023',
  status: 'QTG Qualified',
  lease: 'Guarantee lease',
  noticeStatus: 'Send notice',
  renew: 'Renew lease',
  moveApartment: 'Move apartment',
  moveOut: 'Move out',
  expireDate: 'Lease expires in 45 days (04/04/2024)',
  img: null,
  badge: 'Primary tenant',
  process: 'Current',
  rent: '$2000/month'

},
{
  name: 'Corey Smith',
  email: 'corey@email.com',
  phone: '212-111-2323',
  leaseAgreement: 'Month to month lease agreement',
  moveDate: 'Moved in March 2 2023',
  status: 'Guaranteed lease',
  lease: 'Make a claim',
  noticeStatus: 'Send notice',
  renew: 'Renew lease',
  moveApartment: 'Move apartment',
  moveOut: 'Move out',
  expireDate: 'Lease expires in 45 days (04/04/2024)',
  img: tempTenantImgUrl,
  badge: null,
  process: 'Notice sent',
  rent: '$2000/month'
},
{
  name: 'Corey Smith',
  email: 'corey@email.com',
  phone: '212-111-2323',
  leaseAgreement: '12 month lease agreement',
  moveDate: 'Moved in March 2 2023',
  status: 'QTG Qualified',
  lease: 'Update claim',
  noticeStatus: 'Send notice',
  claim: 'Make a claim',
  renew: 'Renew lease',
  moveApartment: 'Move apartment',
  moveOut: 'Move out',
  expireDate: 'Lease expires in 45 days (04/04/2024)',
  img:tempTenantImgUrl,
  badge: null,
  process: 'Under eviction',
  rent: '$2000/month'
},
]
export const applicationsTabData = [
  {
    name: 'Corey Smith',
    email: 'corey@email.com',
    phone: '212-111-2323',
    applyDate: 'Applied 04/04/2024',
    status: 'Screening prossesing',
    img: null,
    badge: 'Primary tenant',
    process: 'open',
    rent: '$2000/month',
  },
  {
    name: 'Corey Smith',
    email: 'corey@email.com',
    phone: '212-111-2323',
    applyDate: 'Applied 04/04/2024',
    status: 'Accepted',
    img: tempTenantImgUrl,
    badge: 'Primary tenant',
    process: 'open',
    rent: '$2000/month',
    
  
  },
  {
    name: 'Corey Smith',
    email: 'corey@email.com',
    phone: '212-111-2323',
    applyDate: 'Applied 04/04/2024',
    status: 'Lease signed',
    img: null,
    badge: null,
    rent: '$2000/month',
    process: 'schedule',
    moveIn: 'Scheduled for move in 05/05/2024',
    qtgGuarantee:true

  },
  {
    name: 'Corey Smith',
    email: 'corey@email.com',
    phone: '212-111-2323',
    applyDate: 'Applied 04/04/2024',
    status: 'Accepted',
    img: tempTenantImgUrl,
    badge: null,
    rent: '$2000/month',
    process: 'schedule',
    moveIn: 'Scheduled for move in 05/05/2024'
  },
  {
    name: 'Corey Smith',
    email: 'corey@email.com',
    phone: '212-111-2323',
    applyDate: 'Applied 04/04/2024',
    status: 'QTG Qualified',
    img:tempTenantImgUrl,
    badge: null,
    rent: '$2000/month',
    process:'close'
  },
  {
    name: 'Corey Smith',
    email: 'corey@email.com',
    phone: '212-111-2323',
    applyDate: 'Applied 04/04/2024',
    status: ' Disqualified',
    img:null,
    badge: null,
    rent: '$2000/month',
    process:'close'
  },
  ]

export const mockedPropertyData: IQualityTenantSliderData[] = [
  {
    name: 'Whitestone Apartments',
    address: '123 Main St, New York NY',
    tenant: '142 New qualified tenants',
    applications: '142 qualified applications',
    prospects: '142 qualified prospects',
    img: '',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St, New York NY',
    tenant: '142 New qualified tenants',
    applications: '142 qualified applications',
    prospects: '142 qualified prospects',
    img: '',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St, New York NY',
    tenant: '142 New qualified tenants',
    applications: '142 qualified applications',
    prospects: '142 qualified prospects',
    img: '',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St, New York NY',
    tenant: '142 New qualified tenants',
    applications: '142 qualified applications',
    prospects: '142 qualified prospects',
    img: '',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St, New York NY',
    tenant: '142 New qualified tenants',
    applications: '142 qualified applications',
    prospects: '142 qualified prospects',
    img: '',
  },
];

export const QualityPaymentCardData = [
  {
    name: 'Whitestone Apartments',
    address: '123 Main St. New York NY',
    price: '$2,015.20',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St. New York NY',
    price: '$2,045.20',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St. New York NY',
    price: '$2,035.20',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St. New York NY',
    price: '$2,095.20',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St. New York NY',
    price: '$2,015.20',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St. New York NY',
    price: '$2,045.20',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St. New York NY',
    price: '$2,035.20',
  },
  {
    name: 'Whitestone Apartments',
    address: '123 Main St. New York NY',
    price: '$2,095.20',
  },
];
