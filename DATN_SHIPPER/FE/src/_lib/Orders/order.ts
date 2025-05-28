import instance from "../../configs/axios";

export async function list_order(dataClient: any) {
  try {
    let uri = `/list_order/${dataClient?.id_user}?_page=${dataClient?.page}&_limit=${dataClient?.limit}`;
    if (dataClient?.status) {
      uri += `&_status=${dataClient?.status}`;
    }
    const { data } = await instance.get(uri);
    return data;
  } catch (error) {
    return error;
  }
}
export const GetOrderBuyNumberOrNumberPhone = async (searchOrder: string) => {
  try {
    const { data } = await instance.post("/orders/search", { searchOrder });

    return data;
  } catch (error) {
    console.log(error);
  }
};
export const GetNew10OrderInDay = async () => {
  try {
    const { data } = await instance.get("/orders/all_order_day");
    return data;
  } catch (error) {
    console.log(error);
  }
};
