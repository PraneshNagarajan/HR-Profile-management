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
import { FaKey, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { fireAuth, firestore } from "../firebase";
import { useFormik } from "formik";
import { useEffect } from "react";
import { AuthActions } from "../Redux/AuthenticationSlice";
import { useDispatch } from "react-redux";

const formValidation = (field) => {
  const errors = {};
  if (!field.new_password) {
    errors.new_password = "*Required";
  } else if (!new RegExp("[A-Z]").test(field.new_password)) {
    errors.new_password =
      "*Password must be 1 Special Character, 1 Number, 1 Upper & 1 LowerCase.";
  } else if (!new RegExp("[a-z]").test(field.new_password)) {
    errors.new_password =
      "*Password must be 1 Special Character, 1 Number, 1 Upper & 1 LowerCase.";
  } else if (!new RegExp("[0-9]").test(field.new_password)) {
    errors.new_password =
      "*Password must be 1 Special Character, 1 Number, 1 Upper & 1 LowerCase.";
  } else if (!new RegExp("[^A-Za-z0-9_]").test(field.new_password)) {
    errors.new_password =
      "*Password must be 1 Special Character, 1 Number, 1 Upper & 1 LowerCase.";
  } else if (field.new_password.length < 6) {
    errors.new_password = "*Password must be at least 6 characters.";
  }

  if (!field.confirm_password) {
    errors.confirm_password = "*Required";
  } else if (!new RegExp("[A-Z]").test(field.confirm_password)) {
    errors.confirm_password =
      "*Password must be 1 Special Character, 1 Number, 1 Upper & 1 LowerCase.";
  } else if (!new RegExp("[a-z]").test(field.confirm_password)) {
    errors.confirm_password =
      "*Password must be 1 Special Character, 1 Number, 1 Upper & 1 LowerCase.";
  } else if (!new RegExp("[0-9]").test(field.confirm_password)) {
    errors.confirm_password =
      "*Password must be 1 Special Character, 1 Number, 1 Upper & 1 LowerCase.";
  } else if (!new RegExp("[^A-Za-z0-9_]").test(field.confirm_password)) {
    errors.confirm_password =
      "*Password must be 1 Special Character, 1 Number, 1 Upper & 1 LowerCase.";
  } else if (field.confirm_password.length < 6) {
    errors.confirm_password = "*Password must be at least 6 characters.";
  }
  return errors;
};

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const [authStatus, setAuthStatus] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleField1, setIsVisibleField1] = useState(false);
  const [isVisibleField2, setIsVisibleField2] = useState(false);

  const onVisibleHandler = (field) => {
    if (field === "field1") {
      setIsVisibleField1(!isVisibleField1);
    } else {
      setIsVisibleField2(!isVisibleField2);
    }
  };

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },
    validate: formValidation,
    onSubmit: (value) => {
      fireAuth.currentUser
        .updatePassword(formik.values.confirm_password.trim())
        .then(() => {
          setAuthStatus(true);
          setAuthMsg("Your password has been changed sucessfully.");
          setTimeout(() => {
            firestore
              .collection("Employee-Info")
              .doc(fireAuth.currentUser.email)
              .update({ "login-info.last_logout": new Date().toString() });
            fireAuth.signOut().then(
              dispatch(
                AuthActions.getAuthStatus({
                  flag: false,
                  role: "",
                  admin: "",
                })
              )
            );
          }, 1000);
        })
        .catch((err) => {
          setAuthStatus(false);
          setAuthMsg(String(err));
        });
    },
  });

  const new_password_error =
    formik.touched.confirm_password && formik.errors.confirm_password;
  useEffect(() => {
    if (formik.values.confirm_password.length > 1) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        if (
          formik.values.new_password.trim() ===
          formik.values.confirm_password.trim()
        ) {
          setAuthMsg("");
        } else {
          setAuthStatus(false);
          setAuthMsg("Error: Password doesn't match.");
        }
        setIsLoading(false);
      }, 1500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formik.values.confirm_password]);

  useEffect(() => {
    const flag = authMsg.length > 0;
    dispatch(AuthActions.getMsg(flag));
  }, [authMsg]);

  return (
    <Fragment>
      <div className="logo-circle shadow">
        <FaKey className="mt-3" style={{ width: "60px", height: "60px" }} />
      </div>
      <h1 className="mt-5  text-center text-primary">Change Password</h1>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup className="my-3">
            <FormLabel>
              <b>New Password</b>
            </FormLabel>

            <FormControl
              type={isVisibleField1 ? "text" : "password"}
              name="new_password"
              value={formik.values.new_password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              isValid={
                formik.touched.new_password && !formik.errors.new_password
              }
              isInvalid={
                formik.touched.new_password && formik.errors.new_password
              }
            />
            <span
              className="float-end me-2"
              style={{ position: "relative", marginTop: "-33px", zIndex: "2" }}
            >
              {isVisibleField1 && (
                <FaRegEye
                  role="button"
                  onClick={(e) => onVisibleHandler("field1")}
                  style={{ color: "green" }}
                />
              )}
              {!isVisibleField1 && (
                <FaRegEyeSlash
                  role="button"
                  onClick={(e) => onVisibleHandler("field1")}
                  style={{ color: "red" }}
                />
              )}
            </span>
            {formik.touched.new_password && formik.errors.new_password && (
              <p className="text-danger">
                {" "}
                {authMsg.length > 0 ? "" : formik.errors.new_password}{" "}
              </p>
            )}
          </FormGroup>
          <FormGroup className="my-2">
            <FormLabel>
              <b>Confirm Password</b>
            </FormLabel>
            <FormControl
              type={isVisibleField2 ? "text" : "password"}
              name="confirm_password"
              value={formik.values.confirm_password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              isValid={
                formik.touched.confirm_password &&
                !formik.errors.confirm_password
              }
              isInvalid={
                formik.touched.confirm_password &&
                formik.errors.confirm_password
              }
            />
            <span
              className="float-end me-2"
              style={{ position: "relative", marginTop: "-33px", zIndex: "2" }}
            >
              {isVisibleField2 && (
                <FaRegEye
                  role="button"
                  onClick={(e) => onVisibleHandler("field2")}
                  style={{ color: "green" }}
                />
              )}
              {!isVisibleField2 && (
                <FaRegEyeSlash
                  role="button"
                  onClick={(e) => onVisibleHandler("field2")}
                  style={{ color: "red" }}
                />
              )}
            </span>
            {formik.touched.confirm_password &&
              formik.errors.confirm_password && (
                <p className="text-danger">
                  {" "}
                  {authMsg.length > 0
                    ? ""
                    : formik.errors.confirm_password}{" "}
                </p>
              )}
          </FormGroup>
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

export default ChangePasswordPage;
