import instance from "../../configs/axios";

export const GetMessageByChatCoze = async (userId: string) => {
  try {
    const { data } = await instance.post(`/get_messages`, { userId });
    return data;
  } catch (error) {
    console.log(error || "Loi server !");
  }
};
export const SendMessage = async ({
  conversationId,
  content,
  user_id
}: {
  conversationId: string;
  content: string;
  user_id: string;
}) => {
  try {
    const { data } = await instance.post(`/send_messages`, {
      conversationId,
      content,
      user_id
    });
    return data;
  } catch (error) {
    console.log(error || "Loi server !");
  }
};
