import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Collapse from "react-bootstrap/Collapse";
import axios from "axios";
import { useCookies } from "react-cookie";
import Modal from "react-bootstrap/Modal";

export default function Users() {
  const [topFilter, setTopFilter] = useState(false);
  const [cookies] = useCookies(["accessToken"]);
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [records, setRecords] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFilterOpt = () => setTopFilter(!topFilter);

  const fetchdata = async () => {
    setLoading(true);
    try {
      // console.log("in try");
      const token = cookies.accessToken;
      if (!token) {
        console.log("No Token");
      }

      const response = await axios.get(
        `https://api.mnil.hashtechy.space/admin/enduser?limit=10&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Type": "Admin",
          },
        }
      );
      console.log(response?.data);

      const newData = response?.data?.data || [];

      console.log("object", response?.data?.record_counts);

      setallData((prevData) => [...prevData, ...newData]);

      setRecords(response?.data?.record_counts || {});
    } catch (error) {
      console.log("Error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchdata();
  }, [page]);

  const handleScrollEvent = async () => {
    // console.log("Height=", document.documentElement.scrollHeight); //84227
    // console.log("View port=", window.innerHeight); //288
    // console.log("scroll=", document.documentElement.scrollTop);

    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("page", page);
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
          style={{
            width: "199px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#20b2aa33",
            cursor: "pointer",
            padding: "11px",
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
          style={{
            width: "215px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#32cd3233",
            cursor: "pointer",
            padding: "11px",
          }}
        >
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
          style={{
            width: "225px",
            height: "92px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#ff450033",
            cursor: "pointer",
            padding: "11px",
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
                {allData.map((data) => (
                  <tr key={data.id}>
                    <td>{data?.phone ?? "-"}</td>
                    <td style={{ color: "#20b2aa", cursor: "pointer" }}>
                      {data?.name ?? "-"}
                    </td>
                    <td>{data?.email ?? "-"}</td>
                    <td>{data?.booking_count}</td>
                    <td>{data?.vehicles_catalogues?.length}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="button-tooltip">Archive</Tooltip>}
                      >
                        <button className="archive-btn" onClick={handleShow}>
                          <img src="./archive.svg" alt="" />
                        </button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
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
            onClick={handleArchiveUser}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
