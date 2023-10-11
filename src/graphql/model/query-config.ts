export interface QueryConfig {
  text: string;
  values?: string[];
}
export interface DB {
  query: any
}
export interface InputCustomer {
  id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

