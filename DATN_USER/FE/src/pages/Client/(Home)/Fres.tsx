import { Link } from "react-router-dom";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";

const Fres = () => {
  return (
    <>
      <div className="relative flex justify-between h-[350px] *:w-[47.5%] bg-black rounded">
        {/* btn */}
        <div className="absolute left-1/2 -translate-x-1/2 w-full h-full flex flex-col justify-center items-center *:text-white">
          <strong className="text-[52px] font-semibold">Tủ Đồ Hoàn Hảo</strong>
          <span className=" text-[18px]">
            Nâng tầm phong cách với những lựa chọn tinh tế từ bộ sưu tập của
            chúng tôi.
          </span>
          <Link
            onClick={ScrollTop}
            to={"shops"}
            className="border-2 mt-5 border-white uppercase px-[30px] py-2 hover:scale-[1.05] cursor-pointer duration-300 "
          >
            {" "}
            Khám phá ngay{" "}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Fres;
