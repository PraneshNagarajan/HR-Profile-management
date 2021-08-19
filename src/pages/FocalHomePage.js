import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Cards from "../components/Cards";
import { Col, Row } from "react-bootstrap";
import Chart from "../components/Charts";
import { firestore } from "../firebase";
import { useEffect } from "react";
import Spinners from "../components/Spinners";
import DateSearchForm from "../components/DateSearchForm";

const FocalHomePage = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [datas, setDatas] = useState([]);
  const [breakups, setBreakups] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  useEffect(() => {
    firestore
      .collection("Dashboard-Focal")
      .doc("Info")
      .get()
      .then((documentSnapshot) => {
        const combinedDatas = [];
        Object.values(documentSnapshot.get("statics")).map((data, index) => {
          const collectData = {
            color: data.color,
            width: sm ? "10.5rem" : "11.5rem",
            title: sm ? (data.title1 ? data.title1 : data.title) : data.title,
            count: data.count,
            levelData: data.levels ? data.levels : [],
          };
          combinedDatas.push(collectData);
        });
        setDatas(combinedDatas);
        setBreakups(Object.values(documentSnapshot.get("breakups")));
      });
  }, []);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setIsSearched(true);
    setFromDate(e.target[0].value);
    setToDate(e.target[1].value);
  };

  return (
    <div>
      {!breakups.length > 0 && <Spinners />}
      {breakups.length > 0 && (
        <div>
          <div
            className={`d-flex flex-wrap mt-3 ${
              sm ? `justify-content-center ` : `ms-1`
            }`}
          >
            {datas.length > 0 && <Cards data={datas} />}
          </div>
          <DateSearchForm submit={onSubmitHandler} />
          <Row className="d-flex flex-wrap justify-content-between">
            <Col md="6">
              <Chart
                title="Skills Breakup"
                type="Vbar"
                datas={breakups[0]}
                flag={isSearched}
                fromDate={fromDate}
                toDate={toDate}
              />
            </Col>
            <Col md={{ span: "6", offset: "" }}>
              <Chart
                title="Days Worked"
                type="Vbar"
                datas={breakups[0]}
                flag={isSearched}
                fromDate={fromDate}
                toDate={toDate}
              />
            </Col>
            <Col md="6">
              <Chart title="Overall status" type="line" datas={breakups[4]} />
            </Col>
            <Col
              md="6"
              className={`d-flex${
                sm ? `-column` : ` flex-wrap justify-content-between`
              }`}
            >
              <Chart
                title="Submitted breakup"
                type="Hbar"
                height={sm ? "" : "45%"}
                width={sm ? "" : "48%"}
                datas={breakups[1]}
                flag={isSearched}
                fromDate={fromDate}
                toDate={toDate}
              />
              <Chart
                title="Interview breakup"
                type="Hbar"
                height={sm ? "" : "45%"}
                width={sm ? "" : "48%"}
                datas={breakups[2]}
                flag={isSearched}
                fromDate={fromDate}
                toDate={toDate}
              />
              <Chart
                title="Offer breakup"
                type="Hbar"
                height={sm ? "" : "45%"}
                width={sm ? "" : "48%"}
                datas={breakups[3]}
                flag={isSearched}
                fromDate={fromDate}
                toDate={toDate}
              />
              <Chart
                title="Level breakup"
                type="Hbar"
                height={sm ? "" : "45%"}
                width={sm ? "" : "48%"}
                datas={breakups[1]}
                flag={isSearched}
                fromDate={fromDate}
                toDate={toDate}
              />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
export default FocalHomePage;
