import { Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import AddressTabContent from "../components/AddressTabContent";
import EmployeeTabContent from "../components/EmployeeTabContent";
import PersonalTabContent from "../components/PersonalTabContent";
import { InfoActions } from "../Redux/EmployeeInfoSlice";

const AddEmployeePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();
  const infos = useSelector((state) => state.info);
  return (
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
                infos.personal.length > 0 ? "fw-bold text-success" : "text-dark"
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
                infos.address.length > 0 ? "fw-bold text-success" : "text-dark"
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
                infos.employee.length > 0 ? "fw-bold text-success" : "text-dark"
              }
            >
              Employee-Info
            </span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div
        className={infos.activeTab.includes("personal") ? "d-block" : "d-none"}
      >
        <PersonalTabContent />
      </div>
      <div
        className={infos.activeTab.includes("address") ? "d-block" : "d-none"}
      >
        <AddressTabContent />
      </div>
      <div
        className={infos.activeTab.includes("employee") ? "d-block" : "d-none"}
      >
        <EmployeeTabContent />
      </div>
    </Container>
  );
};
export default AddEmployeePage;
