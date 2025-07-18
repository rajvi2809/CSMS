import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import Select from "react-select";
import * as yup from "yup";
import { Form, Field, Formik, ErrorMessage } from "formik";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import axios from "axios";
import { useState, useEffect } from "react";
import "../static/feesManagement.css";
export default function FeesManagement() {
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [showFees, setShowFees] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteID, setdeleteID] = useState(null);
  const [defaultName, setDefaultName] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const [editID, setEditID] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [addFees, setaddFees] = useState(false);
  const [stationOptions, setStationOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const validationSchema = yup.object().shape({
    station_name: yup.array().min(1, "Station is Required"),
    base_fee: yup.number().required("Convenience fee is required"),
    instant_booking_base_fee: yup
      .number()
      .required("Convenience fee is required"),
    parking_fee: yup.number().required("Convenience fee is required"),
  });

  const initialValues = () => {
    if (modalType === "edit" && editID) {
      const editItem = allData.find((item) => item.id === editID);
      return {
        station_name: editItem
          ? [
              {
                value: editItem.station.id,
                label: editItem.station.station_name,
              },
            ]
          : [],
        base_fee: editItem?.base_fee?.toString() || "", // Convert to string
        instant_booking_base_fee:
          editItem?.instant_booking_base_fee?.toString() || "",
        parking_fee: editItem?.parking_fee?.toString() || "",
      };
    }
    return {
      station_name: [],
      base_fee: "",
      instant_booking_base_fee: "",
      parking_fee: "",
    };
  };
  const validationSchemaFees = yup.object({
    convenience_fee: yup.number().required("Convenience fee is required"),
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseFees = () => setShowFees(false);
  const handleShowFees = () => setShowFees(true);

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/fee`, {
        params: {
          limit: 15,
          page: page,
        },
      });

      console.log(response.data);
      const newData = response?.data?.data || [];

      setallData((prevData) => [...prevData, ...newData]);

      setPagination({
        current_page: response?.data?.pagination?.current_page || page,
        total_pages: response?.data?.pagination?.total_pages || 1,
      });
    } catch (error) {
      console.log("Error", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    console.log("ID", id);
    try {
      const response = await axios.delete(`/fee/delete/${id}`);
      console.log("Response", response);
      if (response?.data?.code == 200) {
        toast.success("Station Fee Deleted Successfully");
        setallData((prevFee) => prevFee.filter((fee) => fee.id !== id));
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(response?.data?.message);
    }
    handleClose();
  };

  const handleSubmit = async (values) => {
    const payload = {
      station_id: values.station_name[0]?.value,
      base_fee: Number(values.base_fee),
      instant_booking_base_fee: Number(values.instant_booking_base_fee),
      parking_fee: Number(values.parking_fee),
    };

    try {
      if (modalType === "add") {
        const response = await axios.post(`/fee/create`, payload);
        console.log("Response", response);
        toast.success(response?.data?.message);
        handleCloseFees();

        setallData((prevData) => [
          {
            ...response.data.data,
            convenience_fee: prevData[0]?.convenience_fee || 0,
            station: {
              id: values.station_name[0]?.value,
              station_name: values.station_name[0]?.label,
            },
          },
          ...prevData,
        ]);
      } else if (modalType === "edit") {
        console.log("Edit Value", values);
        const response = await axios.patch(`/fee/update/${editID}`, payload);
        console.log("Response", response);
        toast.success(response?.data?.message);
        handleCloseFees();

        setallData((prevData) => [
          {
            ...response.data.data,
            convenience_fee: prevData[0]?.convenience_fee || 0,
            station: {
              id: values.station_name[0]?.value,
              station_name: values.station_name[0]?.label,
            },
          },
          ...prevData,
        ]);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmitFees = async (values) => {
    try {
      const response = await axios.patch("/convenience-fee/update", values);
      console.log("Update", response);
      setallData((prevData) =>
        prevData.map((item) => ({
          ...item,
          convenience_fee: values.convenience_fee,
        }))
      );
      handleClose();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const fetchAddOptions = async () => {
    try {
      const response = await axios.get(`/charging-station/unassigned`);
      console.log("Response options", response?.data?.data);
      const dynamicOptions = response?.data?.data.map((item) => ({
        value: item.id,
        label: item.id,
      }));

      // console.log("Station Options", dynamicOptions);
      setStationOptions(dynamicOptions);
    } catch (error) {
      console.log("Error", error);
    }
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

  useEffect(() => {
    if (page <= pagination.total_pages) {
      fetchdata();
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <>
      <div className="heading-bar">
        <h3 className="title-class">Fees Management</h3>

        <button
          onClick={() => {
            setaddFees(true);
            setModalType("add");
            handleShowFees();
            fetchAddOptions();
          }}
          className="add-station-btn"
          style={{ width: "134px", marginLeft: "auto" }}
        >
          <img className="add-icon"></img>
          <p style={{ fontSize: "1rem" }}>Add Fees</p>
        </button>
      </div>

      <div className="details-section">
        <button
          onClick={handleShow}
          className="add-station-btn"
          style={{ minWidth: "185px", marginLeft: "auto", paddingLeft: "7px" }}
        >
          <img className="edit-icon"></img>
          <p style={{ fontSize: "1rem" }}>Convenience Fee</p>
        </button>
      </div>
      <div className="content-wrapper">
        <div className="margin-div">
          <div className="main-content">
            <table className="main-table-fees" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Station ID</th>
                  <th>Station Name</th>
                  <th>Base Fees(₹)</th>
                  <th>Quick Booking Base Fee(₹)</th>
                  <th>Parking Fee(₹)</th>
                  <th>Convenience Fee(₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allData.map((item) => (
                  <tr key={item?.id}>
                    <td>{item?.station?.id}</td>
                    <td>{item?.station?.station_name}</td>
                    <td>{item?.base_fee}</td>
                    <td>{item?.instant_booking_base_fee}</td>
                    <td>{item?.parking_fee}</td>
                    <td>{item?.convenience_fee}</td>
                    <td style={{ minWidth: "95px" }}>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="button-tooltip">Edit</Tooltip>}
                      >
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setModalType("edit");
                            setEditID(item?.id);
                            setDefaultName(item?.station?.station_name);
                            handleShowFees();
                          }}
                        >
                          <img src="./edit.svg" alt="" />
                        </button>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="button-tooltip">Delete</Tooltip>}
                      >
                        <button
                          className="delete-btn"
                          onClick={() => {
                            handleShow();
                            setModalType("delete");
                            setdeleteID(item?.id);
                          }}
                        >
                          <img src="./delete.svg" alt="" />
                        </button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
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
        show={showFees}
        onHide={handleCloseFees}
        backdrop="static"
        keyboard={false}
        centered
        style={{ backdropFilter: "blur(3px)" }}
      >
        <Modal.Header closeButton className="custom-modelHeader">
          <Modal.Title>
            {modalType === "add" ? "Create Station Fees" : "Edit Station Fees"}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            setFieldValue,
            submitCount,
            touched,
            errors,
            setFieldTouched,
          }) => (
            <Form>
              <Modal.Body>
                {modalType === "add" ? (
                  <div
                    className={`charging-input-select m_input ${
                      submitCount > 0 &&
                      touched.station_name &&
                      !errors.station_name
                        ? "is-valid"
                        : ""
                    }`}
                    style={{ width: "466.67px", marginBottom: "1rem" }}
                  >
                    <h6 style={{ marginBottom: "5px" }}>
                      Station<span className="span1">*</span>
                    </h6>
                    <Select
                      isClearable={true}
                      className="input-brand"
                      options={stationOptions}
                      name="station_name"
                      value={values.station_name}
                      onChange={(option) => {
                        setSelectedOption(option || []);
                        setFieldValue("station_name", option ? [option] : []);
                      }}
                      onBlur={() => setFieldTouched("station_name", true)}
                      placeholder="Select Station"
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
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "white", // Ensure menu background is white
                          zIndex: 9999, // Ensure it appears above other elements
                        }),
                        menuList: (base) => ({
                          ...base,
                          padding: 0,
                          backgroundColor: "white", // Ensure options background is white
                        }),
                      }}
                    />
                    {touched.station_name && errors.station_name && (
                      <div className="error-div">{errors.station_name}</div>
                    )}
                  </div>
                ) : (
                  <div className="form-floating mb-3">
                    <Field
                      type="text"
                      name="station_name"
                      id="floatingStationName"
                      disabled
                      value={defaultName}
                      className="form-control"
                    />
                    <label
                      htmlFor="floatingStationName"
                      style={{ top: "1.5px", left: "6px" }}
                    >
                      Station<span className="span1"> *</span>
                    </label>
                  </div>
                )}

                <div
                  className={`form-floating mb-3 m_input ${
                    submitCount > 0 && touched.base_fee && !errors.base_fee
                      ? "is-valid"
                      : ""
                  }`}
                >
                  <Field
                    type="text"
                    name="base_fee"
                    id="floatingName"
                    placeholder="Brand Name"
                    className={`form-control input-brand ${
                      errors.base_fee && touched.base_fee ? "is-invalid" : ""
                    }`}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d{0,8}$/.test(value)) {
                        setFieldValue("base_fee", value);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Allow all control/command key combinations
                      if (e.ctrlKey || e.metaKey) return;
                      const allowedKeys = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        "Home",
                        "End",
                        "Tab",
                        "Enter",
                        "Escape",
                        "Shift",
                      ];

                      // Allow numbers and single decimal point
                      if (
                        !/[0-9]/.test(e.key) &&
                        !(e.key === "." && !e.target.value.includes(".")) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasteData = e.clipboardData.getData("text/plain");

                      if (!/^\d*\.?\d{0,8}$/.test(pasteData)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <label
                    htmlFor="floatingName"
                    style={{ top: "1.5px", left: "6px" }}
                  >
                    Base fee<span className="span1"> *</span>
                  </label>
                  <ErrorMessage
                    name="base_fee"
                    component="div"
                    className="error-div"
                  />
                </div>

                <div
                  className={`form-floating mb-3 m_input ${
                    submitCount > 0 &&
                    touched.instant_booking_base_fee &&
                    !errors.instant_booking_base_fee
                      ? "is-valid"
                      : ""
                  }`}
                  // style={{ marginBlock: "40px" }}
                >
                  <Field
                    type="text"
                    name="instant_booking_base_fee"
                    // className="form-control input-brand"
                    id="floatingName"
                    placeholder="Instant Booking Base fee"
                    className={`form-control input-brand ${
                      errors.instant_booking_base_fee &&
                      touched.instant_booking_base_fee
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d{0,8}$/.test(value)) {
                        setFieldValue("instant_booking_base_fee", value);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Allow all control/command key combinations
                      if (e.ctrlKey || e.metaKey) return;
                      const allowedKeys = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        "Home",
                        "End",
                        "Tab",
                        "Enter",
                        "Escape",
                        "Shift",
                      ];

                      // Allow numbers and single decimal point
                      if (
                        !/[0-9]/.test(e.key) &&
                        !(e.key === "." && !e.target.value.includes(".")) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasteData = e.clipboardData.getData("text/plain");

                      if (!/^\d*\.?\d{0,8}$/.test(pasteData)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <label
                    htmlFor="floatingName"
                    style={{ top: "1.5px", left: "6px" }}
                  >
                    Instant Booking Base fee<span className="span1"> *</span>
                  </label>
                  <ErrorMessage
                    name="instant_booking_base_fee"
                    component="div"
                    className="error-div"
                  />
                </div>

                <div
                  className={`form-floating mb-3 m_input ${
                    submitCount > 0 &&
                    touched.parking_fee &&
                    !errors.parking_fee
                      ? "is-valid"
                      : ""
                  }`}
                  // style={{ marginBlock: "40px" }}
                >
                  <Field
                    type="text"
                    name="parking_fee"
                    // className="form-control input-brand"
                    id="floatingName"
                    placeholder="parking Fee"
                    className={`form-control input-brand ${
                      errors.parking_fee && touched.parking_fee
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d{0,8}$/.test(value)) {
                        setFieldValue("parking_fee", value);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Allow all control/command key combinations
                      if (e.ctrlKey || e.metaKey) return;
                      const allowedKeys = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        "Home",
                        "End",
                        "Tab",
                        "Enter",
                        "Escape",
                        "Shift",
                      ];

                      // Allow numbers and single decimal point
                      if (
                        !/[0-9]/.test(e.key) &&
                        !(e.key === "." && !e.target.value.includes(".")) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasteData = e.clipboardData.getData("text/plain");

                      if (!/^\d*\.?\d{0,8}$/.test(pasteData)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <label
                    htmlFor="floatingName"
                    style={{ top: "1.5px", left: "6px" }}
                  >
                    Parking fee<span className="span1"> *</span>
                  </label>
                  <ErrorMessage
                    name="parking_fee"
                    component="div"
                    className="error-div"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  style={{
                    backgroundColor: "#d3d4d5",
                    border: "none",
                    color: "black",
                  }}
                  onClick={handleCloseFees}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: "#20b2aa", border: "none" }}
                >
                  {modalType === "add" ? "Add" : "Update"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* convenience fees modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{ backdropFilter: "blur(3px)" }}
        centered
      >
        {modalType === "delete" ? (
          <Modal.Body style={{ textAlign: "center" }}>
            <div>
              <i className="brand-modal-title-img"></i>
            </div>
            <div style={{ marginBlock: "10px", fontSize: "18px" }}>
              Are you sure you want to Delete this this Station Fee ?
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                onClick={() => handleDelete(deleteID)}
                style={{
                  backgroundColor: "#20b2aa",
                  color: "white",
                  border: "none",
                }}
              >
                Yes
              </Button>

              <Button
                style={{
                  backgroundColor: "#c6c7c8",
                  color: "black",
                  border: "none",
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </Modal.Body>
        ) : (
          <Formik
            onSubmit={handleSubmitFees}
            validationSchema={validationSchemaFees}
            initialValues={{
              convenience_fee: allData[0]?.convenience_fee || "",
            }}
          >
            {({ errors, setFieldValue, touched }) => (
              <Form>
                <Modal.Header className="custom-modelHeader" closeButton>
                  <Modal.Title>Update Convenience Fees</Modal.Title>
                </Modal.Header>
                <Modal.Body
                  className="form-floating mb-3"
                  style={{ paddingBottom: "0px", marginBottom: "0px" }}
                >
                  <div
                    className="form-floating m_input"
                    style={{ marginBottom: "16px" }}
                  >
                    <Field
                      type="text"
                      name="convenience_fee"
                      id="convenience_fee"
                      className={`form-control charging-input1 ${
                        errors.convenience_fee && touched.convenience_fee
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d{0,8}$/.test(value)) {
                          setFieldValue("convenience_fee", value);
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow all control/command key combinations
                        if (e.ctrlKey || e.metaKey) return;
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                          "Home",
                          "End",
                          "Tab",
                          "Enter",
                          "Escape",
                          "Shift",
                        ];

                        // Allow numbers and single decimal point
                        if (
                          !/[0-9]/.test(e.key) &&
                          !(e.key === "." && !e.target.value.includes(".")) &&
                          !allowedKeys.includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const pasteData = e.clipboardData.getData("text/plain");

                        if (!/^\d*\.?\d{0,8}$/.test(pasteData)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <label htmlFor="convenience_fee">
                      Convenience Fee<span className="span1">*</span>
                    </label>
                    <ErrorMessage
                      name="convenience_fee"
                      component="div"
                      className="modal-error"
                    />
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
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#20b2aa", border: "none" }}
                  >
                    Update
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </>
  );
}
