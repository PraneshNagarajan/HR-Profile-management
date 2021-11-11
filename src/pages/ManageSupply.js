import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Fragment } from "react/cjs/react.production.min";
import Spinners from "../components/Spinners";
import PageSwitcher from "../components/Pagination";
import { useDispatch } from "react-redux";
import { Col, FormControl, Card, Row } from "react-bootstrap";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { PaginationActions } from "../Redux/PaginationSlice";
import { useMediaQuery } from "react-responsive";
import { useFormik } from "formik";
import Multiselect from "multiselect-react-dropdown";
import { FilterActions } from "../Redux/FilterSlice";
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

const steps1 = [
  {
    icon: failedIcon,
    title: "Screen Reject",
  },
  {
    icon: failedIcon,
    title: "Duplicate",
  },
  {
    icon: holdIcon,
    title: "Feedback Pending",
  },
  {
    icon: holdIcon,
    title: "Position Hold",
  },
];
const steps2 = [
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

let options1 = {
  2: [{ status: "Position Hold", color: "warning" }],
  3: [
    { status: "Screen Reject", color: "danger" },
    { status: "Duplicate", color: "danger" },
    { status: "Interview Scheduled", color: "primary" },
  ],
};

let options2 = {
  0: [
    { status: "No Show", color: "danger" },
    { status: "L1 Select", color: "primary" },
    { status: "L1 Reject", color: "danger" },
  ],
  3: [
    { status: "L2 Reject", color: "danger" },
    { status: "L2 Select", color: "primary" },
  ],
  5: [
    { status: "Client Select", color: "primary" },
    { status: "Client Reject", color: "danger" },
    { status: "Client Hold", color: "warning" },
  ],
  8: [
    { status: "Declined Before Offer", color: "danger" },
    { status: "Offered", color: "primary" },
  ],
  10: [
    { status: "Declined After Offer", color: "danger" },
    { status: "On Boarded", color: "primary" },
  ],
};

let profileKey = "";
let getData = [];
let date = new Date();
let dateFormat = "(" +
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
  const filter = useSelector((state) => state.filter);
  const alertData = useSelector((state) => state.alert);
  const error = useSelector((state) => state.filter.errors);
  const currentPage = useSelector((state) => state.pagination.current);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [data, setData] = useState([]);
  const [stepOptions, setStepOptions] = useState([]);

  // console.log(supplyList);
  //   useEffect(() => {
  //     firestore
  //       .collection("Demands")
  //       .doc(params.demandId)
  //       .get()
  //       .then((data) => {
  //         setDemandData(data);
  //         dispatch(
  //           PaginationActions.initial({
  //             size: data.profiles.length,
  //             count: sm ? 10 : 20,
  //             current: 1,
  //           })
  //         );
  //       })
  //       .catch((err) => console.log(String(err)));
  //   }, [params.demandId]);

  const formik = useFormik({
    initialValues: {
      id: "",
    },
  });

  // filter profiles based on single or multi catagory
  const onSelectItem = (list, item) => {
    let options = [...selectedOptions];
    options.push(item.key);
    dispatch(
      FilterActions.onTextFilterHandler({ data, options, id: formik.values.id })
    );
    setSelectedOptions(options);
  };

  // remove filters
  const onRemoveItem = (list, item) => {
    let options = selectedOptions;
    let index = selectedOptions.findIndex((id) => id === item.key);
    options.splice(index, 1);
    dispatch(
      FilterActions.onTextFilterHandler({ data, options, id: formik.values.id })
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

  const onUpdateChangesToDB = (step) => {
    let dir = "profile_info.profiles_status.data."+profileKey
    firestore.collection('Demands').doc(params.demandId).update({[dir+".status."+step] : dateFormat.slice(1,dateFormat.length-1), [dir+".current_status"] : step}).catch(err => console.log(String(err)))
  }

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
      //check whether first step is "Interview Scheduled"
      if (
        tmp_data[profileKey]["status"][0].title.includes("Interview Scheduled")
      ) {
        tmp_data[profileKey]["status"][index].title =
          alertData.data +dateFormat

        tmp_data[profileKey].activeStep = index;

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
      } else {
        let tmp = [];
        for (let i in steps1) {
          if (steps1[i].title === alertData.data) {
            tmp = {
              ...steps1[i],
              onClick: () => {
                if (options1[i]) {
                  onChangeStatus(profileKey, options1[i]);
                }
              },
            };
            tmp_data[profileKey]["status"][0] = {
              ...tmp,
              title:
                alertData.data + dateFormat
            };
          }
        }
        //delete first step
        if (Object.values(tmp).length === 0) {
          tmp_data[profileKey]["status"].splice(0, 1);
          tmp_data[profileKey]["status"][0].title =
            alertData.data +dateFormat
        }
      }
      onUpdateChangesToDB(alertData.data)
      setSupplyList(tmp_data);
      dispatch(AlertActions.cancelSubmit());
    }
  }, [alertData.accept]);

  const onProcessData = (statusValues) => {
    let keys = Object.keys(statusValues);
    keys.map((key, index) => {
      let activeStep1 = -1;
      let activeStep2 = -1;
      let status1 = [];
      let status2 = [];
      steps1.map((step, index) => {
        if (statusValues[key]["status"][step.title].length > 0) {
          status2.push({
            ...step,
            title:
              step.title + "(" + statusValues[key]["status"][step.title] + ")",
            onClick: () => {
              if (options1[index]) {
                onChangeStatus(key, options1[index]);
              }
            },
          });
          activeStep1 += 1;
        }

        status1.push({
          ...step,
          onClick: () => {
            profileKey = key;
            onSelectFirstStatus(steps1[index].title);
          },
        });
      });
      steps2.map((step, index) => {
        if (statusValues[key]["status"][step.title].length > 0) {
          status2.push({
            ...step,
            title:
              step.title + "(" + statusValues[key]["status"][step.title] + ")",
            onClick: () => {
              if (options2[index]) {
                onChangeStatus(key, options2[index]);
              }
            },
          });
          activeStep2 += 1;
        } else {
          status2.push({
            ...step,
            onClick: () => {
              if (options2[index]) {
                onChangeStatus(key, options2[index]);
              }
            },
          });
        }
      });

      if (activeStep1 === -1 && activeStep2 === -1) {
        status1.unshift({
          title: "Submitted",
          icon: successIcon,
        });
        status1.push({
          title: "Interview Scheduled",
          icon: successIcon,
          onClick: () => {
            profileKey = key;
            onSelectFirstStatus("Interview Scheduled");
          },
        });
      }
      let combinedStatus =
        activeStep1 === -1 && activeStep2 === -1 ? [...status1] : [...status2];
      statusValues[key]["status"] = combinedStatus;
      statusValues[key]["activeStep"] =
        activeStep1 === -1 && activeStep2 === -1
          ? status1.length - 1
          : activeStep2 === -1
          ? 0
          : activeStep2;
      if (keys.length - 1 === index) {
        setData(statusValues);
        setSupplyList(statusValues);
      }
    });
  };

  const onSelectFirstStatus = (step) => {
    let statusValues = getData; 
    statusValues[profileKey]["status"][step] =
    alertData.data +dateFormat
    onProcessData(statusValues);
    onUpdateChangesToDB(step)
  };

  useEffect(() => {
    if (formik.values.id.length === 0) {
      firestore
        .collection("Demands")
        .doc(params.demandId)
        .get()
        .then((response) => {
          getData = response.data().profile_info.profiles_status.data;
          let statusValues = response.data().profile_info.profiles_status.data;
          console.log(getData);
          onProcessData(statusValues);
          dispatch(
            PaginationActions.initial({
              size: data.profiles.length,
              count: sm ? 10 : 20,
              current: 1,
            })
          );
        })
        .catch((err) => console.log(String(err)));
      dispatch(FilterActions.onSetInitial());
    } else {
      dispatch(
        FilterActions.onTextFilterHandler({
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
        size: supplyList.profile_info
          ? Object.keys(supplyList.profile_info.profiles_status.data).length
          : 0,
        count: sm ? 10 : 20,
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
        <Alerts
          flag={stepOptions.length > 0 ? true : false}
          stepOptions={stepOptions}
        />
        <Row className={`mt-3 ${sm ? `mx-2` : ``}`}>
          <Col md={{ span: "6", offset: "2" }} className="mb-1">
            <FormControl
              placeholder="Enter Demand ID"
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
                  index >= (currentPage - 1) * (sm ? 10 : 20) &&
                  index < currentPage * (sm ? 10 : 20)
                ) {
                  return (
                    <Card
                      className={`mx-1 my-2 text-center`}
                      key={index}
                      style={{ width: sm ? "98%" : "99%" }}
                    >
                      <Card.Body>
                        <Row>
                          <Col md="2">
                            <Card.Img
                              src={
                                demand.slice(-1).toLowerCase() === "m"
                                  ? index % 2 === 0
                                    ? male
                                    : man
                                  : index % 2 === 0
                                  ? women
                                  : female
                              }
                              className={sm ? `w-25` : `w-75`}
                            ></Card.Img>
                          </Col>
                          <Col
                            md={{ span: "8", offset: "1" }}
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
