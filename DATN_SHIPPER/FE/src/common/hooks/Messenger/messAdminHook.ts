import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../../configs/axios";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import { Form, message } from "antd";
import { useParams } from "react-router-dom";
const messAdminHook = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["Messengers", id],
    queryFn: async () => {
      const response = await instance.get(`/messages/${userId}/${id}`);
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (content) => {
      const { data } = await instance.post("/message/send", {
        content,
        senderId: `${userId}`,
        receiverId: "66d35671ae9c6444f583e246",
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

export default messAdminHook;
