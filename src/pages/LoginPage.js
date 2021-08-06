import "./LoginPage.css";
import { Fragment, useState } from "react";
import {
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { FaKey, FaReact } from "react-icons/fa";
import { BsShieldLockFill } from "react-icons/bs";
import { fireAuth, firestore } from "../firebase";
import { useFormik } from "formik";
import Timer from "../Timer";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";

const formValidation = (field) => {
  const errors = {};
  if (!field.username) {
    errors.username = "*Required";
  }

  if (!field.password) {
    errors.password = "*Required";
  }
  return errors;
};

const LoginPage = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const [chances, setChances] = useState(0);
  const [attempts, setAttempts] = useState(-1);
  const [disable, setDisable] = useState(false);
  const [timer, SetTimer] = useState();
  const [account_status, setAccoutStatus] = useState(false);

  const sm = useMediaQuery({ maxWidth: 768 });
  const md = useMediaQuery({ minWidth: 768, maxWidth: 992 });

  // useEffect(() => {
  //   if (authMsg.length > 0 && sm) {
  //     const timer = setTimeout(() => {
  //       setAuthMsg("");
  //     }, 3000);
  //   }
  // }, [authMsg, sm]);
  const authNotification = () => {
    setAccoutStatus(true);
    setAuthMsg(
      " Error: Your account has been locked due to multiple incorrect logins. Please contact your admin or reset your password."
    );
  };

  const updateAuthStatus = (doc, flag = false, attempt) => {
    firestore.collection("Employee-Info").doc(doc).update({
      "Auth-Info.attempts": attempt,
      "Auth-Info.invalid_attempt_timestamp": new Date().toString(),
      "Auth-Info.locked": flag,
    });
  };

  const updateAttemptStatus = (doc, chance) => {
    firestore
      .collection("Employee-Info")
      .doc(doc)
      .update({ "Auth-Info.chances": chance });
  };

  const calculatingDuration = (Atmp_time, flag) => {
    const duration = new Date().getTime() - new Date(Atmp_time).getTime();
    if (duration <= 30000 || !flag) {
      SetTimer(
        new Date().setSeconds(
          new Date().getSeconds() + (30000 - (flag ? duration : 0)) / 1000
        )
      );
      setAuthMsg("");
      setDisable(true);
      setTimeout(() => {
        setDisable(false);
      }, 30000 - (flag ? duration : 0));
    }
  };

  const checkDBStatus = (doc, attempt, flag) => {
    firestore
      .collection("Employee-Info")
      .doc(doc)
      .get()
      .then((documentSnapshot) => {
        const db_Chance = Number(documentSnapshot.get("Auth-Info.chances"));
        const db_Attempts = Number(documentSnapshot.get("Auth-Info.attempts"));
        if (!documentSnapshot.get("Auth-Info.locked")) {
          if (flag) {
            if (db_Chance + 1 <= 2) {
              setChances(db_Chance + 1);
              setAttempts(db_Attempts);
              updateAttemptStatus(doc, db_Chance + 1);
            } else {
              setChances(0);
              updateAttemptStatus(doc, 0);
              if (db_Attempts + 1 <= 2) {
                updateAuthStatus(doc, false, db_Attempts + 1);
                setAttempts(db_Attempts + 1);
                calculatingDuration(
                  documentSnapshot.get("Auth-Info.invalid_attempt_timestamp"),
                  false
                );
              } else {
                updateAuthStatus(doc, true, 3);
                authNotification();
              }
            }
          } else if (attempt >= 0 && attempt < 3) {
            updateAuthStatus(doc, false, attempt);
          } else {
            updateAuthStatus(doc, true, 3);
          }
          if (attempt > 0 && attempt < 3) {
            calculatingDuration(
              documentSnapshot.get("Auth-Info.invalid_attempt_timestamp"),
              flag
            );
          } else if (attempt > 1) {
            authNotification();
          }
        } else {
          authNotification();
        }
      });
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: formValidation,
    onSubmit: (value) => {
      fireAuth
        .signInWithEmailAndPassword(value.username, value.password)
        .then((res) => {
          firestore
            .collection("Employee-Info")
            .doc(value.username)
            .get()
            .then((documentSnapshot) => {
              if (documentSnapshot.get("Auth-Info.locked") === false) {
                setAuthStatus(true);
                setAuthMsg("Login Successfully !");
                firestore
                  .collection("Employee-Info")
                  .doc(value.username)
                  .update({
                    "Auth-Info.chances": 0,
                    "Auth-Info.attempts": 0,
                    "Auth-Info.locked": false,
                    "Auth-Info.login_status": "active",
                    "Auth-Info.invalid_attempt_timestamp": null,
                  });
              } else {
                authNotification();
              }
            });
        })
        .catch((err) => {
          setAuthStatus(false);
          if (
            String(err).includes("user") &&
            !String(err).includes("password")
          ) {
            formik.setValues({ username: "", password: "" });
          } else {
            formik.setFieldValue("password", "");
          }
          setAuthMsg(
            String(err).includes("temporarily disabled")
              ? String(err)
              : "Error: Incorrect Password."
          );
          if (
            !String(err).includes("There is no user") ||
            !String(err).includes("badly formatted")
          ) {
            if (attempts === -1) {
              checkDBStatus(value.username, attempts, true);
            } else {
              setChances(chances + 1);
              updateAttemptStatus(value.username, chances + 1);
              if (chances + 1 > 2) {
                setAuthMsg("");
                setAttempts(attempts + 1);
                setChances(0);
                updateAttemptStatus(value.username, 0);
                checkDBStatus(value.username, attempts + 1, false);
              }
            }
          }
        });
    },
  });
  const onResetPasswordhandler = () => {
    fireAuth
      .sendPasswordResetEmail(formik.values.username)
      .then((res) => {
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

  return (
    <div
      className="bg-hero"
      style={{
        backgroundImage: sm
          ? "linear-gradient(to bottom right, #0d6efd , #0d6efd)"
          : "",
      }}
    >
      <div className={`text-white  p-3 ${sm ? `` : `bg-text`}`}>
        <Col>
          <div className={sm ? "d-flex" : "column"}>
            <FaReact
              style={{
                width: sm ? "50px" : "70px",
                height: sm ? "50px" : "70px",
              }}
              className="text-center"
            ></FaReact>
            {sm && <p className="display-5 ms-2 mt-1"> Enterprise Name</p>}
          </div>
          <Col>
            {!sm && <p className="display-3"> Enterprise Name</p>}
            <p className={sm ? "ps-5 ms-2" : "display-5"}>
              {" "}
              slogan ! slogan ! slogan!
            </p>
          </Col>
        </Col>
        <hr className="mt-5" />
      </div>

      <Form
        className={sm ? "d-flex justify-content-center" : "bg-design"}
        onSubmit={formik.handleSubmit}
      >
        <Card
          style={{ width: sm ? "90%" : md ? "40%" : "30%" }}
          className="mt-5"
        >
          <div className="logo-circle">
            <BsShieldLockFill
              className="mt-3"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
          <h1 className="mt-5  text-center text-primary">SignIn</h1>
          <Card.Body className="">
            <FormGroup className="mb-2">
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
            <FormGroup className="mb-2">
              <FormLabel>
                <b>Enter your Password</b>
              </FormLabel>
              <FormControl
                type="password"
                name="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                isValid={formik.touched.password && !formik.errors.password}
                isInvalid={formik.touched.password && formik.errors.password}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-danger">
                  {" "}
                  {authMsg.length > 0 ? "" : formik.errors.password}{" "}
                </p>
              )}
            </FormGroup>
            <div>
              <Button
                type="submit"
                className="w-100 my-2"
                disabled={
                  !(formik.dirty && formik.isValid) || disable || account_status
                }
              >
                <b>Submit</b>
              </Button>
              <Button
                className="w-100 my-2"
                variant="danger"
                onClick={onResetPasswordhandler}
                disabled={!formik.values.username.length > 0}
              >
                <b>Forget Password</b>
              </Button>
            </div>
            {authMsg.length > 0 && (
              <Fragment>
                <Alert
                  variant={authStatus ? "success" : "danger"}
                  className="mt-2"
                >
                  <b>{authMsg}</b>
                </Alert>
              </Fragment>
            )}
            {disable && (
              <Fragment>
                <Timer expiryTimestamp={timer} className="mt-2"></Timer>
              </Fragment>
            )}
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default LoginPage;
