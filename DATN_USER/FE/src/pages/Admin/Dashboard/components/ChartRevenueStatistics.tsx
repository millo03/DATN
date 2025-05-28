import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useOrdersByMonthOfYear } from "../../../../common/hooks/Order/querry_Order";

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left"
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1
    },
    toolbar: {
      show: false
    }
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300
        }
      }
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350
        }
      }
    }
  ],
  stroke: {
    width: [2, 2],
    curve: "straight"
  },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    hover: {
      sizeOffset: 5
    }
  },
  xaxis: {
    type: "category",
    categories: [
      " 1",
      " 2",
      " 3",
      " 4",
      " 5",
      " 6",
      " 7",
      " 8",
      " 9",
      " 10",
      " 11",
      " 12"
    ],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px"
      }
    },
    min: 0
  }
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartRevenueStatistics: React.FC = () => {
  const { data: orderByMonthOfYearData } = useOrdersByMonthOfYear();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: "Doanh Thu",
        data: []
      },
      {
        name: "Số Lượng Đơn Hàng",
        data: []
      }
    ]
  });

  useEffect(() => {
    if (orderByMonthOfYearData) {
      const revenueData = Array(12).fill(0);
      const orderCountData = Array(12).fill(0);

      orderByMonthOfYearData?.data?.forEach((item) => {
        const monthIndex = item.month - 1;
        revenueData[monthIndex] = item.totalRevenue;
        orderCountData[monthIndex] = item.totalOrders;
      });

      setState({
        series: [
          {
            name: "Doanh Thu",
            data: revenueData
          },
          {
            name: "Số Lượng Đơn Hàng",
            data: orderCountData
          }
        ]
      });
    }
  }, [orderByMonthOfYearData]);

  const totalPrice = orderByMonthOfYearData?.data?.reduce(
    (sum: number, order) => sum + order.totalRevenue,
    0
  );

  const totalOrders = orderByMonthOfYearData?.data?.reduce(
    (sum: number, order) => sum + order.totalOrders,
    0
  );

  return (
    <div className="col-span-10 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <h4 className="text-xl my-5 font-semibold text-black dark:text-white">
        Doanh Thu và Số Lượng Đơn Hàng Các Tháng Trong Năm Nay
      </h4>
      <div className="flex items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-[700px] gap-3 sm:gap-5">
          <div className="flex w-full">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#3C50E0]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#3C50E0]"></span>
            </span>
            <div className="w-full flex space-x-2">
              <p className="font-semibold text-[#3C50E0]">Tổng Doanh Thu: </p>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
          <div className="flex w-full">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#80CAEE]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#80CAEE]"></span>
            </span>
            <div className="w-full flex space-x-2">
              <p className="font-semibold text-[#80CAEE]">
                Tổng Số Lượng Đơn Hàng:{" "}
              </p>
              <span>{totalOrders}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ReactApexChart
          options={options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartRevenueStatistics;
