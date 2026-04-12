export interface PolicyHolder {
  policyHolderId: string;
  name: string;
  email: string;
  role: string;
}

export interface Policy {
  policyId: string;
  policyNumber: string;
  coverageAmount: number;
  premiumAmount: number;
  startDate: string;
  endDate: string;
  policyHolderId: string;
}

export interface Claim {
  claimId: string;
  claimNumber: string;
  claimDate: string;
  claimAmount: number;
  claimStatus: string;
  policyId: string;
  policyHolderId: string;
  description?: string;
}

export interface Payment {
  paymentId: string;
  paymentDate: string;
  paymentAmount: number;
  paymentMode: string;
  transactionRefNo: string;
  claimId: string;
}

export interface AuthResponse {
  token: string;
  policyHolderId: string;
  name: string;
  role: string;
}
