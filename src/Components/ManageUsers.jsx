import Select from "react-select";
import { Form, Field, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDebounce } from "use-debounce";
import Skeleton from "react-loading-skeleton";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Collapse from "react-bootstrap/Collapse";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import "../Static/manageUsers.css";
export default function ManageUsers() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [topFilter, setTopFilter] = useState(false);
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userToArchive, setuserToArchive] = useState(null);
  const [userToRestore, setuserToRestore] = useState(null);
  const [activeCard, setActiveCard] = useState("total");
  const [show, setShow] = useState(false);
  const [isArchive, setisArchive] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [modalType, setmodaltype] = useState("");
  const [updateID, setUpdateID] = useState(null);
  const [addUser, setaddUser] = useState(false);
  const [userOptions, setuserOptions] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

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

  const initialValues = () => {
    if (modalType === "add") {
      return {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      };
    }
  };

  const validationSchema = Yup.object({
    first_name: Yup.string()
      .min(2, "Enter atleast 2 characters for First Name")
      .required("First name is required"),
    last_name: Yup.string()
      .min(2, "Enter atleast 2 characters for Last Name")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone Number is Required")
      .length(10, "Enter Valid Phone Number"),
    role: Yup.string().required("Role is Required"),
    password: Yup.string().required("Password is Required"),
  });

  const validate = (values) => {
    let errors = {};
    if (!values.email) {
      errors.email = "Email is Required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)
    ) {
      errors.email = "Please enter a valid email";
    }
    return errors;
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`/role`);
      console.log("Response options", response?.data?.data);
      const dynamicOptions = response?.data?.data.map((item) => ({
        value: item.role,
        label: item.role,
      }));

      setuserOptions(dynamicOptions);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmit = async (values) => {
    if (modalType === "add") {
      try {
        // First create the user
        const response = await axios.post(`/user/register`, values);
        console.log("User created:", response?.data?.data);

        if (response?.data?.code === 200) {
          const newUser = response?.data?.data;

          setallData((prevData) => [newUser, ...prevData]);

          setRecords((prevRecords) => ({
            total_records: prevRecords.total_records + 1,
            active_records: prevRecords.active_records + 1,
            archived_records: prevRecords.archived_records,
          }));

          toast.success(response?.data?.message);

          handleCloseUser();
        }
      } catch (error) {
        console.log("Error creating user", error);
        toast.error("Failed to create user");
      }
    }
    console.log("Values on Submit", values);
  };

  // const handleSubmit = async (values) => {
  //   if (modalType === "add" || setaddUser) {
  //     {
  //       try {
  //         const response = await axios.get(`/user/register`);
  //         console.log(response?.data?.data);
  //       } catch (error) {
  //         console.log("Error", error);
  //       }
  //     }
  //   }
  //   console.log("Values on Submit", values);
  // };
  function generateSimplePassword() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%";

    // Create a base character set without symbols
    const baseChars = uppercase + lowercase + numbers;

    // Generate first 9 characters from base character set
    let password = "";
    for (let i = 0; i < 9; i++) {
      password += baseChars.charAt(
        Math.floor(Math.random() * baseChars.length)
      );
    }

    // Add one guaranteed symbol at random position
    const randomPosition = Math.floor(Math.random() * 10);
    const randomSymbol = symbols.charAt(
      Math.floor(Math.random() * symbols.length)
    );

    // Insert the symbol at random position
    password =
      password.slice(0, randomPosition) +
      randomSymbol +
      password.slice(randomPosition);

    return password;
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseUser = () => setShowUser(false);
  const handleShowUser = () => setShowUser(true);

  const handleFilterOpt = () => setTopFilter(!topFilter);

  const handleArchiveCharging = async (chargingId) => {
    try {
      const response = await axios.delete(`user/delete/${chargingId}`, {
        params: { id: chargingId },
      });
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

      if (response?.data?.code === 204) {
        setallData([]);
      }

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

  const handleRestoreUser = async (userId) => {
    try {
      // const token = cookies.accessToken;
      // if (!token) {
      //   console.log("No Token");
      //   return;
      // }
      const response = await axios.delete(`user/restore/${userId}`);
      console.log("Restore response", response);

      setallData((prevData) => {
        const updatedData = prevData.map((user) =>
          user.id === userId ? { ...user, deletedAt: null } : user
        );

        if (activeCard === "archived") {
          return updatedData.filter((user) => user.deletedAt !== null);
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

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`users`, {
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
        <h3 className="title-class">Manage Users</h3>

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
          style={{ width: "154px" }}
          className="add-station-btn"
          onClick={() => {
            setmodaltype("add");
            handleShowUser();
            fetchOptions();
            setaddUser(true);
          }}
        >
          <img className="add-icon"></img>
          <p style={{ fontSize: "1rem" }}>Create User</p>
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
            width: "174px",
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
              minWidth: "156px",
            }}
          >
            Total Users
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
            width: "186px",
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
              minWidth: "165px",
            }}
          >
            Active Users
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
            width: "196px",
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
              width: "176px",
            }}
          >
            Archive Users
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
            <table className="main-table-manage" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone No.</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allData.length === 0 && !loading ? (
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
                        {item?.firstname} {item?.lastname}
                      </td>
                      <td>{item?.email}</td>
                      <td>{item?.phone}</td>
                      <td>{item?.role}</td>

                      <td
                        style={{
                          minWidth: "97px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {!item?.deletedAt && (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="button-tooltip">Edit</Tooltip>
                            }
                          >
                            <button
                              className="edit-btn"
                              onClick={() => {
                                setmodaltype("edit");
                                setUpdateID(item?.id);
                                handleShowUser();
                                setaddUser(false);
                              }}
                            >
                              <img src="./edit.svg" alt="" />
                            </button>
                          </OverlayTrigger>
                        )}
                        {item?.deletedAt ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="button-tooltip">Restore</Tooltip>
                            }
                          >
                            <button
                              className="restore-btn"
                              onClick={() => {
                                setuserToRestore(item?.id);
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
                                setuserToArchive(item?.id);
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
                <b> Are you sure you want to Restore this User ?</b>
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
                  if (userToRestore) {
                    handleRestoreUser(userToRestore);
                    toast.success("User Restored Successfully!");
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
              <img className="popup-modal-img-archive"></img>
              <br />
              <br />
              <h2 style={{ fontSize: "1.125rem" }}>
                <b> Are you sure you want to Archive this User ?</b>
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
                  if (userToArchive) {
                    handleArchiveCharging(userToArchive);
                    toast.success("User Archived Successfully!");
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
      {/* add or edit user */}
      <Modal
        show={showUser}
        onHide={handleCloseUser}
        backdrop="static"
        keyboard={false}
      >
        <>
          <Formik
            initialValues={initialValues()}
            validate={validate}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched, submitCount, values }) => (
              <Form>
                <Modal.Header closeButton className="custom-modelHeader">
                  <Modal.Title>
                    {modalType === "add" ? "Create User" : "Update User"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ width: "100%", display: "flex", gap: "10px" }}>
                    <div
                      style={{ width: "50%" }}
                      className={`form-floating mb-3 m_input ${
                        submitCount > 0 &&
                        touched.first_name &&
                        !errors.first_name
                          ? "is-valid"
                          : ""
                      }`}
                    >
                      <Field
                        type="text"
                        name="first_name"
                        className="form-control input-brand"
                        id="floatingFirstName"
                        placeholder="First Name"
                      />
                      <label
                        htmlFor="floatingFirstName"
                        style={{ top: "1.5px", left: "6px" }}
                      >
                        First Name<span className="span1"> *</span>
                      </label>
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        className="error-div"
                      />
                    </div>

                    {/* Last Name Field */}
                    <div
                      style={{ width: "50%" }}
                      className={`form-floating mb-3 m_input ${
                        submitCount > 0 &&
                        touched.last_name &&
                        !errors.last_name
                          ? "is-valid"
                          : ""
                      }`}
                    >
                      <Field
                        type="text"
                        name="last_name"
                        className="form-control input-brand"
                        id="floatingLastName"
                        placeholder="Last Name"
                      />
                      <label
                        htmlFor="floatingLastName"
                        style={{ top: "1.5px", left: "6px" }}
                      >
                        Last Name<span className="span1"> *</span>
                      </label>
                      <ErrorMessage
                        name="last_name"
                        component="div"
                        className="error-div"
                      />
                    </div>
                  </div>

                  <div
                    className={`form-floating mb-3 m_input ${
                      submitCount > 0 && touched.email && !errors.email
                        ? "is-valid"
                        : ""
                    }`}
                  >
                    <Field
                      type="email"
                      name="email"
                      className="form-control input-brand"
                      id="floatingEmail"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="floatingEmail"
                      style={{ top: "1.5px", left: "6px" }}
                    >
                      Email<span className="span1"> *</span>
                    </label>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-div"
                    />
                  </div>

                  <div
                    className={`form-floating mb-3 m_input ${
                      submitCount > 0 && touched.phone && !errors.phone
                        ? "is-valid"
                        : ""
                    }`}
                  >
                    <Field
                      type="tel"
                      name="phone"
                      className="form-control input-brand"
                      id="floatingPhone"
                      placeholder="Phone Number"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");

                        if (
                          e.target.value.length > 0 &&
                          !/^[789]/.test(e.target.value)
                        ) {
                          e.target.value = "";
                        }

                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }}
                    />
                    <label
                      htmlFor="floatingPhone"
                      style={{ top: "1.5px", left: "6px" }}
                    >
                      Phone Number<span className="span1"> *</span>
                    </label>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="error-div"
                    />
                  </div>

                  <div
                    className={`charging-input-select m_input ${
                      submitCount > 0 && touched.role && !errors.role
                        ? "is-valid"
                        : ""
                    }`}
                    style={{ width: "466.67px", marginBottom: "1rem" }}
                  >
                    <h6 style={{ marginBottom: "5px" }}>
                      User Type<span className="span1">*</span>
                    </h6>
                    <Field name="role">
                      {({
                        field,
                        form: { setFieldValue, setFieldTouched },
                      }) => (
                        <Select
                          isClearable={true}
                          className="input-brand"
                          options={userOptions}
                          name="role"
                          value={userOptions.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(option) => {
                            setFieldValue("role", option ? option.value : "");
                          }}
                          onBlur={() => setFieldTouched("role", true)}
                          placeholder="Select Role"
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
                              backgroundColor: "white",
                              zIndex: 9999,
                            }),
                            menuList: (base) => ({
                              ...base,
                              padding: 0,
                              backgroundColor: "white",
                            }),
                          }}
                        />
                      )}
                    </Field>
                    {touched.role && errors.role && (
                      <div className="error-div">{errors.role}</div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <div
                      className="form-floating mb-3 m_input"
                      style={{ width: "409px" }}
                    >
                      <Field
                        disabled
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control input-login"
                        id="floatingPassword"
                        placeholder="Password"
                        style={{ width: "100%", margin: "0px" }}
                      />

                      <label
                        htmlFor="floatingPassword"
                        style={{ top: "1.5px", left: "6px", fontSize: "16px" }}
                      >
                        Password<span className="span1"> *</span>
                      </label>
                      <img
                        src="/eye.svg"
                        className="set-icon"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ right: "8px", top: "30px" }}
                      />

                      <ErrorMessage
                        name="password"
                        component="div"
                        className="error-div"
                      />
                    </div>
                    <div>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="button-tooltip">
                            Generate password
                          </Tooltip>
                        }
                      >
                        <button
                          className="pass-btn"
                          type="button"
                          onClick={() => {
                            const newPassword = generateSimplePassword();
                            setFieldValue("password", newPassword);
                          }}
                        >
                          <img
                            src="./passGenerate.svg"
                            alt="Generate password"
                            style={{ height: "24px", width: "24px" }}
                          />
                        </button>
                      </OverlayTrigger>
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
                    onClick={handleCloseUser}
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
        </>
      </Modal>
    </>
  );
}
