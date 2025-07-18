import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const VehicleChart = () => {
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
      labels: ["2 Wheeler", "3 Wheeler", "4 Wheeler"],
      colors: ["#0d6efd", "#6f42c1", "#ffa84a"],
    },
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("/dashboard/vehicles-chart");
      const { data } = response.data;
      console.log("data", data);
      setState((prev) => ({
        ...prev,
        series: [
          data.twoWheelerCount || 0,
          data.threeWheelerCount || 0,
          data.fourWheelerCount || 0,
        ],
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="test">
      <h5>Total Vehicle</h5>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={340}
        />
      </div>
    </div>
  );
};

export default VehicleChart;
