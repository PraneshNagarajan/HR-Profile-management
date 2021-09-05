import { useFormik } from "formik";
import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { fireAuth, fireStorage, firestore } from "../firebase";
import { AlertActions } from "../Redux/AlertSlice";
import { InfoActions } from "../Redux/EmployeeInfoSlice";
import { AuthActions } from "../Redux/AuthenticationSlice";
import noUserImg from "../images/noUserFound.jpg";

const initialValues = {
  id: "",
  email: "",
};
const validate = (value) => {
  const errors = {};
  if (!value.id) {
    errors.id = "*Required.";
  } else if (value.id.length < 6) {
    errors.id = "*ID must be greater than 5 characters.";
  }

  if (!value.email) {
    errors.email = "*Required.";
  } else if (
    !new RegExp(
      "^[A-Za-z]{1}[A-Za-z0-9_.]+[@]{1}[A-Za-z]+[.]{1}[A-Za-z]{2,3}$"
    ).test(value.email)
  ) {
    errors.email = "*Invalid Format.";
  }
  return errors;
};
const EmployeeTabContent = (props) => {
  const dispatch = useDispatch();
  const sm = useMediaQuery({ maxWidth: 768 });
  const infos = useSelector((state) => state.info);
  const auth = useSelector((state) => state.auth);
  const [selectedRole, setRole] = useState(
    props.view ? infos.employee.role : "- Select Role -"
  );
  const [selectedPermission, setPermission] = useState(
    props.view
      ? infos.employee.permission
        ? "View & Edit"
        : "View Only"
      : "- Select Permission -"
  );
  const [viewImg, setViewImg] = useState(false);
  const [Img, setImg] = useState("");
  const [users, setUsers] = useState({});
  const [errorsID, setErrorsID] = useState("");
  const [errorsEmail, setErrorsEmail] = useState("");
  useEffect(() => {
    firestore
      .collection("Employee-Info")
      .doc("users")
      .get()
      .then((res) => {
        setUsers(res.data());
      });
  }, []);

  const formik = useFormik({
    initialValues: props.view ? infos.employee : initialValues,
    validate,
    onSubmit: (value) => {
      if (Object.values(Img).length >= 0) {
        fireStorage
          .ref()
          .child("employee-img/" + value.email)
          .put(Img)
          .then(() => {
            if (!auth.admin || value.email === auth.email) {
              firestore.collection("Employee-Info").doc(value.email).update({
                "profile.img_uploaded": true,
              });
              dispatch(InfoActions.getImageFlag(true));
              if (infos.employee_status) {
                dispatch(
                  AuthActions.getAuthStatus({
                    id: value.email,
                    flag: true,
                    role: infos.employee.role,
                    admin: infos.employee.admin_permission,
                    name: fireAuth.currentUser.displayName,
                    photoUrl: URL.createObjectURL(Img),
                  })
                );
              } else {
                dispatch(AuthActions.getPhoto(URL.createObjectURL(Img)));
              }
            }
          })
          .catch(() => {});
      }
      if (props.view) {
        firestore
          .collection("Employee-Info")
          .doc(formik.values.email)
          .update({
            "profile.personal": infos.personal,
            "profile.address": infos.address,
          })
          .catch(() => {});

        dispatch(
          AlertActions.handleShow({
            msg: "Data added successfully.",
            flag: true,
          })
        );
      } else {
        firestore
          .collection("Employee-Info")
          .doc(formik.values.email)
          .set({
            "auth-info": {
              attempts: 0,
              chances: 0,
              account_status: "active",
              newly_added: true,
              invalid_attempt_timestamp: null,
              locked: false,
            },
            "login-info": {
              last_logout: null,
              last_login: null,
              state: "active",
            },
            "password-management": {
              question2: null,
              answer1: null,
              answer2: null,
              question1: null,
              last_changed: null,
            },
            profile: {
              img_uploaded: Img.length > 0 ? true : false,
              personal: infos.personal,
              address: infos.address,
              employee: {
                ...formik.values,
                role: selectedRole,
                admin_permission: selectedPermission.includes("&&")
                  ? true
                  : false,
              },
            },
          })
          .then(() => {
            //pass value for key+ from variable
            firestore
              .collection("Employee-Info")
              .doc("users")
              .update({
                [value.id]: {
                  email: value.email,
                  name: infos.personal.firstname,
                  role: selectedRole
                }
              });
            fireAuth
              .createUserWithEmailAndPassword(
                formik.values.email,
                formik.values.id
              )
              .then((res) => {
                res.user.updateProfile({
                  displayName: infos.personal.firstname,
                });
                dispatch(InfoActions.resetForm());
                dispatch(
                  AlertActions.handleShow({
                    msg: "Data added successfully.",
                    flag: true,
                  })
                );
              })
              .catch((err) => {
                dispatch(
                  AlertActions.handleShow({
                    msg: "Data added failed.",
                    flag: false,
                  })
                );
                firestore
                  .collection("Employee-Info")
                  .doc(formik.values.email)
                  .delete();
              });
          })
          .catch(() => {
            dispatch(
              AlertActions.handleShow({
                msg: "Data added failed.",
                flag: false,
              })
            );
          });
      }
    },
  });

  useEffect(() => {
    if (infos.submitted) {
      formik.resetForm();
      setPermission("- Select Permission -");
      setRole("- Select Role -");
      dispatch(InfoActions.getSubmittedStatus());
    }
  }, [infos.submitted]);

  const handleChange = (e) => {
    if (e.target.files[0].size / 1024 > 300) {
      dispatch(
        AlertActions.handleShow({
          msg: "file size must be within 300kb",
          flag: false,
        })
      );
    } else if (e.target.files[0]) {
      setImg(e.target.files[0]);
      setViewImg(true);
    }
  };

  useEffect(() => {
    if (!props.view) {
      const timeout = setTimeout(() => {
        if (Object.keys(users).includes(formik.values.id)) {
          setErrorsID("*Already this ID has been taken.");
        } else {
          setErrorsID("");
        }
      }, 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formik.values.id]);

  useEffect(() => {
    if (!props.view) {
      const timeout = setTimeout(() => {
        if (Object.values(users).includes(formik.values.email)) {
          setErrorsEmail("*Already this Email has been taken.");
        } else {
          setErrorsEmail("");
        }
      }, 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formik.values.email]);

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
            <div>
              <div className="d-flex justify-content-center">
                <img
                  src={
                    props.user.flag
                      ? props.user.img
                      : viewImg
                      ? URL.createObjectURL(Img)
                      : noUserImg
                  }
                  className={`rounded-circle shadow ${
                    props.user.flag ? `border border-5 border-primary` : ``
                  }`}
                  height={sm ? "100px" : "150px"}
                  width={sm ? "100px" : "150px"}
                />
              </div>
              {(props.view.user || !props.view) && (
                <Col className="d-flex justify-content-center">
                  <FormControl
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                  />
                </Col>
              )}
            </div>
            <Row className="my-2">
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup className={sm ? "my-1" : ""}>
                  <FormLabel htmlFor="employee id">Employee Id</FormLabel>
                  <FormControl
                    type="text"
                    name="id"
                    readOnly={props.view}
                    value={formik.values.id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      (formik.errors.id &&
                        (formik.touched.id || formik.values.id.length > 0)) ||
                      errorsID.length !== 0
                    }
                    isValid={
                      !formik.errors.id &&
                      (formik.touched.id || formik.values.id.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik.errors.id ? formik.errors.id : errorsID}
                  </div>
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Roles</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={props.view.user}
                    variant={`outline-${
                      !formik.touched.role
                        ? props.view.user ? `secondary`: `primary`
                        : !selectedRole.includes("Role") && formik.touched.role
                        ? `success`
                        : selectedRole.includes("Role") && formik.touched.role
                        ? `danger`
                        : ``
                    }`}
                    name="role"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {selectedRole}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={(e) => {
                        setRole("Junior-Recruiter");
                        setPermission("- Select Permission -");
                      }}
                      active={selectedRole.includes("Junior")}
                    >
                      Recruiter
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => {
                        setRole("Senior-Recruiter");
                        setPermission("- Select Permission -");
                      }}
                      active={selectedRole.includes("Senior")}
                    >
                      Senior-Recruiter
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => {
                        setRole("Focal");
                      }}
                      active={selectedRole.includes("Focal")}
                    >
                      Focal
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {selectedRole.includes("-") && (
                  <div className="text-danger">{formik.errors.role}</div>
                )}
              </Col>
            </Row>
            <Row className={sm ? "" : "my-5"}>
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup className={sm ? "my-1" : ""}>
                  <FormLabel htmlFor="employee id">Employee email Id</FormLabel>
                  <FormControl
                    type="text"
                    name="email"
                    readOnly={props.view}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      (formik.errors.email &&
                        (formik.touched.email ||
                          formik.values.email.length > 0)) ||
                      errorsEmail.length !== 0
                    }
                    isValid={
                      !formik.errors.email &&
                      (formik.touched.email || formik.values.email.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik.errors.email ? formik.errors.email : errorsEmail}
                  </div>
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Permissions</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={
                      !selectedRole.includes("Focal") || props.view.user
                    }
                    variant={`outline-${
                      !selectedRole.includes("Focal") || props.view
                        ? props.view.user ? `secondary`:`primary`
                        : !selectedPermission.includes("-") &&
                          formik.touched.permission
                        ? `success`
                        : selectedPermission.includes("-")
                        ? `danger`
                        : ``
                    }`}
                    name="permission"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {selectedPermission}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={(e) => {
                        setPermission("View & Edit");
                      }}
                      active={selectedPermission.includes("Write")}
                    >
                      View & Edit
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => {
                        setPermission("View Only");
                      }}
                      active={selectedPermission.includes("Only")}
                    >
                      View Only
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {selectedRole.includes("Focal") &&
                  selectedPermission.includes("-") && (
                    <div className="text-danger">*Required.</div>
                  )}
              </Col>
            </Row>
            <div className={sm ? "mt-5" : "float-end"}>
              <Button
                className={sm ? "w-100" : ""}
                disabled={
                  !(formik.dirty && formik.isValid) ||
                  selectedRole.includes("Role") ||
                  selectedRole.includes("Focal")
                    ? selectedPermission.includes("-")
                    : false ||
                      !Object.keys(infos.personal).length > 0 ||
                      !Object.keys(infos.address).length > 0
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
export default EmployeeTabContent;
