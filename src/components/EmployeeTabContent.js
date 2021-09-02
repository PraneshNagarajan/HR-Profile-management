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

const initialValues = {
  id: "",
  email: "",
};
const validate = (value) => {
  const errors = {};
  if (!value.id) {
    errors.id = "*Required.";
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
  const [Img, setImg] = useState();
  const formik = useFormik({
    initialValues: props.view ? infos.employee : initialValues,
    validate,
    onSubmit: (value) => {
      if (Img.name.length > 0) {
        fireStorage
          .ref()
          .child("employee-img/" + value.email)
          .put(Img)
          .then(() => {
            if (!auth.admin || value.email === auth.id) {
              firestore.collection("Employee-Info").doc(value.email).update({
                "profile.img_uploaded": true,
              });
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
              img_uploaded: Img.name.length > 0 ? true: false,
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
    console.log(e.target.files[0].size / 1024);
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
              {viewImg && (
                <div className="d-flex justify-content-center">
                  <img
                    src={URL.createObjectURL(Img)}
                    accept="image/png, image/jpeg"
                    className="border border-5 border-primary rounded-circle shadow"
                    height="150px"
                    width="150px"
                  />
                </div>
              )}
              <Col className="d-flex justify-content-center">
                <FormControl type="file" onChange={handleChange} />
              </Col>
            </div>
            <Row className="my-2">
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup>
                  <FormLabel htmlFor="employee id">Employee Id</FormLabel>
                  <FormControl
                    type="text"
                    name="id"
                    readOnly={props.view}
                    value={formik.values.id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.id &&
                      (formik.touched.id || formik.values.id.length > 0)
                    }
                    isValid={
                      !formik.errors.id &&
                      (formik.touched.id || formik.values.id.length > 0)
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.id}</div>
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Roles</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={props.view}
                    variant={`outline-${
                      !formik.touched.role
                        ? `primary`
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
            <Row className="my-5">
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup>
                  <FormLabel htmlFor="employee id">Employee email Id</FormLabel>
                  <FormControl
                    type="text"
                    name="email"
                    readOnly={props.view}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.email &&
                      (formik.touched.email || formik.values.email.length > 0)
                    }
                    isValid={
                      !formik.errors.email &&
                      (formik.touched.email || formik.values.email.length > 0)
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.email}</div>
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Permissions</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={!selectedRole.includes("Focal") || props.view}
                    variant={`outline-${
                      !selectedRole.includes("Focal") || props.view
                        ? `primary`
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
            <div className={sm ? "" : "float-end"}>
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
