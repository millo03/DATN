import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  // const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitted] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      const formData = new FormData(form.current);
      const emailInput = formData.get("email") as string;

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(emailInput)) {
        toast.error("Định dạng email không hợp lệ, vui lòng thử lại.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        return;
      }

      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        content: formData.get("content")
      };

      try {
        const response = await fetch("http://localhost:2004/api/v1/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          emailjs
            .sendForm(
              "service_cwchhdc",
              "template_dxp3ou9",
              form.current,
              "kGSzc2RJ3qF1lHtBo"
            )
            .then(
              () => {
                toast.success("Gửi email thành công!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                });
                form.current?.reset();
                //setIsSubmitted(true); // Disable nút gửi sau khi gửi thành công
              },
              (error) => {
                toast.error("Gửi email thất bại: " + error.text, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                });
              }
            );
        } else {
          toast.error("Gửi email thất bại", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
        }
      } catch (error) {
        toast.error("Gửi email thất bại", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    }
  };

  return (
    <div className="max-w-[1440px] w-[95vw] mx-auto">
      <div className="lg:mt-[40px] mt-[60px]">
        <div className="text-sm py-6 bg-[#F3F3F3] font-medium px-[2.5%] rounded">
          <Link to={`/`} className="text-gray-500 hover:text-black">
            Trang chủ
          </Link>
          <span className="mx-1 text-gray-500">&#10148;</span>
          Liên hệ
        </div>
        <div className="grid grid-cols-1 gap-4 mx-auto my-10 sm:grid-cols-2 md:grid-cols-2">
          <div>
            <h2 className="text-[25px] text-[#222222] font-semibold">
              Hãy giữ liên lạc! Liên hệ với chúng tôi
            </h2>
            <p className="text-[16px] text-[#999999] mt-5 max-w-[683px]">
              Phong cách tối giản không phải là tạo ra một không gian lạnh lẽo,
              cứng nhắc, trống rỗng. Đó là việc sử dụng những hình thức đơn giản
              và tự nhiên, đồng thời bỏ đi những lớp thừa thãi mà không mất đi
              vẻ đẹp thẩm mỹ của không gian.
            </p>
            <form ref={form} onSubmit={sendEmail}>
              <label className="block mt-4">Tên của bạn</label>
              <input
                className="lg:w-[683px] md:w-[90%] w-full h-[45px] border border-[#999999] rounded-md pl-4"
                type="text"
                name="name"
                placeholder="Tên của bạn"
                required
              />
              <label className="block mt-4">Email của bạn</label>
              <input
                className="lg:w-[683px] md:w-[90%] w-full h-[45px] border border-[#999999] rounded-md pl-4"
                type="email"
                name="email"
                placeholder="Email của bạn"
                required
              />
              <label className="block mt-4">Nội dung</label>
              <textarea
                className="lg:w-[683px] md:w-[90%] w-full h-[100px] border border-[#999999] rounded-md pl-4 pt-4"
                name="content"
                placeholder="Nội dung tin nhắn"
                required
              />
              <input
                className={`lg:w-[683px] md:w-[90%] w-full h-[45px] bg-black text-white mt-4 rounded-md text-sm ${
                  isSubmitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-[#f68e56]"
                }`}
                type="submit"
                value="Gửi"
                disabled={isSubmitted}
              />
            </form>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d35427.43096480121!2d105.73307722867943!3d21.038688557329184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345457e292d5bf%3A0x20ac91c94d74439a!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1747673509174!5m2!1svi!2s"
              className="lg:w-[710px] w-full h-[510px]"
              style={{ border: "0" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

// import React, { useEffect, useRef, useState } from "react";
// import { FaSpinner } from "react-icons/fa6";
// import { Link } from "react-router-dom";
// import { SendMessageMutation } from "../../../common/hooks/Message/useMessageMutation";
// import useLocalStorage from "../../../common/hooks/Storage/useStorage";

// const ContactForm: React.FC = () => {
//   const [user] = useLocalStorage("user", {});
//   const userId = user?.user?._id;
//   const messagesEndRef = useRef(null);
//   const { mutate: SendMessage, isLoading } = SendMessageMutation();

//   const [message, setMessage] = useState<string>("");

//   const handleSendMessage = (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!message.trim()) {
//       console.error("Tin nhắn không được để trống.");
//       return;
//     }

//     const newMessage = {
//       senderId: userId,
//       receiverId: "670df3dee8e737d68b53fa83",
//       content: message
//     };

//     SendMessage(newMessage, {
//       onSuccess: () => {
//         setMessage("");
//         console.log("Gửi thành công");
//       },
//       onError: (error) => {
//         console.error("Lỗi khi gửi tin nhắn:", error);
//       }
//     });
//   };

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView();
//     }
//   }, [isLoading]);

//   return (
//     <div className="max-w-[1440px] w-[95vw] mx-auto">
//       <div className="lg:mt-[40px] mt-[60px]">
//         <div className="text-sm py-6 bg-[#F3F3F3] font-medium px-[2.5%] rounded">
//           <Link to={`/`} className="text-gray-500 hover:text-black">
//             Trang chủ
//           </Link>
//           <span className="mx-1 text-gray-500">&#10148;</span>
//           Liên hệ
//         </div>
//         <div className="grid grid-cols-1 gap-4 mx-auto my-10 sm:grid-cols-2 md:grid-cols-2">
//           <div>
//             <h2 className="text-[25px] text-[#222222] font-semibold">
//               Hãy giữ liên lạc! Liên hệ với chúng tôi
//             </h2>
//             <p className="text-[16px] text-[#999999] mt-2 max-w-[683px]">
//               Phong cách tối giản không phải là tạo ra một không gian lạnh lẽo,
//               cứng nhắc, trống rỗng. Đó là việc sử dụng những hình thức đơn giản
//               và tự nhiên, đồng thời bỏ đi những lớp thừa thãi mà không mất đi
//               vẻ đẹp thẩm mỹ của không gian.
//             </p>
//             <form
//               className="mt-2 bg-[#F3F3F3] shadow-md rounded-lg p-4 h-[64vh] flex flex-col"
//               onSubmit={handleSendMessage}
//             >
//               <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                 <div className="flex items-start gap-4 justify-end ">
//                   <div className="bg-blue-100 p-4 rounded-2xl w-[auto] max-w-[280px] text-right">
//                     <p className="font-bold mt-[-2px] text-gray-700 text-[16px]">
//                       Bạn
//                     </p>
//                     <p className="text-[14px]">Xin chào shop! </p>
//                   </div>{" "}
//                   <img
//                     src="https://picsum.photos/300/300"
//                     alt="Customer Avatar"
//                     className="w-10 h-10 rounded-full"
//                   />
//                 </div>
//                 <div className="flex items-start ">
//                   <img
//                     src="https://picsum.photos/300/300"
//                     alt="Customer Avatar"
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <div className="bg-gray-100 px-4 py-2 rounded-lg max-w-[70%]">
//                     <p className="font-bold text-gray-700 text-[16px] mt-[-2px]">
//                       Seven
//                     </p>
//                     <p className="text-[14px]">Rất vui khi được hỗ trợ bạn !</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 ">
//                 <input
//                   className="flex w-[100%] h-12 rounded-md border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="Nhập tin nhắn ..."
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                 />
//                 <button
//                   className={`h-[45px] mt-2 w-[100%] bg-black text-white rounded-md text-sm flex items-center justify-center ${
//                     isLoading
//                       ? "opacity-50 cursor-not-allowed"
//                       : "hover:bg-[#f68e56]"
//                   }`}
//                   type="submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? <FaSpinner className="animate-spin" /> : "Gửi"}
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div>
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.868087911924!2d105.74692680000003!3d21.037963500000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455305afd834b%3A0x17268e09af37081e!2sT%C3%B2a%20nh%C3%A0%20FPT%20Polytechnic.!5e0!3m2!1svi!2s!4v1725121386565!5m2!1svi!2s"
//               className="lg:w-[710px] w-full h-[80vh]"
//               style={{ border: "0" }}
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//               title="Google Maps"
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactForm;
// // import { useEffect, useState } from "react";
// // import instance from "../../../configs/axios";

// // const userId1 = "670e93218eb3a3e6b98be81c";
// // const userId2 = "670df3dee8e737d68b53fa83";

// // const ContactForm = () => {
// //   const [messageList, setMessageList] = useState([]);

// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       try {
// //         const { data } = await instance.get(`/messages/${userId1}/${userId2}`);
// //         console.log("data123", data);

// //         // Gộp và sắp xếp tin nhắn theo `createdAt`
// //         const mergedMessages = data.flatMap((item) => item.messages);
// //         const sortedMessages = mergedMessages.sort(
// //           (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
// //         );

// //         setMessageList(sortedMessages);
// //       } catch (error) {
// //         console.error("Lỗi khi lấy dữ liệu:", error);
// //       }
// //     };

// //     fetchMessages();
// //   }, []);

// //   return (
// //     <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
// //       <h3>Lịch sử hội thoại</h3>
// //       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
// //         {messageList.map((message) => (
// //           <div
// //             key={message._id}
// //             style={{
// //               display: "flex",
// //               justifyContent:
// //                 message.role === "admin" ? "flex-start" : "flex-end"
// //             }}
// //           >
// //             <div
// //               style={{
// //                 maxWidth: "70%",
// //                 padding: "10px",
// //                 borderRadius: "10px",
// //                 backgroundColor:
// //                   message.role === "admin" ? "#f0f0f0" : "#d1e7dd",
// //                 color: message.role === "admin" ? "#000" : "#084c61",
// //                 textAlign: "left"
// //               }}
// //             >
// //               <p style={{ margin: 0 }}>{message.content}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ContactForm;
