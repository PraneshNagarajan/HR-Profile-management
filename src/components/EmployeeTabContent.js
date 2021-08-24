import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Dropdown,
  FormControl,
  FormLabel,
  TabContent,
  Form,
  FormGroup,
} from "react-bootstrap";

const EmployeeTabContent = () => {
  const [role, setRole] = useState("- Select Role -");
  const [permission, setPermission] = useState("- Select Permission -");
  return (
    <TabContent>
      <Card>
        <Card.Body className="mb-5">
          <Form className="mb-5">
            <Row className="my-2">
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup>
                  <FormLabel htmlFor="employee id">Employee Id</FormLabel>
                  <FormControl
                    type="text"
                    className={`form-control`}
                    name="employee-id"
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Roles</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" className="w-100">
                    {role}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={(e) => setRole("Junior-Recruiter")}
                      onClick={(e) => setPermission("- Select Permission -")}
                      active={role.includes("junior")}
                    >
                      Recruiter
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => setRole("Senior-Recruiter")}
                      onClick={(e) => setPermission("- Select Permission -")}
                      active={role.includes("senior")}
                    >
                      Senior-Recruiter
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => setRole("Focal")}
                      active={role.includes("focal")}
                    >
                      Focal
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
            <Row className="my-5">
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup>
                  <FormLabel htmlFor="employee id">Employee email Id</FormLabel>
                  <FormControl type="text" name="employee-email" required />
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Permissions</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={!role.includes("Focal")}
                    variant="outline-secondary"
                    id="dropdown-basic"
                    className="w-100"
                  >
                    {permission}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={(e) => setPermission("Read & Write")}
                      active={permission.includes("Write")}
                    >
                      View & Edit
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => setPermission("Read Only")}
                      active={permission.includes("Only")}
                    >
                      View Only
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </TabContent>
  );
};
export default EmployeeTabContent;
