export interface IVoucher {
  _id: string;
  name_voucher: string;
  code_voucher: string;
  description_voucher: string;
  quantity_voucher: number;
  usedCount: number;
  discountType: string;
  discountValue: number;
  minimumSpend: number;
  maxDiscount: number;
  allowedUsers: string[];
  startDate: Date;
  expirationDate: Date;
  isActive: unknown | boolean;
}
