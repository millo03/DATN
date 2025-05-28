export interface Shipper {
  _id: string;
  avatar: string;
  fullName: string;
  userName?: string;
  email?: string;
  vehicle: string;
  phone: string;
  birthDate: string;
  address: string;
  role?: string;
  status: "On delivery" | "Available" | "Offline";
}
