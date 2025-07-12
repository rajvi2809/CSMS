import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import "../static/stationReview.css";

export default function StationReviews() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allData, setallData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const [show, setShow] = useState(false);
  const [stationToApprove, setstationToApprove] = useState(null);
  const [stationToReject, setstationToReject] = useState(null);
  const [isReject, setisReject] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/review?limit=10&page=${page}`);
      console.log(response?.data);

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

  const handleApproveComment = async (reviewId) => {
    try {
      const response = await axios.patch(`/review/update/${reviewId}`, {
        status: "Approved",
      });
      console.log("response", response);

      setallData((prevData) =>
        prevData.map((item) =>
          item.id === reviewId ? { ...item, status: "Approved" } : item
        )
      );
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };

  const handleRejectComment = async (reviewId) => {
    try {
      const response = await axios.patch(`/review/update/${reviewId}`, {
        status: "Rejected",
      });
      console.log("response", response);
      setallData((prevData) =>
        prevData.map((item) =>
          item.id === reviewId ? { ...item, status: "Rejected" } : item
        )
      );
    } catch (error) {
      console.error(
        "Error rejecting comment:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleScrollEvent = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (!loading && pagination?.current_page <= pagination?.total_pages) {
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
        <h3 className="title-class">Station Reviews</h3>
      </div>
      <div className="content-wrapper">
        <div className="margin-div">
          <div className="main-content">
            <table
              className="main-table-station"
              style={{ padding: "8px 7px" }}
            >
              <thead>
                <tr>
                  <th>Station Id</th>
                  <th>Booking Id</th>
                  <th>User Name</th>
                  <th>Station Name</th>
                  <th>Ratings</th>
                  <th>Comments</th>
                  <th> Review Date / Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allData.map((item) => (
                  <tr key={item.id}>
                    <td>{item?.station?.id}</td>
                    <td>{item?.booking?.id}</td>
                    <td>{item?.user?.name}</td>
                    <td>{item?.station?.station_name}</td>
                    <td style={{ minWidth: "145px" }}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={
                              index < item?.rating
                                ? "ratings-star-filled"
                                : "ratings-star-empty"
                            }
                          ></i>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: "left" }}>{item?.comment}</td>
                    <td style={{ color: "#495057" }}>
                      {moment
                        .tz(item?.createdAt, "Asia/Kolkata")
                        .format("YYYY-MM-DD")}
                      <br />
                      <span style={{ color: "black", fontWeight: "bold" }}>
                        {moment
                          .tz(item?.createdAt, "Asia/Kolkata")
                          .format("hh:mm A")}
                      </span>
                    </td>
                    <td>
                      <p
                        style={{ alignContent: "center" }}
                        className={
                          item?.status === "Approved"
                            ? "approved-status"
                            : item?.status === "Pending"
                            ? "pending-status"
                            : item?.status === "Rejected"
                            ? "rejected-status"
                            : ""
                        }
                      >
                        {item?.status}
                      </p>
                    </td>
                    <td style={{ alignItems: "center" }}>
                      {item?.status === "Approved" ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-disapprove">
                              Disapprove
                            </Tooltip>
                          }
                        >
                          <button
                            onClick={() => {
                              setstationToReject(item.id);
                              setisReject(true);
                              handleShow();
                            }}
                            className="approved-btn"
                            aria-controls="example-collapse-text"
                          >
                            <img className="approved-img" src="/cross.svg" />
                          </button>
                        </OverlayTrigger>
                      ) : item?.status === "Rejected" ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-approve">Approve</Tooltip>
                          }
                        >
                          <button
                            onClick={() => {
                              setstationToApprove(item.id);
                              setisReject(false);
                              handleShow();
                            }}
                            className="reject-btn"
                            aria-controls="example-collapse-text"
                          >
                            <img
                              className="reject-img"
                              src="/tick.svg"
                              alt="Approve"
                            />
                          </button>
                        </OverlayTrigger>
                      ) : (
                        <div style={{ display: "flex", gap: "5px" }}>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-approve">Approve</Tooltip>
                            }
                          >
                            <button
                              className="reject-btn"
                              onClick={() => {
                                setstationToApprove(item.id);
                                setisReject(false);
                                handleShow();
                              }}
                            >
                              <img src="/tick.svg" alt="Approve" />
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-disapprove">
                                Disapprove
                              </Tooltip>
                            }
                          >
                            <button
                              className="approved-btn"
                              onClick={() => {
                                setstationToReject(item.id);
                                setisReject(true);
                                handleShow();
                              }}
                            >
                              <img src="/cross.svg" alt="Disapprove" />
                            </button>
                          </OverlayTrigger>
                        </div>
                      )}
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
        {!isReject ? (
          <Modal.Body style={{ textAlign: "center" }}>
            <div>
              <i className="modal-title-img"></i>
            </div>
            <div style={{ marginBlock: "10px", fontSize: "18px" }}>
              Are you sure you want to Approve this comment ?
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                variant="primary"
                onClick={() => {
                  if (stationToApprove) {
                    handleApproveComment(stationToApprove);
                    toast.success("Review Updated Successfully!");
                    handleClose();
                  }
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
          <Modal.Body style={{ textAlign: "center" }}>
            <div>
              <i className="modal-title-img"></i>
            </div>
            <div style={{ marginBlock: "10px" }}>
              Are you sure you want to Disapprove this comment ?
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                variant="primary"
                onClick={() => {
                  if (stationToReject) {
                    handleRejectComment(stationToReject);
                    toast.success("Review Updated Successfully!");
                    handleClose();
                  }
                }}
              >
                Yes
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
}
