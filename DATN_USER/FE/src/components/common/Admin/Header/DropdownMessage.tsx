import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { IoMdClose, IoMdSend } from "react-icons/io";
import instance from "../../../../configs/axios";
// import useLocalStorage from "../../hooks/Storage/useStorage";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";

const DropdownMessage = () => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(false); // State to control chat visibility
  const [selectedChat, setSelectedChat] = useState(null); // State to store the selected chat

  const { data } = useQuery({
    queryKey: ["Messengers", selectedChat?.senderId?._id],
    queryFn: async () => {
      if (!selectedChat) return;
      const response = await instance.get(
        `/messages/${userId}/${selectedChat?.senderId?._id}`
      );
      return response.data;
    },
    enabled: !!selectedChat, // Only fetch when a chat is selected
  });

  const { mutate } = useMutation({
    mutationFn: async (content) => {
      const { data } = await instance.post("/message/send", {
        content,
        senderId: `${userId}`,
        receiverId: `${selectedChat?.senderId?._id}`,
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

  const { data: chatList, isLoading } = useQuery({
    queryKey: ["Mess_admin"],
    queryFn: async () => {
      const response = await instance.get("/messages");
      return response.data;
    },
  });

  const filteredMessages = chatList?.data?.reduce((acc, receiver) => {
    const sender = receiver.senderId;
    console.log(sender);

    const receiverRole = sender?.role;

    if (receiverRole !== "admin") {
      if (!acc[sender?._id]) {
        acc[sender?._id] = {
          senderId: sender,
          messages: receiver.messages,
        };
      } else {
        acc[sender?._id].messages = [
          ...acc[sender?._id].messages,
          ...receiver.messages,
        ];
      }
    }
    return acc;
  }, {});

  const messagesArray = Object.values(filteredMessages || {});

  return (
    <div className="relative">
      <div
        onClick={() => setIsVisible(!isVisible)}
        className="relative flex w-[34px] h-[34px] items-center justify-center rounded-full border-[0.5px] bg-[#EFF4FB] cursor-pointer"
      >
        <span className="absolute -top-0.5 right-0 z-[2] h-2 w-2 rounded-full bg-red-700">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-700 opacity-75"></span>
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#677381"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bell hover:stroke-[#3C50E0]"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>
      {isVisible && (
        <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white right-0 w-[320px]">
          <div className="px-5 py-3">
            <h5 className="text-[14px] font-semibold text-[#8A99AF]">
              Tin Nhắn
            </h5>
          </div>

          {isLoading ? (
            <ul className="flex max-h-[300px] flex-col overflow-y-auto">
              <li className="px-5 py-3">Đang tải...</li>
            </ul>
          ) : messagesArray?.length > 0 ? (
            <ul className="flex max-h-[300px] flex-col overflow-y-auto">
              {messagesArray.map(({ senderId, messages }) => (
                <li
                  key={senderId?._id}
                  onClick={() => setSelectedChat({ senderId, messages })}
                >
                  <div className="flex space-x-3 gap-4.5 border-t border-stroke px-5 py-3 hover:bg-gray-200 cursor-pointer">
                    <div className="h-12 w-12">
                      <img
                        src={senderId?.avatar}
                        className="rounded-full"
                        alt="User"
                      />
                    </div>
                    <div className="text-black flex-1">
                      <h6 className="text-sm font-medium truncate max-w-[200px]">
                        {senderId?.userName || "not found"}
                      </h6>
                      <p className="text-sm text-[#8A99AF]">
                        {messages.slice(-1).map((message) => (
                          <div key={message?._id}>{message?.content}</div>
                        ))}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-3">Không có tin nhắn</div>
          )}
        </div>
      )}

      {selectedChat && (
        <div className="fixed inset-0 flex justify-end pr-[80px] mt-[220px]">
          <div className="h-[500px] flex justify-center items-center">
            <div className="w-[350px] max-w-md bg-white shadow-lg rounded-[10px] flex flex-col h-full border border-gray-300">
              <div className="flex bg-blue-500 text-white pt-1 justify-between items-center h-14 rounded-t-[10px]">
                <div className="flex items-center justify-between py-2 pl-2">
                  <div className="flex items-center">
                    <img
                      className="w-[32px] h-[32px] rounded-full"
                      src={
                        selectedChat?.senderId?.avatar ||
                        "https://vectorified.com/images/default-avatar-icon-12.png"
                      }
                      alt={selectedChat?.senderId?.userName || "Friend"}
                    />
                    <h2 className="text-li font-semibold pl-2">
                      {selectedChat?.senderId?.userName || "Friend"}
                    </h2>
                  </div>
                  <div className="flex items-center mr-0">
                    <IoMdClose
                      className="cursor-pointer text-[30px]"
                      onClick={() => setSelectedChat(null)} // Close popup
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sortedMessages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${msg?.senderId?._id === userId
                        ? "justify-end"
                        : "justify-start"
                      }`}
                  >
                    <div
                      className={`p-3 rounded-[20px] max-w-xs h-auto ${msg.senderId?._id === userId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                        }`}
                    >
                      {msg?.content}
                    </div>
                  </div>
                ))}
              </div>

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
    </div>
  );
};

export default DropdownMessage;
