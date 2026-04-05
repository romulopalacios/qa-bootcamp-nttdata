export interface User {
  id: string;
  phone: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date: string; // ISO String
  counterparty: string; // Name of sender/receiver
  description: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  service: 'Auth' | 'Wallet' | 'Transaction' | 'Contact';
  summary: string;
  description: string;
  parameters?: Array<{ name: string; in: string; required: boolean; type: string }>;
  body?: Record<string, any>;
  responses: Record<number, string>;
}

export interface ServiceLog {
  timestamp: string;
  service: string;
  action: string;
  status: 'INFO' | 'SUCCESS' | 'ERROR';
  details?: string;
  requestDetails?: {
    method: string;
    url: string;
    headers: any;
    body: any;
  };
  responseDetails?: {
    status: number;
    body: any;
  };
}