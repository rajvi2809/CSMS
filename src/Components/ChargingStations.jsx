import { Form, Field, Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Collapse from "react-bootstrap/Collapse";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import "../static/chargingStation.css";

export default function ChargingStations() {
  const [topFilter, setTopFilter] = useState(false);
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [stationToArchive, setstationToArchive] = useState(null);
  const [stationToRestore, setstationToRestore] = useState(null);
  const [activeCard, setActiveCard] = useState("total");
  const [isArchive, setisArchive] = useState(false);
  const [showStation, setShowStation] = useState(false);

  const [options, setOptions] = useState([]); //lists options
  const [selectedOption, setSelectedOption] = useState([]); //has current selected option

  const [optionsAmenities, setOptionsAmenities] = useState([]); //list of all Amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]); //current selected Amenities

  const [selectedStation, setSelectedStation] = useState(null);

  const [records, setRecords] = useState({
    total_records: 0,
    active_records: 0,
    archived_records: 0,
  });
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
  const validationSchema = yup.object().shape({
    stationName: yup.string().required("Station name is required"),
    address: yup.string().required("Address is required"),
    charger: yup.array().min(1, "Please select at least one charger"),
    amenity: yup.array().min(1, "Please select at least one amenity"),
    latitude: yup.string().required("Latitude is required"),
    longitude: yup.string().required("Longitude is required"),
  });

  const initialValues = (station = null) => {
    if (station) {
      return {
        stationName: station.station_name || "",
        address: station.address || "",
        charger:
          station.chargers?.map((c) => ({ value: c.id, label: c.id })) || [],
        amenity:
          station.amenities?.map((a) => ({
            value: a.amenity_name,
            label: a.amenity_name,
            image: `https://api.mnil.hashtechy.space${a.amenity_img}`,
          })) || [],
        latitude: station.latitude || "",
        longitude: station.longitude || "",
      };
    }
    return {
      stationName: "",
      address: "",
      charger: [],
      amenity: [],
      latitude: "",
      longitude: "",
    };
  };

  const handleSubmitForm = async (values, { setSubmitting }) => {
    try {
      const payload = {
        station_name: values.stationName,
        address: values.address,
        charger_ids: values.charger.map((c) => c.value),
        amenities: values.amenity.map((a) => a.value),
        latitude: values.latitude,
        longitude: values.longitude,
      };

      if (selectedStation) {
        // Edit existing station
        const response = await axios.patch(
          `charging-station/update/${selectedStation.id}`,
          payload
        );
        toast.success("Station updated successfully");

        // Update local state
        setallData((prevData) =>
          prevData.map((station) =>
            station.id === selectedStation.id
              ? { ...station, ...response.data.data }
              : station
          )
        );
      } else {
        // Add new station
        const response = await axios.post("/charging-station/create", payload);
        toast.success("Station created successfully");

        // Add to local state
        setallData((prevData) => [response.data.data, ...prevData]);
      }

      handleCloseStation();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseStation = () => setShowStation(false);
  const handleShowStation = () => setShowStation(true);

  const handleFilterOpt = () => setTopFilter(!topFilter);

  // const handleEditClick = (station) => {
  //   setSelectedStation(station);

  //   const selectedChargers =
  //     station.chargers?.map((c) => ({
  //       value: c.id,
  //       label: c.id,
  //     })) || [];

  //   setSelectedOption(selectedChargers);

  //   setOptions((prevOptions) =>
  //     prevOptions.filter(
  //       (opt) => !selectedChargers.some((sel) => sel.value === opt.value)
  //     )
  //   );

  //   const selectedAms =
  //     station.amenities?.map((a) => ({
  //       value: a.amenity_name,
  //       label: a.amenity_name,
  //       image: `https://api.mnil.hashtechy.space${a.amenity_img}`,
  //     })) || [];

  //   setSelectedAmenities(selectedAms);

  //   setOptionsAmenities((prevOptions) =>
  //     prevOptions.filter(
  //       (opt) => !selectedAms.some((sel) => sel.value === opt.value)
  //     )
  //   );
  // };
  // console.log("station", selectedStation);

  const handleArchiveCharging = async (chargingId) => {
    try {
      const response = await axios.delete(
        `charging-station/delete/${chargingId}`,
        {
          params: { id: chargingId },
        }
      );
      console.log("response", response);

      //console.log(chargingId);
      setallData((prevData) =>
        prevData.map((charging) =>
          charging.id === chargingId
            ? { ...charging, deletedAt: new Date().toISOString() }
            : charging
        )
      );

      setRecords((prevRecords) => ({
        ...prevRecords,
        active_records: prevRecords.active_records - 1,
        archived_records: prevRecords.archived_records + 1,
      }));

      if (activeCard === "active") {
        setallData((prevData) =>
          prevData.filter((charging) => charging.id !== chargingId)
        );
      }

      handleClose();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleRestoreStation = async (stationId) => {
    try {
      // const token = cookies.accessToken;
      // if (!token) {
      //   console.log("No Token");
      //   return;
      // }
      const response = await axios.delete(
        `charging-station/restore/${stationId}`
      );
      console.log("Restore response", response);

      setallData((prevData) => {
        const updatedData = prevData.map((station) =>
          station.id === stationId ? { ...station, deletedAt: null } : station
        );

        if (activeCard === "archived") {
          return updatedData.filter((station) => station.deletedAt !== null);
        }

        return updatedData;
      });

      setRecords((prevRecords) => ({
        ...prevRecords,
        active_records: prevRecords.active_records + 1,
        archived_records: prevRecords.archived_records - 1,
      }));

      handleClose();
    } catch (error) {
      console.log("Error restoring user", error);
    }
  };

  const handleNavigate = (stationId) => {
    navigate(`/charging-station-details/${stationId}`);
  };

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`charging-station`, {
        params: {
          limit: filters?.limit,
          page: page,
          ...(filters.active ? { active: true } : {}),
          ...(filters.archived ? { archived: true } : {}),
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

  const getTotalConnectors = (chargers) => {
    let sum = 0;
    chargers?.forEach((c) => {
      sum += c.connectors?.length || 0;
    });
    return sum;
  };

  const getAvailableConnectors = (chargers) => {
    let available = 0;
    chargers?.forEach((c) => {
      c.connectors?.forEach((conn) => {
        if (conn.status === "Available") {
          //console.log("availabe", conn.status);
          available++;
        }
      });
    });
    return available;
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.get("/charger/unassigned");
      console.log("object", response?.data?.data);
      const dynamicOptions = response?.data?.data.map((item) => ({
        value: item.id,
        label: item.id,
      }));
      setOptions(dynamicOptions);
    } catch (error) {
      console.error("Failed to fetch options", error);
    }
  };

  const fetchAmenities = async () => {
    try {
      const response = await axios.get("/amenity");
      console.log("object", response?.data?.data);
      const dynamicOptions = response?.data?.data.map((item) => ({
        value: item.amenity_name,
        label: item.amenity_name,
        image: `https://api.mnil.hashtechy.space${item?.amenity_img}`,
      }));

      console.log("object", dynamicOptions);
      setOptionsAmenities(dynamicOptions);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const displayAmenityImg = ({ label, image }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img src={image} alt={label} style={{ width: 24, height: 24 }} />
      <p>{label}</p>
    </div>
  );

  const handleChange = (option) => {
    setSelectedOption(option || []);
    setOptions((prevOptions) =>
      prevOptions.filter((opt) => opt.value !== option.value)
    );
  };
  const handleChangeAmenities = (option) => {
    setSelectedAmenities(option || []);
    setOptionsAmenities((prevOptions) =>
      prevOptions.filter((opt) => opt.value !== option.value)
    );
  };

  useEffect(() => {
    setallData([]);
    //console.log(page);
  }, [filters]);

  useEffect(() => {
    if (page <= pagination.total_pages) {
      fetchdata();
    }
  }, [page, filters]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <>
      <div className="heading-bar">
        <h3 className="title-class">Charging Stations</h3>

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
        <button
          className="add-station-btn"
          onClick={() => {
            handleShowStation();
            fetchOptions();
            fetchAmenities();
            // handleEditClick();
          }}
        >
          <img className="add-icon"></img>
          <p style={{ fontSize: "1rem" }}>Add Stations</p>
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
              minWidth: "177px",
            }}
          >
            Total Stations
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
            Active Stations
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
            Archive Stations
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
                  <th>ID</th>
                  <th>Station Detail</th>
                  <th>Consumption</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                  <th>Available Ports</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allData.length === 0 ? (
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
                  allData.map((data) => (
                    <tr key={data.id}>
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
                      </td>

                      <td className="ports-td">
                        <div className="ports-div">
                          <span style={{ color: "orange" }}>
                            {getAvailableConnectors(data?.chargers)}
                          </span>
                          <span style={{ color: "rgb(125, 125, 125)" }}>
                            /{getTotalConnectors(data?.chargers)}
                          </span>
                        </div>
                      </td>

                      <td style={{ minWidth: "97px" }}>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="button-tooltip">Edit</Tooltip>}
                        >
                          <button className="edit-btn">
                            <img src="./edit.svg" alt="" />
                          </button>
                        </OverlayTrigger>

                        {data?.deletedAt ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="button-tooltip">Restore</Tooltip>
                            }
                          >
                            <button
                              className="restore-btn"
                              onClick={() => {
                                setstationToRestore(data.id);
                                handleShow();
                                setisArchive(true);
                              }}
                            >
                              <img src="./restore.svg" alt="" />
                            </button>
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="button-tooltip">Archive</Tooltip>
                            }
                          >
                            <button
                              className="archive-btn"
                              onClick={() => {
                                setstationToArchive(data?.id);
                                handleShow();
                                setisArchive(false);
                              }}
                            >
                              <img src="./archive.svg" alt="" />
                            </button>
                          </OverlayTrigger>
                        )}
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

      <Modal
        show={showStation}
        onHide={handleCloseStation}
        backdrop="static"
        keyboard={false}
        style={{
          backdropFilter: "blur(2px)",
        }}
        size="lg"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "rgba(32, 178, 170, 0.05)",
          }}
        >
          <Modal.Title
            style={{
              fontSize: "1.25rem",
            }}
          >
            Update Charging Station
          </Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            ...initialValues,
            charger: selectedOption,
            amenity: selectedAmenities,
          }}
          onSubmit={handleSubmitForm}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              {console.log("values console => ", values)}
              {console.log("errors console => ", errors)}
              <Modal.Body className="form-floating mb-3">
                <div
                  className="form-floating m_input"
                  style={{ marginBottom: "16px" }}
                >
                  <Field
                    type="text"
                    className="form-control charging-input"
                    placeholder="Charging Station Name"
                    name="stationName"
                    id="stationName"
                  />
                  <label htmlFor="stationName">
                    Station Name<span>*</span>
                  </label>
                  <ErrorMessage
                    name="stationName"
                    component="div"
                    className="modal-error"
                  />
                </div>

                <div
                  className="form-floating m_input"
                  style={{ marginBottom: "16px" }}
                >
                  <Field
                    as="textarea"
                    className="form-control charging-input"
                    placeholder="Charging Station Name"
                    name="address"
                    id="address"
                  />
                  <label htmlFor="address">
                    Address<span>*</span>
                  </label>
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="modal-error"
                  />
                </div>

                <div
                  className="charging-input-3"
                  style={{ marginBottom: "16px" }}
                >
                  <div className="charging-input-select m_input">
                    <h6 style={{ marginBottom: "5px" }}>
                      Charger<span>*</span>
                    </h6>
                    <Select
                      isMulti
                      options={options}
                      name="charger"
                      value={values.charger} // Use Formik's values
                      onChange={(option) => {
                        setSelectedOption(option || []);
                        setFieldValue("charger", option || []); // Update Formik's state
                        setOptions((prevOptions) =>
                          prevOptions.filter(
                            (opt) => opt.value !== option.value
                          )
                        );
                      }}
                      placeholder="Select Charger"
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          minHeight: "36px",
                          minWidth: "256px",
                          borderColor: "rgb(222,226,230)",
                          boxShadow: "none",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "rgb(32,178,170)"
                            : "white",
                          color: state.isFocused ? "white" : "black",
                          cursor: "pointer",
                        }),
                      }}
                    />
                    <ErrorMessage
                      name="charger"
                      component="div"
                      className="modal-error"
                    />
                  </div>

                  <div className="charging-input-select m_input">
                    <h6 style={{ marginBottom: "5px" }}>
                      Amenities<span>*</span>
                    </h6>
                    <Select
                      isMulti
                      options={optionsAmenities}
                      name="amenity"
                      value={values.amenity} // Use Formik's values
                      onChange={(option) => {
                        setSelectedAmenities(option || []);
                        setFieldValue("amenity", option || []); // Update Formik's state
                        setOptionsAmenities((prevOptions) =>
                          prevOptions.filter(
                            (opt) => opt.value !== option.value
                          )
                        );
                      }}
                      placeholder="Select Amenity"
                      formatOptionLabel={displayAmenityImg}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          minHeight: "36px",
                          minWidth: "256px",
                          borderColor: "rgb(222,226,230)",
                          boxShadow: "none",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "rgb(32,178,170)"
                            : "white",
                          color: state.isFocused ? "white" : "black",
                          cursor: "pointer",
                        }),
                      }}
                    />
                    <ErrorMessage
                      name="amenity"
                      component="div"
                      className="modal-error"
                    />
                  </div>
                </div>

                <div
                  className="charging-input-4"
                  style={{ marginBottom: "16px" }}
                >
                  <div className="form-floating charging-input-select m_input">
                    <Field
                      type="text"
                      className="form-control"
                      placeholder="Latitude"
                      name="latitude"
                      id="latitude"
                    />
                    <label htmlFor="latitude">
                      Latitude<span>*</span>
                    </label>
                    <ErrorMessage
                      name="latitude"
                      component="div"
                      className="modal-error"
                    />
                  </div>

                  <div className="form-floating charging-input-select m_input">
                    <Field
                      type="text"
                      className="form-control"
                      placeholder="Longitude"
                      name="longitude"
                      id="longitude"
                    />
                    <label htmlFor="longitude">
                      Longitude<span>*</span>
                    </label>
                    <ErrorMessage
                      name="longitude"
                      component="div"
                      className="modal-error"
                    />
                  </div>
                </div>

                {/* <div className="modal-map">Map</div> */}
              </Modal.Body>

              <Modal.Footer>
                <Button
                  style={{
                    backgroundColor: "#e3e3e3",
                    color: "black",
                    border: "none",
                  }}
                  onClick={handleCloseStation}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: "#20b2aa", border: "none" }}
                >
                  Add
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        style={{
          backdropFilter: "blur(2px)",
        }}
      >
        {isArchive ? (
          <>
            <Modal.Body style={{ textAlign: "center" }}>
              <img className="popup-modal-img-restore"></img>
              <br />
              <br />
              <h2 style={{ fontSize: "1.125rem" }}>
                <b> Are you sure you want to Restore this Station ?</b>
              </h2>
            </Modal.Body>
            <Modal.Footer
              style={{
                marginTop: "0px",
                borderTop: "none",
                justifyContent: "center",
              }}
            >
              <Button
                style={{ backgroundColor: "#20b2aa", border: "none" }}
                onClick={() => {
                  if (stationToRestore) {
                    handleRestoreStation(stationToRestore);
                    toast.success("Station Restored Successfully!");
                    handleClose();
                  }
                }}
              >
                Yes
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Body style={{ textAlign: "center" }}>
              <img className="popup-modal-img"></img>
              <br />
              <br />
              <h2 style={{ fontSize: "1.125rem" }}>
                <b> Are you sure you want to Archive this Station ?</b>
              </h2>
            </Modal.Body>
            <Modal.Footer
              style={{
                marginTop: "0px",
                borderTop: "none",
                justifyContent: "center",
              }}
            >
              <Button
                style={{ backgroundColor: "#20b2aa", border: "none" }}
                onClick={() => {
                  if (stationToArchive) {
                    handleArchiveCharging(stationToArchive);
                    toast.success("Station Archived Successfully!");
                    handleClose();
                  }
                }}
              >
                Yes
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
