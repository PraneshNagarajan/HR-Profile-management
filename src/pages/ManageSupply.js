import {
  Card,
  Row,
  Col,
  Button,
  FormGroup,
  InputGroup,
  FormControl,
  FormLabel,
  Spinner,
  Dropdown,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Fragment } from "react/cjs/react.production.min";
import Spinners from "../components/Spinners";
import PageSwitcher from "../components/Pagination";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { PaginationActions } from "../Redux/PaginationSlice";
import { useMediaQuery } from "react-responsive";
import { useFormik } from "formik";
import Multiselect from "multiselect-react-dropdown";
import { FilterProfileActions } from "../Redux/FilterProfileSlice";
import man from "../images/man.png";
import women from "../images/women.png";
import male from "../images/male.jpg";
import female from "../images/female.jpg";
import successIcon from "../images/successIcon.png";
import holdIcon from "../images/holdIcon.png";
import failedIcon from "../images/failedIcon.png";
import Stepper from "react-stepper-horizontal";
import Alerts from "../components/Alert";
import { AlertActions } from "../Redux/AlertSlice";
import { ProfileActions } from "../Redux/ProfileSlice";
import { FaSyncAlt } from "react-icons/fa";

const steps = [
  { state: "success", icon: successIcon, title: "Profile Submitted" },
  { state: "warning", icon: holdIcon, title: "Position Hold" },
  { state: "warning", icon: holdIcon, title: "Feedback Pending" },
  { state: "danger", icon: failedIcon, title: "Screen Reject" },
  { state: "danger", icon: failedIcon, title: "Duplicate" },
  { state: "success", icon: successIcon, title: "Interview Scheduled" },
  { state: "danger", icon: failedIcon, title: "No Show" },
  { state: "danger", icon: failedIcon, title: "L1 Reject" },
  { state: "success", icon: successIcon, title: "L1 Select" },
  { state: "danger", icon: failedIcon, title: "L2 Reject" },
  { state: "success", icon: successIcon, title: "L2 Select" },
  { state: "danger", icon: failedIcon, title: "Client Reject" },
  { state: "warning", icon: holdIcon, title: "Client Hold" },
  { state: "success", icon: successIcon, title: "Client Select" },
  { state: "danger", icon: failedIcon, title: "Declined Before Offer" },
  { state: "success", icon: successIcon, title: "Offered" },
  { state: "danger", icon: failedIcon, title: "Declined After Offer" },
  { state: "success", icon: successIcon, title: "On Boarded" },
];

let statusOptions = {
  "Profile Submitted": [
    { status: "Position Hold", color: "warning" },
    { status: "Screen Reject", color: "danger" },
    { status: "Duplicate", color: "danger" },
    { status: "Interview Scheduled", color: "primary" },
  ],
  "Feedback Pending": [
    { status: "Screen Reject", color: "danger" },
    { status: "Duplicate", color: "danger" },
    { status: "Interview Scheduled", color: "primary" },
  ],
  "Position Hold": [
    { status: "Feedback Pending", color: "warning" },
    { status: "Screen Reject", color: "danger" },
    { status: "Duplicate", color: "danger" },
    { status: "Interview Scheduled", color: "primary" },
  ],
  "Interview Scheduled": [
    { status: "No Show", color: "danger" },
    { status: "L1 Select", color: "primary" },
    { status: "L1 Reject", color: "danger" },
  ],
  "L1 Select": [
    { status: "L2 Reject", color: "danger" },
    { status: "L2 Select", color: "primary" },
  ],
  "L2 Select": [
    { status: "Client Select", color: "primary" },
    { status: "Client Reject", color: "danger" },
    { status: "Client Hold", color: "warning" },
  ],
  "Client Hold": [
    { status: "Client Select", color: "primary" },
    { status: "Declined Before Offer", color: "danger" },
  ],
  "Client Select": [
    { status: "Declined Before Offer", color: "danger" },
    { status: "Offered", color: "primary" },
  ],
  Offered: [
    { status: "Declined After Offer", color: "danger" },
    { status: "On Boarded", color: "primary" },
  ],
};

