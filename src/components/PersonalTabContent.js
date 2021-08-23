import {
  Card,
  Row,
  Col,
  Dropdown,
  FormControl,
  FormLabel,
  FormGroup,
  TabContent,
} from "react-bootstrap";
const PersonalTabContent = () => {
  return (
    <TabContent>
      <Card>
        <Card.Body className="mb-3">
          <form>
            <Row>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="username">First Name</label>
                  <input
                    type="text"
                    className={`form-control`}
                    name="username"
                    required
                  />
                  <div className="invalid-feedback">Username is required</div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="password">Last Name</label>
                  <input
                    type="type"
                    name="password"
                    id="password"
                    className={`form-control`}
                    required
                  />
                  <div className="invalid-feedback">password is required</div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="username">Father Name</label>
                  <input
                    type="text"
                    className={`form-control`}
                    name="username"
                    required
                  />
                  <div className="invalid-feedback">Username is required</div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="password">Mother Name</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control`}
                    required
                  />
                  <div className="invalid-feedback">password is required</div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md="4">
                <div className="form-group my-2">
                  <label htmlFor="username">Date of Birth</label>
                  <input
                    type="date"
                    className={`form-control`}
                    name="username"
                    required
                  />
                  <div className="invalid-feedback">Username is required</div>
                </div>
              </Col>
              <Col md="4" className="mb-5 mt-2">
                <FormLabel>Gender</FormLabel>

                <Dropdown>
                  <Dropdown.Toggle
                    variant="primary"
                    id="dropdown-basic"
                    className="w-100"
                  >
                    Select Gender
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item href="#/action-1">Male</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#/action-2">Female</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#/action-3">Others</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col md="4">
                <FormGroup>
                  <FormLabel>Age</FormLabel>
                  <FormControl type="number" min="0" max="120"></FormControl>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="username">Phone Number (Primary)</label>
                  <input
                    type="text"
                    className={`form-control`}
                    name="username"
                    required
                  />
                  <div className="invalid-feedback">Username is required</div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="password">Phone Number (Secondary)</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control`}
                    required
                  />
                  <div className="invalid-feedback">password is required</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="username">Email (primary)</label>
                  <input
                    type="text"
                    className={`form-control`}
                    name="username"
                    required
                  />
                  <div className="invalid-feedback">Username is required</div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="password">Email (secondary)</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control`}
                    required
                  />
                  <div className="invalid-feedback">password is required</div>
                </div>
              </Col>
            </Row>
          </form>
        </Card.Body>
      </Card>
    </TabContent>
  );
};
export default PersonalTabContent;
