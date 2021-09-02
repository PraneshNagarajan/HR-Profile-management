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
import { BsShieldLockFill } from "react-icons/bs";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { fireAuth, fireStorage, firestore } from "../firebase";
import { useFormik } from "formik";
import Timer from "../Timer";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { AuthActions } from "../Redux/AuthenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { InfoActions } from "../Redux/EmployeeInfoSlice";

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
  const dispatch = useDispatch();
  const msgFlag = useSelector((state) => state.auth.msg);
  const history = useHistory();
  const [timer, SetTimer] = useState();
  const [authMsg, setAuthMsg] = useState("");
  const [chances, setChances] = useState(0);
  const [attempts, setAttempts] = useState(-1);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(false);
  const [account_status, setAccoutStatus] = useState(false);
  const [isVisibleField, setIsVisibleField] = useState(false);
  const sm = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const flag = authMsg.length > 0;
    dispatch(AuthActions.getMsg(flag));
  }, [authMsg]);

  const onVisibleHandler = () => {
    setIsVisibleField(!isVisibleField);
  };

  const onLoadinghandler = () => {
    setIsLoading(true);
  };

  const authNotification = () => {
    setAccoutStatus(true);
    setAuthMsg(
      " Error: Your account has been locked permenantly due to multiple incorrect logins. Please contact your admin or reset your password."
    );
  };

  const updateLoginStatus = (doc) => {
    firestore.collection("Employee-Info").doc(doc).update({
      "login-info.state": "active",
      "login-info.last_login": new Date().toString(),
    });
  };

  const updateAttemptStatus = (doc, flag = false, attempt) => {
    firestore.collection("Employee-Info").doc(doc).update({
      "auth-info.attempts": attempt,
      "auth-info.invalid_attempt_timestamp": new Date().toString(),
      "auth-info.locked": flag,
    });
  };

  const updateChanceStatus = (doc, chance) => {
    firestore
      .collection("Employee-Info")
      .doc(doc)
      .update({ "auth-info.chances": chance });
  };

  const calculatingDuration = (Atmp_time, flag) => {
    const duration = new Date().getTime() - new Date(Atmp_time).getTime();
    if (duration <= 30000 || !flag) {
      SetTimer(
        new Date().setSeconds(
          new Date().getSeconds() + (30000 - (flag ? duration : 0)) / 1000
        )
      );
      dispatch(AuthActions.getMsg(true));
      setAuthMsg("");
      setDisable(true);
      setTimeout(() => {
        dispatch(AuthActions.getMsg(false));
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
        const db_Chance = Number(documentSnapshot.get("auth-info.chances"));
        const db_Attempts = Number(documentSnapshot.get("auth-info.attempts"));
        if (!documentSnapshot.get("auth-info.locked")) {
          if (flag) {
            if (db_Chance + 1 <= 2) {
              setChances(db_Chance + 1);
              setAttempts(db_Attempts);
              updateChanceStatus(doc, db_Chance + 1);
            } else {
              setChances(0);
              updateChanceStatus(doc, 0);
              if (db_Attempts + 1 <= 2) {
                updateAttemptStatus(doc, false, db_Attempts + 1);
                setAttempts(db_Attempts + 1);
                calculatingDuration(
                  documentSnapshot.get("auth-info.invalid_attempt_timestamp"),
                  false
                );
              } else {
                updateAttemptStatus(doc, true, 3);
                authNotification();
              }
            }
          } else if (attempt >= 0 && attempt < 3) {
            updateAttemptStatus(doc, false, attempt);
          } else {
            updateAttemptStatus(doc, true, 3);
          }
          if (attempt > 0 && attempt < 3) {
            calculatingDuration(
              documentSnapshot.get("auth-info.invalid_attempt_timestamp"),
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
          onLoadinghandler();
          firestore
            .collection("Employee-Info")
            .doc(value.username)
            .get()
            .then((documentSnapshot) => {
              const password_info = documentSnapshot.get("password-management");
              const auth_info = documentSnapshot.get("auth-info");
              const profile_info = documentSnapshot.get("profile");
              const dateDiff =
                (new Date().getTime() -
                  new Date(password_info.last_changed).getTime()) /
                (1000 * 3600 * 24);
              // get img url from firebase-Storage
              if (profile_info.img_uploaded) {
                fireStorage
                  .ref()
                  .child("employee-img/" + value.username)
                  .getDownloadURL()
                  .then((url) => {
                    dispatch(
                      AuthActions.getAuthStatus({
                        id: value.username,
                        flag: true,
                        role: profile_info.employee.role,
                        admin: profile_info.employee.admin_permission,
                        name: fireAuth.currentUser.displayName,
                        photoUrl: url,
                      })
                    );
                  });
              }
              if (
                Math.round(dateDiff) <= 90 &&
                !auth_info.newly_added &&
                password_info.status
              ) {
                if (auth_info.locked === false) {
                  updateLoginStatus(value.username);
                  setAuthStatus(true);
                  setAuthMsg("Login Successfully !");
                  firestore
                    .collection("Employee-Info")
                    .doc(value.username)
                    .update({
                      "auth-info.chances": 0,
                      "auth-info.attempts": 0,
                      "auth-info.locked": false,
                      "auth-info.invalid_attempt_timestamp": null,
                    });
                  history.push("/focalHomePage");
                } else {
                  authNotification();
                }
              } else {
                dispatch(
                  AuthActions.getAuthStatus({
                    flag: true,
                    role: "",
                    admin: "",
                    name: "",
                    photoUrl: "",
                  })
                );
                if (auth_info.newly_added) {
                  history.push("/changePassword");
                } else {
                  dispatch(
                    InfoActions.getCompleteInfo({
                      address: profile_info.address,
                      personal: profile_info.personal,
                      employee: profile_info.employee,
                      security: password_info,
                      activeTab: !profile_info.img_uploaded
                        ? "employee-info"
                        : "security-info",
                      employee_status: profile_info.img_uploaded,
                      password_status: password_info.status,
                    })
                  );
                  history.push("/manageEmployeeProfile");
                }
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
          setAuthMsg(String(err));
          if (
            !String(err).includes("There is no user") &&
            !String(err).includes("badly formatted")
          ) {
            if (attempts === -1) {
              checkDBStatus(value.username, attempts, true);
            } else {
              setChances(chances + 1);
              updateChanceStatus(value.username, chances + 1);
              if (chances + 1 > 2) {
                setAuthMsg("");
                setAttempts(attempts + 1);
                setChances(0);
                updateChanceStatus(value.username, 0);
                checkDBStatus(value.username, attempts + 1, false);
              }
            }
          }
        });
      setIsLoading(false);
    },
  });

  return (
    <Fragment>
      <div className="logo-circle shadow">
        <BsShieldLockFill
          className="mt-3"
          style={{ width: "60px", height: "60px" }}
        />
      </div>
      <h1 className="mt-5  text-center text-primary">SignIn</h1>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
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
            {/* invalid-feedback class display when isInvalid prop is true */}
            <p className="invalid-feedback">
              {" "}
              {authMsg.length > 0 ? "" : formik.errors.username}{" "}
            </p>
          </FormGroup>
          <FormGroup className="noShow my-3">
            <FormLabel>
              <b>Enter your Password</b>
            </FormLabel>
            <FormControl
              type={isVisibleField ? "text" : "password"}
              name="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              isValid={formik.touched.password && !formik.errors.password}
              isInvalid={formik.touched.password && formik.errors.password}
            />
            <span
              className="float-end me-2"
              style={{ position: "relative", marginTop: "-33px" }}
            >
              {isVisibleField && (
                <FaRegEye
                  role="button"
                  onClick={onVisibleHandler}
                  style={{ color: "#0d6efd" }}
                />
              )}
              {!isVisibleField && (
                <FaRegEyeSlash
                  style={{ width: "5rem", height: "5rem" }}
                  role="button"
                  onClick={onVisibleHandler}
                  style={{ color: "red" }}
                />
              )}
            </span>
            <p className="invalid-feedback">
              {" "}
              {authMsg.length > 0 ? "" : formik.errors.password}{" "}
            </p>
          </FormGroup>
          <div>
            {!isLoading && (
              <Button
                type="submit"
                className={`w-100 ${sm ? "" : "my-1"}`}
                disabled={
                  !(formik.dirty && formik.isValid) || disable || account_status
                }
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
            <Button
              className="w-100 my-2"
              variant="danger"
              as={Link}
              to="/resetPassword"
            >
              <b>Forget Password</b>
            </Button>
          </div>
          {authMsg.length > 0 && (
            <Fragment>
              <Alert
                variant={authStatus ? "success" : "danger"}
                className="mt-2 text-center"
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
        </Form>
      </Card.Body>
    </Fragment>
  );
};

export default LoginPage;
