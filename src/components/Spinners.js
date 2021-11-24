import "./Spinners.css";
import { Spinner } from "react-bootstrap";

const Spinners = (props) => {
  return (
    <div className="spinner">
      {" "}
      <Spinner animation="border" variant="primary" />
      <div className="text-center spinner" style={{inset: "20% auto 0 auto"}}>
      {props.children}
      </div>
    </div>
  );
};

export default Spinners;
