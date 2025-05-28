import instance from "../../configs/axios";

export const add_Notification = async (dataMessage: {
  userId: string | number;
  receiver_id: string | number;
  message: string | number;
  different?: string | number;
  id_different?: string | number;
}) => {
  try {
    const res = await instance.post(`/notification`, dataMessage);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const get_Notification_By_User = async (userId: string | number) => {
  try {
    const { data } = await instance.get(`/notification/${userId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// export const getAll_Notification = async () => {
//   try {
//     const { data } = await instance.get(`/notification`);
//     console.log(data);

//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };
export const getAll_Notification = async (role: string) => {
  try {
    const { data } = await instance.get(`/notification`, { params: { role } });
    return data;
  } catch (error) {
    console.log(error);
  }
}
export const update_Notification = async (id: string | number) => {
  try {
    const data = await instance.put(`/notification/${id}`, { status_notification: true });
    return data;
  } catch (error) {
    console.log(error);

  }
}
export const delete_Notification = async (id: string | number) => {
  try {
    const data = await instance.delete(`/notification/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

