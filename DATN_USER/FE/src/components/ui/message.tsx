// import { useEffect, useRef, useState } from "react";
// import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
// import { FaSpinner } from "react-icons/fa6";
// import useLocalStorage from "../../common/hooks/Storage/useStorage";
// import { useGetMessageById } from "../../common/hooks/chatCoze/useChatCoze";
// import { ChatCozeMutation } from "../../common/hooks/chatCoze/useChatCozeMutation";
// import { List_Auth } from "../../common/hooks/Auth/querry_Auth";
// interface IDataMessageByRole {
//   role: string;
//   content: string;
//   content_type: string;
// }
// const formatMessageWithProductLink = (message: string): string => {
//   if (typeof message !== "string") {
//     console.warn("Message không phải là chuỗi:", message);
//     return "";
//   }

//   // Regex để tìm các URL
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   // Regex để tìm ID sản phẩm (24 ký tự hex)
//   const productIdRegex = /\b([a-f0-9]{24})\b/;

//   return message.replace(urlRegex, (url) => {
//     const productIdMatch = url.match(productIdRegex);
//     // Kiểm tra nếu URL chứa ID sản phẩm
//     if (productIdMatch) {
//       // Tạo liên kết với URL chứa ID
//       return `<a href="http://localhost:7899/shops/${productIdMatch[0]}" target="_blank" class="text-blue-800 underline underline-offset-1" rel="noopener noreferrer">tại đây</a>`;
//     }
//     // Nếu chỉ là URL thường, gắn URL trực tiếp
//     return `<a href="${url}" target="_blank" class="text-blue-800 underline underline-offset-1" rel="noopener noreferrer">tại đây</a>`;
//   });
// };
// const Message = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [user] = useLocalStorage("user", {});
//   const userId = user?.user?._id;
//   const { data, isLoading: loading_message, error } = useGetMessageById(userId);
//   const { data: getUser } = List_Auth(userId);
//   const { mutate: SendMessage, isLoading } = ChatCozeMutation();
//   const messagesEndRef = useRef(null);
//   console.log("data user", getUser);
//   const [message, setMessage] = useState<string>("");
//   const [dataMessageByRole, setDataMessageByRole] = useState<
//     IDataMessageByRole[]
//   >([]);
//   const [isLoadingReply, setIsLoadingReply] = useState<boolean>(false);

//   const toggleChat = () => {
//     setIsChatOpen((prev) => {
//       const nextState = !prev;
//       return nextState;
//     });
//   };
//   const handleSendMessage = (event: React.FormEvent) => {
//     event.preventDefault();
//     const newMessage = { role: "user", content: message, content_type: "text" };
//     setDataMessageByRole([...dataMessageByRole, newMessage]);

//     setMessage("");
//     setIsLoadingReply(true);
//     SendMessage(
//       {
//         conversationId: data?.conversation_Id,
//         content: message,
//         user_id: userId
//       },
//       {
//         onSuccess: () => {
//           setIsLoadingReply(false);
//           const messageAssistant = {
//             role: "assistant",
//             content: data?.content,
//             content_type: "text"
//           };
//           setDataMessageByRole([messageAssistant, ...dataMessageByRole]);
//         },
//         onError: (error) => {
//           console.error("Lỗi khi gửi tin nhắn:", error);
//         }
//       }
//     );
//   };
//   useEffect(() => {
//     if (data) {
//       const reversedData = data?.data?.data
//         ?.map((item: any) => ({
//           role: item.role,
//           content: item.content,
//           content_type: item.content_type
//         }))
//         .reverse();

//       setDataMessageByRole(reversedData);
//     }
//   }, [data]);
//   useEffect(() => {
//     if (isChatOpen && messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView();
//     }
//   }, [isChatOpen, dataMessageByRole]);

//   // if (isLoading) {
//   //   return <p>Loading messages...</p>;
//   // }
//   // if (error) {
//   //   return <p>Error loading messages</p>;
//   // }
//   return (
//     <>
//       <div>
//         {!isChatOpen && (
//           <button
//             className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
//             type="button"
//             aria-haspopup="dialog"
//             aria-expanded="false"
//             data-state="closed"
//             onClick={toggleChat}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width={30}
//               height={40}
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth={2}
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="text-white block border-gray-200 align-middle"
//             >
//               <path
//                 d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
//                 className="border-gray-200"
//               ></path>
//             </svg>
//           </button>
//         )}

