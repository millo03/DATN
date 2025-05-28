import OrderStats from "./components/OrderStats";
import OrderStatsMonth from "./components/OrderStatsMonth";
import OrderStatsWeek from "./components/OrderStatsWeek";
import OrderSuccessFailure from "./components/OrderSuccessFailure";

const Dashboard_Shipper = () => {
  return (
    <div className=" p-5 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 mt-20">
        Thống Kê Shipper
      </h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8 mb-5">
        <div className="bg-white shadow-md rounded-lg p-4 w-full">
          <OrderStats />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 w-full">
          <OrderSuccessFailure />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <OrderStatsWeek />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <OrderStatsMonth />
      </div>
    </div>
  );
};

export default Dashboard_Shipper;
