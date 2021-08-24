import { useState } from "react";
import {
  Container,
  Nav,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import AddressTabContent from "../components/AddressTabContent";
import EmployeeTabContent from "../components/EmployeeTabContent";
import PersonalTabContent from "../components/PersonalTabContent";

const AddEmployeePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [activeTab, setActiveTab] = useState('personal')
  const personalInfo = useSelector(state => state)
  return (
    <Container fluid className={sm ? 'my-3' : "p-5"}>
      <Nav variant="tabs" defaultActiveKey="personal-info">
        <Nav.Item>
          <Nav.Link eventKey="personal-info" onClick={e => setActiveTab('personal')}><span className={personalInfo.length >0 ? 'fw-bold text-success' : 'text-dark'}>Personal Info</span></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="address-info" onClick={e => setActiveTab('address')}>address-info</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="employee-info" onClick={e => setActiveTab('employee')}>employee-info</Nav.Link>
        </Nav.Item>
      </Nav>
      {activeTab == 'personal' && <PersonalTabContent/>}
      {activeTab == 'address' &&<AddressTabContent /> }
      {activeTab == 'employee' &&<EmployeeTabContent /> }
    </Container>
  );
};
export default AddEmployeePage;
