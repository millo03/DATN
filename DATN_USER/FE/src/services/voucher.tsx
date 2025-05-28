import instance from "../configs/axios";

export const getVoucher = async () => {
  try {
    const { data } = await instance.get("/voucher");
    console.log("Voucher data from API:", data); // Log dữ liệu trả về từ API
    return data.vouchers;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw new Error("Failed to fetch vouchers");
  }
};
