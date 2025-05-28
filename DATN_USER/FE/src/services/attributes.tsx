import instance from "../configs/axios";

export interface Size {
  name_size: string;
  stock_attribute: number;
  price_attribute: number;
  _id: string;
}

export interface Value {
  color: string;
  size: Size[];
  _id: string;
}

export interface AttributeData {
  _id: string;
  id_item: string;
  values: Value[];
}

export const getAll = async (): Promise<AttributeData[]> => {
  try {
    const { data } = await instance.get<{ data: AttributeData[] }>(
      "/attributes"
    );
    console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu nhận được từ API
    return data.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thuộc tính:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};
