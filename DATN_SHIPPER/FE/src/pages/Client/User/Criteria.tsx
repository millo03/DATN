import { FaSackDollar } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { MdContactSupport } from "react-icons/md";
import { PiChalkboardTeacherFill } from "react-icons/pi";

const Criteria = () => {
  return (
    <div>
      <h1 className="text-center text-[40px] mt-[50px]">
        Vì sao bạn nên trở thành Tài xế Seven?
      </h1>
      <div className="flex justify-center items-start h-auto mt-[50px]">
        {/* Căn giữa theo chiều ngang và chiều dọc */}
        <div className="w-1/4 flex flex-col items-center text-center">
          {/* Cột 1 */}
          <FaSackDollar className="w-16 h-16" />
          <span className="pt-4">1. Thu nhập hấp dẫn</span>
          <span className="mt-2">
            Thu nhập cao cùng các chương trình thưởng hấp dẫn dành cho Tài xế.
          </span>
        </div>
        <div className="w-1/4 flex flex-col items-center text-center">
          {/* Cột 2 */}
          <IoIosTime className="w-16 h-16" />
          <span className="pt-4">2. Thời gian linh hoạt</span>
          <span className="mt-2">
            Thời gian và địa điểm làm việc linh động.
          </span>
        </div>
        <div className="w-1/4 flex flex-col items-center text-center">
          {/* Cột 3 */}
          <PiChalkboardTeacherFill className="w-16 h-16" />
          <span className="pt-4">3. Đào tạo chuyên nghiệp</span>
          <span className="mt-2">
            Rất nhiều khóa đào tạo hữu ích giúp Tài xế làm việc hiệu quả.
          </span>
        </div>
        <div className="w-1/4 flex flex-col items-center text-center">
          {/* Cột 4 */}
          <MdContactSupport className="w-16 h-16" />
          <span className="pt-4">4. Hỗ trợ 24/7</span>
          <span className="mt-2">
            Luôn lắng nghe và hỗ trợ Tài xế 24/7 qua Trung tâm Trợ giúp được
            tích hợp trên Ứng dụng ShopeeFood Driver.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Criteria;
