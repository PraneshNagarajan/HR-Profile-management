import { useState, Fragment } from "react";
import { useMediaQuery } from "react-responsive";
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
} from "react-bootstrap";
import { useFormik } from "formik";
var CryptoJS = require("crypto-js");

const questions = [
  "Which year did you completed your high school?",
  "Who is favourite sports player?",
  "Which is your favourite color?",
  "Where did you born?",
  "What was your favorite school teacher’s name?",
];

const SecurityContent = () => {
  const [selectedQuestion1, setQuestion1] = useState(
    "- Select your Security question -")
  const [selectedQuestion2, setQuestion2] = useState(
    "- Select your Security question -")
  const sm = useMediaQuery({ maxWidth: 768 });
  
  const formik = useFormik({
    initialValues: {
      question1: "",
      answer1: "",
      question2: "",
      answer2: "",
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
              <Col md={{ span: "5", offset: "1" }}>
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
                    {questions.map((ques,index) => {
                      return (
                        <Fragment key={index}>
                          <Dropdown.Item
                            onClick={(e) => {
                              setQuestion1(ques);
                            }}
                            active={selectedQuestion1.includes(ques)}
                          >
                            {ques}
                          </Dropdown.Item>
                          {index != questions.length-1 && <Dropdown.Divider />}
                        </Fragment>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                {selectedQuestion1.includes("?") && (
                  <div className="text-danger">{formik.errors.question1}</div>
                )}
              </Col>

              <Col md="5">
                <FormGroup>
                  <FormLabel htmlFor="Answer1">Answer1</FormLabel>
                  <FormControl
                    type="text"
                    name="answer1"
                    value={formik.values.answer1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.answer1 &&
                      (formik.touched.answer1 || formik.values.answer1.length > 0)
                    }
                    isValid={
                      !formik.errors.answer1 &&
                      (formik.touched.answer1 || formik.values.answer1.length > 0)
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.answer1}</div>
                </FormGroup>
              </Col>
            </Row>

            <Row className="my-5">
              <Col md={{ span: "5", offset: "1" }}>
                <FormLabel>Security Question 2</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    variant={`outline-${
                      !formik.touched.question2
                        ? `primary`
                        : selectedQuestion1.includes("?") &&
                          formik.touched.question2
                        ? `success`
                        : !selectedQuestion1.includes("?") &&
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
                    {questions.map((ques,index) => {
                      if (selectedQuestion1 != ques) {
                        return (
                          <Fragment key={index}>
                            <Dropdown.Item
                              onClick={(e) => {
                                setQuestion2(ques);
                              }}
                              active={selectedQuestion2.includes(ques)}
                            >
                              {ques}
                            </Dropdown.Item>
                            {index != questions.length-1 && <Dropdown.Divider />}
                          </Fragment>
                        );
                      }
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                {selectedQuestion1.includes("?") && (
                  <div className="text-danger">{formik.errors.question1}</div>
                )}
              </Col>
              <Col md="5">
                <FormGroup>
                  <FormLabel>Answer2</FormLabel>
                  <FormControl
                    type="text"
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
                  <div className="invalid-feedback">
                    {formik.errors.answer2}
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <div className={sm ? "" : "float-end"}>
              <Button
                className={sm ? "w-100" : ""}
                disabled={
                  !(formik.dirty && formik.isValid) 
                }
                type="submit"
              >
                Save && Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </TabContent>
  );
};
export default SecurityContent