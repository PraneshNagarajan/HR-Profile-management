import { Fragment } from "react";
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

const ManageEmployeeProfilePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();
  const infos = useSelector((state) => state.info);

  useEffect(() => {
    if(!infos.employee_status && !infos.password_status) {
      dispatch(AlertActions.handleShow({msg: 'Please upload photo and choose your security questions and answers.' , flag: false}))
    } else if (!infos.employee_status) {
      dispatch(AlertActions.handleShow({msg: 'Please upload photo' , flag: false}))
    } else if(!infos.password_status) {
      dispatch(AlertActions.handleShow({msg: 'Please choose your security questions and answers.' , flag: false}))
    }
  },[])

  return (
    <Fragment>
      <Alerts />
      <Container fluid className={sm ? "my-3" : "p-5"}>
      <Nav variant="tabs" defaultActiveKey={infos.activeTab}>
        <Nav.Item>
          <Nav.Link
            eventKey="personal-info"
            active={infos.activeTab.includes("personal")}
            onClick={(e) => dispatch(InfoActions.getActiveTab("personal-info"))}
          >
            <span
              className={
               Object.keys(infos.personal).length > 0 ? "fw-bold text-success" : "text-dark"
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
            onClick={(e) => dispatch(InfoActions.getActiveTab("address-info"))}
          >
            <span
              className={
                Object.keys(infos.address).length > 0 ? "fw-bold text-success" : "text-dark"
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
            onClick={(e) => dispatch(InfoActions.getActiveTab("employee-info"))}
          >
            <span
              className={
                Object.keys(infos.employee).length > 0 ? "fw-bold text-success" : "text-dark"
              }
            >
              Employee-Info
            </span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="security-info"
            active={infos.activeTab.includes("security")}
            onClick={(e) => dispatch(InfoActions.getActiveTab("security-info"))}
          >
            <span
              className={
                infos.employee.length > 0 ? "fw-bold text-success" : "text-dark"
              }
            >
              Security-Info
            </span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div
        className={infos.activeTab.includes("personal") ? "d-block" : "d-none"}
      >
        <PersonalTabContent view={true}/>
      </div>
      <div
        className={infos.activeTab.includes("address") ? "d-block" : "d-none"}
      >
        <AddressTabContent view={true}/>
      </div>
      <div
        className={infos.activeTab.includes("employee") ? "d-block" : "d-none"}
      >
        <EmployeeTabContent view={true}/>
      </div>
      <div
        className={infos.activeTab.includes("security") ? "d-block" : "d-none"}
      >
        <SecurityContent />
      </div>
    </Container>
  
    </Fragment>
  );
};
export default ManageEmployeeProfilePage;
