import { useDebounce } from "use-debounce";
import Skeleton from "react-loading-skeleton";
import Collapse from "react-bootstrap/Collapse";
import BootstrapForm from "react-bootstrap/Form";
import * as yup from "yup";
import { Form, Field, Formik, ErrorMessage } from "formik";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { toast } from "react-toastify";
import "../static/brandManagement.css";

export default function BrandsManagement() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [topFilter, setTopFilter] = useState(false);
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [deleteBrandID, setdeleteBrandID] = useState(0);
  const [editBrandID, setEditBrandID] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [show, setShow] = useState(false);
  const [addBrand, setaddBrand] = useState(false);

  const initialValues = () => {
    if (addBrand) {
      return { brand_name: "", formFile: null };
    }

    const brandToEdit = allData.find((item) => item.id === editBrandID);

    return {
      brand_name: brandToEdit?.brand_name || "",
      formFile: null,
      currentImage: brandToEdit?.brand_img || null,
    };
  };

  const validationSchema = yup.object({
    brand_name: yup
      .string()
      .min(2, "Enter at least 2 characters for Brand Name")
      .required("Brand Name is required"),

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

  const handleFilterOpt = () => setTopFilter(!topFilter);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/brand`, {
        params: {
          limit: 15,
          page: page,
          ...(debouncedSearchText && { search_term: debouncedSearchText }),
        },
      });

      console.log(response.data);
      const newData = response?.data?.data || [];
      if (page === 1) {
        setallData(newData);
      } else if (response?.data?.code === 204) {
        setallData([]);
      } else {
        setallData((prevData) => [...prevData, ...newData]);
      }

      setCardData(response?.data?.record_counts);

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

  const handleDeleteBrand = async (id) => {
    console.log("ID", id);
    try {
      const response = await axios.delete(`/brand/delete/${id}`);
      console.log("Response", response);
      if (response?.data?.code == 200) {
        toast.success("Brand Deleted Successfully");
        setallData((prevBrands) =>
          prevBrands.filter((brand) => brand.id !== id)
        );

        // Update card count
        setCardData((prev) => ({
          ...prev,
          total_records: prev.total_records - 1,
        }));
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(response?.data?.message);
    }
    handleClose();
  };

  const handleSubmit = async (id, values) => {
    try {
      const formData = new FormData();
      formData.append("brand_name", values.brand_name);

      if (values.formFile) {
        formData.append("brand_img", values.formFile);
      }

      if (addBrand) {
        const response = await axios.post("/brand/create", formData);
        toast.success("Brand added successfully");

        setallData((prev) => [
          {
            ...response.data.data,
            brand_img: response.data.data.brand_img,
          },
          ...prev,
        ]);

        setCardData((prev) => ({
          ...prev,
          total_records: prev.total_records + 1,
        }));
      } else {
        const response = await axios.patch(`/brand/update/${id}`, formData);
        console.log("Response", response);
        toast.success("Brand updated successfully");

        setallData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...response?.data?.updatedBrand?.[1]?.[0],
                  brand: response?.data?.updatedBrand?.[1]?.[0]?.brand_img,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to update Amenity");
    }
    handleClose();
  };

  useEffect(() => {
    if (page <= pagination.total_pages) {
      fetchdata();
    }
  }, [page, debouncedSearchText]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <>
      <div className="heading-bar">
        <h3 className="title-class">Brands Management</h3>

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
          style={{ width: "146px" }}
          onClick={() => {
            setaddBrand(true);
            handleShow();
          }}
        >
          <img className="add-icon" style={{ marginLeft: "12px" }}></img>
          <p style={{ fontSize: "1rem" }}>Add Brand</p>
        </button>
      </div>
      <div className="details-section">
        <Card
          style={{
            width: "152px",
            height: "84px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#20b2aa33",
            padding: "11px",
          }}
        >
          <Card.Title
            style={{
              fontSize: "1rem",
              alignItems: "center",
              paddingBottom: "6px",
            }}
          >
            Total
          </Card.Title>
          <Card.Text style={{ fontWeight: "bold" }}>
            {cardData?.total_records}
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
                {/* {searchText && (
                  <button
                    onClick={() => {
                      setPage(1);
                      setSearchText("");
                      setallData([]);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "40px",
                    }}
                  >
                    <img
                      src="/close.svg"
                      alt=""
                      style={{ height: "20px", width: "20px" }}
                    />
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </Collapse>
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
                    <tr>
                      <td>
                        <img
                          style={{
                            height: "70px",
                            width: "70px",
                            border: "1px solid #e9ecef",
                            borderRadius: ".375rem",
                          }}
                          src={`https://api.mnil.hashtechy.space${item?.brand_img}`}
                        />
                      </td>
                      <td>{item?.brand_name}</td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="button-tooltip">Edit</Tooltip>}
                        >
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setModalType("edit");
                              setEditBrandID(item?.id);
                              setaddBrand(false);
                              handleShow();
                            }}
                          >
                            <img src="./edit.svg" alt="" />
                          </button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip">Delete</Tooltip>
                          }
                        >
                          <button
                            className="delete-btn"
                            onClick={() => {
                              handleShow();
                              setModalType("delete");
                              setdeleteBrandID(item?.id);
                            }}
                          >
                            <img src="./delete.svg" alt="" />
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
              Are you sure you want to Delete this Brand ?
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                onClick={() => {
                  handleDeleteBrand(deleteBrandID);
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
                handleSubmit(editBrandID, values);
              }}
            >
              {({ setFieldValue, errors, touched, submitCount, values }) => (
                <Form>
                  {console.log("Initial Values", values)}
                  <Modal.Header closeButton className="custom-modelHeader">
                    <Modal.Title>
                      {addBrand ? "Add Brand" : "Update Brand"}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div
                      className={`form-floating mb-3 m_input ${
                        submitCount > 0 &&
                        touched.brand_name &&
                        !errors.brand_name
                          ? "is-valid"
                          : ""
                      }`}
                    >
                      <Field
                        type="text"
                        name="brand_name"
                        className="form-control input-brand"
                        id="floatingName"
                        placeholder="Brand Name"
                      />
                      <label
                        htmlFor="floatingName"
                        style={{ top: "1.5px", left: "6px" }}
                      >
                        Brand Name<span className="span1"> *</span>
                      </label>
                      <ErrorMessage
                        name="brand_name"
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
                        Brand Logo<span className="span1"> *</span>
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
                      {addBrand ? "Add" : "Update"}
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
