import {
  Container,
  Nav,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import PersonalTabContent from "../components/PersonalTabContent";

const AddEmployeePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  return (
    <Container fluid className={sm ? 'my-3' : "p-5"}>
      <Nav variant="tabs" defaultActiveKey="personal-info">
        <Nav.Item>
          <Nav.Link eventKey="personal-info">personal-info</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="address-info">address-info</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="employee-info">employee-info</Nav.Link>
        </Nav.Item>
      </Nav>
      <PersonalTabContent eventKey="personal-info" />
    </Container>
  );
};
export default AddEmployeePage;
