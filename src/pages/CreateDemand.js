import {
  Card,
  Row,
  Col,
  Container,
  Button,
  Dropdown,
  Form,
  FormControl,
  FormLabel,
  FormCheck,
} from "react-bootstrap";
import { Fragment } from "react";

const CreateDemand = () => {
  return (
    <Fragment>
      <Container>
        <Card style={{ width: `40rem`, marginTop: "3%", marginLeft: "20%" }}>
          <Card.Header className="bg-primary text-center text-white">
            <h4>Create Demand</h4>
          </Card.Header>
          <Card.Body>
            <Form>
              <Col md={{ span: 12 }}>
                <FormGroup className="my-2">
                  <Row>
                    <Col md="5">
                      <FormLabel>Recruiter Name</FormLabel>
                    </Col>
                    <Col md="7">
                      <Dropdown>
                        <Dropdown.Toggle
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderColor: "black",
                          }}
                          id="dropdown-basic"
                          className="w-100"
                        >
                          - Select Recruiter -
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          <Dropdown.Item href="#/action-1">
                            Recruiter1
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#/action-2">
                            Recruiter2
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#/action-3">
                            Recruiter3
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>

              <Col md={{ span: 12 }}>
                <FormGroup className="my-2">
                  <Row>
                    <Col md="5">
                      <FormLabel>Date of Demand Allocation</FormLabel>
                    </Col>
                    <Col md="7">
                      <FormControl type="date" name="password" />
                      <div className="invalid-feedback">
                        password is required
                      </div>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={{ span: 12 }}>
                <FormGroup className="my-2">
                  <Row>
                    <Col md="5">
                      <FormLabel>Client Name</FormLabel>
                    </Col>
                    <Col md="7">
                      <FormControl type="text" name="password" />
                      <div className="invalid-feedback">
                        password is required
                      </div>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={{ span: "7", offset: "5" }}>
                <FormCheck type="checkbox" label="Enter manually." />
              </Col>
              <Col md={{ span: 12 }}>
                <FormGroup className="my-2">
                  <Row>
                    <Col md="5">
                      <FormLabel>End Client Name</FormLabel>
                    </Col>
                    <Col md="7">
                      <FormControl type="text" name="password" />
                      <div className="invalid-feedback">
                        password is required
                      </div>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={{ span: "7", offset: "5" }}>
                <FormCheck type="checkbox" label="Enter manually." />
              </Col>
              <Col md="12">
                <FormGroup className="my-2">
                  <Row>
                    <Col md="5">
                      <FormLabel>Demand</FormLabel>
                    </Col>
                    <Col md="7">
                      <FormControl type="number" name="password" />
                      <div className="invalid-feedback">
                        password is required
                      </div>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={{ span: 12 }}>
                <FormGroup className="my-2">
                  <label htmlFor="password">Primary Skills</label>
                  <Row>
                    <Col md="6">
                      <Dropdown>
                        <Dropdown.Toggle
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderColor: "black",
                          }}
                          id="dropdown-basic"
                          className="w-100"
                        >
                          - Select Technology -
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          <Dropdown.Item href="#/action-1">
                            Programming Language
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#/action-2">
                            Web Development
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#/action-3">
                            Devops
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                    <Col md="6">
                      <Dropdown>
                        <Dropdown.Toggle
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderColor: "black",
                          }}
                          id="dropdown-basic"
                          className="w-100"
                        >
                          - Select skills -
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          <Dropdown.Item as={FormCheck}>Java</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item as={FormCheck}>Python</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item as={FormCheck} className="active">
                            Ruby
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ span: "6" }}>
                      <FormCheck type="checkbox" label="Enter manually." />
                    </Col>
                    <Col md={{ span: "6" }}>
                      <FormCheck type="checkbox" label="Enter manually." />
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={{ span: 12 }}>
                <FormGroup className="my-2">
                  <label htmlFor="password">Secondary Skills</label>
                  <Row>
                    <Col md="6">
                      <Dropdown>
                        <Dropdown.Toggle
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderColor: "black",
                          }}
                          id="dropdown-basic"
                          className="w-100"
                        >
                          - Select Technology -
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          <Dropdown.Item href="#/action-1">
                            Programming Language
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#/action-2">
                            Web Development
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#/action-3">
                            Devops
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                    <Col md="6">
                      <Dropdown>
                        <Dropdown.Toggle
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderColor: "black",
                          }}
                          id="dropdown-basic"
                          className="w-100"
                        >
                          - Select skills -
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          <Dropdown.Item as={FormCheck}>Java</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item as={FormCheck}>Python</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item as={FormCheck} className="active">
                            Ruby
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ span: "6" }}>
                      <FormCheck type="checkbox" label="Enter manually." />
                    </Col>
                    <Col md={{ span: "6" }}>
                      <FormCheck type="checkbox" label="Enter manually." />
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col md="12"></Col>
              <Col md="12">
                <Button variant="primary" className="w-100 my-2">
                  Submit
                </Button>
              </Col>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
};
export default CreateDemand;
