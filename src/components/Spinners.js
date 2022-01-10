import "./Spinners.css";
import { Spinner } from "react-bootstrap";

const Spinners = (props) => {
  return (
    <div className="spinner">
      {" "}
      <Spinner animation="border" variant="primary" />
      <div className="text-center spinner" style={{inset: "0 auto 0 auto"}}>
      <div style={{marginTop: "10%"}}>
      {props.children}
      </div>
      </div>
    </div>
  );
};

export default Spinners;
