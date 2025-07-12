import BootstrapForm from "react-bootstrap/Form";
import * as yup from "yup";
import { Form, Field, Formik, ErrorMessage } from "formik";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../Static/amenityManagement.css";

export default function AmenityManagement() {
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteAmenityID, setdeleteAmenityID] = useState(0);
  const [editAmenityID, setEditAmenityID] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [show, setShow] = useState(false);
  const [addAmenity, setaddAmenity] = useState(false);

  const initialValues = () => {
    if (addAmenity) {
      return { amenity_name: "", formFile: null };
    }

    const amenityToEdit = allData.find((item) => item.id === editAmenityID);

    return {
      amenity_name: amenityToEdit?.amenity_name || "",
      formFile: null,
      currentImage: amenityToEdit?.amenity_img || null,
    };
  };

  const validationSchema = yup.object({
    amenity_name: yup
      .string()
      .min(4, "Enter at least 4 characters for Amenity Name")
      .required("Amenity Name is required"),

    formFile: yup
      .mixed()
      .required("A file is required")
      .test(
        "fileType",
        "Only JPG, JPEG, and PNG files are allowed",
        (value) =>
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      ),
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/amenity`, {
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

  const handleDeleteAmenity = async (id) => {
    console.log("ID", id);
    try {
      const response = await axios.delete(`/amenity/delete/${id}`);
      console.log("Response", response);
      if (response?.data?.code == 200) {
        toast.success("Amenity Deleted Successfully");
      } else {
        toast.error(response?.data?.message);
      }

      setallData((prev) => prev.filter((amenity) => amenity.id !== id));
    } catch (error) {
      console.log("Error", error);
      toast.error(response?.data?.message);
    }
    handleClose();
  };

  const handleSubmit = async (id, values) => {
    try {
      const formData = new FormData();
      formData.append("amenity_name", values.amenity_name);

      if (values.formFile) {
        formData.append("amenity_img", values.formFile);
      }

      if (addAmenity) {
        const response = await axios.post("/amenity/create", formData);
        toast.success("Amenity added successfully");

        setallData((prev) => [
          ...prev,
          {
            ...response.data.data,
            amenity_img: response.data.data.amenity_img,
          },
        ]);
      } else {
        response = await axios.patch(`/amenity/update/${id}`, formData);
        toast.success("Amenity updated successfully");

        setallData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...response?.data?.updatedAmenities?.[1]?.[0],
                  amenity_img:
                    response?.data?.updatedAmenities?.[1]?.[0]?.amenity_img,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(
        error.response?.data?.message ||
          (addAmenity ? "Failed to add Amenity" : "Failed to update Amenity")
      );
    }
    handleClose();
  };

  // const handleSubmit = async (id, values) => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("amenity_name", values.amenity_name);

  //     if (values.formFile) {
  //       formData.append("amenity_img", values.formFile);
  //     }

  //     const response = await axios.patch(`/amenity/update/${id}`, formData);

  //     console.log("Submit ID and Values", id, values);
  //     console.log("Response", response);

  //     setallData((prevData) =>
  //       prevData.map((item) =>
  //         item.id === id ? response?.data?.updatedAmenities?.[1]?.[0] : item
  //       )
  //     );

  //     toast.success("Amenity updated successfully");
  //   } catch (error) {
  //     console.log("Error", error);
  //     toast.error(error.response?.data?.message || "Failed to update Amenity");
  //   }
  //   handleClose();
  // };

  // const handleSubmit = async (id, values) => {
  //   try {
  //     const response = await axios.patch(`brand/update/${id}`, values);
  //     console.log("Submit ID and Values", id, values);
  //     console.log("Response", response);
  //     setallData((prevData) =>
  //       prevData.map((item) =>
  //         item.id === id ? response?.data?.updatedBrand?.[1]?.[0] : item
  //       )
  //     );
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  //   handleClose();
  // };

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
        <h3 className="title-class">Amenities Management</h3>
        <button
          className="add-amenity-btn"
          onClick={() => {
            setaddAmenity(true);
            handleShow();
          }}
        >
          <img className="add-icon"></img>
          <p style={{ fontSize: "1rem" }}>Add Amenity</p>
        </button>
      </div>
      <div className="content-wrapper">
        <div className="margin-div">
          <div className="main-content">
            <table className="main-table-brands" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allData.map((item) => (
                  <tr>
                    <td>
                      <img
                        style={{
                          height: "70px",
                          width: "70px",
                          border: "1px solid #e9ecef",
                          borderRadius: ".375rem",
                        }}
                        src={`https://api.mnil.hashtechy.space${item?.amenity_img}`}
                      />
                    </td>
                    <td>{item?.amenity_name}</td>

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
                        overlay={<Tooltip id="button-tooltip">Delete</Tooltip>}
                      >
                        <button
                          className="delete-btn"
                          onClick={() => {
                            handleShow();
                            setModalType("delete");
                            setdeleteAmenityID(item?.id);
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
        centered
        style={{
          backdropFilter: "blur(2px)",
        }}
      >
        {modalType === "delete" ? (
          <Modal.Body style={{ textAlign: "center" }}>
            <div>
              <i className="brand-modal-title-img"></i>
            </div>
            <div style={{ marginBlock: "10px", fontSize: "18px" }}>
              Are you sure you want to Delete this Amenity ?
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                onClick={() => {
                  handleDeleteAmenity(deleteAmenityID);
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
            <Formik
              initialValues={initialValues()}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(editAmenityID, values);
              }}
              enableReinitialize
            >
              {({ setFieldValue, errors, touched, submitCount, values }) => (
                <Form>
                  {console.log("Initial Values", values)}
                  <Modal.Header closeButton className="custom-modelHeader">
                    <Modal.Title>
                      {addAmenity ? "Add Amenity" : "Update Amenity"}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div
                      className={`form-floating mb-3 m_input ${
                        submitCount > 0 &&
                        touched.amenity_name &&
                        !errors.amenity_name
                          ? "is-valid"
                          : ""
                      }`}
                    >
                      <Field
                        type="text"
                        name="amenity_name"
                        className="form-control input-brand"
                        id="floatingName"
                        placeholder="Amenity Name"
                      />
                      <label
                        htmlFor="floatingName"
                        style={{ top: "1.5px", left: "6px" }}
                      >
                        Amenity Name<span> *</span>
                      </label>
                      <ErrorMessage
                        name="amenity_name"
                        component="div"
                        className="error-div"
                      />
                    </div>

                    <div
                      className={`mb-3 m_input ${
                        submitCount > 0 && touched.formFile && !errors.formFile
                          ? "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        htmlFor="formFile"
                        className="form-label"
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Amenity Logo<span> *</span>
                      </label>

                      <BootstrapForm.Control
                        type="file"
                        id="formFile"
                        name="formFile"
                        className="input-brand"
                        onChange={(event) => {
                          setFieldValue(
                            "formFile",
                            event.currentTarget.files[0]
                          );
                        }}
                      />

                      <ErrorMessage
                        name="formFile"
                        component="div"
                        className="error-div"
                        style={{ color: "red", marginTop: "0.25rem" }}
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
                      {addAmenity ? "Add" : "Update"}
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
