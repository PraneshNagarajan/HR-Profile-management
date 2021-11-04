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
import { Fragment } from "react";

const validate = (value) => {
  const errors = {};
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
  const [Img, setImg] = useState({});
  const [users, setUsers] = useState({});
  const [errorsSupervisor, setErrorsSupervisor] = useState("");
  const [supervisorSuggestion, setSupervisorSuggestion] = useState("");
  const [errorsEmail, setErrorsEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupervisorInfo, setSelectedSupervisorInfo] = useState([]);
  const empnoRef = firestore.collection("Employee-No");

  const initialValues = {
    id: "",
    email: "",
    role: "- Select Role -",
    admin_permission: "- Select Permission -",
    supervisor: "",
  };

  const roles = ["JUNIOR RECRUITER", "SENIOR RECRUITER", "FOCAL", "ADMIN"];

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
    initialValues: props.view
      ? {
          ...infos.employee,
          admin_permission: infos.employee.admin_permission
            ? "View && Edit"
            : "View Only",
        }
      : initialValues,
    validate,
    onSubmit: async (value) => {
      let email = await String(value.email).toLowerCase();
      let newReportees = [...selectedSupervisorInfo];
      newReportees.push(value.supervisor);
      await setIsLoading(true);
      if (await !!Img.name) {
        await fireStorage
          .ref()
          .child("employee-img/" + email)
          .put(Img)
          .then(async () => {
            if (await (!loggedUser.admin || email === loggedUser.email)) {
              firestore
                .collection("Employee-Info")
                .doc(email)
                .update({
                  "profile.img_uploaded": true,
                })
                .then(async () => {
                  if (await props.view.user) {
                    await dispatch(
                      AlertActions.handleShow({
                        msg: "Image uploaded successfully.",
                        flag: true,
                      })
                    );
                  }
                });
              await dispatch(InfoActions.getImageFlag(true));
              if (await infos.employee_status) {
                await dispatch(
                  AuthActions.getAuthStatus({
                    id: email,
                    flag: true,
                    role: infos.employee.role,
                    admin: infos.employee.admin_permission,
                    name: fireAuth.currentUser.displayName,
                    photoUrl: URL.createObjectURL(Img),
                  })
                );
              } else {
                await dispatch(AuthActions.getPhoto(URL.createObjectURL(Img)));
              }
            }
          })
          .catch(() => {});
      }
      if (await props.view.user) {
        await firestore
          .collection("Employee-Info")
          .doc(email)
          .update({
            "profile.personal": infos.personal,
            "profile.address": infos.address,
          })
          .then(async () => {
            await dispatch(
              AlertActions.handleShow({
                msg: "Data added successfully.",
                flag: true,
              })
            );
          })
          .catch(() => {});
      } else {
        if (await props.view.admin) {
          await firestore
            .collection("Employee-Info")
            .doc(email)
            .update({
              "profile.employee": {
                ...formik.values,
                email,
                admin_permission: formik.values.admin_permission.includes("&&")
                  ? true
                  : false,
              },
            })
            .then(async () => {
              await dispatch(
                AlertActions.handleShow({
                  msg: "Data added successfully.",
                  flag: true,
                })
              );
            })
            .catch(() => {});
        } else {
          await firestore
            .collection("Employee-Info")
            .doc(email)
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
                img_uploaded: !!Img.name ? true : false,
                personal: infos.personal,
                address: infos.address,
                employee: {
                  ...formik.values,
                  email,
                  admin_permission: formik.values.admin_permission.includes(
                    "&&"
                  )
                    ? true
                    : false,
                },
              },
              uploader_info: {
                id: loggedUser.id,
                date: new Date(),
              },
            })
            .then(async () => {
              //pass value for key+ from variable
              await firestore
                .collection("Employee-Info")
                .doc("users")
                .update({
                  [value.id]: {
                    email,
                    name: infos.personal.firstname,
                    role: formik.values.role,
                    id: formik.values.id,
                    supervisor: formik.values.supervisor,
                  },
                  [value.supervisor]: {
                    reportees: newReportees,
                  },
                })
                .catch((err) => console.log(String(err)));

              await firestore
                .collection("Employee-No")
                .doc("info")
                .update({
                  ["values." + value.id.split("-")[0]]: value.id.split("-")[1],
                })
                .catch(async (err) => {
                  if (await String(err).includes("No document to update")) {
                    await empnoRef.doc("new").delete();
                    await firestore
                      .collection("Employee-No")
                      .doc("info")
                      .set({
                        values: {
                          [value.id.split("-")[0]]: value.id.split("-")[1],
                        },
                      });
                  } else {
                    //error
                  }
                });
              await fireAuth
                .createUserWithEmailAndPassword(
                  formik.values.email,
                  formik.values.id
                )
                .then(async (res) => {
                  res.user.updateProfile({
                    displayName: infos.personal.firstname,
                  });
                  await dispatch(InfoActions.resetForm());
                  await dispatch(
                    AlertActions.handleShow({
                      msg: "Data added successfully.",
                      flag: true,
                    })
                  );
                })
                .catch(async (err) => {
                  await dispatch(
                    await AlertActions.handleShow({
                      msg: "Data added failed.",
                      flag: false,
                    })
                  );
                  await firestore
                    .collection("Employee-Info")
                    .doc(email)
                    .delete();
                });
            })
            .catch(async () => {
              await setIsLoading(false);
              await dispatch(
                AlertActions.handleShow({
                  msg: "Data added failed.",
                  flag: false,
                })
              );
            });
        }
      }
      await setIsLoading(false);
    },
  });

  const checkUserIsPresent = () => {
    let profile = Object.values(users).filter(
      (user) => user.id === formik.values.supervisor
    );

    if (!props.view.user) {
      const timeout = setTimeout(() => {
        if (profile.length > 0) {
          setErrorsSupervisor("");
          if (profile.reportees) {
            setSelectedSupervisorInfo(profile.reportees);
          }
        } else {
          setErrorsSupervisor("*No user found.");
        }
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  };

  useEffect(() => {
    let profile = Object.values(users).filter(
      (user) => user.email === String(formik.values.email).toLowerCase()
    );
    if (!props.view) {
      const timeout = setTimeout(() => {
        if (profile.length > 0) {
          setErrorsEmail("*Already this Email has been taken.");
        } else {
          setErrorsEmail("");
        }
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formik.values.email]);

  useEffect(() => {
    let selectedRole = formik.values.role;
    if (infos.employee.role !== selectedRole && !props.view.user) {
      if (!selectedRole.includes("-")) {
        if (selectedRole === "JUNIOR RECRUITER") {
          setSupervisorSuggestion("Senior Recruiter");
          if (formik.values.supervisor.length > 0) {
            if (formik.values.supervisor.includes("SR")) {
              checkUserIsPresent();
            } else {
              setErrorsSupervisor("*Senior Recruiter should be a supervisor.");
            }
          }
        } else if (selectedRole === "SENIOR RECRUITER") {
          setSupervisorSuggestion("Focal");
          if (formik.values.supervisor.length > 0) {
            if (formik.values.supervisor.includes("FO")) {
              checkUserIsPresent();
            } else {
              setErrorsSupervisor("*Focal should be a supervisor.");
            }
          }
        } else if (selectedRole === "FOCAL") {
          setSupervisorSuggestion("Admin");
          if (formik.values.supervisor.length > 0) {
            if (formik.values.supervisor.includes("AD")) {
              checkUserIsPresent();
            } else {
              setErrorsSupervisor("*Admin should be a supervisor.");
            }
          }
        } else {
          formik.setFieldValue("supervisor", "MG-111111");
        }
      }
    }
    if (!props.view.user && infos.employee.role === formik.values.role) {
      formik.setValues({
        ...infos.employee,
        admin_permission: infos.employee.admin_permission
          ? "View && Edit"
          : "View Only",
      });
    }
  }, [formik.values.role, formik.values.supervisor]);

  useEffect(() => {
    if (
      !formik.values.role.includes("-") &&
      !props.view.user &&
      infos.employee.role !== formik.values.role
    ) {
      empnoRef.onSnapshot((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          let no = formik.values.role.includes(" ")
            ? formik.values.role[0] + formik.values.role.split(" ")[1][0]
            : String(formik.values.role).slice(0, 2);
          if (doc.id === "new") {
            formik.setFieldValue("id", no + "-111111");
          } else {
            empnoRef
              .doc("info")
              .get()
              .then((res) => {
                if (res.id === "info") {
                  let index = Object.keys(res.data().values).findIndex(
                    (id) => id === no
                  );
                  if (index >= 0) {
                    let data = Object.values(res.data().values)[index];
                    formik.setFieldValue("id", no + "-" + (data + 1));
                  } else {
                    formik.setFieldValue("id", no + "-111111");
                  }
                }
              })
              .catch((err) => {
                alert(String(err));
              });
          }
        });
      });
    }
    if (!props.view.user && infos.employee.role === formik.values.role) {
      formik.setValues({
        ...infos.employee,
        admin_permission: infos.employee.admin_permission
          ? "View && Edit"
          : "View Only",
      });
    }
  }, [formik.values.role]);

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
              <div className="d-flex justify-content-center">
                <img
                  src={
                    !!Img.name
                      ? URL.createObjectURL(Img)
                      : props.user.img !== undefined
                      ? props.user.img
                      : noUserImg
                  }
                  className={`rounded-circle shadow ${
                    !!Img.name || props.user.img !== undefined
                      ? `border border-5 border-primary`
                      : ``
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
                    {roles.map((role, index) => {
                      return (
                        <Fragment key={index}>
                          <Dropdown.Item
                            onClick={(e) => {
                              formik.setFieldValue("role", role);
                              formik.setFieldValue(
                                "admin_permission",
                                "- Select Permission -"
                              );
                            }}
                            active={formik.values.role.includes(role)}
                          >
                            {role}
                          </Dropdown.Item>
                          {role.length - 2 > index && <Dropdown.Divider />}
                        </Fragment>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                {formik.touched.role && formik.errors.role && (
                  <div className="text-danger">{formik.errors.role}</div>
                )}
              </Col>
              <Col md="5">
                <FormGroup className={sm ? "my-1" : ""}>
                  <FormLabel htmlFor="employee id">Employee Id</FormLabel>
                  <FormControl
                    type="text"
                    name="id"
                    readOnly={true}
                    value={formik.values.id}
                    onChange={formik.handleChange}
                  />
                </FormGroup>
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
                        : !formik.values.admin_permission.includes("-") &&
                          formik.touched.admin_permission
                        ? `success`
                        : formik.values.admin_permission.includes("-")
                        ? `danger`
                        : ``
                    }`}
                    name="admin_permission"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {formik.values.admin_permission}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={() => {
                        formik.setFieldValue(
                          "admin_permission",
                          "View && Edit"
                        );
                      }}
                      active={formik.values.admin_permission.includes("View")}
                    >
                      View && Edit
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        formik.setFieldValue("admin_permission", "View Only");
                      }}
                      active={formik.values.admin_permission.includes("Only")}
                    >
                      View Only
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {formik.values.role.includes("Admin") &&
                  formik.values.admin_permission.includes("-") && (
                    <div className="text-danger">*Required.</div>
                  )}
              </Col>
            </Row>
            {formik.values.role !== "ADMIN" && (
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup className={sm ? "my-1" : ""}>
                  <FormLabel htmlFor="supervisor id">Supervisor Id</FormLabel>
                  <FormControl
                    type="text"
                    name="supervisor"
                    readOnly={
                      props.view.user || formik.values.role.includes("-")
                    }
                    value={formik.values.supervisor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      (formik.errors.supervisor &&
                        (formik.touched.supervisor ||
                          formik.values.supervisor.length > 0)) ||
                      errorsSupervisor.length !== 0
                    }
                    isValid={
                      !formik.errors.supervisor &&
                      (formik.touched.supervisor ||
                        formik.values.supervisor.length > 0)
                    }
                  />
                  {!formik.values.role.includes("-") && (
                    <p className="text-muted">
                      Please select {supervisorSuggestion} as supervisor.
                    </p>
                  )}
                  <div className="invalid-feedback">
                    {formik.errors.supervisor
                      ? formik.errors.supervisor
                      : errorsSupervisor}
                  </div>
                </FormGroup>
              </Col>
            )}
            <div className={sm ? "mt-5" : "float-end"}>
              {!isLoading && (
                <Button
                  className="w-100"
                  disabled={
                    !(formik.dirty && formik.isValid) ||
                    formik.values.role.includes("Role") ||
                    formik.values.role.includes("Admin")
                      ? formik.values.admin_permission.includes("-")
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
export default EmployeeTabContent;
