import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../static/stationDetails.css";

export default function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allData, setallData] = useState([]);

  const handleNavigate = () => {
    navigate(-1);
  };

  const fetchdata = async () => {
    try {
      const response = await axios.get(`charging-station`, {
        params: {
          station_id: id,
        },
      });
      console.log(response?.data);
      const newData = response?.data?.data || [];
      setallData(newData);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const getTotalConnectors = (chargers) => {
    let sum = 0;
    chargers?.forEach((c) => {
      sum += c.connectors?.length || 0;
    });
    return sum;
  };

  return (
    <>
      <div className="heading-bar">
        <img
          src="/arrow.svg"
          alt=""
          style={{ cursor: "pointer", height: "20px", width: "20px" }}
          onClick={handleNavigate}
        />
        <h3 className="title-class">{allData[0]?.station_name}</h3>
      </div>{" "}
      {allData.length > 0 && (
        <div className="content-wrapper">
          <div className="top-details-div">
            <div className="top-details-div1">
              <span className="span-class">Bookings</span>
              <p className="paragraph-class">{allData[0].booking_count}</p>
            </div>

            <div className="top-details-div1">
              <span className="span-class">Consumption</span>
              <p className="paragraph-class">
                {allData[0].total_consumption ?? 0}W
              </p>
            </div>

            <div className="top-details-div1">
              <span className="span-class">Revenue</span>
              <p className="paragraph-class">
                {(allData[0]?.total_revenue ?? 0) % 1 === 0
                  ? allData[0]?.total_revenue ?? 0
                  : (allData[0]?.total_revenue ?? 0).toFixed(2)}{" "}
                ₹
              </p>
            </div>

            <div className="top-details-div1">
              <span className="span-class">Nos.of Ports</span>
              <p className="paragraph-class">
                {getTotalConnectors(allData[0].chargers)}
              </p>
            </div>
          </div>
          <div className="details-div-middle">
            <div className="table-div1">
              <table className="main-table1">
                <tr>
                  <td
                    style={{ paddingRight: "5px", color: "rgb(125,125,125)" }}
                  >
                    Station Name :
                  </td>
                  <td style={{ color: "rgb(32, 178, 170)" }}>
                    {allData[0]?.station_name}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "rgb(125,125,125)" }}>Address :</td>
                  <td style={{ maxWidth: "265px" }}>{allData[0]?.address}</td>
                </tr>
                <tr>
                  <td style={{ color: "rgb(125,125,125)" }}>Amenities :</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "15px",
                        alignItems: "center",
                      }}
                    >
                      {allData[0]?.amenities.map((services, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                          <img
                            src={`https://api.mnil.hashtechy.space/${services?.amenity_img}`}
                            alt={services.amenity_name}
                            style={{
                              width: "30px",
                              height: "30px",
                            }}
                          />
                          <div style={{ fontSize: "12px", marginTop: "4px" }}>
                            {services.amenity_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style={{ color: "rgb(125,125,125)" }}>Lat/Long :</td>
                  <td style={{ display: "flex", gap: "25px" }}>
                    <div className="small-div">
                      {allData[0]?.location[0]?.latitude}
                    </div>
                    <div className="small-div">
                      {allData[0]?.location[0]?.longitude}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "rgb(125,125,125)" }}>Maintainance :</td>
                  <td>
                    Last on{" "}
                    {moment
                      .tz(allData[0]?.createdAt, "Asia/Kolkata")
                      .format("DD/MM/YYYY")}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div>
            {allData[0]?.chargers.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <h6 style={{ fontWeight: "600", color: "#242424bf" }}>
                  Chargers
                </h6>
                <div style={{ display: "flex", gap: "15px" }}>
                  {allData[0]?.chargers.map((data) => (
                    <div className="charger-card">
                      <div className="box-div">
                        <div>
                          <h6 style={{ fontSize: "1.125rem" }}>{data?.id}</h6>
                          <div style={{ display: "flex" }}>
                            {data?.connectors?.map((type) => (
                              <p
                                className={
                                  type?.status === "Available"
                                    ? "custom-alert alert alert-success border border-success"
                                    : "custom-alert alert alert-danger border border-danger"
                                }
                                style={{
                                  padding: "4px",
                                }}
                              >
                                {type?.connector_type}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div style={{ minWidth: "113px" }}>
                          {data?.connectors?.map((chargerImg) => (
                            <img
                              src={`https://api.mnil.hashtechy.space${chargerImg?.connector_img}`}
                              className="connector-img"
                            />
                          ))}
                        </div>
                      </div>

                      <hr className="hr-style-station" />

                      <div style={{ display: "flex", paddingTop: "3px" }}>
                        <div className="box-bottom-div">
                          <h4 className="heading-tag">Voltage</h4>{" "}
                          <p>
                            <p>{data?.output_voltage}V</p>
                          </p>
                        </div>
                        <div className="vr"></div>

                        <div className="box-bottom-div">
                          <h4 className="heading-tag">Current</h4>

                          <p>{data?.output_current}A</p>
                        </div>
                        <div className="vr"></div>

                        <div className="box-bottom-div">
                          <h4 className="heading-tag">Firmware Version</h4>
                          <p
                            style={{
                              color: "rgb(108, 117, 125)",
                              minWidth: "104px",
                            }}
                          >
                            {data?.firmware_version}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
