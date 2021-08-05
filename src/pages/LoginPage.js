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
import { fireAuth, firestore } from "../firebase";
import { useFormik } from "formik";
import Timer from "../Timer";

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

  const authNotification = () => {
    setAccoutStatus(true);
    setAuthMsg(
      "Your account has been locked due to multiple incorrect logins. Please contact admin.."
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
          if (attempt === -1) {
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
          if (
            (attempt > 0 && attempt < 3) ||
            (attempt === -1 && db_Chance === 2)
          ) {
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
          if (attempts === -1) {
            checkDBStatus(value.username, attempts, true);
            setAuthMsg(String(err));
          } else {
            setChances(chances + 1);
            updateAttemptStatus(value.username, chances + 1);
            setAuthMsg(String(err));
            if (chances + 1 > 2) {
              setAuthMsg("");
              setAttempts(attempts + 1);
              setChances(0);
              updateAttemptStatus(value.username, 0);
              checkDBStatus(value.username, attempts + 1, false);
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
    <div className="bg-hero">
      <div className="text-white bg-text ms-5">
        <Col >
          <FaReact
            style={{ width: "70px", height: "70px" }}
            className="text-center"
          ></FaReact>
          <Col md="12" xs="4">
          <p className="display-3"> Enterprise Name</p>
          <p className="display-5"> slogan</p>
          </Col>
        </Col>
      </div>

      <Form className="bg-design" onSubmit={formik.handleSubmit}>
        <Card style={{ width: "30%" }}>
          <div className="logo-circle">
            <FaKey className="mt-4" />
          </div>
          <h1 className="mt-5  text-center text-primary">SignIn</h1>
          <Card.Body className="mb-3">
            <FormGroup className="mb-2">
              <FormLabel><b>Enter your Username</b></FormLabel>
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
                <p className="text-danger"> {formik.errors.username} </p>
              )}
            </FormGroup>
            <FormGroup className="mb-2">
              <FormLabel><b>Enter your Password</b></FormLabel>
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
                <p className="text-danger"> {formik.errors.password} </p>
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
                <hr className="mb-3" />{" "}
                <Alert variant={authStatus ? "success" : "danger"}>
                  <b>{authMsg}</b>
                </Alert>
              </Fragment>
            )}

            {disable && <Timer expiryTimestamp={timer}></Timer>}
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default LoginPage;
