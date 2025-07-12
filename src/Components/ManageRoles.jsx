import Skeleton from "react-loading-skeleton";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import { useState, useEffect } from "react";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function ManageRoles() {
  const [allData, setallData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/role`, {
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

  const handleScrollEvent = async () => {
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
        <h3 className="title-class">Manage Role</h3>

        <button
          className="add-station-btn"
          style={{ width: "135px", marginLeft: "auto" }}
        >
          <img className="add-icon" style={{ marginLeft: "12px" }}></img>
          <p style={{ fontSize: "1rem" }}>Add Role</p>
        </button>
      </div>

      <div className="content-wrapper">
        <div className="margin-div">
          <div className="main-content">
            <table className="main-table-brands" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", width: "779px" }}>Role</th>
                  <th style={{ textAlign: "left" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {allData.map((item) => (
                  <tr key={item?.id}>
                    <td style={{ textAlign: "left" }}>{item?.role}</td>
                    <td style={{ textAlign: "left" }}>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="button-tooltip">Edit</Tooltip>}
                      >
                        <button
                          className="edit-btn"
                          // onClick={() => {
                          //   setModalType("edit");
                          //   setaddAmenity(false);
                          //   setEditAmenityID(item?.id);
                          //   handleShow();
                          // }}
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
                          // onClick={() => {
                          //   handleShow();
                          //   setModalType("delete");
                          //   setdeleteAmenityID(item?.id);
                          // }}
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
    </>
  );
}
