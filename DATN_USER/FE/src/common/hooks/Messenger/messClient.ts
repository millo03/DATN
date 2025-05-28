import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../../configs/axios";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import { Form, message } from "antd";
const clientMessHook = () => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["Messengers"],
    queryFn: async () => {
      const response = await instance.get(
        `/messages/670df3dee8e737d68b53fa83/${userId}`
      );
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (content) => {
      const { data } = await instance.post("/message/send", {
        content,
        senderId: `${userId}`,
        receiverId: "670df3dee8e737d68b53fa83",
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Messengers"],
      });
      form.resetFields();
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["Messengers"],
      });
      message.error("Gửi tin nhắn thất bại");
    },
  });

  const friendInfo =
    data?.[0]?.receiverId?._id === userId
      ? data?.[0]?.senderId
      : data?.[0]?.receiverId;

  const onFinish = (values) => {
    mutate(values.content);
  };

  const sortedMessages = data
    ?.flatMap((message) =>
      message.messages.map((msg) => ({
        ...msg,
        senderId: message.senderId,
        receiverId: message.receiverId,
      }))
    )
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return {
    friendInfo,
    onFinish,
    sortedMessages,
    form,
  };
};

export default clientMessHook;
