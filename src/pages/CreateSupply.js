import {
  Card,
  Row,
  Col,
  Container,
  Button,
  Form,
  FormGroup,
  InputGroup,
  FormControl,
  FormLabel,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { Fragment, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./CreateSupply.css";
import Spinners from "../components/Spinners";
import Alerts from "../components/Alert";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { firestore } from "../firebase";
import { useDispatch } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";


const CreateSupply = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const pre_requisite = useSelector((state) => state.demandPreRequisite);
  const [files, setFiles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    demand_id: "",
    recruiter_id: "",
    clientname: "",
    endclientname: "",
    location: "",
    panlocation: "",
    type: "",
    demand: 8,
    demandallot: "",
    primarytech: "",
    primaryskill: "",
    secondarytech: "",
    secondaryskill: "",
  });

  const handleChange = (e) => {
    if (e.target.files[0]) {
      let data = [];
      let size = []
      let profile = [...e.target.files]
      Object.values(e.target.files).map((file) => {
        if(files.length > 0) {
          console.log(files[1].length)
          console.log([...e.target.files].length)
          console.log(files[1].length+[...e.target.files].length )
          console.log("test : "+!(files[1].length+[...e.target.files].length > formik.values.demand))
          if(! (files[1].length+[...e.target.files].length > formik.values.demand)){
            if(files[1].includes(file.name)) {
              dispatch(
                AlertActions.handleShow({
                  msg: "Anyone of the files that you selected that was added already. Duplicate profile entry.",
                  flag: false,
                })
              )
              return true;
            } else {
              data = files[1]
              profile = files[0]
              data.push(file.name);
              profile.push(file)
              size.push(file.size/1024)
            }
          }
          else {
            dispatch(
              AlertActions.handleShow({
                msg: "Selected profile is more than demand. Demand : "+formik.values.demand+", but you have selected : "+(files[1].length+[...e.target.files].length),
                flag: false,
              })
            )
          }
        } else {
          if([...e.target.files].length > formik.values.demand) {
            dispatch(
              AlertActions.handleShow({
                msg: "Selected profile is more than demand. Demand : "+formik.values.demand+", but you have selected : "+[...e.target.files].length,
                flag: false,
              })
            )
          } else {
            data.push(file.name);
            size.push(file.size/1024)
          }
          }
      });
     
      if(data.length >0){
        setFiles([profile, data]);
      } 
    }
  };

  const removePofilehandler = (index) => {
    let new_list1 = files[0];
    let new_list2 = files[1];
    new_list1.splice(index, 1);
    new_list2.splice(index, 1);
    setFiles([new_list1, new_list2]);
  };

  const formik = useFormik({
    initialValues,
    validate: (value) => {
      const errors = {};
      if (!value.demand_id) {
        errors.demand_id = "*Required.";
      }
      return errors;
    },
    onSubmit: (value) => {
      setIsLoading(true);
    },
  });

  return (
    <Fragment>
      {Object.values(pre_requisite.recruiters).length > 0 && <Spinners />}
      <Alerts />
      {!Object.values(pre_requisite.recruiters).length > 0 && (
        <Container className="d-flex justify-content-center ">
          <Card className={`my-3 ${sm ? `w-100` : `w-75`}`}>
            <Card.Header className="bg-primary text-center text-white">
              <h4>Create Supply</h4>
            </Card.Header>
            <Card.Body className="mb-4">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <Row>
                      <Col md="4">
                        <FormLabel>
                          <b>Demand ID</b>
                        </FormLabel>
                      </Col>
                      <Col md="8">
                        <InputGroup className="mb-3">
                          <FormControl
                            placeholder="Enter demand ID"
                            name="demand_id"
                            isInvalid={
                              formik.errors.demand_id &&
                              formik.touched.demand_id
                            }
                            isValid={
                              !formik.errors.demand_id &&
                              formik.touched.demand_id
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <Button variant="outline-primary">Search</Button>
                        </InputGroup>

                        {((formik.errors.demand_id &&
                          formik.touched.demand_id) ||
                          !formik.values.demand_id.length > 0) && (
                          <div className="text-danger">
                            {formik.errors.demand_id}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <Row>
                      <Col md="4">
                        <FormLabel>
                          <b>Recruiter Name</b>
                        </FormLabel>
                      </Col>
                      <Col md="8">
                        <FormControl
                          name="recruiter_id"
                          readOnly
                          value={formik.values.recruiter_id}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                <Col md="12">
                  <div className="row">
                    <Col md="6" className="my-2">
                      <FormLabel>
                        <b>Client Name</b>
                      </FormLabel>
                      <FormGroup>
                        <FormControl
                          type="text"
                          name="clientname"
                          readOnly
                          value={formik.values.clientname}
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6" className="my-2">
                      <FormLabel>
                        <b>End Client Name</b>
                      </FormLabel>
                      <FormGroup>
                        <FormControl
                          type="text"
                          name="endclientname"
                          readOnly
                          value={formik.values.endclientname}
                        />
                      </FormGroup>
                    </Col>
                  </div>
                </Col>

                <Col md="12">
                  <div className="row">
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Location</b>
                        </FormLabel>
                        <FormControl
                          type="text"
                          name="location"
                          readOnly
                          value={formik.values.location}
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Pan Location</b>
                        </FormLabel>
                        <FormControl
                          type="text"
                          name="panlocation"
                          value={formik.values.panlocation}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </div>
                </Col>

                <Col md="12">
                  <Row>
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Demand</b>
                        </FormLabel>
                        <FormControl
                          type="number"
                          name="demand"
                          readOnly
                          value={formik.values.demand}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Date of Demand Allocation</b>
                        </FormLabel>
                        <FormControl
                          type="text"
                          name="demandallot"
                          readOnly
                          value={formik.values.demandallot}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>

                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <FormLabel>
                      <b>Primary Skills</b>
                    </FormLabel>
                    <Row>
                      <Col md="6" className="my-1">
                        <FormGroup>
                          <FormLabel>
                            <b>Technology</b>
                          </FormLabel>
                          <FormControl
                            type="text"
                            name="primarytech"
                            readOnly
                            value={formik.values.primarytech}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6" className="my-1">
                        <FormGroup>
                          <FormLabel>
                            <b>Skill</b>
                          </FormLabel>
                          <FormControl
                            type="text"
                            name="primaryskill"
                            readOnly
                            value={formik.values.primaryskill}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <FormLabel>
                      <b>Secondary Skills</b>
                    </FormLabel>
                    <Row>
                      <Col md="6" className="my-1">
                        <FormGroup>
                          <FormLabel>
                            <b>Technology</b>
                          </FormLabel>
                          <FormControl
                            type="text"
                            name="secondarytech"
                            readOnly
                            value={formik.values.secondarytech}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6" className="my-1">
                        <FormGroup>
                          <FormLabel>
                            <b>Skill</b>
                          </FormLabel>
                          <FormControl
                            type="text"
                            name="secondaryskill"
                            readOnly
                            value={formik.values.secondaryskill}
                          />
                        </FormGroup>
                        {formik.errors.secondaryskill &&
                          formik.touched.secondaryskill && (
                            <div className="text-danger">
                              {formik.errors.secondaryskill}
                            </div>
                          )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <hr className="my-5" />
                <FormGroup>
                  <FormLabel>
                    <b>Status</b>
                  </FormLabel>
                  <ProgressBar
                    animated
                    striped
                    variant="primary"
                    now={59}
                    label={<b>5 / 10 profiles are uploaded.</b>}
                  />
                </FormGroup>
                <hr className="my-5" />
                <b>Upload profiles</b>
                <div className="text-center">
                  <FormControl
                    type="file"
                    multiple
                    accept=".pdf,.docx"
                    onChange={handleChange}
                    value=""
                    disabled={files[1] ? (files[1].length < formik.values.demand ? false : true) : false}
                    placeholder="select profiles"
                  />
                </div>
                {files.length > 0 && (
                 <Fragment>
                    <p>File Count : <b>{files[0].length}</b></p>
                  <div
                    className="d-flex flex-wrap my-2 border border-primary border-2 "
                    style={{ maxHeight: "150px", overflowY: "scroll" }}
                  >
                    {files[1].map((file, index) => {
                      return (
                        <Card
                          key={index}
                          className={`shadow m-1 w-30 border ${files[0][index].size / 1024 > 300  ? `bg-danger border-danger` : `bg-success border-success`}`}
                        >
                          <Card.Body className="d-flex justify-content-between text-white">
                            <Button
                              className="position-absolute top-0 end-0 me-1 btn-close bg-white rounded-circle"
                              style={{height : '8px', width:'8px'}}
                              onClick={() => removePofilehandler(index)}
                            ></Button>
                            <b className="mt-1">{file}</b>
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </div>
                 </Fragment>
                )}
                <Col className="text-center">
                  {!isLoading && (
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!(formik.dirty && formik.isValid)}
                      className={`my-3 ${sm ? `w-100` : `w-75`}`}
                    >
                      Submit
                    </Button>
                  )}
                  {isLoading && (
                    <Button
                      variant="primary"
                      className={`my-3 ${sm ? `w-100` : `w-75`}`}
                      disabled
                    >
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Processing...
                      <span className="visually-hidden">Loading...</span>
                    </Button>
                  )}
                </Col>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      )}
    </Fragment>
  );
};
export default CreateSupply;
