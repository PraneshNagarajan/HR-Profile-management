import { useFormik } from "formik";
import { useState } from "react";
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
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { InfoActions } from "../Redux/EmployeeInfoSlice";

const initialValues = {
  firstname: "",
  lastname: "",
  fathername: "",
  mothername: "",
  dob: "",
  gender: "",
  age: 0,
  email1: "",
  email2: "",
  phone1: "",
  phone2: "",
};

const validate = (value) => {
  const errors = {};
  if (!value.firstname) {
    errors.firstname = "*Required.";
  } else if (!new RegExp("^[A-Za-z]*$").test(value.firstname)) {
    errors.firstname = "*Alphabets Only.";
  }

  if (!value.lastname) {
    errors.lastname = "*Required.";
  } else if (!new RegExp("^[A-Za-z]*$").test(value.lasstname)) {
    errors.firstname = "*Alphabets Only.";
  }

  if (!value.fathername) {
    errors.fathername = "*Required.";
  } else if (!new RegExp("^[A-Za-z]*$").test(value.fathername)) {
    errors.firstname = "*Alphabets Only.";
  }

  if (!value.mothername) {
    errors.mothername = "*Required.";
  } else if (!new RegExp("^[A-Za-z]*$").test(value.mothername)) {
    errors.firstname = "*Alphabets Only.";
  }

  if (!value.dob) {
    errors.dob = "*Required.";
  }

  if (!value.gender) {
    errors.gender = "*Required.";
  }

  if (!value.age) {
    errors.age = "*Required.";
  }

  if (!value.phone1) {
    errors.phone1 = "*Required.";
  } else if (String(value.phone1).length > 14) {
    errors.phone1 =
      "*Phone number must be with in 15 charcaters with country code.";
  } else if (!new RegExp("^[0-9]{1,3}[-]{1}").test(value.phone1)) {
    errors.phone1 = "*Please enter hypen after country code.";
  } else if (!new RegExp("[0-9]{7,10}$").test(value.phone1)) {
    errors.phone1 = "*Invalid Format (Numbers Only).";
  }

  if (value.phone2) {
    if (String(value.phone2).length > 14) {
      errors.phone2 =
        "*Phone number must be with in 15 charcaters with country code.";
    } else if (!new RegExp("^[0-9]{1,3}[-]{1}").test(value.phone2)) {
      errors.phone2 = "*Please enter hypen after country code.";
    } else if (!new RegExp("[0-9]{7,10}$").test(value.phone2)) {
      errors.phone2 = "*Invalid Format (Numbers Only).";
    }
  }

  if (!value.email1) {
    errors.email1 = "*Required.";
  } else if (
    !new RegExp(
      "^[A-Za-z]{1}[A-Za-z0-9_.]+[@]{1}[A-Za-z]+[.]{1}[A-Za-z]{2,3}$"
    ).test(value.email1)
  ) {
    errors.email1 = "*Invalid Format.";
  }
  if (value.email2) {
    if (
      !new RegExp(
        "^[A-Za-z]{1}[A-Za-z0-9_.]+[@]{1}[A-Za-z]+[.]{1}[A-Za-z]{2,3}$"
      ).test(value.email2)
    ) {
      errors.email2 = "*Invalid Format.";
    }
  }
  return errors;
};
const PersonalTabContent = (props) => {
  const date = new Date();
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues,
    validate,
  });
  const [selectedGender, setSelectedGender] = useState("- Select Gender -");
  const setGender = (value) => {
    formik.values.gender = value;
    setSelectedGender(value);
  };

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
                    max={
                      date.getFullYear() -
                      21 +
                      "-" +
                      (date.getMonth() > 9
                        ? date.getMonth() + 1
                        : "0" + (date.getMonth() + 1)) +
                      "-" +
                      date.getDate()
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.errors.dob && formik.touched.dob}
                    isValid={!formik.errors.dob && formik.touched.dob}
                  />
                  <div className="invalid-feedback">{formik.errors.dob}</div>
                </FormGroup>
              </Col>
              <Col md="4" className="mb-5 mt-2">
                <FormLabel>Gender</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    variant={`outline-${
                      !formik.touched.gender
                        ? `primary`
                        : !selectedGender.includes("-") && formik.touched.gender
                        ? `success`
                        : selectedGender.includes("-") && formik.touched.gender
                        ? `danger`
                        : ``
                    }`}
                    className="w-100 text-dark"
                    name="gender"
                    onBlur={formik.handleBlur}
                  >
                    {selectedGender}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item onClick={(e) => setGender("Male")}>
                      Male
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={(e) => setGender("Female")}>
                      Female
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={(e) => setGender("Others")}>
                      Others
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {selectedGender.includes("-") && formik.touched.gender && (
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
                    min="21"
                    max="120"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.age &&
                      (formik.touched.age || formik.values.age >= 21)
                    }
                    isValid={
                      !formik.errors.age &&
                      (formik.touched.age || formik.values.age >= 21)
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.age}</div>
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.phone1 &&
                      (formik.touched.email1 || formik.values.email1.length > 0)
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
                disabled={!(formik.dirty && formik.isValid)}
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
