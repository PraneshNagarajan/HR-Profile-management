import {
  Col,
  FormLabel,
  FormControl,
  Row,
  Button,
  Form,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

const DateSearchForm = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  return (
    <Form className="mx-5 my-1" onSubmit={(e) => props.submit(e)}>
      <Row>
        <Col
          md={{ span: "5", offset: "0" }}
          className="d-flex flex-wrap justify-content-center my-1"
        >
          <Col md="2">
            <FormLabel className="h5 mt-1 d-flex align-self-center mx-1">
              From
            </FormLabel>
          </Col>
          <Col md="10">
            <FormControl type="date" />
          </Col>
        </Col>
        <Col
          md={{ span: "5", offset: "0" }}
          className="d-flex flex-wrap justify-content-center my-1"
        >
          <Col md={{ span: "1", offset: "1" }}>
            <FormLabel
              className={`h5 mt-1 d-flex align-self-center ${
                sm ? `mx-3` : `me-2`
              }`}
            >
              To
            </FormLabel>
          </Col>
          <Col md="10">
            <FormControl type="date" />
          </Col>
        </Col>
        <Col md="2" className="d-flex justify-content-center my-1">
          <Button className="w-100" type="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default DateSearchForm;
