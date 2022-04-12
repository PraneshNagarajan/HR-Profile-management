import { useEffect, useState } from "react";
import {
  Col,
  FormControl,
  Card,
  Row,
  FormCheck,
  Badge,
  Button,
} from "react-bootstrap";
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
import { FaSyncAlt, FaCertificate } from "react-icons/fa";

let data = [];
const StatusTrackerPage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const filter = useSelector((state) => state.filterDemand);
  const [supplyList, setSupplyList] = useState([]);
  const loggedUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const filterError = useSelector((state) => state.filterDemand.errors);
  const currentPage = useSelector((state) => state.pagination.current);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [refreshFlag, setRefershFlag] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      id: "",
    },
  });

  const onDispatchActions = (Options) => {
    dispatch(
      FilterDemandActions.onTextFilterHandler({
        supplyList: data,
        options: Options.length > 0 ? Options : [],
        id: formik.values.id,
      })
    );
  };

  const onSelectItem = (list, item) => {
    let options = [...selectedOptions];
    options.push(item.key);
    onDispatchActions(options);
    setSelectedOptions(options);
  };

  const onRemoveItem = (list, item) => {
    let options = selectedOptions;
    let index = selectedOptions.findIndex((id) => id === item.key);
    options.splice(index, 1);
    onDispatchActions(options);
    setSelectedOptions(options);
  };

  useEffect(() => {
    if (
      (formik.values.id.length === 0 && selectedOptions.length === 0) ||
      refreshFlag
    ) {
      data = [];
      firestore.collection("Demands").onSnapshot((querySnapshot) => {
        setError(querySnapshot.size > 0 ? "" : "No Demands/Supplies found.");
        querySnapshot.docs.map((item, index) => {
          if (
            item.data().info.owners.includes(loggedUser.id) ||
            [...item.data().info.assignees].includes(String(loggedUser.id))
          ) {
            data.push({ id: item.id, status: item.data().info.status });
          }
          if (querySnapshot.docs.length - 1 === index) {
            setSupplyList(data);
            setRefershFlag(false);
          }
        });
      });
      dispatch(FilterDemandActions.onSetInitial());
    } else {
      onDispatchActions(selectedOptions);
    }
  }, [formik.values.id, refreshFlag]);

  useEffect(() => {
    dispatch(
      PaginationActions.initial({
        size: supplyList.length,
        count: sm ? 10 : 40,
        current: 1,
      })
    );
  }, [supplyList, sm]);

  useEffect(() => {
    setSupplyList(filter.result);
  }, [filter.result]);

  return (
    <Fragment>
      {supplyList.length === 0 &&
        filterError.length === 0 &&
        error.length === 0 && <Spinners />}
      <Fragment>
        <Row className={`mt-3 ${sm ? `mx-2` : ``}`}>
          <Col md={{ span: "6", offset: "2" }} className="mb-1">
            <FormControl
              placeholder="Enter ID"
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
                onClick={() => setRefershFlag(refreshFlag)}
                style={{ color: "#0d6efd" }}
              />
            </span>
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
        <div className="d-flex justify-content-around">
          <span className="d-flex">
            <FaCertificate
              size="15"
              style={{ color: "#dc3545", marginTop: "5px" }}
            />
            <p className="ms-1"> - Unstarted</p>
          </span>
          <span className="d-flex">
            <FaCertificate
              size="15"
              style={{ color: "#ffc107", marginTop: "5px" }}
            />
            <p className="ms-1"> - Inprogress</p>
          </span>
          <span className="d-flex">
            <FaCertificate
              size="15"
              style={{ color: "#0d6efd", marginTop: "5px" }}
            />
            <p className="ms-1"> - Completed</p>
          </span>
          <span className="d-flex">
            <FaCertificate
              size="15"
              style={{ color: "#198754", marginTop: "5px" }}
            />
            <p className="ms-1"> - Submitted</p>
          </span>
        </div>
        {error.length === 0 && supplyList.length > 0 && (
          <Fragment>
            <div className="mt-3 d-flex justify-content-center flex-wrap">
              {[...supplyList]
                .sort()
                .reverse()
                .map((demand, index) => {
                  if (
                    index >= (currentPage - 1) * (sm ? 10 : 40) &&
                    index < currentPage * (sm ? 10 : 40)
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
                        to={
                          (loggedUser.role === "FOCAL"
                            ? "/viewSupply/"
                            : "/createSupply/") + demand.id
                        }
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
            <div className="d-flex justify-content-center mt-5">
              <PageSwitcher />
            </div>
          </Fragment>
        )}
        {filterError.length > 0 && (
          <p className="fw-bold text-center text-danger mt-5">{filterError}</p>
        )}
        {error.length > 0 && (
          <p className="fw-bold text-center text-danger mt-5">{error}</p>
        )}
      </Fragment>
    </Fragment>
  );
};

export default StatusTrackerPage;
