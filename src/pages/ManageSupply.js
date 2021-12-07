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

const steps = [
  { state: "success", icon: successIcon, title: "Profile Submitted" },
  { state: "danger", icon: failedIcon, title: "Screen Reject" },
  { state: "danger", icon: failedIcon, title: "Duplicate" },
  { state: "warning", icon: holdIcon, title: "Feedback Pending" },
  { state: "warning", icon: holdIcon, title: "Position Hold" },
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
  "Feedback Pending": [{ status: "Position Hold", color: "warning" }],
  "Position Hold": [
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
let date = new Date();
let dateFormat =
  "(" +
  date.getDate() +
  "/" +
  (date.getMonth() + 1) +
  "/" +
  date.getFullYear() +
  ")";

const ManageSupply = () => {
  const params = useParams();
  const [supplyList, setSupplyList] = useState({});
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

  const formik = useFormik({
    initialValues: {
      id: "",
      comments: ""
    },
  });

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
    profileKey = key;
    dispatch(
      AlertActions.handleShow({
        msg: "Please Select the options",
        flag: true,
      })
    );
    setStepOptions(step);
  };

  //update the status db
  const onUpdateChangesToDB = (step, activeStep) => {
    let dir = "profile_info.profiles_status.data." + profileKey;
    let finalStatus = {};
    Object.values(supplyList[profileKey].status).map((item, idx) => {
      let title = item.title.includes("(")
        ? item.title.split("(")[0]
        : item.title;
      let value = item.title.includes("(")
        ? item.title.split("(")[1].split(")")[0]
        : "";
      finalStatus[title] = value;
      if (supplyList[profileKey].status.length - 1 === idx) {
        firestore
          .collection("Demands")
          .doc(params.demandId)
          .update({
            [dir + ".status"]: finalStatus,
            [dir + ".current_status"]: step,
            [dir + ".activeStep"]: activeStep,
          })
          .catch((err) => console.log(String(err)));
      }
    });
  };

  // if user confirm to update the status eg( L1 -> L2 lvl) change
  useEffect(() => {
    if (alertData.accept) {
      let tmp_data = supplyList;
      let index = -1;
      tmp_data[profileKey]["status"].map((step, pos) => {
        if (step.title === alertData.data) {
          index = pos;
        }
      });
      title = tmp_data[profileKey]["status"][index]["title"];
      //check current status between profile_submit to profile select
      if (steps.slice(0, 6).filter((item) => item.title === title).length > 0) {
        tmp_data[profileKey]["status"][index]["title"] =
          alertData.data + dateFormat;
        tmp_data[profileKey]["status"][0] = {
          ...tmp_data[profileKey]["status"][0],
          onClick: () => {},
        };
        if (tmp_data[profileKey]["status"][index].state === "danger") {
          let tmp_value = [
            tmp_data[profileKey]["status"][0],
            tmp_data[profileKey]["status"][index],
          ];
          tmp_data[profileKey]["status"] = tmp_value;
        } else {
          for (let k = index - 1; k >= 1; k--) {
            if (!tmp_data[profileKey]["status"][k].title.includes("(")) {
              tmp_data[profileKey]["status"].splice(k, 1);
            }
          }
        }
      }
      //check whether first step is "Interview Scheduled"
      else if (steps.slice(7).filter((item) => item.title === title).length > 0)
        tmp_data[profileKey]["status"][index].title =
          alertData.data + dateFormat;

      for (let k = index - 1; k >= 0; k--) {
        if (tmp_data[profileKey]["status"][k].state !== "success") {
          tmp_data[profileKey]["status"].splice(k, 1);
        }
        if (
          tmp_data[profileKey]["status"][k].state === "success" &&
          !tmp_data[profileKey]["status"][k].title.includes(alertData.data)
        ) {
          tmp_data[profileKey]["status"][k] = {
            ...tmp_data[profileKey]["status"][k],
            onClick: () => {},
          };
        }
      }
      tmp_data[profileKey]["status"].map((step, pos) => {
        if (step.title.includes(alertData.data)) {
          tmp_data[profileKey].activeStep = pos;
        }
      });
      onUpdateChangesToDB(alertData.data, tmp_data[profileKey].activeStep);
      setSupplyList(tmp_data);
      dispatch(AlertActions.cancelSubmit());
    }
  }, [alertData.accept]);

  //adding icon, title with date for each step and delete steps backward untill step icon is 'successIcon'
  //and disable previous step status options.
  const onProcessData = (statusValues) => {
    let tmp_status = [];
    let keys = Object.keys(statusValues);
    keys.map((key, index) => {
      let status = [];
      steps.map((step, index) => {
        if (statusValues[key]["status"][step.title] !== undefined) {
          title = statusValues[key]["status"][step.title];
          status.push({
            ...step,
            title:
              title.length > 0 ? step.title + "(" + title + ")" : step.title,
            onClick: () => {
              if (
                Object.keys(statusOptions).includes(step.title) &&
                index >= statusValues[key].activeStep
              ) {
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

  useEffect(() => {
    if (formik.values.id.length === 0 && selectedOptions.length === 0) {
      firestore
        .collection("Demands")
        .doc(params.demandId)
        .get()
        .then((response) => {
          let statusValues = response.data().profile_info.profiles_status.data;
          onProcessData(statusValues);
          dispatch(
            PaginationActions.initial({
              size: data.profiles.length,
              count: sm ? 5 : 10,
              current: 1,
            })
          );
        })
        .catch((err) => console.log(String(err)));
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
  }, [formik.values.id, filter.flag]);

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
      <Fragment>
        {stepOptions.length > 0 && (
          <Alerts flag={true} status={{ stepOptions }} />
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
              {Object.keys(supplyList).map((demand, index) => {
                if (
                  index >= (currentPage - 1) * (sm ? 5 : 5) &&
                  index < currentPage * (sm ? 5 : 5)
                ) {
                  return (
                    <Card
                      className={`mx-1 my-2 text-center shadow border border-2 border-${
                        supplyList[demand].current_status.includes("Hold")
                          ? `warning`
                          : supplyList[demand].current_status.slice(-2) ===
                              "ed" ||
                            supplyList[demand].current_status.slice(-4) ===
                              "lect"
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
                                demand.slice(-1) === "M"
                                  ? index % 2 === 0
                                    ? male
                                    : man
                                  : demand.slice(-1) === "F"
                                  ? index % 2 === 0
                                    ? women
                                    : female
                                  : ""
                              }
                              className={sm ? `w-25` : `w-50`}
                            ></Card.Img>
                          </Col>
                          <Col
                            md="4"
                            className="text-center mt-5"
                          >
                            <div>
                              <small>
                                <b>Profile Name : </b>
                                {demand}
                              </small>
                            </div>
                            <div>
                              <small>
                                <b>Current Status : </b>
                                {supplyList[demand].current_status}
                              </small>
                            </div>
                          </Col>
                        <Col md="6" className="text-center mt-5">
                          <InputGroup className="mb-3">
                            <FormControl
                              placeholder="Enter Comments"
                              name="comments"
                              value={formik.values.comments}
                              isInvalid={
                                formik.errors.comments &&
                                formik.touched.comments
                              }
                              isValid={
                                !formik.errors.comments &&
                                formik.touched.comments
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {!isSearching && (
                              <Button
                                variant="outline-primary"
                                onClick={()=>{}}
                                disabled={
                                  isSearching ||
                                  !formik.values.comments.length > 0
                                }
                              >
                                Search
                              </Button>
                            )}
                            {isSearching && (
                              <Button variant="primary" disabled>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />{" "}
                                Searching...
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Button>
                            )}
                          </InputGroup>

                          {formik.touched.comments &&
                            (!formik.values.comments.length > 0 ||
                              formik.errors.comments) && (
                              <div className="text-danger">
                                {formik.errors.comments}
                              </div>
                            )}

                        </Col>
                        </Row>
                        <Row style={{ cursor: "pointer" }}>
                          <Stepper
                            steps={[...supplyList[demand].status]}
                            activeStep={supplyList[demand].activeStep}
                            circleTop={30}
                            circleFontSize={0}
                            completeColor="#FFFFFF"
                            defaultColor="#FFFFFF"
                            activeColor="#FFFFFF"
                            defaultBorderWidth={10}
                            defaultOpacity="0.2"
                          />
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

export default ManageSupply;
