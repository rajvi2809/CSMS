import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import BootstrapForm from "react-bootstrap/Form";
import * as yup from "yup";
import { Form, Field, Formik, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "../static/connectorManagement.css";
export default function ConnectorManagement() {
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteConnectorID, setdeleteConnectorID] = useState(0);
  const [editConnectorID, setEditConnectorID] = useState(0);
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [addConnector, setaddConnector] = useState(false);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });
  const initialValues = () => {
    if (addConnector) {
      return {
        connector_type: "",
        max_power_output: "",
        max_current_output: "",
        level: "",
        current_type: "",
        formFile: null,
      };
    }
    const connectorToEdit = allData.find((item) => item.id === editConnectorID);

    return {
      connector_type: connectorToEdit?.connector_type || "",
      max_power_output: connectorToEdit?.max_power_output || "",
      max_current_output: connectorToEdit?.max_current_output || "",
      level: connectorToEdit?.level || "",
      current_type: connectorToEdit?.current_type || "",
      formFile: null,
      currentImage: connectorToEdit?.connector_img || null,
    };
  };

  const validationSchema = yup.object({
    connector_type: yup.string().required("Connector type is required"),
    max_power_output: yup.string().required("Max power output is required"),
    max_current_output: yup.string().required("Max current output is required"),
    level: yup.string().required("Level is required"),
    current_type: yup.string().required("Current type is required"),
    formFile: yup.mixed().when("currentImage", {
      is: (currentImage) => !currentImage,
      then: yup
        .mixed()
        .required("A file is required")
        .test(
          "fileType",
          "Only JPG, JPEG, and PNG files are allowed",
          (value) =>
            value &&
            ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        ),
    }),
  });

  const handleSubmit = async (id, values) => {
    try {
      const formData = new FormData();
      formData.append("connector_type", values.connector_type);
      formData.append("max_power_output", values.max_power_output);
      formData.append("max_current_output", values.max_current_output);
      formData.append("level", values.level);
      formData.append("current_type", values.current_type);

      if (values.formFile) {
        formData.append("connector_img", values.formFile);
      }

      if (addConnector) {
        const response = await axios.post("/connector/create", formData);
        toast.success("Connector added successfully");
        setallData((prev) => [
          {
            ...response.data.data,
            connector_img: response.data.data.connector_img,
          },
          ...prev,
        ]);
      } else {
        const response = await axios.patch(`/connector/update/${id}`, formData);
        toast.success("Connector updated successfully");
        setallData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...response?.data?.updatedConnector,
                  connector_img:
                    response?.data?.updatedConnector?.connector_img,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(
        error.response?.data?.message || "Failed to update connector"
      );
    }
    handleClose();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/connector`, {
        params: {
          limit: 15,
          page: page,
        },
      });

      console.log(response.data);
      const newData = response?.data?.data || [];

      setallData(newData);
      setPagination({
        current_page: response?.data?.pagination?.current_page || page,
        total_pages: response?.data?.pagination?.total_pages || 1,
      });
    } catch (error) {
      console.log("Error", error);
    }
    setLoading(false);
  };

  const handleDeleteConnector = async (id) => {
    console.log("ID", id);
    try {
      const response = await axios.delete(`/connector/delete/${id}`);
      console.log("Response", response);
      if (response?.data?.code == 200) {
        toast.success("Connector Deleted Successfully");
        setallData((prev) => prev.filter((c) => c.id !== id));

        handleClose();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(response?.data?.message);
    }
    handleClose();
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
        <h3 className="title-class">Connectors Management</h3>
        <button
          className="add-amenity-btn"
          onClick={() => {
            setaddConnector(true);
            handleShow();
          }}
          style={{ width: "180px" }}
        >
          <img className="add-icon"></img>
          <p style={{ fontSize: "1rem" }}>Add Connectors</p>
        </button>
      </div>

      <div className="content-wrapper">
        <div className="margin-div">
          <div className="main-content">
            <table className="main-table-connectors" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Connector Name</th>
                  <th>MOP (kW)</th>
                  <th>MCO (Amps)</th>
                  <th>Charging Level</th>
                  <th>Current Type</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {allData.map((item) => (
                  <tr key={item?.id}>
                    <td>
                      <img
                        style={{
                          height: "70px",
                          width: "70px",
                          objectFit: "contain",
                          border: "1px solid #e9ecef",
                          borderRadius: ".375rem",
                        }}
                        src={`https://api.mnil.hashtechy.space/${item?.connector_img}`}
                      />
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item?.connector_type}
                    </td>
                    <td>{item?.max_power_output}</td>
                    <td>{item?.max_current_output}</td>
                    <td>{item?.level}</td>
                    <td>{item?.current_type}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="button-tooltip">Edit</Tooltip>}
                      >
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setModalType("edit");
                            setaddConnector(false);
                            setEditConnectorID(item?.id);
                            handleShow();
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
                            setdeleteConnectorID(item?.id);
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
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{
          backdropFilter: "blur(2px)",
        }}
        centered
        size="lg"
      >
        {modalType === "delete" ? (
          <Modal.Body style={{ textAlign: "center" }}>
            <div>
              <i className="brand-modal-title-img"></i>
            </div>
            <div style={{ marginBlock: "10px", fontSize: "18px" }}>
              Are you sure you want to Delete this Connector ?
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                onClick={() => {
                  handleDeleteConnector(deleteConnectorID);
                }}
              >
                Yes
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Modal.Body>
        ) : (
          <>
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
                {addConnector ? "Add Connector" : "Update Connector"}
              </Modal.Title>
            </Modal.Header>
            <Formik
              initialValues={initialValues()}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(editConnectorID, values);
              }}
              enableReinitialize
            >
              {({ setFieldValue, errors, touched, values }) => (
                <Form>
                  <Modal.Body className="form-floating mb-3">
                    <div
                      className="form-floating m_input"
                      style={{ marginBottom: "16px" }}
                    >
                      <Field
                        type="text"
                        className="form-control charging-input"
                        placeholder="Connector Name"
                        name="connector_type"
                        id="connector_type"
                      />
                      <label htmlFor="connector_type">
                        Connector Name<span>*</span>
                      </label>
                      <ErrorMessage
                        name="connector_type"
                        component="div"
                        className="modal-error"
                      />
                    </div>

                    <div
                      className="charging-input-3"
                      style={{ marginBottom: "16px" }}
                    >
                      <div className="form-floating charging-input-select m_input">
                        <Field
                          type="number"
                          className="form-control"
                          placeholder="Max Output Power(kw)"
                          name="max_power_output"
                          id="max_power_output"
                        />
                        <label htmlFor="max_power_output">
                          Max Output Power(kw)<span>*</span>
                        </label>
                        <ErrorMessage
                          name="max_power_output"
                          component="div"
                          className="modal-error"
                        />
                      </div>

                      <div className="form-floating charging-input-select m_input">
                        <Field
                          type="number"
                          className="form-control"
                          placeholder="Max Current Output(Amps)"
                          name="max_current_output"
                          id="max_current_output"
                        />
                        <label htmlFor="max_current_output">
                          Max Current Output(Amps)<span>*</span>
                        </label>
                        <ErrorMessage
                          name="max_current_output"
                          component="div"
                          className="modal-error"
                        />
                      </div>
                    </div>

                    <div
                      className="charging-input-3"
                      style={{ marginBottom: "16px" }}
                    >
                      <div className="charging-input-select m_input">
                        <h6 style={{ marginBottom: "5px" }}>
                          Connector Level<span>*</span>
                        </h6>
                        <Select
                          options={[
                            { value: "1", label: "Level 1" },
                            { value: "2", label: "Level 2" },
                            { value: "3", label: "Level 3" },
                          ]}
                          name="level"
                          value={
                            values.level
                              ? {
                                  value: values.level,
                                  label: `Level ${values.level}`,
                                }
                              : null
                          }
                          onChange={(option) =>
                            setFieldValue("level", option?.value || "")
                          }
                          placeholder="Select Level"
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
                          name="level"
                          component="div"
                          className="modal-error"
                        />
                      </div>

                      <div className="charging-input-select m_input">
                        <h6 style={{ marginBottom: "5px" }}>
                          Current Type<span>*</span>
                        </h6>
                        <Select
                          options={[
                            { value: "AC", label: "AC" },
                            { value: "DC", label: "DC" },
                          ]}
                          name="current_type"
                          value={
                            values.current_type
                              ? {
                                  value: values.current_type,
                                  label: values.current_type,
                                }
                              : null
                          }
                          onChange={(option) =>
                            setFieldValue("current_type", option?.value || "")
                          }
                          placeholder="Select Current Type"
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
                          name="current_type"
                          component="div"
                          className="modal-error"
                        />
                      </div>
                    </div>

                    <div className="m_input" style={{ marginBottom: "16px" }}>
                      <h6 style={{ marginBottom: "5px" }}>
                        Connector Image<span>*</span>
                      </h6>
                      <input
                        type="file"
                        className="form-control"
                        name="formFile"
                        id="formFile"
                        onChange={(event) => {
                          setFieldValue(
                            "formFile",
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                      {values.currentImage && (
                        <div style={{ marginTop: "10px" }}>
                          <img
                            src={`https://api.mnil.hashtechy.space/${values.currentImage}`}
                            alt="Current Connector"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )}
                      <ErrorMessage
                        name="formFile"
                        component="div"
                        className="modal-error"
                      />
                    </div>
                  </Modal.Body>

                  <Modal.Footer>
                    <Button
                      style={{
                        backgroundColor: "#e3e3e3",
                        color: "black",
                        border: "none",
                      }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      style={{ backgroundColor: "#20b2aa", border: "none" }}
                    >
                      {addConnector ? "Add" : "Update"}
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </>
        )}
      </Modal>
    </>
  );
}
