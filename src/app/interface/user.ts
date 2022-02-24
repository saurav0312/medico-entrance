export interface Userr { 
    firstName: string; 
    lastName: string;
    email: string;
    phoneNumber?: number;
    dob?: Date;
    address?: string;
    education?: string;
    country?: string;
    state?: string;
    imageUrl? : string;
    accountType: string;
    id?: string;
    isSubscribed?: boolean;
    teacherCode?: string;
  }