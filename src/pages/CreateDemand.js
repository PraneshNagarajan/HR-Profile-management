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
  Spinner
} from "react-bootstrap";
import { Fragment, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./CreateDemand.css";
import Spinners from "../components/Spinners";
import Alerts from '../components/Alert'
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { firestore } from "../firebase";
import { useDispatch } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";

const CreateDemand = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.auth);
  const [ptIsChecked, setPrimaryTechIsChecked] = useState(false);
  const [psIsChecked, setPrimarySkillIsChecked] = useState(false);
  const [stIsChecked, setSecondaryTechIsChecked] = useState(false);
  const [ssIsChecked, setSecondarySkillIsChecked] = useState(false);
  const [clientIsChecked, setClientIsChecked] = useState(false);
  const [end_clientIsChecked, setEndClientIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pre_requisite = useSelector((state) => state.demandPreRequisite);

  const formik = useFormik({
    initialValues: {
      recruiter: "- Select the Recruiter -",
      clientname: "- Select the Client -",
      endclientname: "- Select the End-Client -",
      location: "",
      panlocation: "",
      type: "- Select the type -",
      demand: 1,
      demandallot: "",
      primarytech: "- Select the Techonology -",
      primaryskill: "- Select the Skill -",
      secondarytech: "- Select the Techonology -",
      secondaryskill: "- Select the Skill -",
    },
    validate: (value) => {
      const errors = {};
      if (value.recruiter.includes("-")) {
        errors.recruiter = "*Required.";
      }

      if (value.clientname.includes("-") || !value.clientname) {
        errors.clientname = "*Required.";
      } else if (!new RegExp("^^[A-Za-z_ ]+$").test(value.clientname)) {
        errors.clientname =
          'Alphabets whitespace and "_" character only allowd.';
      }

      if (value.endclientname.includes("-") || !value.endclientname) {
        errors.endclientname = "*Required.";
      } else if (!new RegExp("^[A-Za-z_ ]+$").test(value.endclientname)) {
        errors.endclientname =
          'Alphabets whitespace and "_" character only allowd.';
      }

      if (!value.location) {
        errors.location = "*Required.";
      } else if (!new RegExp("^[A-Za-z_ ]+$").test(value.location)) {
        errors.location = 'Alphabets whitespace and "_" character only allowd.';
      }

      if (!value.panlocation) {
        errors.panlocation = "*Required.";
      } else if (!new RegExp("^[A-Za-z_ ]+$").test(value.panlocation)) {
        errors.panlocation =
          'Alphabets whitespace and "_" character only allowd.';
      }

      if (value.type.includes("-")) {
        errors.type = "*Required.";
      }

      if (value.demand <= 0) {
        errors.demand = "*Value must be greater than 0.";
      }

      if (!value.demandallot) {
        errors.demandallot = "*Required.";
      }

      if (value.primarytech.includes("-") || !value.primarytech) {
        errors.primarytech = "*Required.";
      } else if (!new RegExp("^[A-Za-z_ ]+$").test(value.primarytech)) {
        errors.primarytech =
          'Alphabets whitespace and "_" character only allowd.';
      }

      if (value.primaryskill.includes("-") || !value.primaryskill) {
        errors.primaryskill = "*Required.";
      } else if (!new RegExp("^[A-Za-z_ ]+$").test(value.primaryskill)) {
        errors.primaryskill =
          'Alphabets whitespace and "_" character only allowd.';
      }

      if (value.secondarytech.includes("-") || !value.secondarytech) {
        errors.secondarytech = "*Required.";
      } else if (!new RegExp("^[A-Za-z_ ]+$").test(value.secondarytech)) {
        errors.secondarytech =
          'Alphabets whitespace and "_" character only allowd.';
      }

      if (value.secondaryskill.includes("-") || !value.secondaryskill) {
        errors.secondaryskill = "*Required.";
      } else if (!new RegExp("^[A-Za-z_ ]+$").test(value.secondaryskill)) {
        errors.secondaryskill =
          'Alphabets whitespace and "_" character only allowd.';
      }
      return errors;
    },
    onSubmit: (value) => {
      setIsLoading(true)
      firestore
        .collection("Demands")
        .doc(loggedUser.email)
        .update({
          ["F" + loggedUser.id + new Date().getTime()]: {
            ...value,
          },
        })
        .then(() => {
          setIsLoading(false)
          dispatch(AlertActions.handleShow({msg: 'Data added successfully.', flag: true}))
        })
        .catch((err) => {
          setIsLoading(false)
          if (String(err).includes("No document to update")) {
            firestore
              .collection("Demands")
              .doc(loggedUser.email)
              .set({
                ["F" + loggedUser.id + new Date().getTime()]: {
                  ...value,
                },
              })
              .then(() => {
                dispatch(AlertActions.handleShow({msg: 'Data added successfully.', flag: true}))
              }).catch(err => {
                dispatch(AlertActions.handleShow({msg: 'Data added failed.', flag: false}))
              })
          } else {
            dispatch(AlertActions.handleShow({msg: 'Data added failed.', flag: false}))
          }
        });
    },
  });

  return (
    <Fragment>
      {(!Object.values(pre_requisite.clients).length > 0) && (
        <Spinners />
      )}
      <Alerts />
      {Object.values(pre_requisite.clients).length > 0 && (
        <Container className="d-flex justify-content-center ">
          <Card className={`my-3 ${sm ? `w-100` : `w-75`}`}>
            <Card.Header className="bg-primary text-center text-white">
              <h4>Create Demand</h4>
            </Card.Header>
            <Card.Body className="mb-4">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
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
                                ? `primary`
                                : !formik.values.recruiter.includes("-") &&
                                  formik.touched.recruiter
                                ? `success`
                                : formik.values.recruiter.includes("-") &&
                                  formik.touched.recruiter
                                ? `danger`
                                : ``
                            }`}
                            onBlur={formik.handleBlur}
                            className="w-100"
                          >
                            {formik.values.recruiter}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            {pre_requisite.recruiters.map(
                              (recruiter, index) => {
                                return (
                                  <Fragment key={index}>
                                    <Dropdown.Item
                                      className="text-center"
                                      onClick={() => {
                                        formik.setFieldValue(
                                          "recruiter",
                                          recruiter.name
                                        );
                                      }}
                                    >
                                      {recruiter.name}
                                    </Dropdown.Item>
                                    {index <
                                      pre_requisite.recruiters.length - 1 && (
                                      <Dropdown.Divider />
                                    )}
                                  </Fragment>
                                );
                              }
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                        {formik.errors.recruiter &&
                          formik.touched.recruiter && (
                            <div className="text-danger">
                              {formik.errors.recruiter}
                            </div>
                          )}
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
                            onBlur={formik.handleBlur}
                          />
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
                                : !formik.values.clientname.includes("-") &&
                                  formik.touched.clientname
                                ? `success`
                                : formik.values.clientname.includes("-") &&
                                  formik.touched.clientname
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
                                      active={formik.values.clientname.includes(
                                        client
                                      )}
                                      onClick={() => {
                                        formik.setFieldValue(
                                          "clientname",
                                          client
                                        );
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
                      {formik.errors.clientname &&
                        formik.touched.clientname && (
                          <div className="text-danger">
                            {formik.errors.clientname}
                          </div>
                        )}
                      <FormCheck
                        type="checkbox"
                        label="Enter manually."
                        onClick={() => {
                          setClientIsChecked(!clientIsChecked);
                          setEndClientIsChecked(!clientIsChecked);
                          formik.setFieldValue(
                            "clientname",
                            "- Select the Client -"
                          );
                          formik.setFieldValue(
                            "endclientname",
                            "- Select the EndClient -"
                          );
                        }}
                      />
                    </Col>

                    <Col md="6" className="my-2">
                      <FormLabel>
                        <b>End Client Name</b>
                      </FormLabel>
                      {end_clientIsChecked && (
                        <FormGroup>
                          <FormControl
                            type="text"
                            name="endclientname"
                            isInvalid={
                              formik.errors.endclientname &&
                              (formik.touched.endclientname ||
                                formik.values.endclientname.length > 0)
                            }
                            isValid={
                              !formik.errors.endclientname &&
                              (formik.touched.endclientname ||
                                formik.values.endclientname.length > 0)
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
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
                                : !formik.values.endclientname.includes("-") &&
                                  formik.touched.endclientname
                                ? `success`
                                : formik.values.endclientname.includes("-") &&
                                  formik.touched.endclientname
                                ? `danger`
                                : ``
                            }`}
                            className="w-100"
                          >
                            {formik.values.endclientname}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            {!formik.values.clientname.includes("-") &&
                              pre_requisite.clients[
                                formik.values.clientname
                              ].map((endclient, index) => {
                                return (
                                  <Fragment key={index}>
                                    <Dropdown.Item
                                      onClick={() =>
                                        formik.setFieldValue(
                                          "endclientname",
                                          endclient
                                        )
                                      }
                                      active={formik.values.endclientname.includes(
                                        endclient
                                      )}
                                    >
                                      {endclient}
                                    </Dropdown.Item>
                                    {pre_requisite.clients[
                                      formik.values.clientname
                                    ].length -
                                      1 >
                                      index && <Dropdown.Divider />}
                                  </Fragment>
                                );
                              })}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                      {formik.errors.endclientname &&
                        formik.touched.endclientname && (
                          <div className="text-danger">
                            {formik.errors.endclientname}
                          </div>
                        )}
                      {!clientIsChecked && (
                        <FormCheck
                          type="checkbox"
                          label="Enter manually."
                          onClick={() => {
                            setEndClientIsChecked(!end_clientIsChecked);
                            formik.setFieldValue(
                              "endclientname",
                              "- Select the EndClient -"
                            );
                          }}
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
                        <FormControl
                          type="text"
                          name="location"
                          isInvalid={
                            formik.errors.location && formik.touched.location
                          }
                          isValid={
                            !formik.errors.location && formik.touched.location
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.location && formik.touched.location && (
                          <div className="text-danger">
                            {" "}
                            {formik.errors.location}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Pan Location</b>
                        </FormLabel>
                        <FormControl
                          type="text"
                          name="panlocation"
                          isInvalid={
                            formik.errors.panlocation &&
                            formik.touched.panlocation
                          }
                          isValid={
                            !formik.errors.panlocation &&
                            formik.touched.panlocation
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.panlocation &&
                          formik.touched.panlocation && (
                            <div className="text-danger">
                              {" "}
                              {formik.errors.panlocation}
                            </div>
                          )}
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
                                : !formik.values.type.includes("-") &&
                                  formik.touched.type
                                ? `success`
                                : formik.values.type.includes("-") &&
                                  formik.touched.type
                                ? `danger`
                                : ``
                            }`}
                            className="w-100"
                          >
                            {formik.values.type}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            <Dropdown.Item
                              onClick={() =>
                                formik.setFieldValue("type", "Full TIme")
                              }
                            >
                              Full Time
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                formik.setFieldValue("type", "Part TIme")
                              }
                            >
                              Part Time
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        {formik.errors.type && formik.touched.type && (
                          <div className="text-danger">
                            {formik.errors.type}
                          </div>
                        )}
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
                        <FormControl
                          type="number"
                          name="demand"
                          min="1"
                          value={formik.values.demand}
                          isInvalid={
                            formik.errors.demand && formik.touched.demand
                          }
                          isValid={
                            !formik.errors.demand && formik.touched.demand
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.demand && formik.touched.demand && (
                          <div className="text-danger">
                            {formik.errors.demand}
                          </div>
                        )}
                      </FormGroup>{" "}
                    </Col>
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Date of Demand Allocation</b>
                        </FormLabel>
                        <FormControl
                          type="date"
                          name="demandallot"
                          isInvalid={
                            formik.errors.demandallot &&
                            formik.touched.demandallot
                          }
                          isValid={
                            !formik.errors.demandallot &&
                            formik.touched.demandallot
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.demandallot &&
                          formik.touched.demandallot && (
                            <div className="text-danger">
                              {formik.errors.demandallot}
                            </div>
                          )}
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
                            <FormControl
                              type="text"
                              name="primarytech"
                              isInvalid={
                                formik.errors.primarytech &&
                                formik.touched.primarytech
                              }
                              isValid={
                                !formik.errors.primarytech &&
                                formik.touched.primarytech
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
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
                                  : !formik.values.primarytech.includes("-") &&
                                    formik.touched.primarytech
                                  ? `success`
                                  : formik.values.primarytech.includes("-") &&
                                    formik.touched.primarytech
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
                                        active={formik.values.primarytech.includes(
                                          tech
                                        )}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "primarytech",
                                            tech
                                          )
                                        }
                                      >
                                        {tech}
                                      </Dropdown.Item>
                                      {Object.keys(pre_requisite.technologies)
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
                        {formik.errors.primarytech &&
                          formik.touched.primarytech && (
                            <div className="text-danger">
                              {formik.errors.primarytech}
                            </div>
                          )}
                        <FormCheck
                          type="checkbox"
                          label="Enter manually."
                          onClick={() => {
                            setPrimaryTechIsChecked(!ptIsChecked);
                            setPrimarySkillIsChecked(!ptIsChecked);
                            formik.setFieldValue(
                              "primarytech",
                              "- Select the Technology -"
                            );
                            formik.setFieldValue(
                              "primaryskill",
                              "- Select the Skill -"
                            );
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
                              type="text"
                              name="primaryskill"
                              isInvalid={
                                formik.errors.primaryskill &&
                                formik.touched.primaryskill
                              }
                              isValid={
                                !formik.errors.primaryskill &&
                                formik.touched.primaryskill
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
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
                                  : !formik.values.primaryskill.includes("-") &&
                                    formik.touched.primaryskill
                                  ? `success`
                                  : formik.values.primaryskill.includes("-") &&
                                    formik.touched.primaryskill
                                  ? `danger`
                                  : ``
                              }`}
                              className="w-100"
                            >
                              {formik.values.primaryskill}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                              {!formik.values.primarytech.includes("-") &&
                                pre_requisite.technologies[
                                  formik.values.primarytech
                                ].map((skill, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item
                                        active={formik.values.primaryskill.includes(
                                          skill
                                        )}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "primaryskill",
                                            skill
                                          )
                                        }
                                      >
                                        {skill}
                                      </Dropdown.Item>
                                      {pre_requisite.technologies[
                                        formik.values.primarytech
                                      ].length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                })}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {formik.errors.primaryskill &&
                          formik.touched.primaryskill && (
                            <div className="text-danger">
                              {formik.errors.primaryskill}
                            </div>
                          )}
                        {!ptIsChecked && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            onClick={() => {
                              formik.setFieldValue(
                                "primaryskill",
                                "- Select the Skill -"
                              );
                              setPrimarySkillIsChecked(!psIsChecked);
                            }}
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
                            <FormControl
                              type="text"
                              name="secondarytech"
                              isInvalid={
                                formik.errors.secondarytech &&
                                formik.touched.secondarytech
                              }
                              isValid={
                                !formik.errors.secondarytech &&
                                formik.touched.secondarytech
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
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
                                  : !formik.values.secondarytech.includes(
                                      "-"
                                    ) && formik.touched.secondarytech
                                  ? `success`
                                  : formik.values.secondarytech.includes("-") &&
                                    formik.touched.secondarytech
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
                                        active={formik.values.secondarytech.includes(
                                          tech
                                        )}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "secondarytech",
                                            tech
                                          )
                                        }
                                      >
                                        {tech}
                                      </Dropdown.Item>
                                      {Object.keys(pre_requisite.technologies)
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
                        {formik.errors.secondarytech &&
                          formik.touched.secondarytech && (
                            <div className="text-danger">
                              {formik.errors.secondarytech}
                            </div>
                          )}
                        <FormCheck
                          type="checkbox"
                          label="Enter manually."
                          onClick={() => {
                            setSecondaryTechIsChecked(!stIsChecked);
                            setSecondarySkillIsChecked(!stIsChecked);
                            formik.setFieldValue(
                              "secondarytech",
                              "- Select the Technology -"
                            );
                            formik.setFieldValue(
                              "secondaryskill",
                              "- Select the Skill -"
                            );
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
                              name="secondaryskill"
                              isInvalid={
                                formik.errors.secondaryskill &&
                                formik.touched.secondaryskill
                              }
                              isValid={
                                !formik.errors.secondaryskill &&
                                formik.touched.secondaryskill
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
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
                                  : !formik.values.secondaryskill.includes(
                                      "-"
                                    ) && formik.touched.secondaryskill
                                  ? `success`
                                  : formik.values.secondaryskill.includes(
                                      "-"
                                    ) && formik.touched.secondaryskill
                                  ? `danger`
                                  : ``
                              }`}
                              className="w-100"
                            >
                              {formik.values.secondaryskill}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                              {!formik.values.secondarytech.includes("-") &&
                                pre_requisite.technologies[
                                  formik.values.secondarytech
                                ].map((skill, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item
                                        active={formik.values.secondaryskill.includes(
                                          skill
                                        )}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "secondaryskill",
                                            skill
                                          )
                                        }
                                      >
                                        {skill}
                                      </Dropdown.Item>
                                      {pre_requisite.technologies[
                                        formik.values.secondarytech
                                      ].length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                })}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {formik.errors.secondaryskill &&
                          formik.touched.secondaryskill && (
                            <div className="text-danger">
                              {formik.errors.secondaryskill}
                            </div>
                          )}
                        {!stIsChecked && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            onClick={() => {
                              formik.setFieldValue(
                                "secondaryskill",
                                "- Select the Skill -"
                              );
                              setSecondarySkillIsChecked(!ssIsChecked);
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col className="text-center">
                  {!isLoading && (
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!(formik.dirty && formik.isValid)}
                      className={`my-3 ${sm ? `w-100` : `w-75`}`}
                    >
                      Submit
                    </Button>
                  )}
                  {isLoading && (
                    <Button
                      variant="primary"
                      className={`my-3 ${sm ? `w-100` : `w-75`}`}
                      disabled
                    >
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Loading...</span>
                    </Button>
                  )}
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
