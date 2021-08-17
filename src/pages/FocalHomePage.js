import { Fragment, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Cards from "../components/Cards";
import { Card, Col, Row } from "react-bootstrap";
import Chart from "../components/Charts";
import { fireAuth, fireStorage, firestore } from "../firebase";
import { useEffect } from "react";

const FocalHomePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [datas, setDatas] = useState([]);
  const [breakups, setBreakups] = useState([]);
  useEffect(() => {
    firestore
      .collection("Dashboard-Focal")
      .doc("Info")
      .get()
      .then((documentSnapshot) => {
        setDatas(Object.values(documentSnapshot.get("statics")));
        setBreakups(Object.values(documentSnapshot.get("breakups")));
      });
  }, []);
  return (
    <div>
      <div
        className={`d-flex flex-wrap mt-3 ${
          sm ? `justify-content-center ` : `ms-1`
        }`}
      >
        {datas.map((data) => {
          return (
            <Cards
              color={data.color}
              width={sm ? "10.5rem" : "11.5rem"}
              title={sm ? (data.title1 ? data.title1 : data.title) : data.title}
              data={data.count}
            />
          );
        })}
      </div>
      <Row className="d-flex flex-wrap justify-content-between">
        <Col md="6">
          {breakups.length > 0 && (
            <Chart title="Skills Breakup" type="Vbar" datas={breakups[0]} />
          )}
        </Col>
        <Col md={{ span: "6", offset: "" }}>
          {breakups.length > 0 && (
            <Chart title="Days Worked" type="Vbar" datas={breakups[0]} />
          )}
        </Col>
        <Col md="6">
          {breakups.length > 0 && (
            <Chart title="Overall status" type="line" datas={breakups[4]} />
          )}
        </Col>
        <Col
          md="6"
          className={`d-flex${
            sm ? `-column` : ` flex-wrap justify-content-between`
          }`}
        >
          {breakups.length > 0 && (
            <Chart
              title="Submitted breakup"
              type="Hbar"
              height={sm ? "" : "45%"}
              width={sm ? "" : "48%"}
              datas={breakups[1]}
            />
          )}
          {breakups.length > 0 && (
            <Chart
              title="Interview breakup"
              type="Hbar"
              height={sm ? "" : "45%"}
              width={sm ? "" : "48%"}
              datas={breakups[2]}
            />
          )}
          {breakups.length > 0 && (
            <Chart
              title="Offer breakup"
              type="Hbar"
              height={sm ? "" : "45%"}
              width={sm ? "" : "48%"}
              datas={breakups[3]}
            />
          )}
          {breakups.length > 0 && (
            <Chart
              title="Level breakup"
              type="Hbar"
              height={sm ? "" : "45%"}
              width={sm ? "" : "48%"}
              datas={breakups[1]}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};
export default FocalHomePage;