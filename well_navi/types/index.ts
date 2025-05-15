export interface SchemeType {
  id: number;
  Scheme_Name: string;
  Description: string;
  Benefits: string;
  Eligibility_Criteria: string;
  Documents_Required: string;
  Application_Process: string;
  Caste: string;
  Income: number;
  Gender: string;
  State: string;
  District: string;
}

export interface EligibilityFormData {
  caste: string;
  income: string;
  gender: string;
  state: string;
  district: string;
}
