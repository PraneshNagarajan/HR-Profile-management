import { Fragment, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import AddressTabContent from "../components/AddressTabContent";
import Alerts from "../components/Alert";
import EmployeeTabContent from "../components/EmployeeTabContent";
import SecurityContent from "../components/SecurityContent";
import PersonalTabContent from "../components/PersonalTabContent";
import { InfoActions } from "../Redux/EmployeeInfoSlice";
import { useEffect } from "react";
import { AlertActions } from "../Redux/AlertSlice";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { fireStorage, firestore } from "../firebase";

const ManageEmployeeProfilePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();
  const infos = useSelector((state) => state.info);
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get("activeTab");
  const [userImg, setUserImg] = useState("");
  const [userImgFlag, setUserImgFlag] = useState(false);

  useEffect(() => {
    firestore
      .collection("Employee-Info")
      .doc("users")
      .get()
      .then((documentSnapshot) => {
        const doc = documentSnapshot.get(params.id);
        firestore
          .collection("Employee-Info")
          .doc(doc)
          .get()
          .then((documentSnapshot) => {
            const profile_info = documentSnapshot.get("profile");
            const password_info = documentSnapshot.get("password-management");
            dispatch(
              InfoActions.getCompleteInfo({
                address: profile_info.address,
                personal: profile_info.personal,
                employee: profile_info.employee,
                security: password_info.status,
                activeTab,
              })
            );

            if (
              profile_info.img_uploaded &&
              profile_info.employee.id !== auth.id
            ) {
              fireStorage
                .ref()
                .child("employee-img/" + doc)
                .getDownloadURL()
                .then((url) => {
                  setUserImg(url);
                  setUserImgFlag(true);
                });
            } else if (profile_info.employee.id === auth.id) {
              setUserImg(auth.photoUrl);
              console.log("test");
              setUserImgFlag(true);
            } else {
              setUserImgFlag(false);
            }

            if (profile_info.employee.id === auth.id) {
              if (!profile_info.img_uploaded && !password_info.status) {
                dispatch(
                  AlertActions.handleShow({
                    msg: "Please upload photo and choose your security questions and answers.",
                    flag: false,
                  })
                );
              } else if (!profile_info.img_uploaded) {
                dispatch(
                  AlertActions.handleShow({
                    msg: "Please upload photo",
                    flag: false,
                  })
                );
              } else if (!password_info.status) {
                dispatch(
                  AlertActions.handleShow({
                    msg: "Please choose your security questions and answers.",
                    flag: false,
                  })
                );
              }
            } else {
              dispatch(InfoActions.getActiveTab("personal-info"));
            }
          });
      });
  }, [params.id]);

  return (
    <Fragment>
      <Alerts />
      {Object.keys(infos.personal).length > 0 && (
        <Container fluid className={sm ? "my-3" : "p-5"}>
          <Nav variant="tabs" defaultActiveKey={infos.activeTab}>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to={location.pathname + "?activeTab=personal-info"}
                eventKey="personal-info"
                active={infos.activeTab.includes("personal")}
                onClick={(e) =>
                  dispatch(InfoActions.getActiveTab("personal-info"))
                }
              >
                <span className="fw-bold text-success">Personal-Info</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to={location.pathname + "?activeTab=address-info"}
                eventKey="address-info"
                active={infos.activeTab.includes("address")}
                onClick={(e) =>
                  dispatch(InfoActions.getActiveTab("address-info"))
                }
              >
                <span className="fw-bold text-success">Address-Info</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to={location.pathname + "?activeTab=employee-info"}
                eventKey="employee-info"
                active={infos.activeTab.includes("employee")}
                onClick={(e) =>
                  dispatch(InfoActions.getActiveTab("employee-info"))
                }
              >
                <span
                  className={
                    userImg.length > 0
                      ? "fw-bold text-success"
                      : "fw-bold text-danger"
                  }
                >
                  Employee-Info
                </span>
              </Nav.Link>
            </Nav.Item>
            {infos.employee.id === auth.id && (
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={location.pathname + "?activeTab=security-info"}
                  eventKey="security-info"
                  active={infos.activeTab.includes("security")}
                  onClick={(e) =>
                    dispatch(InfoActions.getActiveTab("security-info"))
                  }
                >
                  <span
                    className={
                      infos.security.status
                        ? "fw-bold text-success"
                        : "fw-bold text-danger"
                    }
                  >
                    Security-Info
                  </span>
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
          <div
            className={
              infos.activeTab.includes("personal") ? "d-block" : "d-none"
            }
          >
            <PersonalTabContent
              view={{
                user: infos.employee.id === auth.id,
                admin: infos.employee.id !== auth.id,
              }}
            />
          </div>
          <div
            className={
              infos.activeTab.includes("address") ? "d-block" : "d-none"
            }
          >
            <AddressTabContent
              view={{
                user: infos.employee.id === auth.id,
                admin: infos.employee.id !== auth.id,
              }}
            />
          </div>
          <div
            className={
              infos.activeTab.includes("employee") ? "d-block" : "d-none"
            }
          >
            <EmployeeTabContent
              view={{
                user: infos.employee.id === auth.id,
                admin: infos.employee.id !== auth.id,
              }}
              user={{ img: userImg, flag: userImgFlag }}
            />
          </div>
          <div
            className={
              activeTab.includes("security") && infos.employee.id === auth.id
                ? "d-block"
                : "d-none"
            }
          >
            <SecurityContent />
          </div>
        </Container>
      )}
    </Fragment>
  );
};
export default ManageEmployeeProfilePage;
