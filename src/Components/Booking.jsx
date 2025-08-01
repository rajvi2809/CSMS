import { useDebounce } from "use-debounce";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import Select from "react-select";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import Skeleton from "react-loading-skeleton";
import "../static/booking.css";

const Options = [
  { value: "Technical Issues", label: "Technical Issues" },
  { value: "Power Issue", label: "Power Issue" },
  { value: "Booking or System Issue", label: "Booking or System Issue" },
  { value: "Maintenance", label: "Maintenance" },
];

const OptionsFilter = [
  { value: "Pending", label: "Pending" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function Booking() {
  //const [cookies] = useCookies(["accessToken"]);
  const [allData, setallData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [selectedId, setSelectedId] = useState(null);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [topFilter, setTopFilter] = useState(false);

  const [selectBtn, setSelectBtn] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSelectOpen = () => setSelectBtn(true);
  const handleSelectClose = () => setSelectBtn(false);
  const handleFilterOpt = () => setTopFilter(!topFilter);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`booking?limit=10&page=${page}`, {
        params: {
          ...(statusFilter && { status: statusFilter }),
          ...(debouncedSearchText && { search_term: debouncedSearchText }),
        },
      });
      console.log(response?.data);

      if (page === 1) {
        setallData(response?.data?.data || []);
      } else if (response?.data?.code === 204) {
        setallData([]);
      } else {
        setallData((prevData) => [
          ...prevData,
          ...(response?.data?.data || []),
        ]);
      }

      setPagination({
        current_page: response?.data?.pagination?.current_page || page,
        total_pages: response?.data?.pagination?.total_pages || 1,
      });
    } catch (error) {
      console.log("Error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (page <= pagination.total_pages) {
      fetchdata();
    }
  }, [page, statusFilter, debouncedSearchText]);

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

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <>
      <div className="heading-bar">
        <h3 className="title-class">Booking Management</h3>

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
                width: "1026px",
                backgroundColor: "white",
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

              <Select
                onChange={(selectedOption) => {
                  setPage(1);
                  setStatusFilter(selectedOption ? selectedOption.value : null);
                }}
                className="custom-select"
                placeholder="Select Booking status"
                isClearable={true}
                options={OptionsFilter}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    maxHeight: "36px",
                    minHeight: "36px",
                    minWidth: "256px",
                    borderColor: "rgb(222,226,230)",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "rgb(222,226,230)",
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor:
                      state.isFocused || state.isSelected
                        ? "rgb(32,178,170)"
                        : "white",
                    color:
                      state.isFocused || state.isSelected ? "white" : "black",
                    "&:active": {
                      backgroundColor: "rgb(32,178,170)",
                      color: "white",
                    },
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "black", // Ensures selected value text stays black
                  }),
                }}
              ></Select>
            </div>
          </div>
        </Collapse>

        <div className="margin-div">
          <div className="main-content">
            <table className="main-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Serial Number</th>
                  <th>User Details</th>
                  <th>Station Name</th>
                  <th>Connector Type</th>
                  <th>Status</th>
                  <th>Slot Time</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
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
                ) : allData?.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan="10"
                      style={{ textAlign: "center", padding: "40px 0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src="/noRecords.png"
                          alt="No records found"
                          style={{ width: "258px", margin: "auto" }}
                        />
                        <p
                          style={{
                            fontSize: "20px",
                            marginTop: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          No records found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allData?.map((data) => (
                    <tr key={data?.id}>
                      <td
                        className="popup-details"
                        variant="primary"
                        onClick={() => {
                          setSelectedId(data.id);
                          handleShow();
                        }}
                      >
                        {data?.id}
                      </td>

                      {selectedId === data.id && (
                        <>
                          <Modal
                            show={show}
                            onHide={handleClose}
                            size="xl"
                            backdrop="static"
                            keyboard={true}
                            style={{
                              backdropFilter: "blur(2px)",
                              fontSize: "16px",
                            }}
                          >
                            <Modal.Header
                              closeButton
                              className="custom-modelHeader"
                            >
                              <Modal.Title>{data?.id}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="popup-body">
                                <div className="popup-user">
                                  <div className="popup-user1">
                                    {data?.user?.profile_img ? (
                                      <img
                                        src={`https://api.mnil.hashtechy.space/${data?.user?.profile_img}`}
                                        alt=""
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
                                          backgroundColor: "#dee2e6",
                                          borderRadius: "50%",
                                          height: "3.75rem",
                                          width: "3.75rem",
                                          fontSize: "1.5rem",
                                          fontWeight: "bold",
                                          color: "#495057",
                                          border: "1px solid #dee2e6",
                                        }}
                                      >
                                        {data?.user?.name
                                          ?.charAt(0)
                                          .toUpperCase()}
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
                                        {data?.user?.name}
                                      </h6>
                                      <p
                                        style={{
                                          marginBottom: "0px",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        <img
                                          src="./phone.svg"
                                          alt=""
                                          style={{
                                            width: "14px",
                                            height: "14px",
                                          }}
                                        />
                                        {"  "}
                                        {data?.user?.phone}
                                      </p>
                                      <p style={{ fontSize: "0.75rem" }}>
                                        <img
                                          src="./msg.svg"
                                          alt=""
                                          style={{
                                            width: "14px",
                                            height: "14px",
                                          }}
                                        />
                                        {"  "}
                                        {data?.user?.email}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="popup-user2">
                                    <p
                                      style={{
                                        color: "#7d7d7d",
                                        fontSize: ".875rem",
                                      }}
                                    >
                                      Vehicle Name
                                    </p>
                                    <p
                                      style={{
                                        color: "#000",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      {
                                        data?.vehicles_catalogue?.brand
                                          ?.brand_name
                                      }{" "}
                                      {data?.vehicles_catalogue?.model}
                                    </p>
                                  </div>

                                  <div className="popup-user3">
                                    <p
                                      style={{
                                        color: "#7d7d7d",
                                        fontSize: ".875rem",
                                      }}
                                    >
                                      Consumption (W)
                                    </p>
                                    <p
                                      style={{
                                        color: "#000",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      {data?.consumption ?? 0}
                                    </p>
                                  </div>

                                  <div className="popup-user4">
                                    <p
                                      style={{
                                        color: "#7d7d7d",
                                        fontSize: ".875rem",
                                      }}
                                    >
                                      Payment Method
                                    </p>
                                    <p
                                      style={{
                                        color: "#000",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      {data?.bookingwise_payment
                                        ?.payment_method ?? "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="popup-vehicle">
                                  <table className="vehicle-table">
                                    <thead>
                                      <tr>
                                        <th>Serial Number</th>
                                        <th>Station Name</th>
                                        <th>Connector / Position</th>
                                        <th>Slot Time</th>
                                        <th>Booking Time</th>
                                        {data?.status === "Completed" && (
                                          <th>Session</th>
                                        )}
                                        {data?.status === "Cancelled" && (
                                          <th>Cancelled Time</th>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>{data?.charger?.id}</td>

                                        <td>{data?.station?.station_name}</td>

                                        <td>
                                          {data?.connector?.connector_type}
                                          {<br />}
                                          <span style={{ color: "#696969" }}>
                                            {data?.charger_position}
                                          </span>
                                        </td>

                                        <td>
                                          {moment
                                            .tz(
                                              data?.booked_start_time,
                                              "Asia/Kolkata"
                                            )
                                            .format("hh:mm A")}
                                          -
                                          {moment
                                            .tz(
                                              data?.booked_end_time,
                                              "Asia/Kolkata"
                                            )
                                            .format("hh:mm A")}
                                        </td>

                                        <td>
                                          {moment
                                            .tz(
                                              data?.booked_start_time,
                                              "Asia/Kolkata"
                                            )
                                            .format("YYYY-MM-DD")}
                                          <br />
                                          <span
                                            style={{
                                              color: "black",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {" "}
                                            {moment
                                              .tz(
                                                data?.booked_start_time,
                                                "Asia/Kolkata"
                                              )
                                              .format("hh:mm A")}
                                          </span>
                                        </td>
                                        {data?.status === "Completed" && (
                                          <td
                                            style={{
                                              padding: " 5px 16px 5px 5px",
                                            }}
                                          >
                                            {moment
                                              .tz(
                                                data?.session_start_time,
                                                "Asia/Kolkata"
                                              )
                                              .format("hh:mm A")}
                                            {" - "}
                                            {moment
                                              .tz(
                                                data?.session_end_time,
                                                "Asia/Kolkata"
                                              )
                                              .format("hh:mm A")}
                                          </td>
                                        )}
                                        {data?.status === "Cancelled" && (
                                          <td
                                            style={{
                                              padding: " 5px 16px 5px 5px",
                                            }}
                                          >
                                            {moment
                                              .tz(
                                                data?.updatedAt,
                                                "Asia/Kolkata"
                                              )
                                              .format("YYYY-MM-DD")}
                                            {"  "}
                                            {moment
                                              .tz(
                                                data?.updatedAt,
                                                "Asia/Kolkata"
                                              )
                                              .format("hh:mm A")}{" "}
                                          </td>
                                        )}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div className="popup-price">
                                  <table className="popup-price-table">
                                    <thead>
                                      <tr>
                                        <th>Price Details</th>
                                        <th
                                          style={{
                                            textAlign: "end",
                                            paddingRight: "20px",
                                          }}
                                        >
                                          Price
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>Base Price</td>
                                        <td
                                          style={{
                                            textAlign: "end",
                                            paddingRight: "20px",
                                          }}
                                        >
                                          ₹
                                          {data?.bookingwise_payment
                                            ?.base_fee ?? 0}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>Parking Fees</td>
                                        <td
                                          style={{
                                            textAlign: "end",
                                            paddingRight: "20px",
                                          }}
                                        >
                                          ₹
                                          {data?.bookingwise_payment
                                            ?.parking_fee ?? 0}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>Convenience fee</td>
                                        <td
                                          style={{
                                            textAlign: "end",
                                            paddingRight: "20px",
                                          }}
                                        >
                                          ₹
                                          {data?.bookingwise_payment
                                            ?.convenience_fee ?? 0}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>Total Amount</td>
                                        <td
                                          style={{
                                            textAlign: "end",
                                            paddingRight: "20px",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontWeight: "bold",
                                              color: "black",
                                            }}
                                          >
                                            ₹
                                            {data?.bookingwise_payment
                                              ?.amount ?? 0}
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                style={{
                                  backgroundColor: "#d3d4d5",
                                  border: "none",
                                  color: "black",
                                }}
                                onClick={handleClose}
                              >
                                Close
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </>
                      )}

                      <td>{data?.charger?.id}</td>

                      <td style={{ textAlign: "left" }}>
                        {data?.user?.name}
                        <br />
                        <span style={{ color: " rgb(73, 80, 87)" }}>
                          {data?.user?.phone}
                        </span>
                      </td>

                      <td>{data?.station?.station_name}</td>

                      <td>
                        <div style={{ position: "relative" }}>
                          <img
                            className="img-connector"
                            src={`https://api.mnil.hashtechy.space/${data?.connector?.connector_img}`}
                          />

                          <span
                            style={{
                              width: "24px",
                              height: "24px",
                              backgroundColor: "#f1f1f1",
                              color: "#000",
                              borderRadius: "50%",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 500,
                              fontSize: "12px",
                              position: "absolute",
                              display: "inline-flex",
                            }}
                          >
                            {data?.charger_position.charAt(0).toUpperCase()}
                          </span>
                          <br />
                          {data?.connector?.connector_type}
                        </div>
                      </td>

                      <td>
                        <p
                          style={{
                            height: "auto",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                          }}
                          className={
                            data?.status === "Completed"
                              ? "alert alert-success border border-success"
                              : data?.status === "Pending"
                              ? "alert alert-warning border border-warning"
                              : data?.status === "Cancelled"
                              ? "alert alert-danger border border-danger"
                              : data?.status === "Confirmed"
                              ? "alert alert-info border border-info"
                              : data?.status === "Ongoing"
                              ? "alert border border-dark"
                              : ""
                          }
                        >
                          {data?.status}
                        </p>
                      </td>

                      <td>
                        {moment
                          .tz(data?.booked_start_time, "Asia/Kolkata")
                          .format("YYYY-MM-DD")}
                        <br />
                        <span style={{ color: "black", fontWeight: "bold" }}>
                          {" "}
                          {moment
                            .tz(data?.booked_start_time, "Asia/Kolkata")
                            .format("hh:mm A")}
                        </span>
                      </td>
                      <td>₹{data?.bookingwise_payment?.amount ?? 0}/-</td>

                      <td>
                        {data?.bookingwise_payment?.payment_method ?? "-"}
                      </td>
                      <td>
                        {data?.status === "Confirmed" ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-cancel">Cancel</Tooltip>
                            }
                          >
                            <button
                              className="cancel-btn"
                              onClick={handleSelectOpen}
                            >
                              <img src="./cross.svg" alt="" />
                            </button>
                          </OverlayTrigger>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectBtn && (
        <Modal
          show={selectBtn}
          onHide={handleSelectClose}
          centered
          backdrop="static"
          keyboard={true}
          style={{ backdropFilter: "blur(2px)" }}
        >
          <Modal.Header closeButton style={{ backgroundColor: "#20b2aa0d" }}>
            <Modal.Title style={{ fontSize: "1.25rem" }}>
              Cancel Booking
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <label style={{ fontSize: "16px" }}>
              Connector Type<span className="span1">*</span>
            </label>
            <Select
              className="custom-select"
              placeholder="Select Reason"
              onChange={setSelectedOption}
              options={Options}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? "rgb(32,178,170)" : "#ccc", // light grey default
                  boxShadow: state.isFocused
                    ? `0 0 0 1px rgb(32,178,170)`
                    : "none",
                  "&:hover": {
                    borderColor: state.isFocused ? "rgb(32,178,170)" : "#ccc",
                  },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "rgb(32,178,170)"
                    : "white",
                  color: state.isFocused ? "white" : "black",
                }),
              }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              style={{
                backgroundColor: "#d3d4d5",
                border: "none",
                color: "black",
              }}
              onClick={handleSelectClose}
            >
              Close
            </Button>
            <Button
              style={{
                backgroundColor: "rgb(32,178,170)",
                color: "white",
                border: "none",
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
