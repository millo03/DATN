import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useOrdersByDayOfWeek } from "../../../../common/hooks/Order/querry_Order";

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 420,
    stacked: true,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%"
          }
        }
      }
    }
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last"
    }
  },
  dataLabels: {
    enabled: false
  },

  xaxis: {
    categories: [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ Nhật"
    ]
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 400,
    fontSize: "14px",
    markers: {
      radius: 99
    }
  },
  fill: {
    opacity: 1
  }
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartRevenueWeekly: React.FC = () => {
  const { data: orderByDayOfWeekData } = useOrdersByDayOfWeek();
  console.log("orderByDayOfWeekData", orderByDayOfWeekData);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  const totalOrder = orderByDayOfWeekData?.data?.reduce(
    (sum: number, order) => {
      return sum + order.totalOrders;
    },
    0
  );

  const totalPrice = orderByDayOfWeekData?.data?.reduce(
    (sum: number, order) => {
      return sum + order.totalRevenue;
    },
    0
  );
  const currencyTotalPrice = formatCurrency(totalPrice);

  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: "Số Lượng Đơn Hàng",
        data: orderByDayOfWeekData?.data?.map((day) => day.totalOrders) || []
      },
      {
        name: "Doanh Thu",
        data:
          orderByDayOfWeekData?.data?.map((day) =>
            // formatCurrency(day.totalRevenue)
            formatCurrency(day.totalRevenue)
          ) || []
      }
    ]
  });

  useEffect(() => {
    if (orderByDayOfWeekData) {
      setState((prevState) => ({
        ...prevState,
        series: [
          {
            ...prevState.series[0],
            data: orderByDayOfWeekData?.data?.map((day) => day.totalOrders)
          },
          {
            ...prevState.series[1],
            data: orderByDayOfWeekData?.data?.map((day) => day.totalRevenue)
          }
        ]
      }));
    }
  }, [orderByDayOfWeekData]);

  return (
    <div className="col-span-4 rounded-sm border border-stroke bg-white p-7.5 w-[48.2%] h-[80vh]  ">
      <div className="mx-7 mt-7 mb-2 justify-between gap-4 sm:flex">
        <div className="w-full">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Doanh Thu Tuần Này
          </h4>
        </div>

        {/* <div>
          <div className="relative z-20 inline-block">
            {/* <select
              name="#"
              id="#"
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="" className="dark:bg-boxdark">
                Tuần này
              </option>
              <option value="" className="dark:bg-boxdark">
                Tuần trước
              </option>
            </select> */}
        <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
              fill="#637381"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
              fill="#637381"
            />
          </svg>
        </span>
        {/* </div>
        </div> */}
      </div>
      <div className="flex mx-6  justify-between">
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-[14px] text-[#3C50E0]">
            Tổng Doanh Thu :{" "}
          </p>
          <span>{currencyTotalPrice}</span>
        </div>
        <div className="flex items-center space-x-1">
          <p className="font-semibold text-[14px] text-[#3C50E0]">
            Tổng Số Lượng Đơn Hàng:{" "}
          </p>
          <span>{totalOrder}</span>
        </div>
      </div>

      <div className="mx-9 mb-2">
        <div id="chartTwo" className="-ml-0 -mb-7">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={600}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartRevenueWeekly;
