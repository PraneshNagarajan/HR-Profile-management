import { Card, Row, Col, FormControl } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Fragment } from "react/cjs/react.production.min";
import Spinners from "../components/Spinners";
import PageSwitcher from "../components/Pagination";
import { useDispatch } from "react-redux";
import { firestore } from "../firebase";
import { PaginationActions } from "../Redux/PaginationSlice";
import { useMediaQuery } from "react-responsive";
import { useFormik } from "formik";
import {
  FaRegTrashAlt,
  FaTrashRestoreAlt,
  FaEdit,
  FaEye,
  FaSyncAlt,
} from "react-icons/fa";
import Alerts from "../components/Alert";
import { AlertActions } from "../Redux/AlertSlice";
import {} from "react-icons/fa";
import { useHistory } from "react-router-dom";

let dataFlag = true;

const ManageEmployee = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alert);
  const filter = useSelector((state) => state.filterProfile);
  const currentPage = useSelector((state) => state.pagination.current);
  const pre_requisite = useSelector((state) => state.demandPreRequisite);
  const [employeeList, setEmployeeList] = useState({});
  const loggedUser = useSelector((state) => state.auth);
  const sm = useMediaQuery({ maxWidth: 768 });
  const [error, setError] = useState("");
  const [refreshFlag, setRefershFlag] = useState(false);
  const [deletedDatas, setDeletedDatas] = useState({
    roles: [],
    reportees: [],
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      comments: "",
    },
  });

  const onAlert = (msg, flag) => {
    dispatch(
      AlertActions.handleShow({
        msg,
        flag,
      })
    );
  };

  useEffect(() => {
    setEmployeeList([]);
    setError("");
    firestore
      .collection("Employee-Info")
      .doc("users")
      .get()
      .then((user) => {
        let list = [];
        let data = user.data();
        let reportees = Object.values(data);
        reportees
          .filter(
            (user) =>
              user.id != loggedUser.id &&
              user.role != "SUPERADMIN" &&
              user.role != loggedUser.role
          )
          .map((emp, index) => {
            if (formik.values.id.length > 0 && emp.includes(formik.values.id)) {
              list.push(emp);
            } else if (!formik.values.id.length > 0) {
              list.push(emp);
            }
            dispatch(
              PaginationActions.initial({
                size: list.length,
                count: sm ? 5 : 10,
                current: 1,
              })
            );
          });
        if (list.length == 0) {
          setError("No Employees found.");
        }
        setEmployeeList(list);
      })
      .catch((err) =>
        onAlert(
          "manage_employee_line:113.unable to fetch employees details",
          false
        )
      );
    setRefershFlag(false);
  }, [formik.values.id, filter.flag, refreshFlag]);

  useEffect(() => {
    if (alerts.accept && typeof alerts.data === "object") {
      firestore
        .collection("Employee-Info")
        .doc("users")
        .get()
        .then((res) => {
          let newSupervisorReportees = [];
          let users = res.data();
          let managerID = users[alerts.data.newSupervisor].supervisor;
          newSupervisorReportees = users[alerts.data.newSupervisor].reportees
            ? users[alerts.data.newSupervisor].reportees
            : [];

          [...alerts.data.selectedReportees].map((reportee) => {
            newSupervisorReportees.push(reportee);
          });

          console.log(newSupervisorReportees);

          let rm_existing_list = users[alerts.data.id].reportees.filter(
            (emp) => !alerts.data.selectedReportees.includes(emp)
          );

          let reportees = rm_existing_list.map((emp) =>
            reportees.push({ value: emp })
          );
          setDeletedDatas((prevItems) => {
            return { ...prevItems, reportees: rm_existing_list };
          });
          console.log(rm_existing_list);

          alerts.data.selectedReportees.map((emp, index) => {
            let upt_value = {
              [emp + ".supervisor"]: alerts.data.newSupervisor,
              [emp + ".manager"]: managerID,
              [alerts.data.newSupervisor + ".reportees"]:
                newSupervisorReportees,
            };
            upt_value[alerts.data.id + ".state"] =
              rm_existing_list.length > 0 ? "active" : "inactive";
            upt_value[alerts.data.id + ".reportees"] = rm_existing_list;
            console.log(upt_value);
            firestore
              .collection("Employee-Info")
              .doc("users")
              .update(upt_value)
              .then(() => {
                firestore
                  .collection("Employee-Info")
                  .doc(users[emp].email)
                  .update({
                    ["profile.employee.supervisor"]: alerts.data.newSupervisor,
                  })
                  .catch((err) =>
                    onAlert("manage-employee-line-152." + String(err), false)
                  );
                if (alerts.data.selectedReportees.length - 1 === index) {
                  onAlert("Data added successfully.");
                }
              })
              .catch((err) => {
                onAlert("emptab_line:158" + String(err), false);
              });
          });
        });
      dispatch(AlertActions.cancelSubmit());
    }
  }, [alerts.accept]);

  useEffect(() => {
    dispatch(
      PaginationActions.initial({
        size: Object.keys(employeeList).length - 1,
        count: sm ? 5 : 6,
        current: 1,
      })
    );
  }, [employeeList, sm]);

  const onDeleteEmployee = (id) => {
    let user = employeeList.filter((user) => user.id === id);
    let roles = pre_requisite.users.filter(
      (emp) => emp.role === user[0].role && emp.id != user[0].id
    );
    let reportees = [];
    if (user[0].reportees) {
      user[0].reportees.map((emp) => reportees.push({ value: emp }));
    }

    setDeletedDatas({ roles, reportees, id });
    dispatch(
      AlertActions.handleShow({
        msg: "The Employee (" + user[0].id + ") has been deleted suceesfully.",
        flag: true,
      })
    );
  };

  useEffect(() => {
    if (filter.flag) {
      setEmployeeList(filter.result);
    }
  }, [filter.result]);

  return (
    <Fragment>
      {Object.keys(employeeList).length === 0 && error.length === 0 && (
        <Spinners />
      )}
      {!dataFlag && (
        <p className="text-danger fw-bold position-absolute top-50 start-50 translate-middle">
          No Profiles upload yet.
        </p>
      )}
      <Fragment>
        {Object.keys(deletedDatas.reportees).length > 0 && (
          <Alerts delete={deletedDatas} />
        )}
        {!Object.keys(deletedDatas.reportees).length > 0 && (
          <Alerts flag={true} />
        )}
        <Row className={`mt-3 ${sm ? `mx-2` : ``}`}>
          <Col md={{ span: "6", offset: "3" }} className="mb-1">
            <FormControl
              placeholder="Enter Profile ID"
              type="text"
              name="id"
              value={formik.values.id}
              isInvalid={formik.errors.id}
              onChange={formik.handleChange}
              autoComplete="off"
            />
            <span
              className="float-end me-2"
              style={{ position: "relative", marginTop: "-33px" }}
            >
              <FaSyncAlt
                role="button"
                onClick={() => setRefershFlag(true)}
                style={{ color: "#0d6efd" }}
              />
            </span>
          </Col>
        </Row>
        {error.length === 0 && Object.keys(employeeList).length > 0 && (
          <Fragment>
            <div className="mt-3 d-flex justify-content-around flex-wrap">
              {employeeList
                .sort((a, b) => Number(a) > Number(b))
                .map((emp, index) => {
                  if (
                    index >= (currentPage - 1) * (sm ? 5 : 6) &&
                    index < currentPage * (sm ? 5 : 6) &&
                    (emp.state == "active" || loggedUser.role == "SUPERADMIN")
                  ) {
                    return (
                      <Card
                        className={`my-2 text-center d-flex flex-wrap shadow border border-2 border-${
                          emp.state == "active" ? "primary" : "danger"
                        }`}
                        key={index}
                        style={{
                          width: sm ? "98%" : "48%",
                          cursor: loggedUser.admin ? "" : "cursor",
                          maxWidth: "100%",
                        }}
                      >
                        <Card.Body>
                          <Row>
                            <Col
                              md="3"
                              className="d-flex-column align-self-center"
                            >
                              <Card.Img
                                className={`img-fluid img-thumbnail rounded ${
                                  sm ? "" : " float-start"
                                }`}
                                src={emp.img_url}
                                style={{ width: "140px", height: "140px" }}
                              ></Card.Img>
                            </Col>
                            <Col md="8" className="align-self-center">
                              <>
                                <div
                                  className={
                                    sm
                                      ? "d-flex-column"
                                      : "d-flex justify-content-between"
                                  }
                                >
                                  <div>
                                    <small>
                                      <b>Employee ID : </b>
                                      {emp.id}
                                    </small>
                                  </div>
                                  <div>
                                    <small>
                                      <b>Role: </b>
                                      {emp.role}
                                    </small>
                                  </div>
                                </div>
                                <div
                                  className={
                                    sm
                                      ? "d-flex-column"
                                      : "d-flex justify-content-between"
                                  }
                                >
                                  <div>
                                    <small>
                                      <b>Employee Name: </b>
                                      {emp.name}
                                    </small>
                                  </div>
                                  <div>
                                    <small>
                                      <b>Supervisor : </b>
                                      {emp.supervisor}
                                    </small>
                                  </div>
                                </div>
                                {!sm && (
                                  <div
                                    className={
                                      sm
                                        ? "d-flex-column"
                                        : "d-flex justify-content-between"
                                    }
                                  >
                                    <small>
                                      <b>Email : </b>
                                      {emp.email}
                                    </small>
                                    <small>
                                      <b>Manager: </b>
                                      {emp.manager}
                                    </small>
                                  </div>
                                )}
                                {loggedUser.admin && (
                                  <div className="d-flex justify-content-around mt-3">
                                    {emp.state == "active" && (
                                      <FaRegTrashAlt
                                        size="20px"
                                        style={{
                                          color: "Red",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          onDeleteEmployee(emp.id);
                                        }}
                                      />
                                    )}

                                    {emp.state == "inactive" && (
                                      <FaTrashRestoreAlt
                                        size="20px"
                                        style={{
                                          color: "green",
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}

                                    <FaEye
                                      className={`sm ? "" : "ms-5" text-primary`}
                                      size="20px"
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        history.push(
                                          "/manageEmployeeProfile/view/" +
                                            emp.id +
                                            "?activeTab=personal-info",
                                          "_blank"
                                        )
                                      }
                                    />
                                    <FaEdit
                                      className={`sm ? "" : "ms-5" text-secondary`}
                                      size="20px"
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        history.push(
                                          "/manageEmployeeProfile/edit/" +
                                            emp.id +
                                            "?activeTab=personal-info"
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    );
                  }
                })}
            </div>
            <div className="d-flex justify-content-center mt-4">
              <PageSwitcher />
            </div>
          </Fragment>
        )}
        {error.length > 0 && (
          <p className="fw-bold text-center text-danger mt-5">{error}</p>
        )}
      </Fragment>
    </Fragment>
  );
};

export default ManageEmployee;
