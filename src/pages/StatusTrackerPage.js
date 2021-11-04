import { findAllByTestId } from "@testing-library/react";
import { useEffect, useState } from "react";
import { Col, FormControl, Card, InputGroup, DropdownButton, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Fragment } from "react/cjs/react.production.min";
import Spinners from "../components/Spinners";
import PageSwitcher from "../components/Pagination";
import { firestore } from "../firebase";
import { useMediaQuery } from "react-responsive";
import { useDispatch } from "react-redux";
import { PaginationActions } from "../Redux/PaginationSlice";
import { useFormik } from "formik";

const StatusTrackerPage = () => {
  const data = [
    { id: "FO-1111111635861804887JR-111111", status: "pending" },
    { id: "FO-1111111635861804887JR-111114", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "pending" },
    { id: "FO-1111111635861804887JR-111111", status: "pending" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "pending" },
    { id: "FO-1111111635861804887JR-111111", status: "pending" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "pending" },
    { id: "FO-1111111635861804887JR-111111", status: "pending" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "pending" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Completed" },
    { id: "FO-1111111635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887SR-111111", status: "Submitted" },
    { id: "FO-1111111635861804887JR-111114", status: "Completed" },
    { id: "FO-1111119635861804887JR-111111", status: "new" },
    { id: "FO-1111111635861804887JR-111111", status: "Submitted" },
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
  const [demand, setDemand] = useState("");
  const currentPage = useSelector((state) => state.pagination.current);
  const [selectedOptions, setSelectedOptions] = useState([])

  const formik = useFormik({
    initialValues: {
      id: "",
    },
  });

  const onSelectedOptionsChange = (value) => {
    let data = selectedOptions
    let index = data.indexOf(value)
    if(index >= 0) {
      data.pop(index)
    } else {
      data.push(value)
    }
    setSelectedOptions(data)
  }
console.log(selectedOptions)
  useEffect(() => {
    if (demand.length === 0) {
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
    }
  }, [formik.values.id]);

  useEffect(() => {
    dispatch(
      PaginationActions.initial({
        size: supplyList.length,
        count: sm ? 10 : 20,
        current : 1
      })
    );
  }, [supplyList, sm]);
console.log(selectedOptions)
  useEffect(() => {
    let result = [];
    let tmp_result = [];
    const timeout = setTimeout(() => {
      if (formik.values.id.length > 0 || selectedOptions.length > 0) {
        data.map((item, index) => {
          if (item.id.includes(formik.values.id)) {
            result.push(item);
          }
          if(selectedOptions.includes(item.status) && result.filter(filterItem => filterItem.id === item.id).length === 0){
            result.push(item)
          }
          if (data.length - 1 === index && result.length > 0) {
            setSupplyList(result);
          }
        });
        if (!result.length > 0) {
          formik.setFieldError(
            "id",
            "*Invalid Demand id / No don't have Permission."
          );
        } else {
          formik.setFieldError("id", "");
        }
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [formik.values.id, selectedOptions]);

  return (
    <Fragment>
      {supplyList.length === 0 && <Spinners />}
      {supplyList.length > 0 && (
        <Fragment>
          <Col
            md={{ span: "6", offset: "3" }}
            className={`mt-3 ${sm ? `mx-2` : ``}`}
          >
            <InputGroup>
            <FormControl
              placeholder="Enter Demand ID"
              type="text"
              name="id"
              value={formik.values.id}
              isInvalid={formik.errors.id}
              onChange={formik.handleChange}
            />
            </InputGroup>
                     <FormControl as="select"  onChange={(e) => onSelectedOptionsChange(e.target.value)}>
      <option key={"Completed"} value={"Completed"} >
        {"Completed"}
      </option>
  </FormControl>
            {formik.errors.id && (
              <p className="text-danger">{formik.errors.id}</p>
            )}
          </Col>
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
                        : String(demand.status).includes("pending")
                        ? "warning"
                        : "danger"
                    }`}
                    key={index}
                  >
                    <Card.Body>
                      <p>
                        <b> ID : </b> {demand.id}
                      </p>
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
    </Fragment>
  );
};

export default StatusTrackerPage;
