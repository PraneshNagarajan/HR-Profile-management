import { useFormik } from "formik";
import { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Dropdown,
  FormControl,
  FormLabel,
  FormGroup,
  TabContent,
  Form,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { InfoActions } from "../Redux/EmployeeInfoSlice";

const validate = (value) => {
  const errors = {};
  if (!value.firstname) {
    errors.firstname = "*Required.";
  } else if (!new RegExp("^[A-Z ]+$").test(value.firstname)) {
    errors.firstname = "*Alphabets only allowed and must be in uppercase.";
  }

  if (!new RegExp("^[A-Z ]+$").test(value.lastname) && value.lastname) {
    errors.lastname = "*Alphabets only allowed and must be in uppercase.";
  }

  if (!value.fathername) {
    errors.fathername = "*Required.";
  } else if (!new RegExp("^[A-Z ]+$").test(value.fathername)) {
    errors.fathername = "*Alphabets only allowed and must be in uppercase.";
  }

  if (!value.mothername) {
    errors.mothername = "*Required.";
  } else if (!new RegExp("^[A-Z ]+$").test(value.mothername)) {
    errors.mothername = "*Alphabets only allowed and must be in uppercase.";
  }

  if (!value.dob) {
    errors.dob = "*Required.";
  }

  if (!value.gender) {
    errors.gender = "*Required.";
  }

  if (!value.phone1) {
    errors.phone1 = "*Required.";
  } else if (String(value.phone1).length > 14) {
    errors.phone1 =
      "*Phone number must be with in 15 charcaters with country code.";
  } else if (!new RegExp("^[+]").test(value.phone1)) {
    errors.phone1 = "*Please add '+' before country code.";
  } else if (!new RegExp("^[+][0-9]{1,3}[-]{1}").test(value.phone1)) {
    errors.phone1 = "*Please enter hypen after country code.";
  } else if (!new RegExp("[0-9]{7,10}$").test(value.phone1)) {
    errors.phone1 = "*Invalid Format (Numbers Only).";
  }

  if (value.phone2) {
    if (String(value.phone2).length > 14) {
      errors.phone2 =
        "*Phone number must be with in 15 charcaters with country code.";
    } else if (!new RegExp("^[+]").test(value.phone2)) {
      errors.phone2 = "*Please add '+' before country code.";
    } else if (!new RegExp("^[+][0-9]{1,3}[-]{1}").test(value.phone2)) {
      errors.phone2 = "*Please enter hypen after country code.";
    } else if (!new RegExp("[0-9]{7,10}$").test(value.phone2)) {
      errors.phone2 = "*Invalid Format (Numbers Only).";
    }
  }

  if (!value.email1) {
    errors.email1 = "*Required.";
  } else if (
    !new RegExp(
      "^[A-Za-z]{1}[A-Za-z0-9_.-]+[@]{1}[A-Za-z-]+[.]{1}[A-Za-z]{2,3}$"
    ).test(value.email1)
  ) {
    errors.email1 = "*Invalid Format.";
  }
  if (value.email2) {
    if (
      !new RegExp(
        "^[A-Za-z]{1}[A-Za-z0-9_.-]+[@]{1}[A-Za-z-]+[.]{1}[A-Za-z]{2,3}$"
      ).test(value.email2)
    ) {
      errors.email2 = "*Invalid Format.";
    }
  }
  return errors;
};
const PersonalTabContent = (props) => {
  const date = new Date();
  const dispatch = useDispatch();
  const infos = useSelector((state) => state.info);
  const sm = useMediaQuery({ maxWidth: 768 });
  const initialValues = {
    firstname: "",
    lastname: "",
    fathername: "",
    mothername: "",
    dob: "",
    gender:
      props.view.user || props.view.admin
        ? infos.personal.gender
        : "- Select Gender -",
    age: 20,
    email1: "",
    email2: "",
    phone1: "",
    phone2: "",
  };

  const formik = useFormik({
    initialValues:
      props.view.user || props.view.admin ? infos.personal : initialValues,
    validate,
  });

  useEffect(() => {
    if (infos.submitted) {
      formik.resetForm();
    }
  }, [infos.submitted]);

  return (
    <TabContent>
      <Card>
        <Card.Body className="mb-3">
          <Form>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="username">First Name</FormLabel>
                  <FormControl
                    type="text"
                    name="firstname"
                    readOnly={props.view.user || props.view.admin}
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.firstname &&
                      (formik.touched.firstname ||
                        formik.values.firstname.length > 0)
                    }
                    isValid={
                      !formik.errors.firstname &&
                      (formik.touched.firstname ||
                        formik.values.firstname.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik.errors.firstname}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="last name">Last Name</FormLabel>
                  <FormControl
                    type="text"
                    name="lastname"
                    readOnly={props.view.user || props.view.admin}
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.lastname &&
                      (formik.touched.lastname ||
                        formik.values.lastname.length > 0)
                    }
                    isValid={
                      !formik.errors.lastname &&
                      (formik.touched.lastname ||
                        formik.values.lastname.length > 0)
                    }
                  />
                  {!formik.touched.lastname && (
                    <div className="text-muted">optional</div>
                  )}
                  <div className="invalid-feedback">
                    {formik.errors.lastname}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="father name">Father Name</FormLabel>
                  <FormControl
                    type="text"
                    name="fathername"
                    readOnly={props.view.user || props.view.admin}
                    value={formik.values.fathername}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.fathername &&
                      (formik.touched.fathername ||
                        formik.values.fathername.length > 0)
                    }
                    isValid={
                      !formik.errors.fathername &&
                      (formik.touched.fathername ||
                        formik.values.fathername.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik.errors.fathername}{" "}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="mother name">Mother Name</FormLabel>
                  <FormControl
                    type="text"
                    name="mothername"
                    readOnly={props.view.user || props.view.admin}
                    value={formik.values.mothername}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.mothername &&
                      (formik.touched.mothername ||
                        formik.values.mothername.length > 0)
                    }
                    isValid={
                      !formik.errors.mothername &&
                      (formik.touched.mothername ||
                        formik.values.mothername.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik.errors.mothername}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="date of birth">Date of Birth</FormLabel>
                  <FormControl
                    type="date"
                    name="dob"
                    readOnly={props.view.user || props.view.admin}
                    value={formik.values.dob}
                    max={
                      date.getFullYear() -
                      20 +
                      "-" +
                      (date.getMonth() >= 9
                        ? date.getMonth() + 1
                        : "0" + date.getMonth()) +
                      "-" +
                      date.getDate()
                    }
                    onChange={(e) => {
                      const getAge = Math.floor(
                        (new Date() - new Date(e.target.value).getTime()) /
                          3.15576e10
                      );
                      formik.setFieldValue("age", getAge);
                      formik.setFieldValue("dob", e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.errors.dob && formik.touched.dob}
                    isValid={
                      (!formik.errors.dob && formik.touched.dob) ||
                      formik.values.dob.length > 0
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.dob}</div>
                </FormGroup>
              </Col>
              <Col md="4" className="mb-5 mt-2">
                <FormLabel>Gender</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={props.view.user || props.view.admin}
                    variant={`outline-${
                      !formik.touched.gender
                        ? props.view.user || props.view.admin
                          ? `secondary`
                          : `primary`
                        : !formik.values.gender.includes("-") &&
                          formik.touched.gender
                        ? `success`
                        : formik.values.gender.includes("-") &&
                          formik.touched.gender
                        ? `danger`
                        : ``
                    }`}
                    className="w-100 text-dark"
                    name="gender"
                    onBlur={formik.handleBlur}
                  >
                    {formik.values.gender}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={(e) => formik.setFieldValue("gender", "Male")}
                    >
                      Male
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => formik.setFieldValue("gender", "Female")}
                    >
                      Female
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => formik.setFieldValue("gender", "Others")}
                    >
                      Others
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {formik.values.gender.includes("-") && formik.touched.gender && (
                  <p className="text-danger" style={{ fontSize: ".9rem" }}>
                    *Required.
                  </p>
                )}
              </Col>
              <Col md="4" className="my-2">
                <FormGroup>
                  <FormLabel>Age</FormLabel>
                  <FormControl
                    name="age"
                    type="number"
                    min="20"
                    max="120"
                    value={formik.values.age}
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="phone 1">
                    Phone Number (Primary)
                  </FormLabel>
                  <FormControl
                    type="text"
                    name="phone1"
                    placeholder="+91-9999999999"
                    readOnly={props.view.admin}
                    value={formik.values.phone1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.phone1 &&
                      (formik.touched.phone1 || formik.values.phone1.length > 0)
                    }
                    isValid={
                      !formik.errors.phone1 &&
                      (formik.touched.phone1 || formik.values.phone1.length > 0)
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.phone1}</div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="phone 2">
                    Phone Number (Secondary)
                  </FormLabel>
                  <FormControl
                    type="text"
                    name="phone2"
                    placeholder="+91-9999999999"
                    readOnly={props.view.admin}
                    value={formik.values.phone2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.phone2 &&
                      (formik.touched.phone2 || formik.values.phone2.length > 0)
                    }
                    isValid={
                      !formik.errors.phone2 &&
                      (formik.touched.phone2 || formik.values.phone2.length > 0)
                    }
                  />
                  {!formik.touched.phone2 && (
                    <div className="text-muted">optional</div>
                  )}
                  <div className="invalid-feedback">{formik.errors.phone2}</div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="email 1">Email (primary)</FormLabel>
                  <FormControl
                    type="text"
                    name="email1"
                    readOnly={props.view.admin}
                    value={formik.values.email1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.email1 &&
                      (formik.touched.email1 || formik.values.email1.length > 0)
                    }
                    isValid={
                      !formik.errors.email1 &&
                      (formik.touched.email1 || formik.values.email1.length > 0)
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.email1}</div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel htmlFor="email 2">Email (secondary)</FormLabel>
                  <FormControl
                    type="text"
                    name="email2"
                    readOnly={props.view.admin}
                    value={formik.values.email2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.email2 &&
                      (formik.touched.email2 || formik.values.email2.length > 0)
                    }
                    isValid={
                      !formik.errors.email2 &&
                      (formik.touched.email2 || formik.values.email2.length > 0)
                    }
                  />
                  {!formik.touched.email2 && (
                    <div className="text-muted">optional</div>
                  )}
                  <div className="invalid-feedback">{formik.errors.email2}</div>
                </FormGroup>
              </Col>
            </Row>
            <div className={sm ? "" : "float-end"}>
              <Button
                className={sm ? "w-100" : ""}
                disabled={
                  props.view.admin
                    ? true
                    : props.view.user
                    ? !formik.isValid
                    : !(formik.dirty && formik.isValid)
                }
                onClick={(e) =>
                  dispatch(InfoActions.getPersonalInfo(formik.values))
                }
              >
                Save && Next
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </TabContent>
  );
};
export default PersonalTabContent;