//         {isChatOpen && (
//           <div
//             style={{
//               boxShadow: "rgb(95 95 95) 0px 1px 20px 0px"
//             }}
//             className="fixed right-[-7px] bottom-2 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[60vh] h-[90vh] z-[100] flex flex-col"
//           >
//             <div className="flex items-center justify-between pb-6">
//               <div className="flex flex-col space-y-1.5">
//                 <h2 className="font-semibold text-lg tracking-tight">Seven</h2>
//                 <p className="text-sm text-[#6b7280] leading-3">
//                   Tư vấn khách hàng
//                 </p>
//               </div>
//               <div>
//                 <button
//                   className="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition duration-150"
//                   aria-label="Close"
//                   onClick={toggleChat}
//                 >
//                   <AiOutlineClose className="text-gray-600" />
//                 </button>
//               </div>
//             </div>
//             <div className="pr-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded scrollbar-none">
//               {dataMessageByRole?.map((message: any, index:number) => (
//                 <>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "10px"
//                     }}
//                   >
//                     <div
//                       key={message._id}
//                       style={{
//                         display: "flex",
//                         justifyContent:
//                           message.role === "assistant"
//                             ? "flex-start"
//                             : "flex-end"
//                       }}
//                     >
//                       <div
//                         style={{
//                           maxWidth: "70%",
//                           padding: "10px",
//                           borderRadius: "10px",
//                           marginTop: "10px",
//                           backgroundColor:
//                             message.role === "assistant"
//                               ? "#f0f0f0"
//                               : "#084c61",
//                           color:
//                             message.role === "assistant" ? "#000" : "white",
//                           textAlign: "left"
//                         }}
//                       >
//                         <p
//                           className="leading-relaxed max-w-[300px]"
//                           dangerouslySetInnerHTML={{
//                             __html:
//                               message.role === "assistant"
//                                 ? formatMessageWithProductLink(message.content)
//                                 : message.content
//                           }}
//                         ></p>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               ))}
//               {isLoadingReply && (
//                 <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
//                   <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//                     <div className="rounded-full bg-gray-100 border p-1">
//                       <svg
//                         stroke="none"
//                         fill="black"
//                         strokeWidth="1.5"
//                         viewBox="0 0 24 24"
//                         aria-hidden="true"
//                         height={20}
//                         width={20}
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
//                         ></path>
//                       </svg>
//                     </div>
//                   </span>
//                   <p className="leading-relaxed">
//                     <span className="block font-bold text-gray-700">seven</span>
//                     đang soạn tin nhắn...
//                   </p>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="flex items-center pt-4">
//               <form
//                 onSubmit={handleSendMessage}
//                 className="flex items-center gap-2"
//               >
//                 <input
//                   className="flex h-10 w-[48vh] rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
//                   placeholder="Nhập tin nhắn ..."
//                   disabled={isLoading}
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                 />

//                 <button className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2">
//                   {isLoading || loading_message ? (
//                     <FaSpinner className="animate-spin" />
//                   ) : (
//                     <AiOutlineSend />
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Message;
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa6";
import useLocalStorage from "../../common/hooks/Storage/useStorage";
import { useGetMessageById } from "../../common/hooks/chatCoze/useChatCoze";
import { ChatCozeMutation } from "../../common/hooks/chatCoze/useChatCozeMutation";
import { List_Auth } from "../../common/hooks/Auth/querry_Auth";

interface IDataMessageByRole {
  role: string;
  content: string;
  content_type: string;
}

