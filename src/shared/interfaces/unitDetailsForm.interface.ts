export interface IUnitDetailsForm {
  name?: string;
  address_1?: string;
  address_2?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string;
  unit_type?: string;
  market_rent?: number;
  description?: string;
  amenities?: string[];
  photos?: (File | undefined)[] | null;
  bedrooms?: string;
  bathrooms?: string;
  square_feet?: string;
  no_of_units?: string;
}

interface UnitInfo {
  name: string;
  state?: string;
  city?: string;
  address_1?: string;
  zip_code?: string;
  address_2?: string;
  no_of_units?: string
}
export interface UnitDetails {
  id: string;
  property_id: string;
  unit_type: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  market_rent: number;
  amenities: string[];
  unit_info: UnitInfo;
  photos: (string | File)[];
}

interface IAplicantData
  {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    coApplicant?: boolean,
    guarantor?: boolean,
    occupants?: boolean,

  }
  interface IEmployeeData {
    employmentStatus?: string;
    jobDescription?: string;
    companyName?: string;
    companyWebsite?: string;
    length?: string;
    monthlyWage?:string;
    firstName?: string;
    lastName?: string;
    title?: string;
    email?: string;
    phoneNumber?: string;
  }

export interface ITenantState {
  data?: {
    id?: string;
    coApplicantdata?: IAplicantData[]
    employmentsData?:IEmployeeData[] 
  };
}