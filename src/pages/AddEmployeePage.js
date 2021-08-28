import { useEffect } from "react";
import { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import AddressTabContent from "../components/AddressTabContent";
import EmployeeTabContent from "../components/EmployeeTabContent";
import PersonalTabContent from "../components/PersonalTabContent";

const AddEmployeePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <Container fluid className={sm ? "my-3" : "p-5"}>
      <Nav variant="tabs" defaultActiveKey="personal-info">
        <Nav.Item>
          <Nav.Link
            eventKey="personal-info"
            onClick={(e) => setActiveTab("personal")}
          >
            Personal-info
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="address-info"
            onClick={(e) => setActiveTab("address")}
          >
            address-info
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="employee-info"
            onClick={(e) => setActiveTab("employee")}
          >
            employee-info
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className={activeTab == "personal" ? "d-block" : "d-none"}>
        <PersonalTabContent />
      </div>
      <div className={activeTab == "address" ? "d-block" : "d-none"}>
        <AddressTabContent />
      </div>
      <div className={activeTab == "employee" ? "d-block" : "d-none"}>
        <EmployeeTabContent />
      </div>
    </Container>
  );
};
export default AddEmployeePage;
