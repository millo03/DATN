// Component Message.jsx
import { useState } from "react";
import message from "../../assets/Images/Logo/logoMessage.jpg";
// import Chat from "../../pages/Client/Chat/Chat";

const Message = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed right-4 bottom-24 z-50">
      {/* Biểu tượng tin nhắn */}
      <div className="w-[55px] h-[55px] cursor-pointer" onClick={toggleChat}>
        <img
          src={message}
          alt="Message Icon"
          className="rounded-full w-full h-full object-cover"
        />
      </div>

      {/* Popup chat */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-40 flex justify-end items-end"
          onClick={toggleChat}
        >
          {/* Lớp phủ mờ */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Nội dung chat */}
          <div
            className="relative w-[350px] h-[500px] mr-4 mb-24"
            onClick={(event) => event.stopPropagation()}
          >
            {/* <Chat onClose={toggleChat} /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
