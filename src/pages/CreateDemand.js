import {
  Card,
  Row,
  Col,
  Container,
  Button,
  Dropdown,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  FormCheck,
} from "react-bootstrap";
import { Fragment, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./CreateDemand.css";
import Spinners from "../components/Spinners";
import { useSelector } from "react-redux";
import { useFormik } from "formik";

const CreateDemand = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [ptIsChecked, setPrimaryTechIsChecked] = useState(false);
  const [psIsChecked, setPrimarySkillIsChecked] = useState(false);
  const [stIsChecked, setSecondaryTechIsChecked] = useState(false);
  const [ssIsChecked, setSecondarySkillIsChecked] = useState(false);
  const [clientIsChecked, setClientIsChecked] = useState(false);
  const [end_clientIsChecked, setEndClientIsChecked] = useState(false);
  // const [formik.values.recruiter, setformik.values.recruiter]= useState("- Select the Recruiter -")
  // const [formik.values.clientname, setformik.values.clientname] = useState("- Select the Client -");
  // const [formik.values.endclientname, setformik.values.endclientname] = useState("- Select the End-Client -");
  // const [formik.values.primarytech, setformik.values.primarytech] = useState("- Select the Techonology -");
  // const [formik.values.secondarytech, setformik.values.secondarytech] = useState("- Select the Techonology -");
  // const [selectedSkill1, setSelectedSkill1] = useState("- Select the Skill -");
  // const [formik.values.secondaryskill, setformik.values.secondaryskill] = useState("- Select the Skill -");
  const pre_requisite = useSelector((state) => state.demandPreRequisite);
 
  const formik = useFormik({
    initialValues: {
      recruiter:"- Select the Recruiter -",
      clientname:"- Select the Client -",
      endclientname: "- Select the End-Client -",
      location: "",
      panlocation:"",
      type: "- Select the type -",
      demand: "",
      demandallot: "",
      primarytech: "- Select the Techonology -",
      primaryskill:"- Select the Skill -",
      secondarytech:"- Select the Techonology -",
      secondaryskill:"- Select the Skill -"
    },
    validate: (value) =>{

    }
  })

  return (
    <Fragment>
      {!Object.values(pre_requisite.clients).length > 0 && <Spinners />}
      {Object.values(pre_requisite.clients).length > 0 && (
        <Container className="d-flex justify-content-center ">
          <Card className={`my-3 ${sm ? `w-100` : `w-75`}`}>
            <Card.Header className="bg-primary text-center text-white">
              <h4>Create Demand</h4>
            </Card.Header>
            <Card.Body className="mb-4">
              <Form>
                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <Row>
                      <Col md="4">
                        <FormLabel>
                          <b>Recruiter Name</b>
                        </FormLabel>
                      </Col>
                      <Col md="8">
                        <Dropdown className="dropbox">
                          <Dropdown.Toggle
                          name="recruiter"
                          variant={`outline-${
                            !formik.touched.recruiter
                                ? `secondary`
                              : !formik.values.recruiter.includes("-") && formik.touched.recruiter
                              ? `success`
                              : formik.values.recruiter.includes("-") && formik.touched.recruiter
                              ? `danger`
                              : ``
                          }`}
                          onBlur={formik.handleBlur}
                            className="w-100"
                          >
                           {formik.values.recruiter}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            {pre_requisite.recruiters.map((recruiter, index) => {
                              return (
                                <Fragment key={index}>
                                  <Dropdown.Item className="text-center"  onClick={ () => {
                                    formik.setFieldValue('recruiter', recruiter.name)
                                    }}>
                                      
                                    {recruiter.name}
                                  </Dropdown.Item>
                                  {index <
                                    pre_requisite.recruiters.length - 1 && (
                                    <Dropdown.Divider />
                                  )}
                                </Fragment>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                <Col md="12">
                  <div className="row">
                    <Col md="6" className="my-2">
                      <FormLabel>
                        <b>Client Name</b>
                      </FormLabel>
                      {clientIsChecked && (
                        <FormGroup>
                          <FormControl 
                          type="text" 
                          name="clientname" 
                          isInvalid={
                            formik.errors.clientname &&
                            (formik.touched.clientname ||
                              formik.values.clientname.length > 0)
                          }
                          isValid={
                            !formik.errors.clientname &&
                            (formik.touched.clientname ||
                              formik.values.clientname.length > 0)
                          }
                          onChange={formik.handleChange} 
                          onBlur={formik.handleBlur} />
                          <div className="invalid-feedback">
                          </div>
                        </FormGroup>
                      )}
                      {!clientIsChecked && (
                        <Dropdown className="dropbox">
                          <Dropdown.Toggle
                          name="clientname"
                          onBlur={formik.handleBlur}
                            variant={`outline-${
                              !formik.touched.clientname
                                  ? `primary`
                                : !formik.values.clientname.includes("-") && formik.touched.clientname
                                ? `success`
                                : formik.values.clientname.includes("-") && formik.touched.clientname
                                ? `danger`
                                : ``
                            }`}
                            className="w-100"
                          >
                            {formik.values.clientname}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            {Object.keys(pre_requisite.clients).map(
                              (client, index) => {
                                return (
                                  <Fragment key={index}>
                                    <Dropdown.Item
                                    active={formik.values.clientname.includes(client)}
                                      onClick={() => {
                                        formik.setFieldValue('clientname', client)
                                      }}
                                    >
                                      {client}
                                    </Dropdown.Item>
                                    {Object.keys(pre_requisite.clients).length -
                                      1 >
                                      index && <Dropdown.Divider />}
                                  </Fragment>
                                );
                              }
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                      <FormCheck
                        type="checkbox"
                        label="Enter manually."
                        onClick={() => {
                          setClientIsChecked(!clientIsChecked);
                          setEndClientIsChecked(!end_clientIsChecked);
                        }}
                      />
                    </Col>

                    <Col md="6" className="my-2">
                      <FormLabel>
                        <b>End Client Name</b>
                      </FormLabel>
                      {end_clientIsChecked && (
                        <FormGroup>
                          <FormControl type="text" name="password" />
                          <div className="invalid-feedback">
                            password is required
                          </div>
                        </FormGroup>
                      )}
                      {!end_clientIsChecked && (
                        <Dropdown className="dropbox">
                          <Dropdown.Toggle
                            name="endclientname"
                            onBlur={formik.handleBlur}
                              variant={`outline-${
                                !formik.touched.endclientname
                                    ? `primary`
                                  : !formik.values.endclientname.includes("-") && formik.touched.endclientname
                                  ? `success`
                                  : formik.values.endclientname.includes("-") && formik.touched.endclientname
                                  ? `danger`
                                  : ``
                              }`}
                            className="w-100"
                          >
                            {formik.values.endclientname}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            {!formik.values.clientname.includes('-') &&
                              pre_requisite.clients[formik.values.clientname].map(
                                (endclient, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item onClick={() => formik.setFieldValue('endclientname',endclient)} active={formik.values.endclientname.includes(endclient)}>{endclient}</Dropdown.Item>
                                      {pre_requisite.clients[formik.values.clientname]
                                        .length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                }
                              )}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                      {!clientIsChecked && (
                        <FormCheck
                          type="checkbox"
                          label="Enter manually."
                          onClick={() =>
                            setEndClientIsChecked(!end_clientIsChecked)
                          }
                        />
                      )}
                    </Col>
                  </div>
                </Col>

                <Col md="12">
                  <div className="row">
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Location</b>
                        </FormLabel>
                        <FormControl type="text" name="password" />
                        <div className="invalid-feedback">
                          password is required
                        </div>
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Pan Location</b>
                        </FormLabel>
                        <FormControl type="text" name="password" />
                        <div className="invalid-feedback">
                          password is required
                        </div>
                      </FormGroup>
                    </Col>
                  </div>
                </Col>

                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <Row>
                      <Col md="4">
                        <FormLabel>
                          <b>Type</b>
                        </FormLabel>
                      </Col>
                      <Col md="8">
                        <Dropdown className="dropbox">
                          <Dropdown.Toggle
                            name="type"
                            onBlur={formik.handleBlur}
                              variant={`outline-${
                                !formik.touched.type
                                    ? `primary`
                                  : !formik.values.type.includes("-") && formik.touched.type
                                  ? `success`
                                  : formik.values.type.includes("-") && formik.touched.type
                                  ? `danger`
                                  : ``
                              }`}
                            className="w-100"
                          >
                            {formik.values.type}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            <Dropdown.Item onClick={ () => formik.setFieldValue('type', 'Full-TIme')}>
                              Full-Time
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={ () => formik.setFieldValue('type', 'Part-TIme')}>
                              Part-Time
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                <Col md="12">
                  <Row>
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Demand</b>
                        </FormLabel>
                        <FormControl type="number" name="password" />
                        <div className="invalid-feedback">
                          password is required
                        </div>
                      </FormGroup>{" "}
                    </Col>
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Date of Demand Allocation</b>
                        </FormLabel>
                        <FormControl type="date" name="password" />
                        <div className="invalid-feedback">
                          password is required
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>

                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <FormLabel>
                      <b>Primary Skills</b>
                    </FormLabel>
                    <Row>
                      <Col md="6" className="my-1">
                        {ptIsChecked && (
                          <FormGroup>
                            <FormLabel>
                              <b>Enter the technology</b>
                            </FormLabel>
                            <FormControl type="number" name="password" />
                            <div className="invalid-feedback">
                              password is required
                            </div>
                          </FormGroup>
                        )}
                        {!ptIsChecked && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                              name="primarytech"
                              onBlur={formik.handleBlur}
                                variant={`outline-${
                                  !formik.touched.primarytech
                                      ? `primary`
                                    : !formik.values.primarytech.includes("-") && formik.touched.primarytech
                                    ? `success`
                                    : formik.values.primarytech.includes("-") && formik.touched.primarytech
                                    ? `danger`
                                    : ``
                                }`}
                              id="dropdown-basic"
                              className="w-100"
                            >
                              {formik.values.primarytech}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                            {Object.keys(pre_requisite.technologies).map(
                              (tech, index) => {
                                return (
                                  <Fragment key={index}>
                                    <Dropdown.Item
                                      active={formik.values.primarytech.includes(tech)}
                                      onClick={() => formik.setFieldValue('primarytech',tech)}
                                    >
                                      {tech}
                                    </Dropdown.Item>
                                    {Object.keys(pre_requisite.technologies).length -
                                      1 >
                                      index && <Dropdown.Divider />}
                                  </Fragment>
                                );
                              }
                            )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        <FormCheck
                          type="checkbox"
                          label="Enter manually."
                          onClick={() => {
                            setPrimaryTechIsChecked(!ptIsChecked);
                            setPrimarySkillIsChecked(!psIsChecked);
                          }}
                        />
                      </Col>
                      <Col md="6" className="my-1">
                        {(ptIsChecked || psIsChecked) && (
                          <FormGroup>
                            {ptIsChecked && (
                              <FormLabel>
                                <b>Enter the Skill</b>
                              </FormLabel>
                            )}
                            <FormControl
                              type="number"
                              name="password"
                              placeholder={ptIsChecked ? "" : "Enter the Skill"}
                            />
                            <div className="invalid-feedback">
                              password is required
                            </div>
                          </FormGroup>
                        )}
                        {!ptIsChecked && !psIsChecked && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                             name="primaryskill"
                             onBlur={formik.handleBlur}
                               variant={`outline-${
                                 !formik.touched.primaryskill
                                     ? `primary`
                                   : !formik.values.primaryskill.includes("-") && formik.touched.primaryskill
                                   ? `success`
                                   : formik.values.primaryskill.includes("-") && formik.touched.primaryskill
                                   ? `danger`
                                   : ``
                               }`}
                              className="w-100"
                            >
                            {formik.values.primaryskill}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                            {!formik.values.primarytech.includes('-') &&
                              pre_requisite.technologies[formik.values.primarytech].map(
                                (skill, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item active={formik.values.primaryskill.includes(skill)} onClick={() => formik.setFieldValue('primaryskill',skill)} >{skill}</Dropdown.Item>
                                      {pre_requisite.technologies[formik.values.primarytech]
                                        .length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {!ptIsChecked && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            onClick={() =>
                              setPrimarySkillIsChecked(!psIsChecked)
                            }
                          />
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <FormLabel>
                      <b>Secondary Skills</b>
                    </FormLabel>
                    <Row>
                      <Col md="6" className="my-1">
                        {stIsChecked && (
                          <FormGroup>
                            <FormLabel>
                              <b>Enter the technology</b>
                            </FormLabel>
                            <FormControl type="number" name="password" />
                            <div className="invalid-feedback">
                              password is required
                            </div>
                          </FormGroup>
                        )}
                        {!stIsChecked && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                              name="secondarytech"
                              onBlur={formik.handleBlur}
                                variant={`outline-${
                                  !formik.touched.secondarytech
                                      ? `primary`
                                    : !formik.values.secondarytech.includes("-") && formik.touched.secondarytech
                                    ? `success`
                                    : formik.values.secondarytech.includes("-") && formik.touched.secondarytech
                                    ? `danger`
                                    : ``
                                }`}
                              className="w-100"
                            >
                             {formik.values.secondarytech}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                            {Object.keys(pre_requisite.technologies).map(
                              (tech, index) => {
                                return (
                                  <Fragment key={index}>
                                    <Dropdown.Item
                                    active={formik.values.secondarytech.includes(tech)}
                                      onClick={() => formik.setFieldValue('secondarytech',tech)}
                                    >
                                      {tech}
                                    </Dropdown.Item>
                                    {Object.keys(pre_requisite.technologies).length -
                                      1 >
                                      index && <Dropdown.Divider />}
                                  </Fragment>
                                );
                              }
                            )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        <FormCheck
                          type="checkbox"
                          label="Enter manually."
                          onClick={() => {
                            setSecondaryTechIsChecked(!stIsChecked);
                            setSecondarySkillIsChecked(!psIsChecked);
                          }}
                        />
                      </Col>
                      <Col md="6" className="my-1">
                        {(stIsChecked || ssIsChecked) && (
                          <FormGroup>
                            {stIsChecked && (
                              <FormLabel>
                                <b>Enter the Skill</b>
                              </FormLabel>
                            )}
                            <FormControl
                              type="text"
                              name="password"
                              placeholder={stIsChecked ? "" : "Enter the Skill"}
                            />
                            <div className="invalid-feedback">
                              password is required
                            </div>
                          </FormGroup>
                        )}
                        {!stIsChecked && !ssIsChecked && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                              name="secondaryskill"
                              onBlur={formik.handleBlur}
                                variant={`outline-${
                                  !formik.touched.secondaryskill
                                      ? `primary`
                                    : !formik.values.secondaryskill.includes("-") && formik.touched.secondaryskill
                                    ? `success`
                                    : formik.values.secondaryskill.includes("-") && formik.touched.secondaryskill
                                    ? `danger`
                                    : ``
                                }`}
                              className="w-100"
                            >
                             {formik.values.secondaryskill}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                            {!formik.values.secondarytech.includes('-') &&
                              pre_requisite.technologies[formik.values.secondarytech].map(
                                (skill, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item active={formik.values.secondaryskill.includes(skill)}  onClick={() => formik.setFieldValue('secondaryskill',skill)}>{skill}</Dropdown.Item>
                                      {pre_requisite.technologies[formik.values.secondarytech]
                                        .length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {!stIsChecked && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            onClick={() =>
                              setSecondarySkillIsChecked(!ssIsChecked)
                            }
                          />
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col className="text-center">
                  <Button
                    variant="primary"
                    className={`my-3 ${sm ? `w-100` : `w-75`}`}
                  >
                    Submit
                  </Button>
                </Col>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      )}
    </Fragment>
  );
};
export default CreateDemand;
