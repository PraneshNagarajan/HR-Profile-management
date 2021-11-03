import { findAllByTestId } from "@testing-library/react";
import { useEffect, useState } from "react";
import { Col, FormControl, Card } from "react-bootstrap";
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
  const [error, setError] = useState(false);
  const currentPage = useSelector((state) => state.pagination.current);

  const formik = useFormik({
    initialValues: {
      id: "",
    },
  });

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

  useEffect(() => {
    let result = [];
    const timeout = setTimeout(() => {
      if (formik.values.id.length > 0) {
        data.map((item, index) => {
          if (item.id.includes(formik.values.id)) {
            result.push(item);
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
  }, [formik.values.id]);

  return (
    <Fragment>
      {supplyList.length === 0 && <Spinners />}
      {supplyList.length > 0 && (
        <Fragment>
          <Col
            md={{ span: "6", offset: "3" }}
            className={`mt-3 ${sm ? `mx-2` : ``}`}
          >
            <FormControl
              placeholder="Enter Demand ID"
              type="text"
              name="id"
              value={formik.values.id}
              isInvalid={formik.errors.id}
              onChange={formik.handleChange}
            />
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
