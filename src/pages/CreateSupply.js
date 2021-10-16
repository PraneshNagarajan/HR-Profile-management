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
  Tabs,
  Tab,
} from "react-bootstrap";
import { Fragment, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./CreateSupply.css";
import Spinners from "../components/Spinners";
import Alerts from "../components/Alert";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { fireStorage, firestore } from "../firebase";
import { useDispatch } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";

const initialValues = {
  demand_id: "",
  profile_id: "",
  recruiter: "",
  clientname: "",
  endclientname: "",
  location: "",
  panlocation: "",
  type: "",
  demand: 0,
  demandallot: "",
  primarytech: "",
  primaryskill: "",
  secondarytech: "",
  secondaryskill: "",
  status: "",
  file_count: 0,
};

const CreateSupply = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [files, setFiles] = useState([]);
  const [filenames, setFileNames] = useState([]);
  const [uploadType, setUploadType] = useState("PC");
  const [uploadFlag, setUploadFlag] = useState(false);
  const [addedProfiles, setAddedProfiles] = useState([]);
  const [totalFileCount, setTotalFileCount] = useState([]);
  const [searchProfrileDB, setSearchProfileDB] = useState([]);

  const alertMsg = (present, size) => {
    let msg1 =
      "The profile '" +
      present.join(", ") +
      (present.length > 1 ? " are" : " is") +
      " ' present in Database. \nDuplicate Entry.";
    let msg2 =
      (size.length > 1 ? "These files ' " : "This file ' ") +
      size.join(", ") +
      " ' are greater than 300kb. \nThe file size must be <= 300kb.";
    let combinedMsg = "";
    if (present.length > 0 && size.length > 0) {
      combinedMsg = (
        <Fragment>
          <p>{msg1}</p>
          <hr />
          <p>{msg2}</p>
        </Fragment>
      );
    } else if (present.length > 0) {
      combinedMsg = msg1;
    } else if (size.length > 0) {
      combinedMsg = msg2;
    }
    dispatch(
      AlertActions.handleShow({
        msg: combinedMsg,
        flag: false,
      })
    );
  };

  const uploadDatasToDB = (alertMsg) => {
    let file_error = [];
    let res_error = [];
    files.map(async (file, index) => {
      await firestore
        .collection("Profiles")
        .doc(file.name)
        .set({
          status: "mapped",
        })
        .catch((err) => {
          file_error.push(file.name);
        });
      await fireStorage
        .ref("profiles/resumes/" + file.name)
        .put(file)
        .catch((err) => {
          res_error.push(file.name);
        });
      if ((await files.length) - 1 === index) {
        if (file_error.length === 0 && res_error.length === 0) {
          dispatch(
            AlertActions.handleShow({
              msg: alertMsg,
              flag: true,
            })
          );
        } else {
          dispatch(
            AlertActions.handleShow({
              msg: "Profile submitted is Failed.",
              flag: false,
            })
          );
        }
      }
    });
  };

  const onPreCheck = async () => {
    await setIsSaving(true);
    let presentFileList = await [];
    let excessSizeFileList = await [];
    let res = await filenames.filter((file) => addedProfiles.includes(file));
    if ((await res.length) === 0) {
      await files.map(async (file, index) => {
        firestore
          .collection("Profiles")
          .doc("new")
          .get()
          .then(async (doc) => {
            if (await doc.exists) {
              setUploadFlag(true);
            } else {
              await firestore
                .collection("Profiles")
                .doc(file.name)
                .get()
                .then((doc) => {
                  if (!doc.exists) {
                    if (!(file.size / 1024 > 300)) {
                    } else {
                      excessSizeFileList.push(file.name);
                    }
                  } else {
                    presentFileList.push(file.name);
                  }
                });
            }
            if ((await files.length) - 1 === index) {
              if (
                presentFileList.length === 0 &&
                excessSizeFileList.length === 0
              ) {
                if ((await formik.values.demand) === totalFileCount) {
                  await setUploadFlag(true);
                  await dispatch(
                    AlertActions.handleShow({
                      msg: "You are good to submit.",
                      flag: true,
                    })
                  );
                } else {
                  await uploadDatasToDB(
                    <Fragment>
                      <p>Just mapped the profiles against this demand.</p>
                      <p>Please upload the required profiles to submit.</p>
                    </Fragment>
                  );
                }
                await firestore
                  .collection("Demands")
                  .doc(formik.values.demand_id)
                  .update({
                    "info.file_count": totalFileCount,
                    "info.status": "Still profile matching is pending",
                    "profile-info": {
                      profiles: filenames,
                      status: "pending",
                    },
                  });
              } else {
                alertMsg(presentFileList, excessSizeFileList);
              }
            }
          });
      });
    } else {
      await dispatch(
        AlertActions.handleShow({
          msg: "Already you have selected this profile. Please check the selected profiles.",
          flag: false,
        })
      );
    }
    await setIsSaving(false);
  };

  const formik = useFormik({
    initialValues,
    validate: (value) => {
      const errors = {};
      if (!value.demand_id) {
        errors.demand_id = "*Required.";
      }
      if (!value.profile_id) {
        errors.profile_id = "*Required";
      }
      return errors;
    },
    onSubmit: async (value) => {
      await setIsLoading(true);
      await uploadDatasToDB("Profile submitted is succesfully.");
      await setIsLoading(false);
    },
  });

  const handleChange = (e) => {
    if (e.target.files) {
      let data = [];
      let count = 0;
      let profile = [...e.target.files];
      alert(
        "--" +
          totalFileCount +
          " : " +
          formik.values.file_count +
          " : " +
          [...e.target.files].length
      );
      Object.values(e.target.files).map((file) => {
        if (formik.values.file_count === 0) {
          if (
            !(
              totalFileCount + [...e.target.files].length >
              formik.values.demand
            )
          ) {
            data.push(file.name);
            count = data.length;
          } else {
            dispatch(
              AlertActions.handleShow({
                msg:
                  "Selected profile is more than demand. Demand : " +
                  formik.values.demand +
                  ", but you have selected : " +
                  (totalFileCount + [...e.target.files].length),
                flag: false,
              })
            );
          }
        } else if (formik.values.file_count > 0) {
          if (
            !(
              totalFileCount + [...e.target.files].length >
              formik.values.demand
            )
          ) {
            alert(
              totalFileCount +
                " : " +
                formik.values.file_count +
                " : " +
                [...e.target.files].length
            );
            if (filenames.includes(file.name)) {
              dispatch(
                AlertActions.handleShow({
                  msg: "Anyone of the files that you selected that was added already. Duplicate profile entry.",
                  flag: false,
                })
              );
              return true;
            } else {
              data = filenames;
              profile = files;
              data.push(file.name);
              profile.push(file);
              count += 1;
            }
          } else {
            dispatch(
              AlertActions.handleShow({
                msg:
                  "Selected profile is more than demand. Demand : " +
                  formik.values.demand +
                  ", but you have selected : " +
                  (totalFileCount + [...e.target.files].length),
                flag: false,
              })
            );
          }
        }
      });

      if (data.length > 0) {
        setFiles(profile);
        setFileNames(data);
        setTotalFileCount(totalFileCount + count);
        formik.setFieldValue("file_count", data.length);
        alert(totalFileCount + " : " + count);
      }
    }
  };

  const removePofilehandler = (index, flag = false, name = "") => {
    if (flag) {
      let new_list = addedProfiles;
      new_list.splice(index, 1);
      firestore
        .collection("Demands")
        .doc(formik.values.demand_id)
        .update({
          "profile-info.profiles": new_list,
          "info.file_count": new_list.length,
        })
        .then(async () => {
          dispatch(
            AlertActions.handleShow({
              msg: "Removed profile : " + name,
              flag: true,
            })
          );
          setAddedProfiles(new_list);
          formik.setFieldValue("file_count", formik.values.file_count - 1);
          setTotalFileCount(totalFileCount - 1);
        })
        .catch((err) => {
          dispatch(
            AlertActions.handleShow({
              msg: "Unable to remove profile : " + name,
              flag: false,
            })
          );
        });
    } else {
      let new_list1 = files;
      let new_list2 = filenames;
      new_list1.splice(index, 1);
      new_list2.splice(index, 1);
      setFiles(new_list1);
      setFileNames(new_list2);
      formik.setFieldValue("file_count", formik.values.file_count - 1);
      setTotalFileCount(totalFileCount - 1);
    }
  };

  const getDemandInfo = async (doc) => {
    await setIsSearching(true);
    await firestore
      .collection("Demands")
      .doc(doc)
      .get()
      .then(async (documentSnapshot) => {
        if (await documentSnapshot.exists) {
          let datas = await documentSnapshot.get("info");
          await formik.setValues({
            demand_id: formik.values.demand_id,
            profile_id: "",
            ...datas,
          });
          formik.setFieldValue("status", datas.status);
          datas = await documentSnapshot.get("profile-info");
          // await formik.setFieldValue("file_count", datas.profiles.length);
          await setTotalFileCount(datas.profiles.length);
          await setAddedProfiles(datas.profiles);
        } else {
          formik.setErrors({ demand_id: "*Invalid Demand ID." });
        }
      });
    await setIsSearching(false);
  };

  const getProfileFromDB = (profile_id) => {
    firestore
      .collection("Profiles")
      .doc(profile_id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let data = doc.data();
          if (data.status === "mapped") {
            dispatch(
              AlertActions.handleShow({
                msg:
                  "This profile already mapped to demand id : " +
                  data.demand_id +
                  "So, you can't add it. Please add other profile.",
                flag: false,
              })
            );
          } else if (formik.values.file_count <= formik.values.demand) {
            dispatch(
              AlertActions.handleShow({
                msg: "Profile has been added.",
                flag: true,
              })
            );
            setSearchProfileDB(profile_id);
            data = filenames.push(profile_id);
            setFileNames(data);
          } else {
            dispatch(
              AlertActions.handleShow({
                msg: "Already you have added required profiles. So, you can't add. if want add remove existing one.",
                flag: false,
              })
            );
          }
        } else {
          dispatch(
            AlertActions.handleShow({
              msg: "Invalid Profile ID.",
              flag: false,
            })
          );
        }
      });
  };

  return (
    <Fragment>
      <Alerts />
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
                            formik.errors.demand_id && formik.touched.demand_id
                          }
                          isValid={
                            !formik.errors.demand_id && formik.touched.demand_id
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {!isSearching && (
                          <Button
                            variant="outline-primary"
                            onClick={() =>
                              getDemandInfo(formik.values.demand_id)
                            }
                            disabled={
                              isSearching || !formik.values.demand_id.length > 0
                            }
                          >
                            Search
                          </Button>
                        )}
                        {isSearching && (
                          <Button variant="primary" disabled>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />{" "}
                            Searching...
                            <span className="visually-hidden">Loading...</span>
                          </Button>
                        )}
                      </InputGroup>

                      {formik.touched.demand_id &&
                        !formik.values.demand_id.length > 0 && (
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
                        name="recruiter"
                        readOnly
                        value={formik.values.recruiter}
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
              <hr className="my-4" />
              <FormGroup>
                <FormLabel>
                  <b>Status</b>
                </FormLabel>
                <ProgressBar
                  animated
                  striped
                  variant="primary"
                  now={
                    totalFileCount > 0
                      ? (totalFileCount / formik.values.demand) * 100
                      : 0
                  }
                  label={
                    <b>
                      {totalFileCount} / {formik.values.demand} profiles are
                      uploaded.
                    </b>
                  }
                />
              </FormGroup>
              <hr className="my-4" />
              {addedProfiles.length > 0 && (
                <Fragment>
                  <b className="my-1">Added profiles</b>
                  <div
                    className="d-flex flex-wrap my-2 border border-success border-2 mx-2"
                    style={{ maxHeight: "150px", overflowY: "scroll" }}
                  >
                    {addedProfiles.map((file, index) => {
                      return (
                        <Card
                          key={index}
                          className={`shadow m-1 w-30 bg-success`}
                        >
                          <Card.Body className="d-flex justify-content-between text-white">
                            <Button
                              className="position-absolute top-0 end-0 me-1 btn-close bg-white rounded-circle"
                              style={{ height: "8px", width: "8px" }}
                              onClick={() =>
                                removePofilehandler(index, true, file)
                              }
                            ></Button>
                            <b className="mt-1">{file}</b>
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </div>
                  <hr className="my-4" />
                </Fragment>
              )}
              <b>Adding New Profiles</b>
              <Tabs
                activeKey={uploadType}
                onSelect={(k) => setUploadType(k)}
                className="ms-1 mt-4"
              >
                <Tab
                  eventKey={"PC"}
                  title={
                    <span
                      className={`fw-bold ${
                        uploadType === "PC" ? `text-success` : `text-dark`
                      }`}
                    >
                      Upload From PC
                    </span>
                  }
                >
                  <Card>
                    <div className="text-center mt-3">
                      <FormControl
                        type="file"
                        multiple
                        accept=".pdf,.docx"
                        onChange={handleChange}
                        value=""
                        disabled={
                          totalFileCount < formik.values.demand ? false : true
                        }
                        placeholder="select profiles"
                      />
                    </div>
                    <div className="d-flex flex-wrap justify-content-around">
                      <p className="my-1">
                        Added file : <b>{formik.values.file_count}</b>
                      </p>
                      <p className="my-1">
                        Remaning :{" "}
                        <b>{formik.values.demand - totalFileCount}</b>
                      </p>
                    </div>
                    {filenames.length > 0 && (
                      <Fragment>
                        <div
                          className="d-flex flex-wrap my-2 border border-primary border-2 mx-2"
                          style={{ maxHeight: "150px", overflowY: "scroll" }}
                        >
                          {filenames.map((file, index) => {
                            return (
                              <Card
                                key={index}
                                className={`shadow m-1 w-30 border ${
                                  files[index].size / 1024 > 300
                                    ? `bg-danger`
                                    : `bg-success`
                                }`}
                              >
                                <Card.Body className="d-flex justify-content-between text-white">
                                  <Button
                                    className="position-absolute top-0 end-0 me-1 btn-close bg-white rounded-circle"
                                    style={{ height: "8px", width: "8px" }}
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
                  </Card>
                </Tab>
                <Tab
                  eventKey={"DB"}
                  title={
                    <span
                      className={`fw-bold ${
                        uploadType === "DB" ? `text-success` : `text-dark`
                      }`}
                    >
                      Upload From DB
                    </span>
                  }
                >
                  <Card>
                    <Col md={{ span: "8", offset: "2" }} className="mt-3">
                      <InputGroup className="mb-3 ">
                        <FormControl
                          placeholder="Enter profile ID"
                          name="profile_id"
                          isInvalid={
                            formik.errors.profile_id &&
                            formik.touched.profile_id
                          }
                          isValid={
                            !formik.errors.profile_id &&
                            formik.touched.profile_id
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {!isSearching && (
                          <Button
                            variant="outline-primary"
                            onClick={() =>
                              getProfileFromDB(formik.values.profile_id)
                            }
                            disabled={
                              isSearching ||
                              !formik.values.profile_id.length > 0
                            }
                          >
                            Search
                          </Button>
                        )}
                        {isSearching && (
                          <Button variant="primary" disabled>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />{" "}
                            Searching...
                            <span className="visually-hidden">Loading...</span>
                          </Button>
                        )}
                      </InputGroup>
                      {formik.touched.profile_id &&
                        !formik.values.profile_id.length > 0 && (
                          <div className="text-danger">
                            {formik.errors.profile_id}
                          </div>
                        )}
                    </Col>
                    <div className="d-flex flex-wrap justify-content-around">
                      <p className="my-1">
                        Added file : <b>{formik.values.file_count}</b>
                      </p>
                      <p className="my-1">
                        Remaning :{" "}
                        <b>{formik.values.demand - totalFileCount}</b>
                      </p>
                    </div>
                    {filenames.length > 0 && (
                      <Fragment>
                        <div
                          className="d-flex flex-wrap my-2 border border-primary border-2 mx-2"
                          style={{ maxHeight: "150px", overflowY: "scroll" }}
                        >
                          {filenames.map((file, index) => {
                            return (
                              <Card
                                key={index}
                                className={`shadow m-1 w-30 border ${
                                  files[index].size / 1024 > 300
                                    ? `bg-danger`
                                    : `bg-success`
                                }`}
                              >
                                <Card.Body className="d-flex justify-content-between text-white">
                                  <Button
                                    className="position-absolute top-0 end-0 me-1 btn-close bg-white rounded-circle"
                                    style={{ height: "8px", width: "8px" }}
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
                  </Card>
                </Tab>
              </Tabs>
              <Col className="text-center">
                <div className="d-flex justify-content-between">
                  <Fragment>
                    {!isSaving && (
                      <Button
                        variant="primary"
                        className={`my-3`}
                        disabled={files.length > 0 ? false : true}
                        style={{ width: sm ? "100%" : "45%" }}
                        onClick={onPreCheck}
                      >
                        Save
                      </Button>
                    )}
                    {isSaving && (
                      <Button
                        variant="primary"
                        className={`my-3`}
                        style={{ width: sm ? "100%" : "45%" }}
                        disabled
                      >
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Saving...
                        <span className="visually-hidden">Loading...</span>
                      </Button>
                    )}
                  </Fragment>
                  <Fragment>
                    {isLoading && (
                      <Button
                        variant="primary"
                        className={`my-3`}
                        style={{ width: sm ? "100%" : "45%" }}
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
                    {!isLoading && (
                      <Button
                        variant="primary"
                        type="submit"
                        className={`my-3`}
                        style={{ width: sm ? "100%" : "45%" }}
                        disabled={!uploadFlag}
                      >
                        Submit
                      </Button>
                    )}
                  </Fragment>
                </div>
              </Col>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
};
export default CreateSupply;
