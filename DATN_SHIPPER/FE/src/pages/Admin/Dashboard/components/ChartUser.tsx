import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetNewUserIn7Day } from "../../../../common/hooks/Auth/querry_Auth";

const options: ApexOptions = {
  colors: ["#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
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
    categories: [] // Sẽ được cập nhật từ dữ liệu
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
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
  categories: string[];
}

const ChartUser: React.FC = () => {
  const { data: dataUser } = useGetNewUserIn7Day();

  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: "Số lượng",
        data: []
      }
    ],
    categories: [] // Danh sách ngày
  });

  useEffect(() => {
    if (dataUser?.usersByDate) {
      // Cập nhật categories và dữ liệu từ dataUser
      const categories = dataUser.usersByDate.map((user) => user.day);
      const chartData = dataUser.usersByDate.map((user) => user.totalUser);

      setState({
        series: [
          {
            name: "Số lượng",
            data: chartData
          }
        ],
        categories: categories
      });
    }
  }, [dataUser]);

  const totalUser =
    dataUser?.usersByDate?.reduce(
      (sum: number, user) => sum + user.totalUser,
      0
    ) || 0;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="flex justify-between mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center p-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 19"
            >
              <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z" />
              <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
            </svg>
          </div>
          <div>
            <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">
              {totalUser}
            </h5>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Số lượng người dùng mới trong 7 ngày vừa qua
            </p>
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9 px-4">
          <ReactApexChart
            options={{ ...options, xaxis: { categories: state.categories } }}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartUser;
