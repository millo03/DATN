export interface IVoucher {
  _id: string;
  name_voucher: string;
  code_voucher: string;
  description_voucher: string;
  quantity_voucher: number;
  usedCount: number;
  discountType: string;
  discountValue: number;
  applyType: string;
  appliedProducts: string[];
  appliedCategories: string[];
  minimumSpend: number;
  maxDiscount: number;
  allowedUsers: string[];
  startDate: Date | null;
  expirationDate: Date | null;
  limitType: string;
  userType: string[]; // Thêm trường này
}
