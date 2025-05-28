import { Outlet } from "react-router-dom";
import Sidebar_Profile from "./_component/sidebar";

const Layout_Profile = () => {
  return (
    <div className="max-w-[1440px] w-[95vw]  mx-auto">
      <div className="grid grid-cols-[250px_auto] gap-x-10   mt-16 mb-10">
        <Sidebar_Profile />
        <div className="min-h-[80vh] ">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default Layout_Profile;
