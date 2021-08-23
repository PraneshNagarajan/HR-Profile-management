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
} from "react-bootstrap";

const EmployeeTabContent = () => {
  const [role, setRole] = useState("- Select Role -");
  const [permission, setPermission] = useState("- Select Permission -");
  return (
    <TabContent>
      <Card>
        <Card.Body className="p-5 mb-5">
          <Form className="mb-5">
            <Row>
              <Col md="4">
                <div className="form-group my-2">
                  <FormLabel htmlFor="employee id">Employee Id</FormLabel>
                  <FormControl
                    type="text"
                    className={`form-control`}
                    name="employee-id"
                    required
                  />
                </div>
              </Col>
              <Col md="4">
                <FormLabel>Roles</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="primary"
                    id="dropdown-basic"
                    className="w-100"
                  >
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
              <Col md="4">
                <FormLabel>Permissions</FormLabel>

                <Dropdown>
                  <Dropdown.Toggle
                    disabled={!role.includes("Focal")}
                    variant="secondary"
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
                      Read & Write
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => setPermission("Read Only")}
                      active={permission.includes("Only")}
                    >
                      Read Only
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
