export interface IProterty {
  name?: string;
  units: number;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  zip_code: string;
  association_with_property: string;
}
export interface PropertyDetails {
  id?: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip_code: string;
  association_with_property: string;
  name: string;
  units: number;
  description: string;
  photos: File[];
}

export interface OwnerDetails {
  owner?: any;
  index?: undefined;
  ownerData: any;
  title?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

export interface ContactDetails {
  id?: string;
  property_id: string;
  phone_number: string;
  email: string;
  company: string;
  company_info?: {
    company_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip_code: string;
  };
  property_owner: Array<string>;
  property_manager: Array<string>;
}

export interface AddUnitDetails {
  photos?: Array<string>;
  property_id: string;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  market_rent?: number;
  description?: string;
  amenities?: Array<string>;
  unit_type: string;
  unit_info: Array<object>;
}

export interface EditUnitDetailsArgs {
  id: string;
  userData: AddUnitDetails;
}

export interface PropertyManegerSchema {
  maneger?: any;
  first_name?: string;
  index?: number;
  last_name?: string;
  title: string;
  phone_number?: string;
  email?: string;
}

export interface ModalProps {
  title: string;
  desc: string;
  bgColor: string;
  hoverColor: string;
  btnTitle: string;
  iconBg: string;
  borderColor: string;
}
export interface UnitModelInterface {
  model_name: string;
  number_of_units: number;
  address: string;
  rent: number;
  amenities: string[];
}

export interface PaymentInterface {
  title?: string;
  expiryDate?: string;
  active?: boolean;
  method?: string;
  accountNumber?: string;
}

export interface Unit {
  id: string;
  unit_name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  market_rent: number;
  description: string;
  photos: string[];
  amenities: string[];
}

export interface UnitModelDataInterface {
  id: string;
  property_id: string;
  unit_type: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  market_rent: number;
  amenities: string[];
  unit_info?: Record<string, any>; // Replace with a more specific type if known
  photos: string[];
  units?: Unit[]; // Optional in case there are no units
}

export interface SingleUnitInterface {
  no_of_units: Number;
  unitResponse: [];
  last_evaluated_key: null;
}
export interface MultipleUnitInterface {
  [x: string]: any;
  length: number;
  slice: any;
  id: string;
  property_id: string;
  unit_type: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  market_rent: number;
  amenities: string[];
  unit_info: UnitModelInterface;
  photos: string[];
  units: Unit[];
}