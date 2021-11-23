import { useEffect } from "react";
import { Fragment } from "react";
import { Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import AddressTabContent from "../components/AddressTabContent";
import Alerts from "../components/Alert";
import EmployeeTabContent from "../components/EmployeeTabContent";
import PersonalTabContent from "../components/PersonalTabContent";
import { InfoActions } from "../Redux/EmployeeInfoSlice";

const AddEmployeePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();
  const infos = useSelector((state) => state.info);

  useEffect(() => {
    dispatch(InfoActions.resetForm());
  }, []);
  return (
    <Fragment>
      <Alerts flag={true}/>
      <Container fluid className={sm ? "my-3" : "p-5"}>
        <Nav variant="tabs" defaultActiveKey={infos.activeTab}>
          <Nav.Item>
            <Nav.Link
              eventKey="personal-info"
              active={infos.activeTab.includes("personal")}
              onClick={(e) =>
                dispatch(InfoActions.getActiveTab("personal-info"))
              }
            >
              <span
                className={
                  Object.keys(infos.personal).length > 0
                    ? "fw-bold text-success"
                    : "text-dark"
                }
              >
                Personal-Info
              </span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="address-info"
              active={infos.activeTab.includes("address")}
              onClick={(e) =>
                dispatch(InfoActions.getActiveTab("address-info"))
              }
            >
              <span
                className={
                  Object.keys(infos.address).length > 0
                    ? "fw-bold text-success"
                    : "text-dark"
                }
              >
                Address-Info
              </span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="employee-info"
              active={infos.activeTab.includes("employee")}
              onClick={(e) =>
                dispatch(InfoActions.getActiveTab("employee-info"))
              }
            >
              <span
                className={
                  Object.keys(infos.employee).length > 0
                    ? "fw-bold text-success"
                    : "text-dark"
                }
              >
                Employee-Info
              </span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div
          className={
            infos.activeTab.includes("personal") ? "d-block" : "d-none"
          }
        >
          <PersonalTabContent view={false} />
        </div>
        <div
          className={infos.activeTab.includes("address") ? "d-block" : "d-none"}
        >
          <AddressTabContent view={false} />
        </div>
        <div
          className={
            infos.activeTab.includes("employee") ? "d-block" : "d-none"
          }
        >
          <EmployeeTabContent view={false} user={{ flag: false }} />
        </div>
      </Container>
    </Fragment>
  );
};
export default AddEmployeePage;
