import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../pages/Client/User/Login";
import AdminLayout from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";
import OrderList from "../pages/Admin/Orders/OrderList";
import ForgotPassword from "../pages/Client/User/ForgotPass";
import Notification from "../components/Notification/Page";
import ChangePassword from "../pages/Client/User/ChangePassword";
import InforShipper from "../pages/Client/User/InforShipper";
import Salary from "../pages/Admin/Shipper/Salary";
import HistoryOrder from "../pages/Admin/Orders/HistoryOrder";
import Dashboard_Shipper from "../pages/Admin/Shipper/Dashboard_Shipper";
import Shipper_Order from "../pages/Admin/Shipper/Shipper_detali/Shipper_Order";
const RouterComponent = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile/notification" element={<Notification />} />
            <Route path="/infor_shipper" element={<InforShipper />} />
          </Route>
          <Route path="courier" element={<AdminLayout />}>
            <Route path="orders" element={<OrderList />} />
            <Route path="orders_history" element={<HistoryOrder />} />
            <Route path="changePassword" element={<ChangePassword />} />
            <Route path="salary_shipper" element={<Salary />} />
            <Route path="shipper_orders/:id" element={<Shipper_Order />} />
            <Route path="dashboard_Shipper" element={<Dashboard_Shipper />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default RouterComponent;
