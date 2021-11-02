import { useEffect, useState } from "react";
import { Col, FormControl ,Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Fragment } from "react/cjs/react.production.min";
import Spinners from "../components/Spinners";
import { firestore } from "../firebase";

const StatusTrackerPage = () => {
  const [supplyList, setSupplyList] = useState([]);
  const demandRef = firestore.collection("Demands");
  const loggedUser = useSelector((state) => state.auth);
  const [demand, setDemand] = useState("");
  const [error, setError] = useState(false);
  

  useEffect(() => {
    let data = [];
    demandRef.onSnapshot((querySnapshot) => {
      querySnapshot.docs.map((item, index) => {
        if (item.id.includes(loggedUser.id)) {
          data.push(item.id);
        }
        if (querySnapshot.docs.length - 1 === index) {
          setSupplyList(data);
        }
      });
    });
  });

  return (
    <Fragment>
      {supplyList.length === 0 && <Spinners />}
      {supplyList.length > 0 && (
        <Fragment>
          <Col md={{ span: "6", offset: "3" }} className="mt-3">
              <FormControl
                placeholder="Enter Demand ID"
                type="text"
                name="Demand_id"
                value={demand}
                isInvalid={error}
                onChange={(e) => setDemand(e.target.value)}
              />
          </Col>
          <div className="mt-5 d-flex justify-content-center flex-wrap">
          {supplyList.map((id,index) => {
            if(demand.length > 0 ) {
                if(id.includes(demand)){
                    return (
                        <Card className="w-50 my-2" key={index}>
                          <Card.Body>
                            <p>{id}</p>
                          </Card.Body>
                        </Card>
                      );
                } else {
                   return( <p className="text-danger">*Invalid Demand id / No don't have Permission.</p>)
                }
            } else {
                return (
                    <Card className="w-50  my-2" key={index}>
                      <Card.Body>
                        <p>{id}</p>
                      </Card.Body>
                    </Card>
                  );
            }
          })}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default StatusTrackerPage;
