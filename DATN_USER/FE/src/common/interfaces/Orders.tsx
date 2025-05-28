import { ReactNode } from "react";

export interface IOrder {
  _id?: string;
  userId: string;
  shipperId: string;
  items: {
    name_size: ReactNode;
    color_item: ReactNode;
    productId: any;
    _id?: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
  }[];
  orderNumber?: string | any;
  customerInfo: {
    userName: string;
    phone: string;
    email: string;
    payment?: string;
    city?: string;
    address?: string;
    code?: string;
  };
  cancellationRequested?: boolean;
  discount: number;
  totalPrice: number;
  discountCode: String;
  discountAmount: Number;
  status?:
    | "Chờ xác nhận"
    | "Đang chuẩn bị hàng"
    | "Đang vận chuyển"
    | "Đã giao hàng"
    | "Đã hủy"
    | "Giao hàng thành công"
    | "Giao hàng thất bại";
  datetime?: Date;
}
