import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import instance from "../../../configs/axios";
import { toast } from "react-toastify";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responsemessage, setResponsemessage] = useState("");
  const [responderEmail, setResponderEmail] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [Content, setContent] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await instance.get(`/contact/${id}`);
        console.log("Fetched contact data:", data);
        if (data && data.data) {
          setRequestEmail(data.data.email);
          setContent(data.data.content);
        } else {
          console.error("Data not in expected format:", data);
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        toast.error("Lỗi khi lấy thông tin liên hệ!");
      }
    };

    fetchContact();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await instance.put(`/contact/feedback/${id}`, {
        response_message: responsemessage,
        responder_email: responderEmail,
        request_content: Content,
        response_date: new Date(),
      });

      const emailData = {
        to_email: requestEmail,
        from_email: responderEmail,
        response_message: responsemessage,
        request_content: Content,
      };
      console.log("Email data being sent:", emailData);
      const result = await emailjs.send(
        "service_hpiuvdb",
        "template_nts3fhh",
        emailData,
        "HnQ2o-Hb2FLVuBiAl"
      );

      if (result.status === 200) {
        toast.success("Phản hồi thành công!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/admin/contact");
      } else {
        toast.error("Phản hồi thất bại!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("Gửi phản hồi hoặc email thất bại!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <CheckAuths roles={["admin"]}>
      <div className="container mx-6">
        <div className="flex items-center justify-between mb-10 mt-[80px]">
          <h1 className="text-2xl font-semibold">Phản hồi liên hệ</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Email người yêu cầu
            </label>
            <input
              type="text"
              value={requestEmail || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Nội dung yêu cầu
            </label>
            <textarea
              value={Content || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="responseContent"
            >
              Nội dung phản hồi
            </label>
            <textarea
              id="responseContent"
              value={responsemessage}
              onChange={(e) => setResponsemessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="responderEmail"
            >
              Email phản hồi
            </label>
            <input
              id="responderEmail"
              type="text"
              value={responderEmail}
              onChange={(e) => setResponderEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-400"
          >
            Gửi phản hồi
          </button>
        </form>
      </div>
    </CheckAuths>
  );
};

export default Feedback;
