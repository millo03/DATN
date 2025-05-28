import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import instance from "../../../configs/axios";

const Profile = () => {
  // const [avatarFile, setAvatarFile] = useState(null);
  // const [user, setUser] = useLocalStorage("user", {});
  const [user] = useLocalStorage("user", {});
  const [profileInfo, setProfileInfo] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    avatar: ""
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = user?.user?._id;
      const { data } = await instance.get(`/auth/${userId}`);
      const userData = data; // Cần phải dựa vào cấu trúc phản hồi từ backend để lấy dữ liệu người dùng
      if (userData) {
        setProfileInfo({
          userName: userData.userName || "",
          fullName: userData.fullName || "",
          email: userData.email || "",
          phoneNumber: userData.phone || "",
          birthDate: userData.birthDate || "",
          avatar: userData.avatar || ""
        });
      } else {
        console.error("Không có dữ liệu người dùng trả về từ backend");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProfileInfo({
      ...profileInfo,
      [name]: value
    });
  };
  const routing = useNavigate();
  console.log(user);
  if (!localStorage.getItem("user")) {
    routing("/");
  }

  //   const handleSaveProfile = async (e: any) => {
  //     e.preventDefault();
  //     try {
  //       const userId = user?.user?._id;

  //       // Nếu có chọn ảnh mới, thực hiện cập nhật ảnh đại diện
  //       if (avatarFile) {
  //         const formData = new FormData();
  //         formData.append("avatar", avatarFile);

  //         const { data } = await instance.put(
  //           `/auth/${userId}/avatar`,
  //           formData,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );
  //         setProfileInfo({
  //           ...profileInfo,
  //           avatar: data.avatar || "",
  //         });
  //         alert("Đã cập nhật ảnh đại diện thành công");
  //       }

  //       // Tiếp tục cập nhật thông tin người dùng
  //       await instance.put(`/auth/${userId}`, {
  //         ...profileInfo,
  //       });
  //       fetchUserData();
  //       alert("Cập nhật thông tin thành công");
  //     } catch (error) {
  //       console.error("Lỗi khi cập nhật thông tin:", error);
  //       alert("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.");
  //     }
  //   };

  //   const handleFileInputChange = (e: any) => {
  //     const file = e.target.files[0];
  //     setAvatarFile(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfileInfo({
  //         ...profileInfo,
  //         avatar: reader.result,
  //       });
  //     };
  //     if (file) {
  //       reader.readAsDataURL(file);
  //     }
  //   };

  // console.log(profileInfo);

  return (
    <>
      <div>
        <div className="border-b-2">
          <h2 className="text-xl">Hồ Sơ Của Tôi</h2>
          <p className="py-2 text-sm">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
        </div>
        <div className="py-8">
          <div className="flex flex-row flex-wrap text-sm lg:flex-nowrap">
            <div className="order-2 basis-full lg:order-1 lg:basis-2/3">
              <form className="w-full">
                <div className="flex items-center gap-5 py-2 lg:py-3">
                  <p className="w-36 text-left lg:text-right py-1 text-[#777777]">
                    Tên đăng nhập
                  </p>
                  <p>{profileInfo.userName}</p>
                </div>
                <div className="flex flex-col py-2 lg:flex lg:items-center lg:flex-row gap-x-5 lg:gap-5 lg:py-3">
                  <label className="w-36 text-left lg:text-right py-1 text-[#777777]">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileInfo.fullName}
                    onChange={handleInputChange}
                    className="px-3 py-2 border w-full lg:w-[350px] outline-none"
                    placeholder="Nhập tên của bạn"
                  />
                </div>
                <div className="flex flex-col py-2 lg:flex lg:items-center lg:flex-row gap-x-5 lg:gap-5 lg:py-3">
                  <p className="w-36 text-left lg:text-right py-1 text-[#777777]">
                    Email
                  </p>
                  <div className="flex justify-between gap-3">
                    <p>{profileInfo.email}</p>
                    <a href="#" className="text-blue-400 underline">
                      Thay đổi
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-5 py-2 lg:py-3">
                  <p className="w-36 text-left lg:text-right py-1 text-[#777777]">
                    Số điện thoại
                  </p>
                  <p>{profileInfo.phoneNumber}</p>
                  <a href="#" className="text-blue-400 underline">
                    Thêm
                  </a>
                </div>
                <div className="flex items-center gap-5 py-2 lg:py-3">
                  <p className="w-36 text-left lg:text-right py-1 text-[#777777]">
                    Ngày sinh
                  </p>
                  <input
                    type="date"
                    name="birthDate"
                    value={profileInfo.birthDate}
                    onChange={handleInputChange}
                    className="w-48 px-2 py-1 border border-gray-300 rounded outline-none"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 my-6 text-white bg-black"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
            <div className="order-1 p-3 my-4 border-b basis-full lg:order-2 lg:border-b-0 lg:border-l-2 lg:basis-1/3">
              <div className="flex justify-center">
                <img
                  src={profileInfo.avatar || "https://picsum.photos/300/300"}
                  className="rounded-full w-44 h-44"
                  alt="Avatar"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-input"
                />
                <label
                  htmlFor="avatar-input"
                  className="px-6 py-3 border rounded-lg cursor-pointer my-9"
                >
                  Chọn ảnh
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
