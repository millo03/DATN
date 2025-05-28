import { Button, Form, Input } from "antd";
import { IoMdSend } from "react-icons/io";
import clientMessHook from "../../../common/hooks/Messenger/messClient";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";

const Chat = () => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const { friendInfo, onFinish, sortedMessages, form } = clientMessHook();

  return (
    <div
      className="h-[500px] flex justify-center items-center"
      onClick={(event) => event.stopPropagation()} // Chặn sự kiện nhấp để không đóng chat
    >
      <div className="w-[350px] max-w-md bg-white shadow-lg rounded-[10px] flex flex-col h-full border border-gray-300">
        {/* Nội dung của Chat */}
        <div className="flex bg-blue-500 text-white pt-1 justify-between items-center h-14 rounded-t-[10px]">
          <div className="flex items-center flex-1 py-2 pl-2">
            <img
              className="w-[32px] h-[32px] rounded-full"
              src={
                friendInfo?.avatarUrl ||
                "https://vectorified.com/images/default-avatar-icon-12.png"
              }
              alt={friendInfo?.userName || "Friend"}
            />
            <h2 className="text-li font-semibold pl-2">
              {friendInfo?.userName || "Hỗ trợ khách hàng"}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sortedMessages?.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${
                msg.senderId._id === userId ? "justify-end" : "justify-start"
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
              <Button type="primary" htmlType="submit" className="ml-[10px]">
                <IoMdSend />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
