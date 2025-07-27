import { useDebounce } from "use-debounce";
import Skeleton from "react-loading-skeleton";
import Collapse from "react-bootstrap/Collapse";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import axios from "axios";
import "../Static/vehiclemanagement.css";
export default function VehicleManagement() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [allData, setallData] = useState([]);
  const [topFilter, setTopFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [activeCard, setActiveCard] = useState("total");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    archived: false,
    active: false,
    limit: 15,
    page: page,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const [records, setRecords] = useState({
    total_records: 0,
    active_records: 0,
    archived_records: 0,
  });

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/vehicles`, {
        params: {
          limit: filters?.limit,
          page: page,
          ...(filters.active ? { active: true } : {}),
          ...(filters.archived ? { archived: true } : {}),
          ...(debouncedSearchText && { search_term: debouncedSearchText }),
        },
      });

      console.log("Code", response?.data?.code);
      console.log(response?.data);
      if (response?.data?.code === 200) {
        const newData = response?.data?.data || [];
        setallData((prevData) => [...prevData, ...newData]);
        setRecords(response?.data?.record_counts || {});

        setPagination({
          current_page: response?.data?.pagination?.current_page || page,
          total_pages: response?.data?.pagination?.total_pages || 1,
        });
      } else if (response?.data?.code === 204) {
        setallData([]);
        setPagination({
          current_page: 1,
          total_pages: 1,
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
    setLoading(false);
  };

  const handleScrollEvent = async () => {
    // console.log("Height=", document.documentElement.scrollHeight); //84227
    // console.log("View port=", window.innerHeight); //288
    // console.log("scroll=", document.documentElement.scrollTop);
    try {
      //console.log("in try");
      // console.log(pagination?.current_page);
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        //  console.log("in try if");
        if (!loading && pagination?.current_page <= pagination?.total_pages) {
          //console.log("object");
          //console.log(pagination?.current_page);
          setPage((prevPage) => prevPage + 1);
        }
      }
    } catch (error) {
      console.log("Scroll error", error);
    }
  };
  const handleFilterOpt = () => setTopFilter(!topFilter);

  useEffect(() => {
    setallData([]);
    //console.log(page);
  }, [filters]);

  useEffect(() => {
    if (page <= pagination.total_pages) {
      fetchdata();
    }
  }, [page, filters, debouncedSearchText]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <>
      <div className="heading-bar">
        <h3 className="title-class">Vehicle Management</h3>

        <OverlayTrigger
          placement="left"
          overlay={<Tooltip id="button-tooltip">Filter</Tooltip>}
        >
          <button
            className="filter-btn"
            onClick={handleFilterOpt}
            aria-controls="example-collapse-text"
            aria-expanded={topFilter}
          >
            <img className="filter-img" />
          </button>
        </OverlayTrigger>
        <button className="add-station-btn">
          <img className="add-icon"></img>
          <p style={{ fontSize: "1rem" }}>Add Vehicle</p>
        </button>

        <button className="add-bulk-btn">
          <img className="add-bulk-icon"></img>
          <p style={{ fontSize: "1rem" }}>Bulk Upload</p>
        </button>
      </div>

      <div className="details-section">
        <Card
          onClick={() => {
            setActiveCard("total");
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
            width: "199px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#20b2aa33",
            cursor: "pointer",
            padding: "11px",
            borderBottom: activeCard === "total" ? "4px solid #20b2aa" : "none",
          }}
        >
          <Card.Title
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              minWidth: "179px",
            }}
          >
            Total Vehicles
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
                src="./total_users.svg"
                alt=""
                style={{ width: "16px", height: "16px" }}
              />
            </div>
          </Card.Title>
          <Card.Text style={{ fontWeight: "bold" }}>
            {records?.total_records}
          </Card.Text>
        </Card>

        <Card
          onClick={() => {
            setActiveCard("active");
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
            width: "215px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#32cd3233",
            cursor: "pointer",
            padding: "11px",
            borderBottom:
              activeCard === "active" ? "4px solid #20b2aa" : "none",
          }}
        >
          {/* {console.log("Filters", filters)} */}
          <Card.Title
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              minWidth: "196px",
            }}
          >
            Active Vehicles
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
                src="./active_users.svg"
                alt=""
                style={{ width: "16px", height: "16px" }}
              />
            </div>
          </Card.Title>
          <Card.Text style={{ fontWeight: "bold" }}>
            {records?.active_records}
          </Card.Text>
        </Card>

        <Card
          onClick={() => {
            setActiveCard("archived");
            //console.log("Filters", filters);
            setFilters((prevFilter) => ({
              ...prevFilter,
              archived: true,
              active: false,
            }));
            setPage(1);
          }}
          style={{
            width: "225px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#ff450033",
            cursor: "pointer",
            padding: "11px",
            borderBottom:
              activeCard === "archived" ? "4px solid #20b2aa" : "none",
          }}
        >
          <Card.Title
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              width: "207px",
            }}
          >
            Archive Vehicles
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
                src="./archive.svg"
                alt=""
                style={{ width: "16px", height: "16px" }}
              />
            </div>
          </Card.Title>
          <Card.Text style={{ fontWeight: "bold" }}>
            {records?.archived_records}
          </Card.Text>
        </Card>
      </div>
      <div className="content-wrapper">
        <Collapse in={topFilter}>
          <div className="filter-section" id="example-collapse-text">
            <div
              style={{
                padding: "20px",
                display: "flex",
                gap: "20px",
                marginBottom: "15px",
              }}
            >
              <div className="input-group">
                <img src="./search.svg" alt="" style={{ padding: "10px" }} />
                <input
                  type="text"
                  placeholder="Search Here..."
                  style={{ all: "unset" }}
                  value={searchText}
                  onChange={(e) => {
                    setPage(1);
                    setSearchText(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </Collapse>
        <div className="margin-div">
          <div className="main-content">
            <table className="main-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Battery Capacity(kW/h)</th>
                  <th>Battery Voltage(v)</th>
                  <th>Connectors</th>
                  <th>Action</th>
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
                  allData.map((item) => (
                    <tr key={item?.id}>
                      <td>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <div>
                            <img
                              src={
                                item?.vehicle_img?.startsWith("/")
                                  ? `https://api.mnil.hashtechy.space${item.vehicle_img}`
                                  : item?.vehicle_img
                              }
                              alt=""
                              style={{
                                height: "70px",
                                width: "70px",
                                objectFit: "contain",
                                border: "1px solid #e9ecef",
                                borderRadius: ".375rem",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              textAlign: "left",
                              alignContent: "center",
                            }}
                          >
                            {" "}
                            {item?.brand?.brand_name} {item?.model}
                            <br />
                            {item?.vehicle_type}
                          </div>
                        </div>
                      </td>

                      <td>{item?.battery_capacity}</td>

                      <td>{item?.battery_voltage}</td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%", // Ensures vertical centering works
                            minHeight: "80px", // Minimum height to prevent squishing
                          }}
                        >
                          {item?.connectors?.map((connector) => (
                            <div
                              key={connector.id}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                              }}
                            >
                              <img
                                style={{
                                  height: "40px",
                                  width: "40px",
                                  objectFit: "contain",
                                }}
                                src={`https://api.mnil.hashtechy.space${connector?.connector_img}`}
                                alt={connector?.connector_type}
                              />
                              <div style={{ marginTop: "4px" }}>
                                <span
                                  style={{ color: "black", fontSize: "12px" }}
                                >
                                  {connector?.connector_type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="button-tooltip">Edit</Tooltip>}
                        >
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setModalType("edit");
                              setaddAmenity(false);
                              setEditAmenityID(item?.id);
                              handleShow();
                            }}
                          >
                            <img src="./edit.svg" alt="" />
                          </button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip">Archive</Tooltip>
                          }
                        >
                          <button
                            className="archive-btn"
                            onClick={() => {
                              handleShow();
                              setModalType("delete");
                              setdeleteAmenityID(item?.id);
                            }}
                          >
                            <img src="./archive.svg" alt="" />
                          </button>
                        </OverlayTrigger>
                      </td>
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
      </div>
    </>
  );
}
