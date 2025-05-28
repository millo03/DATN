import { FaSackDollar } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { PiChalkboardTeacherFill } from "react-icons/pi";

import { MdContactSupport, MdOutlineContactSupport } from "react-icons/md";
import { Steps } from "antd";

const Procedure = () => {
  const items = [
    {
      title: "Gửi thông tin và nội dung xin việc trên website chính của SEVEN",
      status: "wait",
    },
    {
      title: "Chờ phản hồi từ ADMIN",
      status: "wait",
    },
    {
      title: "Xác nhận tài khoản qua email",
      status: "wait",
    },
    {
      title:
        "Đăng nhập và cập nhật đầy đủ thông tin trên website giành cho shipper",
      status: "wait",
    },
  ];
  return (
    <div className="mt-[30px] ml-[30px] mr-[30px]">
      <h1 className="text-center text-[40px]">
        Quy trình đăng ký Tài xế Seven
      </h1>
      <img src="../src/assets/Images/Logo/shipper.webp" alt="" />
      <div className="space-x-4">
        <Steps labelPlacement="vertical" items={items} />
      </div>
    </div>
  );
};

export default Procedure;
