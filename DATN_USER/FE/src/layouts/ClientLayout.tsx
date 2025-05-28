import { Outlet } from "react-router-dom";
import Header from "../components/common/Client/Header";
import Footer from "../components/common/Client/Footer";
// import Message from "../components/ui/message";

const ClientLayout = () => {
  return (
    <div className="scrollbar scrollbar-thumb-gray-300 scrollbar-thumb-rounded scrollbar-track-transparent h-full">
      <Header />
      <div>
        <Outlet />
      </div>
      {/* <Message /> */}
      <Footer />
    </div>
  );
};

export default ClientLayout;