const formatMessageWithProductLink = (message: string): string => {
  if (typeof message !== "string") {
    console.warn("Message không phải là chuỗi:", message);
    return "";
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const productIdRegex = /\b([a-f0-9]{24})\b/;

  return message.replace(urlRegex, (url) => {
    const productIdMatch = url.match(productIdRegex);
    if (productIdMatch) {
      return `<a href="http://localhost:7899/shops/${productIdMatch[0]}" target="_blank" class="text-blue-800 underline underline-offset-1" rel="noopener noreferrer">tại đây</a>`;
    }
    return `<a href="${url}" target="_blank" class="text-blue-800 underline underline-offset-1" rel="noopener noreferrer">tại đây</a>`;
  });
};

const Message = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const { data, isLoading: loading_message, error } = useGetMessageById(userId);
  const { data: getUser } = List_Auth(userId);
  const { mutate: SendMessage, isLoading } = ChatCozeMutation();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [dataMessageByRole, setDataMessageByRole] = useState<
    IDataMessageByRole[]
  >([]);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    const newMessage = { role: "user", content: message, content_type: "text" };

    // Kiểm tra dataMessageByRole là mảng trước khi spread
    setDataMessageByRole((prev) =>
      Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
    );

    setMessage("");
    setIsLoadingReply(true);
    SendMessage(
      {
        conversationId: data?.conversation_Id,
        content: message,
        user_id: userId
      },
      {
        onSuccess: (response) => {
          setIsLoadingReply(false);
          // Lấy nội dung từ phản hồi API thay vì data?.content
          const assistantMessage = {
            role: "assistant",
            content: response?.data?.content || "Response from assistant",
            content_type: "text"
          };
          setDataMessageByRole((prev) =>
            Array.isArray(prev)
              ? [...prev, assistantMessage]
              : [assistantMessage]
          );
        },
        onError: (error) => {
          console.error("Lỗi khi gửi tin nhắn:", error);
          setIsLoadingReply(false);
        }
      }
    );
  };

  useEffect(() => {
    if (data?.data?.data && Array.isArray(data.data.data)) {
      const reversedData = data.data.data
        .map((item: any) => ({
          role: item.role,
          content: item.content,
          content_type: item.content_type
        }))
        .reverse();
      setDataMessageByRole(reversedData);
    } else {
      // Nếu không có dữ liệu hợp lệ, đặt lại thành mảng rỗng
      setDataMessageByRole([]);
    }
  }, [data]);

  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isChatOpen, dataMessageByRole]);

  return (
    <div>
      {!isChatOpen && (
        <button
          className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          onClick={toggleChat}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={30}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white block border-gray-200 align-middle"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
        </button>
      )}

      {isChatOpen && (
        <div
          style={{ boxShadow: "rgb(95 95 95) 0px 1px 20px 0px" }}
          className="fixed right-[-7px] bottom-2 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[60vh] h-[90vh] z-[100] flex flex-col"
        >
          <div className="flex items-center justify-between pb-6">
            <div className="flex flex-col space-y-1.5">
              <h2 className="font-semibold text-lg tracking-tight">Seven</h2>
              <p className="text-sm text-[#6b7280] leading-3">
                Tư vấn khách hàng
              </p>
            </div>
            <div>
              <button
                className="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition duration-150"
                aria-label="Close"
                onClick={toggleChat}
              >
                <AiOutlineClose className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="pr-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded scrollbar-none">
            {loading_message && <p>Loading messages...</p>}
            {error && <p>Error loading messages: {error.message}</p>}
            {dataMessageByRole?.map((message, index) => (
              <div
                key={index} // Sử dụng index làm key tạm thời, nên thay bằng message.id nếu có
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      message.role === "assistant" ? "flex-start" : "flex-end"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "10px",
                      borderRadius: "10px",
                      marginTop: "10px",
                      backgroundColor:
                        message.role === "assistant" ? "#f0f0f0" : "#084c61",
                      color: message.role === "assistant" ? "#000" : "white",
                      textAlign: "left"
                    }}
                  >
                    <p
                      className="leading-relaxed max-w-[300px]"
                      dangerouslySetInnerHTML={{
                        __html:
                          message.role === "assistant"
                            ? formatMessageWithProductLink(message.content)
                            : message.content
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {isLoadingReply && (
              <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                  <div className="rounded-full bg-gray-100 border p-1">
                    <svg
                      stroke="none"
                      fill="black"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      height={20}
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2UX 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                  </div>
                </span>
                <p className="leading-relaxed">
                  <span className="block font-bold text-gray-700">Seven</span>
                  đang soạn tin nhắn...
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center pt-4">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <input
                className="flex h-10 w-[48vh] rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder="Nhập tin nhắn ..."
                disabled={isLoading || loading_message}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
                disabled={isLoading || loading_message}
              >
                {isLoading || loading_message ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <AiOutlineSend />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
