import axios from "axios";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Energybar = () => {
  const [allData, setallData] = useState([]);

  const fetchdata = async () => {
    try {
      const response = await axios.get(`/dashboard/energy-dispensed-chart`);
      console.log("Resource", response?.data?.data);
      if (response?.data?.code === 200) {
        setallData(response?.data?.data || []);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const chartData = {
    series: [
      {
        name: "Energy Dispensed",
        data: allData.map((item) => item?.consunmption || 0),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: { enabled: false },
      },
      stroke: { curve: "smooth", width: 2 },
      title: {
        text: "Energy Dispensed",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: allData.map((item) => {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          return `${monthNames[item.month - 1]} ${item.year
            .toString()
            .slice(-2)}`;
        }),
      },
    },
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default Energybar;
