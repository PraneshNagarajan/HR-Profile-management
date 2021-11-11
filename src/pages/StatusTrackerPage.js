import { useEffect, useState } from "react";
import { Col, FormControl, Card, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Fragment } from "react/cjs/react.production.min";
import Spinners from "../components/Spinners";
import PageSwitcher from "../components/Pagination";
import { firestore } from "../firebase";
import { useMediaQuery } from "react-responsive";
import { useDispatch } from "react-redux";
import { PaginationActions } from "../Redux/PaginationSlice";
import { useFormik } from "formik";
import Multiselect from "multiselect-react-dropdown";
import { FilterDemandActions } from "../Redux/FilterDemandSlice";
import { Link } from "react-router-dom";

const StatusTrackerPage = () => {
  const data = [
    { id: "FO-1111121636468555961JR-111111", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111114", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111111", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111111", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111119", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111111", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111119", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Unstarted" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887SR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111114", status: "Completed" },
    { id: "FO-1111119635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Inprogress" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
  ];

  const sm = useMediaQuery({ maxWidth: 768 });
  const filter = useSelector((state) => state.filterDemand);
  const [supplyList, setSupplyList] = useState([]);
  const demandRef = firestore.collection("Demands");
  const loggedUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.filter.errors);
  const currentPage = useSelector((state) => state.pagination.current);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const formik = useFormik({
    initialValues: {
      id: "",
    },
  });

  const onSelectItem = (list, item) => {
    let options = [...selectedOptions];
    options.push(item.key);
    dispatch(
      FilterDemandActions.onTextFilterHandler({ data, options, id: formik.values.id })
    );
    setSelectedOptions(options);
  };

  const onRemoveItem = (list, item) => {
    let options = selectedOptions;
    let index = selectedOptions.findIndex((id) => id === item.key);
    options.splice(index, 1);
    dispatch(
      FilterDemandActions.onTextFilterHandler({ data, options, id: formik.values.id })
    );
    setSelectedOptions(options);
  };

  useEffect(() => {
    if (formik.values.id.length === 0) {
      // demandRef.onSnapshot((querySnapshot) => {
      //   querySnapshot.docs.map((item, index) => {
      //     if (item.id.includes(loggedUser.id)) {
      //       data.push({id: item.id, status: item.data().status});
      //     }
      //     if (querySnapshot.docs.length - 1 === index) {
      //       setSupplyList(data);
      //     }
      //   });
      // });
      setSupplyList(data);
      dispatch(FilterDemandActions.onSetInitial());
    } else {
      dispatch(
        FilterDemandActions.onTextFilterHandler({
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
        size: supplyList.length,
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
      {supplyList.length === 0 && error.length === 0 && <Spinners />}
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
              displayValue="key"
              onRemove={onRemoveItem}
              onSelect={onSelectItem}
              options={[
                {
                  key: "Unstarted",
                },
                {
                  key: "Inprogress",
                },
                {
                  key: "Completed",
                },
                {
                  key: "Submitted",
                },
              ]}
              showCheckbox
            />
          </Col>
        </Row>
        {error.length === 0 && supplyList.length > 0 && (
          <Fragment>
            <div className="mt-3 d-flex justify-content-center flex-wrap">
              {supplyList.map((demand, index) => {
                if (
                  index >= (currentPage - 1) * (sm ? 10 : 20) &&
                  index < currentPage * (sm ? 10 : 20)
                ) {
                  return (
                    <Card
                      className={`mx-1 my-2 text-center text-white bg-${
                        demand.status === "Submitted"
                          ? "primary"
                          : demand.status === "Completed"
                          ? "success"
                          : String(demand.status).includes("Inprogress")
                          ? "warning"
                          : "danger"
                      }`}
                      key={index}
                      as={Link}
                      to={"/manageSupply/"+demand.id}
                    >
                      <Card.Body>
                        <small>
                          <b>{demand.id} </b>
                        </small>
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

export default StatusTrackerPage;
