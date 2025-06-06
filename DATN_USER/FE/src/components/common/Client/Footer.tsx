import { Link } from "react-router-dom";
import logo from "../../../assets/Images/Logo/logo black.png";
const Footer = () => {
  return (
    <div className="border-t xl:w-full xl:flex xl:justify-center">
      <div className="max-w-[1440px] mb:w-full xl:px-0 mb:px-6 grid grid-cols-1 py-10 gap-4 sm:grid-cols-2 md:grid-cols-4 ">
        <div>
          <Link to="/" className="*:h-14 mr-2 *:w-18">
            <img src={logo} alt="Logo" />
          </Link>

          <p className="text-[#999999] mt-[30px] mb-[15px] w-60">
            Địa chỉ : Số 298 Đ. Cầu Diễn, Minh Khai, Bắc Từ Liêm, Hà Nội
          </p>

          <ul>
            <li className="text-[#999999] mb-[7px]">
              Điện thoại :
              <a className="underline hover:text-black" href="">
                0364854076
              </a>
            </li>
          </ul>
          <ul>
            <li className="text-[#999999]">
              Email :
              <a className="underline hover:text-black" href="">
                sevenshop@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium">Giới thiệu</h4>
          <ul>
            <li className="text-[#999999] mt-[30px] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Về chúng tôi
              </a>
            </li>
          </ul>

          <ul>
            <li className="text-[#999999] mt-[30px] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Công ty của chúng tôi
              </a>
            </li>
          </ul>
          <ul>
            <li className="text-[#999999] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Liên hệ với chúng tôi
              </a>
            </li>
          </ul>
          <ul>
            <li className="text-[#999999] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Câu hỏi thường gặp
              </a>
            </li>
          </ul>
          <ul>
            <li className="text-[#999999]">
              <a className="hover:underline hover:text-black" href="">
                Điều khoản và điều kiện
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium">Chính sách</h4>
          <ul>
            <li className="text-[#999999] mt-[30px] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Giao hàng
              </a>
            </li>{" "}
          </ul>
          <ul>
            <li className="text-[#999999] mt-[30px] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Vận chuyển
              </a>
            </li>
          </ul>
          <ul>
            <li className="text-[#999999] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Tìm kiếm
              </a>
            </li>
          </ul>
          <ul>
            <li className="text-[#999999] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Hướng dẫn chọn kích thước
              </a>
            </li>
          </ul>
          <ul>
            <li className="text-[#999999] mb-[15px]">
              <a className="hover:underline hover:text-black" href="">
                Hỗ trợ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div>
            <h4 className="text-lg font-medium">Ưu đãi</h4>

            <p className="text-[#999999] mt-[30px] mb-[15px]">
              Hãy là người đầu tiên biết về những sản phẩm mới và ưu đãi độc
              quyền của chúng tôi.
            </p>
          </div>
          <div className="relative flex mb-4 border-b-[1px] border-[#999999]">
            <input
              type="email"
              id="email"
              className="w-full py-2 border-none rounded outline-none focus:ring-0 peer"
              placeholder="Email"
            />

            <button className="">Nhận</button>
          </div>
          <div className="flex gap-4">
            <a href="#" className="group">
              <svg
                width="18"
                height="18"
                aria-hidden="true"
                focusable="false"
                className="transition-colors duration-300 icon icon-facebook"
                viewBox="0 0 18 18"
              >
                <path
                  fill="currentColor"
                  className="text-[#999999] group-hover:text-[black]"
                  d="M16.42.61c.27 0 .5.1.69.28.19.2.28.42.28.7v15.44c0 .27-.1.5-.28.69a.94.94 0 01-.7.28h-4.39v-6.7h2.25l.31-2.65h-2.56v-1.7c0-.4.1-.72.28-.93.18-.2.5-.32 1-.32h1.37V3.35c-.6-.06-1.27-.1-2.01-.1-1.01 0-1.83.3-2.45.9-.62.6-.93 1.44-.93 2.53v1.97H7.04v2.65h2.24V18H.98c-.28 0-.5-.1-.7-.28a.94.94 0 01-.28-.7V1.59c0-.27.1-.5.28-.69a.94.94 0 01.7-.28h15.44z"
                />
              </svg>
            </a>
            <a href="#" className="group">
              <svg
                width="18"
                height="18"
                aria-hidden="true"
                focusable="false"
                className="transition-colors duration-300 icon icon-instagram"
                viewBox="0 0 18 18"
              >
                <path
                  fill="currentColor"
                  className="text-[#999999] group-hover:text-[black]"
                  d="M8.77 1.58c2.34 0 2.62.01 3.54.05.86.04 1.32.18 1.63.3.41.17.7.35 1.01.66.3.3.5.6.65 1 .12.32.27.78.3 1.64.05.92.06 1.2.06 3.54s-.01 2.62-.05 3.54a4.79 4.79 0 01-.3 1.63c-.17.41-.35.7-.66 1.01-.3.3-.6.5-1.01.66-.31.12-.77.26-1.63.3-.92.04-1.2.05-3.54.05s-2.62 0-3.55-.05a4.79 4.79 0 01-1.62-.3c-.42-.16-.7-.35-1.01-.66-.31-.3-.5-.6-.66-1a4.87 4.87 0 01-.3-1.64c-.04-.92-.05-1.2-.05-3.54s0-2.62.05-3.54c.04-.86.18-1.32.3-1.63.16-.41.35-.7.66-1.01.3-.3.6-.5 1-.65.32-.12.78-.27 1.63-.3.93-.05 1.2-.06 3.55-.06zm0-1.58C6.39 0 6.09.01 5.15.05c-.93.04-1.57.2-2.13.4-.57.23-1.06.54-1.55 1.02C1 1.96.7 2.45.46 3.02c-.22.56-.37 1.2-.4 2.13C0 6.1 0 6.4 0 8.77s.01 2.68.05 3.61c.04.94.2 1.57.4 2.13.23.58.54 1.07 1.02 1.56.49.48.98.78 1.55 1.01.56.22 1.2.37 2.13.4.94.05 1.24.06 3.62.06 2.39 0 2.68-.01 3.62-.05.93-.04 1.57-.2 2.13-.41a4.27 4.27 0 001.55-1.01c.49-.49.79-.98 1.01-1.56.22-.55.37-1.19.41-2.13.04-.93.05-1.23.05-3.61 0-2.39 0-2.68-.05-3.62a6.47 6.47 0 00-.4-2.13 4.27 4.27 0 00-1.02-1.55A4.35 4.35 0 0014.52.46a6.43 6.43 0 00-2.13-.41A69 69 0 008.77 0z"
                />
                <path
                  fill="currentColor"
                  className="text-[#999999] group-hover:text-[black]"
                  d="M8.8 4a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.43a2.92 2.92 0 110-5.85 2.92 2.92 0 010 5.85zM13.43 5a1.05 1.05 0 100-2.1 1.05 1.05 0 000 2.1z"
                />
              </svg>
            </a>
            <a href="#" className="group">
              <svg
                width="18"
                height="18"
                aria-hidden="true"
                focusable="false"
                className="transition-colors duration-300 icon icon-youtube"
                viewBox="0 0 100 70"
              >
                <path
                  fill="currentColor"
                  className="text-[#999999] group-hover:text-[black]"
                  d="M98 11c2 7.7 2 24 2 24s0 16.3-2 24a12.5 12.5 0 01-9 9c-7.7 2-39 2-39 2s-31.3 0-39-2a12.5 12.5 0 01-9-9c-2-7.7-2-24-2-24s0-16.3 2-24c1.2-4.4 4.6-7.8 9-9 7.7-2 39-2 39-2s31.3 0 39 2c4.4 1.2 7.8 4.6 9 9zM40 50l26-15-26-15v30z"
                />
              </svg>
            </a>
            <a href="#" className="group">
              <svg
                aria-hidden="true"
                focusable="false"
                className="transition-colors duration-300 icon icon-tiktok"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  fill="currentColor"
                  className="text-[#999999] group-hover:text-[black]"
                  d="M8.02 0H11s-.17 3.82 4.13 4.1v2.95s-2.3.14-4.13-1.26l.03 6.1a5.52 5.52 0 11-5.51-5.52h.77V9.4a2.5 2.5 0 101.76 2.4L8.02 0z"
                />
              </svg>
            </a>
            <a href="#" className="group">
              <svg
                width="18"
                height="18"
                aria-hidden="true"
                focusable="false"
                className="transition-colors duration-300 icon icon-twitter"
                viewBox="0 0 18 15"
              >
                <path
                  fill="currentColor"
                  className="text-[#999999] group-hover:text-black"
                  d="M17.64 2.6a7.33 7.33 0 01-1.75 1.82c0 .05 0 .13.02.23l.02.23a9.97 9.97 0 01-1.69 5.54c-.57.85-1.24 1.62-2.02 2.28a9.09 9.09 0 01-2.82 1.6 10.23 10.23 0 01-8.9-.98c.34.02.61.04.83.04 1.64 0 3.1-.5 4.38-1.5a3.6 3.6 0 01-3.3-2.45A2.91 2.91 0 004 9.35a3.47 3.47 0 01-2.02-1.21 3.37 3.37 0 01-.8-2.22v-.03c.46.24.98.37 1.58.4a3.45 3.45 0 01-1.54-2.9c0-.61.14-1.2.45-1.79a9.68 9.68 0 003.2 2.6 10 10 0 004.08 1.07 3 3 0 01-.13-.8c0-.97.34-1.8 1.03-2.48A3.45 3.45 0 0112.4.96a3.49 3.49 0 012.54 1.1c.8-.15 1.54-.44 2.23-.85a3.4 3.4 0 01-1.54 1.94c.74-.1 1.4-.28 2.01-.54z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
