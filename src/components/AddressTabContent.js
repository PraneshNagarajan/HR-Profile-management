import {
  Card,
  Row,
  Col,
  FormGroup,
  FormCheck,
  TabContent
} from "react-bootstrap";

const AddressTabContent = () => {
  return (
    <TabContent>
      <Card>
        <Card.Body className="mb-3">
          <h4>Present Address</h4>
          <form>
            <Row>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="username">Flat No</label>
                  <input
                    type="text"
                    className={`form-control`}
                    name="username"
                    required
                  />
                  <div className="invalid-feedback"></div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="password">Street Name</label>
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
                  <label htmlFor="username">Landmark</label>
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
                  <label htmlFor="password">City</label>
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
                  <label htmlFor="username">district</label>
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
                  <label htmlFor="password">State </label>
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
                  <label htmlFor="username">Country</label>
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
                  <label htmlFor="password">Pincode</label>
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
                        {/* Permenant adrees form */}
          </form>
          <hr className="my-5" />
          <h4>Permenant Address</h4>
          <FormGroup>
            <FormCheck
              type="checkbox"
              label="Same as Present address"
            ></FormCheck>
          </FormGroup>
          <form>
            <Row>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="username">Flat No</label>
                  <input
                    type="text"
                    className={`form-control`}
                    name="username"
                    required
                  />
                  <div className="invalid-feedback"></div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group my-2">
                  <label htmlFor="password">Street Name</label>
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
                  <label htmlFor="username">Landmark</label>
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
                  <label htmlFor="password">City</label>
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
                  <label htmlFor="username">district</label>
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
                  <label htmlFor="password">State </label>
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
                  <label htmlFor="username">Country</label>
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
                  <label htmlFor="password">Pincode</label>
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
export default AddressTabContent;
