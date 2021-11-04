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

const StatusTrackerPage = () => {
  const data = [
    { id: "FO-1111111635861804887JR-111111", status: "Inprogress" },
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
  const [supplyList, setSupplyList] = useState([]);
  const demandRef = firestore.collection("Demands");
  const loggedUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const currentPage = useSelector((state) => state.pagination.current);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const formik = useFormik({
    initialValues: {
      id: "",
    },
  });

  const onCatagoryFilterHandler = (dataLists, options) => {
    let datas = options.length > 0 ? [] : dataLists;
    dataLists.map((item, index) => {
      if (options.includes(item.status)) {
        datas.push(item);
      }
    });
    return datas;
  };

  const onTextFilterHandler = (options) => {
    let result = [];
    data.map((item, index) => {
      if (item.id.includes(formik.values.id)) {
        result.push(item);
      }
      if (data.length - 1 === index && result.length > 0) {
        let output = onCatagoryFilterHandler(
          formik.values.id.length > 0 || options.length > 0 ? result : data,
          options
        );
        result = output;
        setSupplyList(output);
      }
    });
    setError(result.length === 0 ? "No match found." : "");
  };

  const onSelectItem = (list, item) => {
    let options = [...selectedOptions];
    options.push(item.key);
    onTextFilterHandler(options);
    setSelectedOptions(options);
  };

  const onRemoveItem = (list, item) => {
    let options = selectedOptions;
    let index = selectedOptions.findIndex((id) => id === item.key);
    options.splice(index, 1);
    onTextFilterHandler(options);
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
    } else {
      onTextFilterHandler(selectedOptions.length > 0 ? selectedOptions : []);
    }
  }, [formik.values.id]);

  useEffect(() => {
    dispatch(
      PaginationActions.initial({
        size: supplyList.length,
        count: sm ? 10 : 20,
        current: 1,
      })
    );
  }, [supplyList, sm]);

  return (
    <Fragment>
      {supplyList.length === 0 && <Spinners />}
      {supplyList.length > 0 && (
        <Fragment>
          <Row className={`mt-3 ${sm ? `mx-2` : ``}` }>
          <Col
            md={{ span: "6", offset: "2" }}
            className="mb-1"
          >
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
          {error.length === 0 && (
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
      )}
    </Fragment>
  );
};

export default StatusTrackerPage;
