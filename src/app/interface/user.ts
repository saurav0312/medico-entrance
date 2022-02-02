export interface User { 
    firstName: string; 
    lastName: string;
    email: string;
    phoneNumber?: number;
    address?: string;
    education?: string;
    country?: string;
    state?: string;
    imageUrl? : string;
  }