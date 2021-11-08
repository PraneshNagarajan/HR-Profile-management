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
import successCheck from "../images/success_check.png";
import Stepper from "react-stepper-horizontal";

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

  console.log(params.demandId);
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

  useEffect(() => {
    if (formik.values.id.length === 0) {
      firestore
        .collection("Demands")
        .doc(params.demandId)
        .get()
        .then((response) => {
          setSupplyList(response.data());
          setData(response.data());
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
              {Object.keys(supplyList.profile_info.profiles_status.data).map(
                (demand, index) => {
                  console.log(demand);
                  if (
                    index >= (currentPage - 1) * (sm ? 10 : 20) &&
                    index < currentPage * (sm ? 10 : 20)
                  ) {
                    return (
                      <Card
                        className={`mx-1 my-2 text-center`}
                        key={index}
                        style={{ width: sm ? '98%' : '48%' }}
                      >
                        <Card.Body>
                          <Row >
                            <Col md="3">
                              <Card.Img
                                src={index % 2 === 0 ? man : male}
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
                                  {
                                    supplyList.profile_info.profiles_status
                                      .data[demand].current_status
                                  }
                                </small>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Stepper
                              steps={[
                                { title: "Step One" ,icon: successCheck},
                                { title: "Step Two"  ,icon: successCheck},
                                { title: "Step Three" ,icon: successCheck},
                                { title: "Step Four"  ,icon: successCheck},
                              ]}
                              activeStep={1}
                              circleTop={30}
                              circleFontSize={1}
                              completeColor="#FFFFFF"
                              defaultColor="#FFFFFF"
                              activeColor="#FFFFFF"
                              completeBarColor ="#33cc33"
                            />
                          </Row>
                        </Card.Body>
                      </Card>
                    );
                  }
                }
              )}
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
