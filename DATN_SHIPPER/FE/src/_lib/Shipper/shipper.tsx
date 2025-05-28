import instance from "../../configs/axios";

export const getAllShipper = async () => {
  try {
    const { data } = await instance.get("/shippers");
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const addShipperOrder = async (orderId: string, shipperId: string) => {
  try {
    const { data } = await instance.post(`/orders/shipper/${orderId}`, {
      shipperId
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
