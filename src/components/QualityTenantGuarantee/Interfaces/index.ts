// Define the interface for the statusMessage property
interface StatusMessage {
    name: string;
    action: string | null;
  }
  
  // Define the interface for the searchMessage property
  interface SearchMessage {
    name: string;
    action: string | null;
  }
  
  // Define the main interface for each item in the qualityTenantTableData array
  export interface QualityTenantTableItem {
    unit: string;
    monthlyRent: string;
    status: string;
    address: string;
    statusMessage: StatusMessage;
    searchMessage: SearchMessage;
  }