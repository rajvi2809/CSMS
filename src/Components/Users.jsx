import { useDebounce } from "use-debounce";
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
import "../static/users.css";

export default function Users() {
  const [topFilter, setTopFilter] = useState(false);
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [userToArchive, setuserToArchive] = useState(null);
  const [userToRestore, setuserToRestore] = useState(null);
  const [activeCard, setActiveCard] = useState("total");
  const [isArchive, setisArchive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);

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
  const navigate = useNavigate();

  const handleNavigate = (userId) => {
    navigate(`/user-details/${userId}`);
  };
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFilterOpt = () => setTopFilter(!topFilter);

  const handleArchiveUser = async (userId) => {
    try {
      const response = await axios.delete(`enduser/delete/${userId}`, {
        params: { id: userId },
      });
      console.log("response", response);

      console.log(userId);
      setallData((prevData) =>
        prevData.map((user) =>
          user.id === userId
            ? { ...user, deletedAt: new Date().toISOString() }
            : user
        )
      );

      setRecords((prevRecords) => ({
        ...prevRecords,
        active_records: prevRecords.active_records - 1,
        archived_records: prevRecords.archived_records + 1,
      }));

      if (activeCard === "active") {
        setallData((prevData) => prevData.filter((user) => user.id !== userId));
      }

      handleClose();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      const response = await axios.delete(`enduser/restore/${userId}`, {});
      console.log("Restore response", response);

      setallData((prevData) => {
        // Update the user deletedAt to null
        const updatedData = prevData.map((user) =>
          user.id === userId ? { ...user, deletedAt: null } : user
        );

        // If viewing archived users, remove the restored user from the list
        if (activeCard === "archived") {
          return updatedData.filter((user) => user.id !== userId);
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
      const response = await axios.get(`enduser`, {
        params: {
          limit: filters?.limit,
          page: page,
          ...(filters.active ? { active: true } : {}),
          ...(filters.archived ? { archived: true } : {}),
          ...(debouncedSearchText && { search_term: debouncedSearchText }),
        },
      });

      console.log(response?.data);
      if (response?.data?.code === 200) {
        const newData = response?.data?.data || [];

        if (page === 1) {
          setallData(newData);
        }

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

  // useEffect(() => {
  //   setallData([]);
  //   //console.log(page);
  // }, [filters]);

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
        <h3 className="title-class">Users</h3>

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
            Total Users
            <div
              style={{
                marginLeft: "54px",
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
            Active Users
            <div
              style={{
                marginLeft: "62px",
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
            Archive Users
            <div
              style={{
                marginLeft: "62px",
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
            <table className="main-table-users">
              <thead>
                <tr>
                  <th>Mobile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Bookings</th>
                  <th>No of Vehicles</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allData.length === 0 ? (
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
                ) : (
                  allData.map((data) => (
                    <tr key={data.id}>
                      <td>{data?.phone ?? "-"}</td>
                      <td
                        onClick={() => handleNavigate(data.id)}
                        style={{ color: "#20b2aa", cursor: "pointer" }}
                      >
                        {data?.name ?? "-"}
                      </td>
                      <td>{data?.email ?? "-"}</td>
                      <td>{data?.booking_count}</td>
                      <td>{data?.vehicles_catalogues?.length}</td>
                      <td>
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
                                setuserToRestore(data.id);
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
                                setuserToArchive(data.id);
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
              <img className="popup-modal-img"></img>
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
                    handleArchiveUser(userToArchive);
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
    </>
  );
}