let title;
let profileKey = "";
let dateFormat = new Date().toISOString().slice(0, 10).replaceAll("-", "/");
let dir = "profile_info.profiles_status.data.";
let dataFlag = true;

const ManageSupply = () => {
  const params = useParams();
  const [supplyList, setSupplyList] = useState({});
  const loggedUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const sm = useMediaQuery({ maxWidth: 768 });
  const filter = useSelector((state) => state.filterProfile);
  const alertData = useSelector((state) => state.alert);
  const error = useSelector((state) => state.filterProfile.errors);
  const currentPage = useSelector((state) => state.pagination.current);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [data, setData] = useState([]);
  const [stepOptions, setStepOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [comment, setComment] = useState({ key: -1, value: "" });
  const [profileView, setProfileView] = useState(false);
  const [viewComment, setViewComment] = useState("");
  const [refreshFlag, setRefershFlag] = useState(false);

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
  // filter profiles based on single or multi catagory
  const onSelectItem = (list, item) => {
    let options = [...selectedOptions];
    options.push(item.value);
    dispatch(
      FilterProfileActions.onTextFilterHandler({
        data,
        options,
        id: formik.values.id,
      })
    );
    setSelectedOptions(options);
  };

  // remove filters
  const onRemoveItem = (list, item) => {
    let options = selectedOptions;
    let index = selectedOptions.findIndex((id) => id === item.key);
    options.splice(index, 1);
    dispatch(
      FilterProfileActions.onTextFilterHandler({
        data,
        options,
        id: formik.values.id,
      })
    );
    setSelectedOptions(options);
  };

  //trigger alert box to select the upcoming status of profile
  const onChangeStatus = (key, step) => {
    setViewComment({});
    setProfileView(false)
    profileKey = key;
    onAlert("Please Select the options", true);
    setStepOptions(step);
  };

  const onViewComment = (pKey) => {
    setProfileView(false);
    setIsSearching(true);
    firestore
      .collection("Demands")
      .doc(params.demandId)
      .get()
      .then((response) => {
        let res_data =
          response.data().profile_info.profiles_status.data[pKey]["comments"];
        if (res_data) {
          setViewComment(res_data);
          onAlert("", true);
        } else {
          setViewComment({});
          onAlert("No comments found.Manage_supply_line:204. ", false);
        }
        setIsSearching(false);
      })
      .catch((err) => {
        onAlert(
          "Unable to fetch comments.Manage_supply_line:235. " + String(err),
          false
        );
        setIsSearching(false);
      });
  };

  //update comments
  const onUpdateComments = (profileName) => {
    setIsSearching(true);
    firestore
      .collection("Demands")
      .doc(params.demandId)
      .update({
        [dir + profileName + ".comments." + new Date().getTime()]: {
          comment: comment.value,
          commented_by: loggedUser.id,
          date: new Date().toString(),
        },
      })
      .then(() => {
        onAlert("Comments added successfully.", true);
        setIsSearching(false);
      })
      .catch((err) => {
        onAlert(
          "Comments added failed.Manage_supply_line:235. " + String(err),
          false
        );
        setIsSearching(false);
      });
    setComment({ key: -1, value: "" });
  };

  //update the status db
  const onUpdateChangesToDB = (step, activeStep) => {
    let finalStatus = {};
    Object.values(supplyList[profileKey].status).map((item, idx) => {
      let title = item.title.includes("(")
        ? item.title.split("(")[0]
        : item.title;
      let value = item.title.includes("(")
        ? item.title.split("(")[1].split(")")[0]
        : "";
      finalStatus[title] = item.titleValue;
      if (supplyList[profileKey].status.length - 1 === idx) {
        firestore
          .collection("Demands")
          .doc(params.demandId)
          .update({
            [dir + profileKey + ".status"]: finalStatus,
            [dir + profileKey + ".current_status"]: step,
            [dir + profileKey + ".activeStep"]: activeStep,
          })
          .catch((err) =>
            onAlert("Manage_supply_line:266. " + String(err), false)
          );
      }
    });
  };

  // if user confirm to update the status eg( L1 -> L2 lvl) change
  //adding icon, title with date for each step and delete steps backward untill step icon is 'successIcon'
  //and disable previous step status options.
  useEffect(() => {
    if (alertData.accept && typeof alertData.data == "string") {
      let tmp_data = supplyList;
      let index = -1;
      let pStatus = tmp_data[profileKey]["status"];
      tmp_data[profileKey].current_status = alertData.data;
      pStatus.map((step, pos) => {
        if (step.title === alertData.data) {
          index = pos;
        }
      });
      title = pStatus[index]["title"];
      //check current status between profile_submit to profile select
      pStatus[index]["title"] = alertData.data + "(" + dateFormat + ")";
      pStatus[0] = {
        ...pStatus[0],
        onClick: () => {},
      };
      if (pStatus[index].state === "danger") {
        let tmp_value = pStatus.slice(0, index + 1);
        tmp_data[profileKey]["status"] = [...tmp_value].filter((item) =>
          item.title.includes("(")
        );
      } else {
        for (let k = index - 1; k >= 1; k--) {
          if (!pStatus[k].title.includes("(")) {
            pStatus.splice(k, 1);
          }
          if (
            pStatus[k].state != "danger" &&
            !pStatus[k].title.includes(alertData.data)
          ) {
            pStatus[k] = {
              ...pStatus[k],
              onClick: () => {},
            };
          }
        }
      }
      pStatus.map((step, pos) => {
        if (step.title.includes(alertData.data)) {
          tmp_data[profileKey].activeStep = pos;
          pStatus[pos].titleValue = {
            value: dateFormat,
            uploaded_by: loggedUser.id,
          };
        }
      });
      onUpdateChangesToDB(alertData.data, tmp_data[profileKey].activeStep);
      setSupplyList(tmp_data);

      dispatch(AlertActions.cancelSubmit());
    }
    if (!alertData.show) {
      setStepOptions([]);
    }
  }, [alertData.accept, !alertData.show]);

  //adding stepper
  const onProcessData = (statusValues) => {
    let keys = Object.keys(statusValues);
    keys.map((key, index) => {
      let status = [];
      let curnt_sts_flag = false;
      steps.map((step, index) => {
        if (statusValues[key]["status"][step.title] !== undefined) {
          title = statusValues[key]["status"][step.title];
          let condition =
            Object.keys(statusOptions).includes(step.title) &&
            (curnt_sts_flag || step.title === statusValues[key].current_status);
          if (condition) {
            curnt_sts_flag = true;
          }
          status.push({
            ...step,
            title:
              title.value.length > 0
                ? step.title + "(" + title.value + ")"
                : step.title,
            titleValue: title,
            onClick: () => {
              if (condition) {
                onChangeStatus(key, statusOptions[step.title]);
              }
            },
          });
        }
      });
      statusValues[key]["status"] = status;
      statusValues[key]["activeStep"] = statusValues[key].activeStep;
      if (keys.length - 1 === index) {
        setData(statusValues);
        setSupplyList(statusValues);
      }
    });
  };

  const viewProfileInfo = (profileID) => {
    setViewComment({});
    dispatch(ProfileActions.handleClear());
    firestore
      .collection("Profiles")
      .doc(profileID)
      .get()
      .then((res) => {
        dispatch(
          ProfileActions.handleAddExistingData({ [profileID]: res.data().info })
        );
        setProfileView(true);
        onAlert(profileID, "");
      })
      .catch((err) => {
        setProfileView(false);
        onAlert(
          "Unable to fetch data. Manage_supply_line:387. " + String(err),
          false
        );
      });
  };

  useEffect(() => {
    if (
      (formik.values.id.length === 0 && selectedOptions.length === 0) ||
      refreshFlag
    ) {
      setSupplyList([]);
      firestore
        .collection("Demands")
        .doc(params.demandId)
        .get()
        .then((response) => {
          let statusValues = response.data().profile_info.profiles_status.data;
          onProcessData(statusValues);
          dataFlag = Object.keys(statusValues).length > 0 ? true : false;
          dispatch(
            PaginationActions.initial({
              size: Object.keys(statusValues).length,
              count: sm ? 5 : 10,
              current: 1,
            })
          );
        })
        .catch((err) =>
          onAlert("manage_supply_line:403. " + String(err), false)
        );
      dispatch(FilterProfileActions.onSetInitial());
    } else {
      dispatch(
        FilterProfileActions.onTextFilterHandler({
          data,
          options: selectedOptions.length > 0 ? selectedOptions : [],
          id: formik.values.id,
        })
      );
    }
    setRefershFlag(false);
  }, [formik.values.id, filter.flag, refreshFlag]);

  useEffect(() => {
    dispatch(
      PaginationActions.initial({
        size: Object.keys(supplyList).length,
        count: sm ? 5 : 5,
        current: 1,
      })
    );
  }, [supplyList, sm]);

  useEffect(() => {
    if (filter.flag) {
      setSupplyList(filter.result);
    }
  }, [filter.result]);

  return (
    <Fragment>
      {Object.keys(supplyList).length === 0 && error.length === 0 && (
        <Spinners />
      )}
      {!dataFlag && (
        <p className="text-danger fw-bold position-absolute top-50 start-50 translate-middle">
          No Profiles upload yet.
        </p>
      )}
      <Fragment>
        {profileView && <Alerts profile={{ flag: profileView, view: true }} />}

        {stepOptions.length == 0 && !profileView && <Alerts flag={true} />}
        {stepOptions.length > 0 && <Alerts status={{ stepOptions }} />}
        {Object.values(viewComment).length > 0 && (
          <Alerts table={viewComment} />
        )}
        <Row className={`mt-3 ${sm ? `mx-2` : ``}`}>
          <Col md={{ span: "6", offset: "2" }} className="mb-1">
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
          <Col md="3">
            <Multiselect
              displayValue="value"
              onRemove={onRemoveItem}
              onSelect={onSelectItem}
              options={[
                {
                  key: 0,
                  value: "Screen Reject",
                },
                {
                  key: 1,
                  value: "Duplicate",
                },
                {
                  key: 2,
                  value: "Feedback Pending",
                },
                {
                  key: 3,
                  value: "Position Hold",
                },
                {
                  key: 4,
                  value: "Interview Scheduled",
                },
                {
                  key: 5,
                  value: "No Show",
                },
                {
                  key: 6,
                  value: "Feedback Pending",
                },
                {
                  key: 7,
                  value: "L1 Select",
                },
                {
                  key: 8,
                  value: "L1 Reject",
                },
                {
                  key: 9,
                  value: "L2 Select",
                },
                {
                  key: 10,
                  value: "L2 Reject",
                },
                {
                  key: 11,
                  value: "Client Select",
                },
                {
                  key: 12,
                  value: "Client Reject",
                },
                {
                  key: 13,
                  value: "Client Hold",
                },
                {
                  key: 14,
                  value: "Declined Before Offer",
                },
                {
                  key: 15,
                  value: "Offered",
                },
                {
                  key: 16,
                  value: "Declined After Offer",
                },
                {
                  key: 17,
                  value: "On Boarded",
                },
              ]}
              showCheckbox
            />
          </Col>
        </Row>
        {error.length === 0 && Object.keys(supplyList).length > 0 && (
          <Fragment>
            <div className="mt-3 d-flex justify-content-center flex-wrap">
              {Object.keys(supplyList)
                .sort()
                .reverse()
                .map((profileName, index) => {
                  if (
                    index >= (currentPage - 1) * (sm ? 5 : 5) &&
                    index < currentPage * (sm ? 5 : 5)
                  ) {
                    return (
                      <Card
                        className={`mx-1 my-2 text-center d-flex flex-wrap shadow border border-2 border-${
                          supplyList[profileName].current_status.includes(
                            "Hold"
                          )
                            ? `warning`
                            : supplyList[profileName].current_status.slice(
                                -2
                              ) === "ed" ||
                              supplyList[profileName].current_status.slice(
                                -4
                              ) === "lect"
                            ? `primary`
                            : `danger`
                        }`}
                        key={index}
                        style={{ width: sm ? "98%" : "99%" }}
                      >
                        <Card.Body>
                          <Row>
                            <Col md="2">
                              <Card.Img
                                src={
                                  profileName.slice(-1) === "M"
                                    ? index % 2 === 0
                                      ? male
                                      : man
                                    : profileName.slice(-1) === "F"
                                    ? index % 2 === 0
                                      ? women
                                      : female
                                    : ""
                                }
                                className={sm ? `w-25` : `w-50`}
                                onClick={() => viewProfileInfo(profileName)}
                                style={{ cursor: "pointer" }}
                              ></Card.Img>
                            </Col>
                            <Col md="4" className="text-center mt-5">
                              <div>
                                <small>
                                  <b>Profile Name : </b>
                                  {profileName}
                                </small>
                              </div>
                              <div>
                                <small>
                                  <b>Current Status : </b>
                                  <span
                                    className={`fw-bold text-${
                                      supplyList[
                                        profileName
                                      ].current_status.includes("Hold")
                                        ? `warning`
                                        : (supplyList[
                                            profileName
                                          ].current_status.slice(-2) === "ed" ||
                                          supplyList[
                                            profileName
                                          ].current_status.slice(-4) === "lect")
                                        ? `primary`
                                        : `danger`
                                    }`}
                                  >
                                    {supplyList[profileName].current_status}
                                  </span>
                                </small>
                              </div>
                            </Col>
                            <Col md="6" className="text-center mt-5">
                              <InputGroup className="mb-3">
                                <FormControl
                                  placeholder="Enter Comments"
                                  value={
                                    comment.key === index ? comment.value : ""
                                  }
                                  onChange={(e) =>
                                    setComment({
                                      value: e.target.value,
                                      key: index,
                                    })
                                  }
                                />
                                {comment.value.length === 0 && (
                                  <Button
                                    variant="outline-secondary"
                                    onClick={() => {
                                      onViewComment(profileName);
                                    }}
                                  >
                                    View Comments
                                  </Button>
                                )}

                                {!isSearching &&
                                  comment.key === index &&
                                  comment.value.length > 0 && (
                                    <Button
                                      variant="outline-primary"
                                      onClick={() => {
                                        onUpdateComments(profileName);
                                      }}
                                    >
                                      Add
                                    </Button>
                                  )}
                                {isSearching && comment.key === index && (
                                  <Button
                                    variant={
                                      comment.value.length > 0
                                        ? "primary"
                                        : "secondary"
                                    }
                                    disabled
                                  >
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                    />{" "}
                                    Adding...
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </Button>
                                )}
                              </InputGroup>
                            </Col>
                          </Row>
                          {!sm && (
                            <Row
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <Stepper
                                steps={[...supplyList[profileName].status]}
                                activeStep={supplyList[profileName].activeStep}
                                circleTop={30}
                                circleFontSize={0}
                                completeColor="#FFFFFF"
                                defaultColor="#FFFFFF"
                                activeColor="#FFFFFF"
                                defaultBorderWidth={10}
                                defaultOpacity="0.2"
                              />
                            </Row>
                          )}
                          {sm &&
                            Object.keys(statusOptions).filter((value) =>
                              value.includes(
                                supplyList[profileName].current_status
                              )
                            ).length > 0 && (
                              <Button
                                onClick={() => {
                                  let selected_status = [
                                    ...supplyList[profileName].status,
                                  ].filter((value) =>
                                    value.title.includes(
                                      supplyList[profileName].current_status
                                    )
                                  );
                                  selected_status[0].onClick();
                                }}
                              >
                                - Select Profile Status -{" "}
                              </Button>
                            )}
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

export default ManageSupply;
