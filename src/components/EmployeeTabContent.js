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
      "^[A-Za-z]{1}[A-Za-z0-9_.-]+[@]{1}[A-Za-z-]+[.]{1}[A-Za-z]{2,3}$"
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
  const pre_requisite = useSelector((state) => state.demandPreRequisite);
  const [Img, setImg] = useState({});
  const [users, setUsers] = useState({});
  const [supervisorOptions, setSupervisorOptions] = useState([]);
  const [errorsEmail, setErrorsEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const empnoRef = firestore.collection("Employee-No");

  const role_list = ["JUNIOR RECRUITER", "SENIOR RECRUITER", "FOCAL"];
  const [roles, setRoles] = useState(role_list);

  const initialValues = {
    id: "",
    email: "",
    role: props.flag ? "SUPERADMIN" : "- Select Role -",
    admin_permission: "- Select Permission -",
    supervisor: "- Select Supervisor -",
  };

  useEffect(() => {
    firestore
      .collection("Employee-Info")
      .doc("users")
      .get()
      .then((res) => {
        setUsers(res.data());
      });
    //if logged user is Superadmin add ADMIN Options.
    if (loggedUser.role === "SUPERADMIN") {
      let newRoles = roles;
      if (!roles.includes("ADMIN")) {
        newRoles.push("ADMIN");
        setRoles(newRoles);
      }
    }
  }, []);

  const onAlert = (msg, flag) => {
    dispatch(
      AlertActions.handleShow({
        msg,
        flag,
      })
    );
  };

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
                    await onAlert("Image uploaded successfully.", true);
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
                    supervisor: infos.employee.supervisor,
                    manager: infos.employee.manager,
                  })
                );
              } else {
                await dispatch(AuthActions.getPhoto(URL.createObjectURL(Img)));
              }
            }
          })
          .catch((err) => {
            onAlert("emptab_line:139" + String(err), false);
          });
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
            await onAlert("Data added successfully.", true);
          })
          .catch((err) => {
            onAlert("emptab_line:152. " + String(err), false);
          });
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
              await onAlert("Data added successfully.", true);
            })
            .catch((err) => {
              onAlert("emptab_line:170. " + String(err), false);
            });
        } else {
          await fireAuth
            .createUserWithEmailAndPassword(
              formik.values.email,
              String(formik.values.id)
            )
            .then(async (res) => {
              res.user.updateProfile({
                displayName: infos.personal.firstname,
              });
              let nxtID = formik.values.id + 1;
              let newSupervisorReportees = await [];
              let supervisorManager = (await value.role.includes("ADMIN"))
                ? props.flag
                  ? String(value.id)
                  : supervisorOptions[0].id
                : "";
                await firestore
                .collection("Employee-No")
                .doc("info")
                .update({ id: Number(value.id) })
                .catch(async (err) => {
                  if (await String(err).includes("No document to update")) {
                    await empnoRef.doc("new").delete();
                    await firestore
                      .collection("Employee-No")
                      .doc("info")
                      .set({ id: Number(value.id) });
                  } else {
                    onAlert("emptab_line:206.", false)
                  }
                });
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
                      supervisor:
                        String(supervisorManager).length > 0
                          ? supervisorManager
                          : value.supervisor,
                      email,
                      admin_permission: props.flag
                        ? true
                        : formik.values.admin_permission.includes("&&")
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
                  if ((await !props.flag) && loggedUser.role != "SUPERADMIN") {
                    let position = pre_requisite.users.findIndex(
                      (item) => item.id === value.supervisor
                    );
                    supervisorManager =
                      value.role === "ADMIN"
                        ? supervisorOptions[0].id
                        : pre_requisite.users[position].supervisor;
                    newSupervisorReportees = pre_requisite.users[position]
                      .reportees
                      ? [...pre_requisite.users[position].reportees]
                      : [];
                    newSupervisorReportees.push(String(value.id));
                  }
                  let supervisor_id = props.flag
                    ? String(value.id)
                    : value.role === "ADMIN"
                    ? supervisorOptions[0].id
                    : value.supervisor;
                  await firestore
                    .collection("Employee-Info")
                    .doc("users")
                    .update({
                      [value.id]: {
                        email,
                        name: infos.personal.firstname,
                        role: formik.values.role,
                        id: String(formik.values.id),
                        supervisor:
                          String(supervisorManager).length > 0
                            ? supervisorManager
                            : value.supervisor,
                        manager:
                          String(supervisorManager).length > 0
                            ? supervisorManager
                            : supervisorManager,
                      },
                      [supervisor_id + ".reportees"]: newSupervisorReportees,
                    })
                    .catch((err) =>
                      onAlert("emptab_line:283" + String(err), false)
                    );
                })
                .catch(async (err) => {
                  await setIsLoading(false);
                  await onAlert(
                    "emptab_line:336" + String(err) + " Data added failed.",
                    false
                  );
                });
              await dispatch(InfoActions.resetForm());
              await formik.setFieldValue("id", nxtID);
              // add notification collection for new user(doc)
              await firestore
                .collection("Notifications")
                .doc(email)
                .set({
                  [new Date().getTime()]: {
                    msg: "Welcome Mr/Mrs." + infos.personal.firstname,
                    status: "unread",
                    link: false,
                    url: "",
                    date: new Date().toString(),
                  },
                })
                .then(async () => {
                  await onAlert("Data added successfully.", true);
                  firestore
                    .collection("Employee-Info")
                    .doc("new")
                    .delete()
                    .catch((err) => onAlert("emptab_line:322", false));
                })
                .catch(async (err) => {
                  onAlert("emptab_line_325", false);
                });
            })
            .catch(async (err) => {
              await onAlert(
                "Emptab_line:317. " + String(err) + "Data added failed.",
                false
              );
            });
        }
      }
      await setIsLoading(false);
    },
  });
  useEffect(() => {
    let profile =
      Object.values(users).length > 1
        ? Object.values(users).filter(
            (user) => user.email === String(formik.values.email).toLowerCase()
          )
        : {};
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

  const onFilterSupervisor = (filter) => {
    let filterDatas = pre_requisite.users.filter((emp) => emp.role === filter);
    setSupervisorOptions(filterDatas);
  };

  useEffect(() => {
    let selectedRole = formik.values.role;
    if (infos.employee.role !== selectedRole && !props.view.user) {
      if (!selectedRole.includes("-")) {
        if (selectedRole === "JUNIOR RECRUITER") {
          onFilterSupervisor("SENIOR RECRUITER");
        } else if (selectedRole === "SENIOR RECRUITER") {
          onFilterSupervisor("FOCAL");
        } else if (selectedRole === "FOCAL") {
          onFilterSupervisor("ADMIN");
        } else {
          // formik.setFieldValue("supervisor", "MG-111111");
          onFilterSupervisor("SUPERADMIN");
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
  }, [formik.values.role]);

  useEffect(() => {
    if (!props.view) {
      empnoRef.onSnapshot((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          if (doc.id === "new") {
            formik.setFieldValue("id", 111111);
          } else {
            empnoRef
              .doc("info")
              .get()
              .then((res) => {
                // this check is very important to prevent app crash if not multiple request occur to down app
                if (res.data().id !== formik.values.id - 1) {
                  formik.setFieldValue("id", res.data().id + 1);
                }
              })
              .catch((err) => {
                onAlert("emptab_line:402. " + String(err), false);
              });
          }
        });
      });
    }
  });

  useEffect(() => {
    if (infos.submitted) {
      formik.resetForm();
      dispatch(InfoActions.getSubmittedStatus());
    }
  }, [infos.submitted]);

  const handleChange = (e) => {
    if (e.target.files[0].size / 1024 > 300) {
      onAlert("file size must be within 300kb.", false);
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
                <FormGroup className={sm ? "my-1" : ""}>
                  <FormLabel htmlFor="employee id">Employee ID</FormLabel>
                  <FormControl
                    type="text"
                    name="id"
                    readOnly={props.flag ? false : true}
                    value={formik.values.id}
                    onChange={formik.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Roles</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={props.view.user || props.flag}
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
                                "supervisor",
                                "- Select Supervisor -"
                              );
                              formik.setFieldValue(
                                "admin_permission",
                                "- Select Permission -"
                              );
                            }}
                            active={formik.values.role.includes(role)}
                          >
                            {role}
                          </Dropdown.Item>
                          {roles.length - 1 > index && <Dropdown.Divider />}
                        </Fragment>
                      );
                    })}
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
                  <FormLabel htmlFor="employee id">Employee Email ID</FormLabel>
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
              {formik.values.role === "ADMIN" && (
                <Col md="5">
                  <FormLabel>Permissions</FormLabel>
                  <Dropdown>
                    <Dropdown.Toggle
                      disabled={
                        !formik.values.role.includes("ADMIN") || props.view.user
                      }
                      variant={`outline-${
                        !formik.values.role.includes("ADMIN") || props.view
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
                  {formik.values.role.includes("ADMIN") &&
                    formik.values.admin_permission.includes("-") && (
                      <div className="text-danger">*Required.</div>
                    )}
                </Col>
              )}
              {formik.values.role !== "ADMIN" &&
                !props.flag &&
                !formik.values.role.includes("-") && (
                  <Col md={{ span: "5" }}>
                    <FormLabel>Supervisor ID</FormLabel>
                    <Dropdown className="dropbox">
                      <Dropdown.Toggle
                        name="supervisor"
                        variant={`outline-${
                          !formik.touched.supervisor
                            ? `primary`
                            : !formik.values.supervisor.includes("-") &&
                              formik.touched.supervisor
                            ? `success`
                            : formik.values.supervisor.includes("-") &&
                              formik.touched.supervisor
                            ? `danger`
                            : ``
                        }`}
                        disabled={props.view.user}
                        onBlur={formik.handleBlur}
                        className="w-100"
                      >
                        {formik.values.supervisor}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="w-100">
                        {supervisorOptions.map((recruiter, index) => {
                          return (
                            <Fragment key={index}>
                              <Dropdown.Item
                                className="text-center"
                                onClick={() => {
                                  formik.setFieldValue(
                                    "supervisor",
                                    recruiter.id
                                  );
                                }}
                              >
                                {recruiter.id}({recruiter.name})
                              </Dropdown.Item>
                              {index < supervisorOptions.length - 1 && (
                                <Dropdown.Divider />
                              )}
                            </Fragment>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                    {formik.errors.supervisor && formik.touched.supervisor && (
                      <div className="text-danger">
                        {formik.errors.supervisor}
                      </div>
                    )}
                  </Col>
                )}
            </Row>
            <div className={sm ? "mt-5" : "float-end"}>
              {!isLoading && (
                <Button
                  className="w-100"
                  disabled={
                    props.flag
                      ? !(
                          String(formik.values.id).length > 0 &&
                          formik.values.email.length > 0
                        )
                      : !(formik.dirty && formik.isValid) ||
                        formik.values.supervisor.includes("-") ||
                        formik.values.role.includes("Role") ||
                        formik.values.role.includes("ADMIN")
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
                  <span className="visually-hidden">Loading....</span>
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
