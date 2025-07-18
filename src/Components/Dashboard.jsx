import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import "../static/dashboard.css";
import axios from "axios";
import ChargerChart from "./ChargerChart";
import VehicleChart from "./VehicleChart";
import EnergyBar from "./EnergyBar";
export default function Dashboard() {
  const [cardData, setCardData] = useState([]);
  const [allData, setallData] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleNavigate = (stationId) => {
    navigate(`/charging-station-details/${stationId}`);
  };

  const fetchCardData = async () => {
    try {
      const response = await axios.get(`/dashboard/counts`);
      console.log("Response", response?.data);
      if (response?.data?.code === 200) {
        setCardData(response?.data?.data);
        // console.log("Card Data", cardData);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/dashboard/top-performing-status`);
      console.log("stations response", response?.data);
      setallData(response?.data?.data?.rows);
    } catch (error) {
      console.log("Error", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCardData();
    fetchData();
  }, []);

  return (
    <>
      <div className="heading-bar">
        <h3 className="title-class">Dashboard</h3>
      </div>

      <div className="details-section">
        <Card
          onClick={() => {
            setFilters(
              (prevFilter) => ({
                ...prevFilter,
                active: false,
                archived: false,
              }),
              setPage(1)
            );
          }}
          style={{
            width: "203px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#20b2aa33",
            padding: "11px",
          }}
        >
          <Card.Title
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              minWidth: "156px",
            }}
          >
            Total Revenue
            <div
              style={{
                marginLeft: "33px",
                backgroundColor: "#f5f5f5",
                borderRadius: "50px",
                height: "35px",
                width: "35px",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <img
                src="./dashCard1.svg"
                alt=""
                style={{ width: "16px", height: "16px" }}
              />
            </div>
          </Card.Title>
          <Card.Text style={{ fontWeight: "bold" }}>
            {cardData?.total_revenue}
          </Card.Text>
        </Card>

        <Card
          onClick={() => {
            console.log("Filters", filters);
            setFilters(
              (prevFilter) => ({
                ...prevFilter,
                active: true,
                archived: false,
              }),
              setPage(1)
            );
          }}
          style={{
            width: "199px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#ff450033",
            padding: "11px",
          }}
        >
          {/* {console.log("Filters", filters)} */}
          <Card.Title
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              minWidth: "165px",
            }}
          >
            Total Booking
            <div
              style={{
                marginLeft: "33px",
                backgroundColor: "#f5f5f5",
                borderRadius: "50px",
                height: "35px",
                width: "35px",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <img className="dashCrad2-img" />
            </div>
          </Card.Title>
          <Card.Text style={{ fontWeight: "bold" }}>
            {cardData?.total_bookings}
          </Card.Text>
        </Card>

        <Card
          onClick={() => {
            setFilters((prevFilter) => ({
              ...prevFilter,
              archived: true,
              active: false,
            }));
            setPage(1);
          }}
          style={{
            width: "215px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#32cd3233",
            padding: "11px",
          }}
        >
          <Card.Title
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              width: "192px",
            }}
          >
            Ave. Revenue / Station
            <div
              style={{
                marginLeft: "33px",
                backgroundColor: "#f5f5f5",
                borderRadius: "50px",
                height: "35px",
                width: "55px",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <img className="dashCrad3-img" />
            </div>
          </Card.Title>
          <Card.Text style={{ fontWeight: "bold" }}>
            {cardData?.average_revenue}
          </Card.Text>
        </Card>
      </div>

      <div
        className="details-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12,minmax(0,1fr))",
          alignItems: "revert",
        }}
      >
        <div className="dashChart" style={{ gridColumn: "span 3" }}>
          <ChargerChart />
        </div>
        <div className="dashChart" style={{ gridColumn: "span 3" }}>
          <VehicleChart />
        </div>
        <div className="dashChart" style={{ gridColumn: "span 6" }}>
          <EnergyBar />
        </div>
      </div>

      <div className="content-wrapper">
        <div className="main-content">
          <table className="main-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Station Detail</th>
                <th>Consumption</th>
                <th>Bookings</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {allData?.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "100px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <img
                        src="/noRecords.png"
                        alt="No Records Found"
                        style={{
                          width: "170px",
                          marginBottom: "20px",
                          transform: "translateX(-20px)",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#000",
                          transform: "translateX(-20px)",
                        }}
                      >
                        No Records Found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                allData?.map((data) => (
                  <tr key={data?.id}>
                    <td>{data?.id}</td>
                    <td
                      onClick={() => handleNavigate(data?.id)}
                      style={{
                        color: "#20b2aa",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {/* console.log("dataID", data?.id) */}
                      {data?.station_name ?? "-"}
                      <br />
                      <span style={{ color: "rgb(125, 125, 125)" }}>
                        {data?.address}
                      </span>
                    </td>
                    <td>{data?.total_consumption ?? 0} W</td>
                    <td>{data?.booking_count}</td>
                    <td style={{ minWidth: "98px" }}>
                      {(data?.total_revenue ?? 0) % 1 === 0
                        ? data?.total_revenue ?? 0
                        : (data?.total_revenue ?? 0).toFixed(2)}{" "}
                      ₹
                    </td>{" "}
                  </tr>
                ))
              )}

              {loading && (
                <tr>
                  <td>
                    <Skeleton width={50} />
                  </td>
                  <td>
                    <Skeleton width={100} />
                  </td>
                  <td>
                    <Skeleton width={150} />
                  </td>
                  <td>
                    <Skeleton width={120} />
                  </td>
                  <td>
                    <Skeleton width={100} />
                  </td>
                  <td>
                    <Skeleton width={80} />
                  </td>
                  <td>
                    <Skeleton width={100} />
                  </td>
                  <td>
                    <Skeleton width={80} />
                  </td>
                  <td>
                    <Skeleton width={120} />
                  </td>
                  <td>
                    <Skeleton width={60} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
