export interface Auth {
  _id?: string;
  email?: string;
  password?: string;
  userName?: string;
  fullName?: string;
  address: [
    {
      fullName: string;
      phoneNumber: string;
      addressDetails: string;
      addressType: string;
    }
  ];
  phone?: string[];
  role?: string;
  avatar?: string;
}
