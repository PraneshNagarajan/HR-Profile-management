import { useState } from "react";
import {
  Container,
  Nav,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import AddressTabContent from "../components/AddressTabContent";
import PersonalTabContent from "../components/PersonalTabContent";

const AddEmployeePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [activeTab, setActiveTab] = useState('personal')
  return (
    <Container fluid className={sm ? 'my-3' : "p-5"}>
      <Nav variant="tabs" defaultActiveKey="personal-info">
        <Nav.Item>
          <Nav.Link eventKey="personal-info" onClick={e => setActiveTab('personal')}>personal-info</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="address-info" onClick={ e => setActiveTab('address')}>address-info</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="employee-info">employee-info</Nav.Link>
        </Nav.Item>
      </Nav>
      {activeTab == 'personal' && <PersonalTabContent />}
      {activeTab == 'address' &&<AddressTabContent /> }
    </Container>
  );
};
export default AddEmployeePage;
