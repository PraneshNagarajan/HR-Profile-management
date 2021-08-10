import {
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Fragment, useState } from "react";
import { FaUnlockAlt } from "react-icons/fa";
import { fireAuth, firestore } from "../firebase";
import { useFormik } from "formik";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { AuthActions } from "../Redux/AuthenticationSlice";
import { useDispatch } from "react-redux";
var CryptoJS = require("crypto-js");

const formValidation = (field) => {
  const errors = {};
  if (!field.username) {
    errors.username = "*Required";
  }
  if (!field.answer1) {
    errors.answer1 = "*Required";
  }
  if (!field.answer2) {
    errors.answer2 = "*Required";
  }
  return errors;
};

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const [authStatus, setAuthStatus] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [db_question1, setDB_Question1] = useState("");
  const [db_question2, setDB_Question2] = useState("");
  const sm = useMediaQuery({ maxWidth: 768 });

  const onResetPasswordhandler = () => {
    fireAuth
      .sendPasswordResetEmail(formik.values.username)
      .then((res) => {
        setAuthStatus(true);
        setAuthMsg(
          "We have sent a link to reset your password to your mail. Please check it.."
        );
        setTimeout(() => {
          setAuthMsg("");
        }, 5000);
      })
      .catch((err) => {
        setAuthStatus(false);
        setAuthMsg(String(err));
        setTimeout(() => {
          setAuthMsg("");
        }, 5000);
      });
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      answer1: "",
      answer2: "",
    },
    validate: formValidation,
    onSubmit: (value) => {
      firestore
        .collection("Employee-Info")
        .doc(value.username)
        .get()
        .then((documentSnapshot) => {
          const auth_info = documentSnapshot.get("password-management");
          try {
            const decrpted_answer1 = JSON.parse(
              CryptoJS.AES.decrypt(
                auth_info.answer1,
                String(value.answer1.trim())
              ).toString(CryptoJS.enc.Utf8)
            );
            const decrpted_answer2 = JSON.parse(
              CryptoJS.AES.decrypt(
                auth_info.answer2,
                String(value.answer2.trim())
              ).toString(CryptoJS.enc.Utf8)
            );
            onResetPasswordhandler();
          } catch (err) {
            setAuthStatus(false);
            setAuthMsg("Error: Answers didn't match");
          }
        })
        .catch((err) => {
          setAuthStatus(false);
          setAuthMsg(String(err));
        });
    },
  });

  useEffect(() => {
    if (formik.values.username.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        firestore
          .collection("Employee-Info")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setAuthMsg("");
              if (doc.id === formik.values.username) {
                firestore
                  .collection("Employee-Info")
                  .doc(formik.values.username)
                  .get()
                  .then((documentSnapshot) => {
                    const auth_info = documentSnapshot.get(
                      "password-management"
                    );
                    setDB_Question1(auth_info.question1);
                    setDB_Question2(auth_info.question2);
                    setIsLoading(false);
                    setAuthStatus(true);
                  })
                  .catch((err) => {
                    setAuthStatus(false);
                    setAuthMsg(String(err));
                  });
              } else {
                setIsLoading(false);
                setAuthStatus(false);
                setAuthMsg("Invalid user name or User name doesn't exists");
              }
            });
          });
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [formik.values.username]);

  useEffect(() => {
    const flag = authMsg.length > 0;
    dispatch(AuthActions.getMsg(flag));
  }, [authMsg]);

  return (
    <Fragment>
      <div className="logo-circle shadow">
        <FaUnlockAlt
          className="mt-3"
          style={{ width: "60px", height: "60px" }}
        />
      </div>
      <h1 className="mt-5  text-center text-primary">Reset Password</h1>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup className={sm ? "mb-2" : ""}>
            <FormLabel>
              <b>Enter your Username</b>
            </FormLabel>
            <FormControl
              type="text"
              name="username"
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              isValid={formik.touched.username && !formik.errors.username}
              isInvalid={formik.touched.username && formik.errors.username}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-danger">
                {" "}
                {authMsg.length > 0 ? "" : formik.errors.username}{" "}
              </p>
            )}
          </FormGroup>

          {db_question1.length > 0 && (
            <Fragment>
              <FormGroup className="my-3">
                <FormLabel>
                  <b>{sm ? "Q" : "Security Question"}1: </b>({db_question1})
                </FormLabel>
                <FormControl
                  type="password"
                  name="answer1"
                  value={formik.values.answer1}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isValid={formik.touched.answer1 && !formik.errors.answer1}
                  isInvalid={formik.touched.answer1 && formik.errors.answer1}
                />
                {formik.touched.answer1 && formik.errors.answer1 && (
                  <p className="text-danger">
                    {" "}
                    {authMsg.length > 0 ? "" : formik.errors.answer1}{" "}
                  </p>
                )}
              </FormGroup>
              <FormGroup className="my-2">
                <FormLabel>
                  <b>{sm ? "Q" : "Security Question"}2: </b>({db_question2})
                </FormLabel>
                <FormControl
                  type="password"
                  name="answer2"
                  value={formik.values.answer2}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  isValid={formik.touched.answer2 && !formik.errors.answer2}
                  isInvalid={formik.touched.answer2 && formik.errors.answer2}
                />
                {formik.touched.answer2 && formik.errors.answer2 && (
                  <p className="text-danger">
                    {" "}
                    {authMsg.length > 0 ? "" : formik.errors.answer2}{" "}
                  </p>
                )}
              </FormGroup>
            </Fragment>
          )}

          <div>
            {!isLoading && (
              <Button
                type="submit"
                className="w-100 mt-2"
                disabled={!(formik.dirty && formik.isValid)}
              >
                <b>Submit</b>
              </Button>
            )}
            {isLoading && (
              <Button variant="primary" className="w-100 mt-2" disabled>
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
          </div>
          {authMsg.length > 0 && (
            <Fragment>
              <Alert
                variant={authStatus ? "success" : "danger"}
                className="mt-3"
              >
                <b>{authMsg}</b>
              </Alert>
            </Fragment>
          )}
        </Form>
      </Card.Body>
    </Fragment>
  );
};

export default ResetPasswordPage;
