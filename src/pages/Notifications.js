import { useState } from "react";
import { Container, Nav, TabContent, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import { NotificationActions } from "../Redux/NotificationSlice";
import { firestore } from "../firebase";
import { FaRegTrashAlt, FaStar, FaCheckDouble } from "react-icons/fa";

const Notifications = () => {
  const notifications = useSelector((state) => state.notification.data);
  const sm = useMediaQuery({ maxWidth: 768 });
  const [activeTab, setActiveTab] = useState("unread");
  const user = useSelector((state) => state.auth.email);
  const history = useHistory();
  const dispatch = useDispatch();
  const notifyRef = firestore.collection("Notifications").doc(user);

  setInterval(() => {
    notifyRef.get().then((res) => {
      let unreadData = Object.values(res.data()).filter(
        (item) => item.status === "unread"
      );
      dispatch(
        NotificationActions.getNotifications({
          key: unreadData.length,
          data: res.data(),
        })
      );
    });
  }, 180000);

  const onChangeStatus = (status, key) => {
    let data = notifications[key];
    if (status === "delete") {
      notifyRef
        .delete()
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
          {Object.entries(notifications)
            .filter((item) => item[1].status === activeTab)
            .sort()
            .reverse()
            .map((notification, index) => {
              return (
                <Card key={index} className="mb-2 animated fadeOut infinite">
                  <Card.Body>
                    <Card.Title
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        history.push(notification[1].url);
                      }}
                    >
                      {notification[1].title}
                    </Card.Title>
                    <Card.Subtitle>{notification[1].msg}</Card.Subtitle>
                    <Card.Text className="d-flex justify-content-between mt-3">
                      <div>
                        <FaRegTrashAlt
                          size="20px"
                          style={{ color: "Red" }}
                          onClick={() =>
                            onChangeStatus("delete", notification[0])
                          }
                        />
                        <FaStar
                          className={sm ? "" : "ms-5"}
                          size="20px"
                          style={{
                            color: activeTab === "marked" ? "yellow" : "Grey",
                          }}
                          onClick={() =>
                            onChangeStatus("marked", notification[0])
                          }
                        />
                        <FaCheckDouble
                          className={sm ? "" : "ms-5"}
                          size="20px"
                          style={{
                            color: activeTab === "unread" ? "Grey" : "Green",
                          }}
                          onClick={() =>
                            onChangeStatus("read", notification[0])
                          }
                        />
                      </div>
                      <p className="text-muted">{notification[1].date}</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
        </Card>
      </TabContent>
    </Container>
  );
};

export default Notifications;
