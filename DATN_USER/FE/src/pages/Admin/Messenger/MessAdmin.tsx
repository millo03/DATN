import { Button, Form, Input, message } from "antd";
import { IoMdClose, IoMdSend } from "react-icons/io";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../../configs/axios";
import { useParams } from "react-router-dom";
import { useState } from "react";

const MessAdmin = () => {
  const { id } = useParams();
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(false); // State để kiểm soát hiển thị khung chat

  const { data } = useQuery({
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
        receiverId: `${id}`,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Messengers"] });
      form.resetFields();
    },
    onError: () => {
      message.error("Gửi tin nhắn thất bại");
    },
  });

  const friendInfo =
    data?.[0]?.receiverId?._id === userId
      ? data?.[0]?.senderId
      : data?.[0]?.receiverId;

  const onFinish = (values: any) => {
    mutate(values.content);
  };

  const sortedMessages = data
    ?.flatMap((message: any) =>
      message.messages.map((msg: any) => ({
        ...msg,
        senderId: message.senderId,
        receiverId: message.receiverId,
      }))
    )
    .sort(
      (a: number, b: number) => new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 flex justify-end pr-[80px] mt-[290px]">
          <div className="h-[500px] flex justify-center items-center">
            <div className="w-[350px] max-w-md bg-white shadow-lg rounded-[10px] flex flex-col h-full border border-gray-300">
              <div className="flex justify-between items-center bg-blue-500 text-white h-14 rounded-t-[10px] px-0">
                <div className="flex items-center ml-4">
                  <img
                    className="w-[32px] h-[32px] rounded-full"
                    src={
                      friendInfo?.avatarUrl ||
                      "https://vectorified.com/images/default-avatar-icon-12.png"
                    }
                    alt={friendInfo?.userName || "Friend"}
                  />
                  <h2 className="text-li font-semibold pl-2">
                    {friendInfo?.userName || "Friend"}
                  </h2>
                </div>

                <div className="flex items-center mr-4">
                  <IoMdClose
                    className="cursor-pointer text-[30px]"
                    onClick={() => setIsVisible(false)} // Ẩn khung chat
                  />
                </div>
              </div>

              {/* Nội dung tin nhắn */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sortedMessages?.map((msg: any, index: any) => (
                  <div
                    key={index}
                    className={`flex items-start ${
                      msg.senderId._id === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-[20px] max-w-xs h-auto ${
                        msg.senderId._id === userId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form gửi tin nhắn */}
              <div className="pt-5 pl-3 rounded-b-[10px]">
                <Form
                  name="basic"
                  onFinish={onFinish}
                  autoComplete="off"
                  className="flex"
                  form={form}
                >
                  <Form.Item name="content" className="w-[270px]">
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="ml-[10px]"
                    >
                      <IoMdSend />
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessAdmin;
