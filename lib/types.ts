/**
 * CRM Field Configuration Schema
 */

export type DataType = 
  | 'NUMBER' 
  | 'DROPDOWN' 
  | 'TEXT' 
  | 'EMAIL' 
  | 'PHONE' 
  | 'MULTISELECT' 
  | 'DATE' 
  | 'USER' 
  | 'TEXTAREA';

export interface FieldConfig {
  genListColId: number;
  genListId: number;
  columnName: string;
  displayName: string;
  dataType: DataType;
  dbDataType: string;
  dbLength: number | null;
  dbPrecision: number | null;
  dbScale: number | null;
  displayOrder: number;
  placeholderText: string;
  helpText: string;
  required: boolean;
  defaultValue: string | null;
  minValue: string | null;
  maxValue: string | null;
  regexPattern: string | null;
  regexMessage: string | null;
  lovCode: string | null; // List of Values code for dropdowns
  customValidationExpr: string | null;
  validationErrorMessage: string | null;
  editable: boolean;
  visible: boolean;
  searchable: boolean;
  sortable: boolean;
  unique: boolean;
  indexed: boolean;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

export interface LeadData {
  [key: string]: string | number | string[] | null | undefined;
}

// Sample LOV data (would come from an API in production)
export const LOV_DATA: Record<string, Array<{ value: string; label: string }>> = {
  LEAD_SOURCE_LOV: [
    { value: 'WEBSITE', label: 'Website' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'AGENT', label: 'Agent' },
    { value: 'COLD_CALL', label: 'Cold Call' },
  ],
  LEAD_STATUS_LOV: [
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'DISQUALIFIED', label: 'Disqualified' },
  ],
  COUNTRY_LOV: [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'SG', label: 'Singapore' },
    { value: 'HK', label: 'Hong Kong' },
  ],
  SERVICE_LINE_INTERESTED_LOV: [
    { value: 'FREIGHT_FORWARDING', label: 'Freight Forwarding' },
    { value: 'TRANSPORTATION', label: 'Transportation' },
    { value: '3PL', label: '3PL' },
    { value: 'CUSTOMS_BROKERAGE', label: 'Customs Brokerage' },
  ],
};
