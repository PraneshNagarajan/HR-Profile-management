import { useEffect, useState } from "react";
import { Container, Nav, TabContent, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import { NotificationActions } from "../Redux/NotificationSlice";
import { firestore } from "../firebase";
import { FaRegTrashAlt, FaStar, FaCheckDouble } from "react-icons/fa";
import app from "firebase";
import PageSwitcher from "../components/Pagination";
import { PaginationActions } from "../Redux/PaginationSlice";

//let interval;

const Notifications = () => {
  const notifications = useSelector((state) => state.notification.data);
  const sm = useMediaQuery({ maxWidth: 768 });
  const [activeTab, setActiveTab] = useState("unread");
  const user = useSelector((state) => state.auth.email);
  const currentPage = useSelector((state) => state.pagination.current);
  const history = useHistory();
  const dispatch = useDispatch();
  const notifyRef = firestore.collection("Notifications").doc(user);

  useEffect(() => {
    setInterval(() => {
      console.log("notify");
      notifyRef.get().then((res) => {
        let unreadData =
          res.data() !== undefined
            ? Object.values(res.data()).filter(
                (item) => item.status === "unread"
              )
            : 0;
        dispatch(
          NotificationActions.getNotifications({
            key: unreadData.length,
            data: res.data(),
          })
        );
      });
    }, 180000);
  }, []);

  useEffect(() => {
    let size = Object.values(notifications).filter(
      (item) => item.status === activeTab
    ).length;
    dispatch(
      PaginationActions.initial({
        size: size > 0 ? size : 1,
        count: 10,
        current: 1,
      })
    );
  }, [notifications, sm]);

  const onChangeStatus = (status, key) => {
    if (status === "delete") {
      // delete firestore document field using key
      notifyRef
        .update({
          [key]: app.firestore.FieldValue.delete(),
        })
        .catch((err) => console.log("Unable to delete notification : " + key));
    } else {
      notifyRef.update({
        [key + ".status"]: status,
      });
    }
    dispatch(NotificationActions.changeStatus({ key, status }));
  };

  return (
    <Container fluid className={sm ? "my-3" : "p-5"}>
      <Nav variant="tabs" defaultActiveKey={"unread"}>
        <Nav.Item>
          <Nav.Link
            eventKey="unread"
            active={activeTab.includes("unread")}
            onClick={() => setActiveTab("unread")}
          >
            <span className="fw-bold text-success">Un-Read</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="address-info"
            active={activeTab === "read"}
            onClick={() => setActiveTab("read")}
          >
            <span className="fw-bold text-success">Read</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="marked"
            active={activeTab.includes("marked")}
            onClick={() => setActiveTab("marked")}
          >
            <span className="fw-bold text-success">Marked</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <TabContent>
        <Card className="p-3">
          {Object.keys(notifications).length > 0 &&
            Object.entries(notifications)
              .filter((item) => item[1].status === activeTab)
              .sort()
              .reverse()
              .map((notification, index) => {
                if (
                  index >= (currentPage - 1) * 10 &&
                  index < currentPage * 10
                ) {
                  return (
                    <Card
                      key={index}
                      className="mb-2 animated fadeOut infinite"
                    >
                      <Card.Body>
                        <Card.Subtitle>
                          {notification[1].msg.split("-")[0]}
                          <span
                            style={{ cursor: "pointer" }}
                            className="text-primary"
                            onClick={() => {
                              onChangeStatus("read", notification[0]);
                              history.push(notification[1].url);
                            }}
                          >
                            {notification[1].msg.split("-")[1]}{" "}
                          </span>
                        </Card.Subtitle>
                        <Card.Text className="d-flex justify-content-between mt-3">
                          <div>
                            <FaRegTrashAlt
                              size="20px"
                              style={{ color: "Red", cursor: "pointer" }}
                              onClick={() =>
                                onChangeStatus("delete", notification[0])
                              }
                            />
                            <FaStar
                              className={sm ? "" : "ms-5"}
                              size="20px"
                              style={{
                                color:
                                  activeTab === "marked" ? "yellow" : "Grey",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                onChangeStatus("marked", notification[0])
                              }
                            />
                            <FaCheckDouble
                              className={sm ? "" : "ms-5"}
                              size="20px"
                              style={{
                                color:
                                  activeTab === "unread" ? "Grey" : "Green",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                if (activeTab === "unread") {
                                  onChangeStatus("read", notification[0]);
                                }
                              }}
                            />
                          </div>
                          <p className="text-muted">{notification[1].date}</p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  );
                }
              })}
          {Object.keys(notifications).length === 0 && (
            <p className="text-center text-danger fw-bold">
              {" "}
              Notifications not found.
            </p>
          )}
        </Card>
      </TabContent>
      <div className="d-flex justify-content-center mt-5">
        <PageSwitcher />
      </div>
    </Container>
  );
};

export default Notifications;
