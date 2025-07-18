import { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const ChargerChart = () => {
  const [state, setState] = useState({
    series: [0, 0, 0, 0, 0], // Initialize with zeros
    options: {
      chart: {
        type: "pie",
      },

      stroke: {
        width: 0,
      },

      legend: {
        position: "bottom",
      },
      labels: ["Available", "Unavailable", "Preparing", "Charging", "Faulted"],
      colors: ["#81c784", "#e57373", "#ffd54f", "#0d6efd", "#6f42c1"],
    },
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("/dashboard/charger-chart");
      const { data } = response.data;

      setState((prev) => ({
        ...prev,
        series: [
          data.available || 0,
          data.unavailable || 0,
          data.preparing || 0,
          data.charging || 0,
          data.faulted || 0,
        ],
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="test">
      <h5>Charger Status</h5>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={390}
        />
      </div>
    </div>
  );
};

export default ChargerChart;
