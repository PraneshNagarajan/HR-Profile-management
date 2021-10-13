import { useState, Fragment } from "react";
import { useMediaQuery } from "react-responsive";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { AlertActions } from "../Redux/AlertSlice";
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
  Button,
  Spinner
} from "react-bootstrap";
import { useFormik } from "formik";
import { firestore } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { InfoActions } from "../Redux/EmployeeInfoSlice";
import { AuthActions } from "../Redux/AuthenticationSlice";
var CryptoJS = require("crypto-js");

const questions = [
  "Where did your mother born?",
  "Who is favourite sports player?",
  "What was your childhood nickname?",
  "What was your maths teacher name?",
  "What is your eldest cousin’s name?",
];

const initialValues = {
  answer1: "",
  answer2: "",
};

const SecurityContent = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [selectedQuestion1, setQuestion1] = useState(
    "- Select your Security question -"
  );
  const [selectedQuestion2, setQuestion2] = useState(
    "- Select your Security question -"
  );
  const [isVisibleField1, setIsVisibleField1] = useState(false);
  const [isVisibleField2, setIsVisibleField2] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const doc = useSelector((state) => state.auth.email);

  const onVisibleHandler = (field) => {
    if (field === "field1") {
      setIsVisibleField1(!isVisibleField1);
    } else {
      setIsVisibleField2(!isVisibleField2);
    }
  };

  const formik = useFormik({
    initialValues,
    validate: (value) => {
      const errors = {};
      if (!value.answer1) {
        errors.answer1 = "*Required.";
      }
      if (!value.answer2) {
        errors.answer2 = "*Required.";
      }
      return errors;
    },

    onSubmit: (value) => {
      setIsLoading(true)
      // Encrypt
      const ans1 = CryptoJS.AES.encrypt(
        JSON.stringify(value.answer1),
        value.answer1
      ).toString();
      const ans2 = CryptoJS.AES.encrypt(
        JSON.stringify(value.answer2),
        value.answer2
      ).toString();

      firestore
        .collection("Employee-Info")
        .doc(doc)
        .update({
          "password-management.question1": selectedQuestion1,
          "password-management.question2": selectedQuestion2,
          "password-management.answer1": ans1,
          "password-management.answer2": ans2,
          "password-management.status": true,
          "password-management.last_changed": new Date().toString(),
        })
        .then(() => {
          setIsLoading(false)
          dispatch(InfoActions.getSecurityFlag(true));
          dispatch(AuthActions.getSecurityStatus(true));
          dispatch(
            AlertActions.handleShow({
              msg: "Data added successfully.",
              flag: true,
            })
          );
        })
        .catch(() => {
          setIsLoading(false)
          dispatch(
            AlertActions.handleShow({
              msg: "Data added failed.",
              flag: false,
            })
          );
        });
    },
  });

  return (
    <TabContent>
      <Card>
        <Card.Body className="mb-5">
          <Form
            className="mb-5"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <Row className="my-2">
              <Col md={{ span: "5", offset: "1" }} className={sm ? "my-2" : ""}>
                <FormLabel>Security Question 1</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    variant={`outline-${
                      !formik.touched.question1
                        ? `primary`
                        : selectedQuestion1.includes("?") &&
                          formik.touched.question1
                        ? `success`
                        : !selectedQuestion1.includes("?") &&
                          formik.touched.question1
                        ? `danger`
                        : ``
                    }`}
                    name="question1"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {selectedQuestion1}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    {questions.map((ques, index) => {
                      return (
                        <Fragment key={index}>
                          <Dropdown.Item
                            onClick={(e) => {
                              setQuestion1(ques);
                              formik.setFieldValue("question1", ques);
                            }}
                            active={selectedQuestion1.includes(ques)}
                          >
                            {ques}
                          </Dropdown.Item>
                          {index !== questions.length - 1 && (
                            <Dropdown.Divider />
                          )}
                        </Fragment>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                {selectedQuestion1.includes("-") &&
                  formik.touched.question1 && (
                    <div className="text-danger">*Required.</div>
                  )}
              </Col>

              <Col md="5">
                <FormGroup className="noShow">
                  <FormLabel htmlFor="Answer1">Answer1</FormLabel>
                  <FormControl
                    type={isVisibleField1 ? "text" : "password"}
                    name="answer1"
                    value={formik.values.answer1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.answer1 &&
                      (formik.touched.answer1 ||
                        formik.values.answer1.length > 0)
                    }
                    isValid={
                      !formik.errors.answer1 &&
                      (formik.touched.answer1 ||
                        formik.values.answer1.length > 0)
                    }
                  />
                  <span
                    className="float-end me-2"
                    style={{ position: "relative", marginTop: "-33px" }}
                  >
                    {isVisibleField1 && (
                      <FaRegEye
                        role="button"
                        onClick={(e) => onVisibleHandler("field1")}
                        style={{ color: "#0d6efd" }}
                      />
                    )}
                    {!isVisibleField1 && (
                      <FaRegEyeSlash
                        style={{ width: "5rem", height: "5rem" }}
                        role="button"
                        onClick={(e) => onVisibleHandler("field1")}
                        style={{ color: "red" }}
                      />
                    )}
                  </span>
                  <div className="invalid-feedback">
                    {formik.errors.answer1}
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <Row className={sm ? "" : "my-5"}>
              <Col md={{ span: "5", offset: "1" }} className={sm ? "my-2" : ""}>
                <FormLabel>Security Question 2</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    variant={`outline-${
                      !formik.touched.question2
                        ? `primary`
                        : selectedQuestion2.includes("?") &&
                          formik.touched.question2
                        ? `success`
                        : !selectedQuestion2.includes("?") &&
                          formik.touched.question2
                        ? `danger`
                        : ``
                    }`}
                    name="question2"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {selectedQuestion2}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    {questions.map((ques, index) => {
                      if (selectedQuestion1 !== ques) {
                        return (
                          <Fragment key={index}>
                            <Dropdown.Item
                              onClick={(e) => {
                                setQuestion2(ques);
                                formik.setFieldValue("question2", ques);
                              }}
                              active={selectedQuestion2.includes(ques)}
                            >
                              {ques}
                            </Dropdown.Item>
                            {index != questions.length - 1 && (
                              <Dropdown.Divider />
                            )}
                          </Fragment>
                        );
                      }
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                {formik.touched.question2 &&
                  selectedQuestion2.includes("-") && (
                    <div className="text-danger">*Required.</div>
                  )}
              </Col>
              <Col md="5">
                <FormGroup className="noShow">
                  <FormLabel>Answer2</FormLabel>
                  <FormControl
                    type={isVisibleField2 ? "text" : "password"}
                    name="answer2"
                    value={formik.values.answer2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.answer2 &&
                      (formik.touched.answer2 ||
                        formik.values.answer2.length > 0)
                    }
                    isValid={
                      !formik.errors.answer2 &&
                      (formik.touched.answer2 ||
                        formik.values.answer2.length > 0)
                    }
                  />
                  <span
                    className="float-end me-2"
                    style={{ position: "relative", marginTop: "-33px" }}
                  >
                    {isVisibleField2 && (
                      <FaRegEye
                        role="button"
                        onClick={() => onVisibleHandler("field2")}
                        style={{ color: "#0d6efd" }}
                      />
                    )}
                    {!isVisibleField2 && (
                      <FaRegEyeSlash
                        style={{ width: "5rem", height: "5rem" }}
                        role="button"
                        onClick={() => onVisibleHandler("field2")}
                        style={{ color: "red" }}
                      />
                    )}
                  </span>
                  <div className="invalid-feedback">
                    {formik.errors.answer2}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <div className={sm ? "mt-5" : "float-end"}>
              {!isLoading && (
                <Button
                  className={sm ? "w-100" : ""}
                  disabled={!(formik.dirty && formik.isValid) && props.view}
                  type="submit"
                >
                  Save && Submit
                </Button>
              )}
              {isLoading && (
                <Button variant="primary" className="w-100" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Uploading...
                  <span className="visually-hidden">Loading...</span>
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </TabContent>
  );
};
export default SecurityContent;
