// User interface in types.ts
export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  phoneNumber: number;
  email: string;
  password: string;
  // Add other fields as needed
};

// Token interface in types.ts
export type Token = {
  id?: number;
  user_id?: number;
  token: string;
  // Add other fields as needed
};
