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
  {
    icon: successIcon,
    title: "Interview Scheduled",
  },
  {
    icon: failedIcon,
    title: "No Show",
  },
  {
    icon: holdIcon,
    title: "Feedback Pending",
  },
  {
    icon: successIcon,
    title: "L1 Select",
  },
  {
    icon: failedIcon,
    title: "L1 Reject",
  },
  {
    icon: successIcon,
    title: "L2 Select",
  },
  {
    icon: failedIcon,
    title: "L2 Reject",
  },
  {
    icon: successIcon,
    title: "Client Select",
  },
  {
    icon: failedIcon,
    title: "Client Reject",
  },
  {
    icon: holdIcon,
    title: "Client Hold",
  },
  {
    icon: failedIcon,
    title: "Declined Before Offer",
  },
  {
    icon: successIcon,
    title: "Offered",
  },
  {
    icon: failedIcon,
    title: "Declined After Offer",
  },
  {
    icon: successIcon,
    title: "On Boarded",
  },
];

const ManageSupply = () => {
  const params = useParams();
  const [supplyList, setSupplyList] = useState({});
  const dispatch = useDispatch();
  const sm = useMediaQuery({ maxWidth: 768 });
  const md = useMediaQuery({ maxWidth: 992 });
  const filter = useSelector((state) => state.filter);
  const error = useSelector((state) => state.filter.errors);
  const currentPage = useSelector((state) => state.pagination.current);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [data, setData] = useState([]);

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

  const onSelectItem = (list, item) => {
    let options = [...selectedOptions];
    options.push(item.key);
    dispatch(
      FilterActions.onTextFilterHandler({ data, options, id: formik.values.id })
    );
    setSelectedOptions(options);
  };

  const onRemoveItem = (list, item) => {
    let options = selectedOptions;
    let index = selectedOptions.findIndex((id) => id === item.key);
    options.splice(index, 1);
    dispatch(
      FilterActions.onTextFilterHandler({ data, options, id: formik.values.id })
    );
    setSelectedOptions(options);
  };

  const onChangeStatus = (key, step) => {
    alert(key + " : " + step);
  };
  useEffect(() => {
    if (formik.values.id.length === 0) {
      firestore
        .collection("Demands")
        .doc(params.demandId)
        .get()
        .then((response) => {
          // setSupplyList(response.data());
          let responseData = response.data();
          let statusValues = responseData.profile_info.profiles_status.data;
          // console.log(statusValues["60544_Invoice---Copy-(2)"]["status"])
          let keys = Object.keys(statusValues);
          keys.map((key, index) => {
            console.log(key);
            let activeStep1 = -1;
            let activeStep2 = 0;
            let status1 = [];
            let status2 = [];
            steps1.map((step) => {
              if (statusValues[key]["status"][step.title].length > 0) {
                status1.push({
                  ...step,
                  title:
                    step.title +
                    "(" +
                    statusValues[key]["status"][step.title] +
                    ")",
                  onClick: () => onChangeStatus(key, steps1.title),
                });
                activeStep1 += 1;
              }
            });
            steps2.map((step, index) => {
              if (statusValues[key]["status"][step.title].length > 0) {
                status2.push({
                  ...step,
                  title:
                    step.title +
                    "(" +
                    statusValues[key]["status"][step.title] +
                    ")",
                  onClick: () =>
                    onChangeStatus(
                      key,
                      steps2[index + 1 < steps2.length ? index + 1 : index]
                        .title
                    ),
                });
                activeStep2 += 1;
              } else {
                status2.push({
                  ...step,
                  onClick: () =>
                    onChangeStatus(
                      key,
                      steps2[index + 1 < steps2.length ? index + 1 : index]
                        .title
                    ),
                });
              }
            });
            if (activeStep1 === -1) {
              status2.unshift({
                title: "Submitted",
                icon: successIcon,
                onClick: () => onChangeStatus(key, "Interview Scheduled"),
              });
            }
            let combinedStatus =
              status1.length > 0
                ? [...status1].concat([...status2])
                : [...status2];
            statusValues[key]["status"] = combinedStatus;
            statusValues[key]["activeStep"] =
              activeStep1 === -1 ? activeStep2 : 0;
            console.log(statusValues);
            if (keys.length - 1 === index) {
              setData(statusValues);
              setSupplyList(statusValues);
            }
          });
          // dispatch(
          //   PaginationActions.initial({
          //     size: data.profiles.length,
          //     count: sm ? 10 : 20,
          //     current: 1,
          //   })
          // );
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

  console.log(supplyList);
  return (
    <Fragment>
      {Object.keys(supplyList).length === 0 && error.length === 0 && (
        <Spinners />
      )}
      <Fragment>
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
                              className="w-75"
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
                        <Row>
                          <Stepper
                            steps={[...supplyList[demand].status]}
                            activeStep={supplyList[demand].activeStep}
                            circleTop={30}
                            circleFontSize={0}
                            completeColor="#FFFFFF"
                            defaultColor="#FFFFFF"
                            activeColor="#FFFFFF"
                            defaultBorderWidth={10}
                            // activeTitleColor="#3333ff"
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
