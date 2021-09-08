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
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { fireAuth, fireStorage, firestore } from "../firebase";
import { AlertActions } from "../Redux/AlertSlice";
import { InfoActions } from "../Redux/EmployeeInfoSlice";
import { AuthActions } from "../Redux/AuthenticationSlice";
import noUserImg from "../images/noUserFound.jpg";

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
  const loggedUser = useSelector((state) => state.auth);
  const [viewImg, setViewImg] = useState(false);
  const [Img, setImg] = useState({});
  const [users, setUsers] = useState({});
  const [errorsID, setErrorsID] = useState("");
  const [errorsEmail, setErrorsEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    id: "",
    email: "",
    role: props.view ? infos.employee.role : "- Select Role -",
    permission: props.view
      ? infos.employee.permission
        ? "View & Edit"
        : "View Only"
      : "- Select Permission -",
  };

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
    initialValues: props.view ? {...infos.employee, permission: infos.employee.permission ? 'View & Edit' : 'View Only' } : initialValues,
    validate,
    onSubmit: (value) => {
      setIsLoading(true);
      console.log((Img.name))
      if (!!Img.name) {
        fireStorage
          .ref()
          .child("employee-img/" + value.email)
          .put(Img)
          .then(() => {
            if (!loggedUser.admin || value.email === loggedUser.email) {
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
      if (props.view.user) {
        firestore
          .collection("Employee-Info")
          .doc(formik.values.email)
          .update({
            "profile.personal": infos.personal,
            "profile.address": infos.address,
          })
          .then(() => {
            setIsLoading(false);
            dispatch(
              AlertActions.handleShow({
                msg: "Data added successfully.",
                flag: true,
              })
            );
          })
          .catch(() => {});
      } else {
        if(props.view.admin) {
          firestore
          .collection("Employee-Info")
          .doc(formik.values.email)
          .update({
            "profile.employee": {
              ...formik.values,
              admin_permission: formik.values.permission.includes("&&")
                ? true
                : false,
            },
          })
          .then(() => {
            setIsLoading(false);
            dispatch(
              AlertActions.handleShow({
                msg: "Data added successfully.",
                flag: true,
              })
            );
          })
          .catch(() => {});
        }
        else {
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
                admin_permission: formik.values.permission.includes("&&")
                  ? true
                  : false,
              },
            },
            uploader_info: {
              id: loggedUser.id,
              date: new Date(),
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
                  role: formik.values.role,
                },
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
                setIsLoading(false);
                dispatch(InfoActions.resetForm());
                dispatch(
                  AlertActions.handleShow({
                    msg: "Data added successfully.",
                    flag: true,
                  })
                );
              })
              .catch((err) => {
                setIsLoading(false);
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
            setIsLoading(false);
            dispatch(
              AlertActions.handleShow({
                msg: "Data added failed.",
                flag: false,
              })
            );
          });
        }
      }
    },
  });
  useEffect(() => {
    if (infos.submitted) {
      formik.resetForm();
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
  console.log(props.user.img)
console.log(props.user.flag
  ? viewImg
    ? URL.createObjectURL(Img)
    : props.user.img.length > 0 ? props.user.img : noUserImg
  : viewImg
  ? URL.createObjectURL(Img)
  : noUserImg)
 

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
                     !!Img.name ? URL.createObjectURL(Img) : props.user.img !== undefined ? props.user.img : noUserImg
                  }
                  className={`rounded-circle shadow ${
                    !!Img.name || props.user.img !== undefined ? `border border-5 border-primary` : ``
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
                        ? props.view.user
                          ? `secondary`
                          : `primary`
                        : !formik.values.role.includes("Role") &&
                          formik.touched.role
                        ? `success`
                        : formik.values.role.includes("Role") &&
                          formik.touched.role
                        ? `danger`
                        : ``
                    }`}
                    name="role"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {formik.values.role}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={(e) => {
                        formik.setFieldValue("role", "Recruiter");
                        formik.setFieldValue(
                          "permission",
                          "- Select Permission -"
                        );
                      }}
                      active={formik.values.role.includes("Junior")}
                    >
                      Recruiter
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        formik.setFieldValue("role", "Senior Recruiter");
                        formik.setFieldValue(
                          "permission",
                          "- Select Permission -"
                        );
                      }}
                      active={formik.values.role.includes("Senior")}
                    >
                      Senior Recruiter
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        formik.setFieldValue("role", "Admin");
                      }}
                      active={formik.values.role.includes("Admin")}
                    >
                      Admin
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {formik.touched.role && formik.errors.role && (
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
                      !formik.values.role.includes("Admin") || props.view.user
                    }
                    variant={`outline-${
                      !formik.values.role.includes("Admin") || props.view
                        ? props.view.user
                          ? `secondary`
                          : `primary`
                        : !formik.values.permission.includes("-") &&
                          formik.touched.permission
                        ? `success`
                        : formik.values.permission.includes("-")
                        ? `danger`
                        : ``
                    }`}
                    name="permission"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {formik.values.permission}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={() => {
                        formik.setFieldValue("permission", "View & Edit");
                      }}
                      active={formik.values.permission.includes("View")}
                    >
                      View & Edit
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        formik.setFieldValue("permission", "View Only");
                      }}
                      active={formik.values.permission.includes("Only")}
                    >
                      View Only
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {formik.values.role.includes("Admin") &&
                  formik.values.permission.includes("-") && (
                    <div className="text-danger">*Required.</div>
                  )}
              </Col>
            </Row>
            <div className={sm ? "mt-5" : "float-end"}>
              {!isLoading && (
                <Button
                  className={sm ? "w-100" : ""}
                  disabled={
                    !(formik.dirty && formik.isValid) ||
                    formik.values.role.includes("Role") ||
                    formik.values.role.includes("Admin")
                      ? formik.values.permission.includes("-")
                      : false ||
                        !Object.keys(infos.personal).length > 0 ||
                        !Object.keys(infos.address).length > 0
                  }
                  type="submit"
                >
                  Save && Submit
                </Button>
              )}
              {isLoading && (
                <Button
                  variant="primary"
                  className={sm ? "w-100" : ""}
                  disabled
                >
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
          </Form>
        </Card.Body>
      </Card>
    </TabContent>
  );
};
export default EmployeeTabContent;
