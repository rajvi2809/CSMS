import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
export default function UserDetails() {
  const { id } = useParams();
  const [cookies] = useCookies(["accessToken"]);
  const [allData, setallData] = useState([]);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(-1);
  };

  const fetchdata = async () => {
    try {
      const token = cookies.accessToken;
      if (!token) {
        console.log("No Token");
      }

      const response = await axios.get(
        `https://api.mnil.hashtechy.space/admin/enduser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Type": "Admin",
          },
          params: {
            enduser_id: id,
          },
        }
      );
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

  return (
    <>
      <div className="heading-bar">
        <img
          src="/arrow.svg"
          alt=""
          style={{ cursor: "pointer", height: "20px", width: "20px" }}
          onClick={handleNavigate}
        />
        <h3 className="title-class">User Details</h3>
      </div>{" "}
      {allData.length > 0 && (
        <div className="content-wrapper">
          <div className="margin-div1">
            <div className="main-content">
              <div className="user-details">
                <div className="user-details1">
                  {allData[0].profile_img ? (
                    <img
                      src={allData[0].profile_img}
                      style={{
                        objectFit: "contain",
                        border: "1px solid #dee2e6",
                        borderRadius: "50%",
                        height: "3.75rem",
                        width: "3.75rem",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#e4d0f7",
                        borderRadius: "50%",
                        height: "40px",
                        width: "40px",
                        fontWeight: "bold",
                        color: "#871df6",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {allData[0]?.name
                        ? allData[0].name
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase())
                            .join("")
                        : "-"}
                    </div>
                  )}
                  <div>
                    <h6
                      style={{
                        color: "#242424",
                        fontSize: "1.25rem",
                        fontWeight: "bolder",
                      }}
                    >
                      {allData[0]?.name}
                    </h6>
                    <p
                      style={{
                        marginBottom: "0px",
                        fontSize: "0.75rem",
                      }}
                    >
                      <img
                        src="/phone.svg"
                        alt=""
                        style={{
                          width: "14px",
                          height: "14px",
                        }}
                      />
                      {"  "}
                      {allData[0]?.phone}
                    </p>
                    {allData[0].email && (
                      <p style={{ fontSize: "0.75rem" }}>
                        <img
                          src="/msg.svg"
                          alt=""
                          style={{
                            width: "14px",
                            height: "14px",
                          }}
                        />
                        {"  "}
                        {allData[0]?.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="user-details2">
                  <p style={{}}>No. of vehicles:</p>
                  <br />
                  <span style={{ color: "black", fontWeight: "bolder" }}>
                    {allData[0]?.vehicles_catalogues.length}
                  </span>
                </div>
                <div className="user-details2">
                  <p>Bookings:</p>
                  <br />
                  <span style={{ color: "black", fontWeight: "bolder" }}>
                    {allData[0]?.booking_count}
                  </span>
                </div>

                <div className="user-details2">
                  <p>Completed Charging:</p>
                  <br />
                  <span style={{ color: "black", fontWeight: "bolder" }}>
                    {allData[0]?.completed_charging_count}
                  </span>
                </div>

                <div className="user-details2">
                  <p>Cancelled Bookings:</p>
                  <br />
                  <span style={{ color: "black", fontWeight: "bolder" }}>
                    {allData[0]?.cancelled_charging_count}
                  </span>
                </div>

                <div className="user-details2">
                  <p>Sign Up:</p>
                  <br />
                  <span style={{ color: "black", fontWeight: "bolder" }}>
                    {moment
                      .tz(allData[0]?.createdAt, "Asia/Kolkata")
                      .format("DD MMMM YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <br />
          <h6 style={{ color: "#495057" }}>Vehicle Details</h6>
          <div className="vehicle-details">
            {allData[0].vehicles_catalogues.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="box-top-div">
                  <div>
                    <h5 style={{ color: "rgb(32, 178, 170)" }}>
                      {vehicle?.brand?.brand_name} {vehicle?.model}
                      <p
                        style={{
                          paddingTop: "10px",
                          paddingBottom: "0px",
                          color: "rgb(108, 117, 125)",
                        }}
                      >
                        {vehicle?.vehicle_type}
                      </p>
                    </h5>
                  </div>
                  <img
                    src={vehicle?.vehicle_img}
                    style={{ width: "60px", height: "50px" }}
                  />
                </div>

                <hr className="hr-style" />

                <div style={{ display: "flex" }}>
                  <div className="box-bottom-div">
                    <h4 className="heading-tag">
                      Battery <br />
                      Capacity
                    </h4>{" "}
                    <p>
                      {vehicle.battery_capacity}
                      <span style={{ color: "rgb(108, 117, 125)" }}>kWh</span>
                    </p>
                  </div>
                  <div className="vr"></div>

                  <div className="box-bottom-div">
                    <h4 className="heading-tag">Connector</h4>
                    <p>{vehicle?.connectors?.[0]?.connector_type}</p>
                    <span style={{ color: "rgb(108, 117, 125)" }}>
                      ({vehicle?.connectors?.[0]?.current_type})
                    </span>
                  </div>
                  <div className="vr"></div>

                  <div className="box-bottom-div">
                    <h4 className="heading-tag">
                      Make <br />
                      Year
                    </h4>{" "}
                    <p>2022</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
