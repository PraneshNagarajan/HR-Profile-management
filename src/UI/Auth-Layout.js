import "./Auth-Layout.css";
import { Col, Card } from "react-bootstrap";
import { FaReact } from "react-icons/fa";
import { Fragment } from "react";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

const AuthLayout = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const md = useMediaQuery({ minWidth: 768, maxWidth: 992 });
  const msgFlag = useSelector(state => state.auth.msg) 
  return (
    <div
      className="bg-hero"
      style={{
        backgroundImage: sm
          ? "linear-gradient(to bottom right, #0d6efd , #0d6efd)"
          : "",
      }}
    >
      <div
        className={
          sm
            ? msgFlag
              ? "shadow  position-sticky top-0"
              : " shadow my-4"
            : "bg-text p-5"
        }
      >
        <div className="text-white">
          <Col>
            <div className={sm ? "d-flex ms-3" : "column"}>
              <FaReact
                style={{
                  width: "80px",
                  height: "80px",
                }}
              ></FaReact>
              {sm && (
                <div className="ms-2">
                  <p className="display-5 mt-3" style={{ lineHeight: "0.5" }}>
                    {" "}
                    HirePRO
                  </p>
                  <p className="ms-1">slogan ! slogan ! slogan!</p>
                </div>
              )}
            </div>
            <Col>
              {!sm && (
                <Fragment>
                  <p className="display-3">HIRE<span className="fst-italic">PRO</span></p>
                  <p className="display-5">slogan ! slogan ! slogan!</p>
                </Fragment>
              )}
            </Col>
          </Col>
        </div>
        <hr className="text-white" />
      </div>

      <div
        className={sm ? "d-flex justify-content-center mt-5" : "bg-design"}
        style={{ backgroundColor: sm ? "#0d6efd" : "" }}
      >
        <Card
          style={{ width: sm ? "90%" : md ? "40%" : "30%" }}
          className="mt-5"
        >
          {props.children}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
