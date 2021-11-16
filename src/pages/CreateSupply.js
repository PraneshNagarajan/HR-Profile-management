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
  Tabs,
  Tab,
} from "react-bootstrap";
import { Fragment, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./CreateSupply.css";
import Alerts from "../components/Alert";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { fireStorage, firestore } from "../firebase";
import { useDispatch } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";
import { ProfileActions } from "../Redux/ProfileSlice";

const initialValues = {
  demand_id: "",
  profile_id: "",
  assignee: "",
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
  const loggedUser = useSelector((state) => state.auth);
  const profileInfo = useSelector((state) => state.profileInfo);
  const alerts = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [files, setFiles] = useState([]);
  const [filenames, setFileNames] = useState([]);
  const [uploadType, setUploadType] = useState("PC");
  const [addedProfiles, setAddedProfiles] = useState([]);
  const [totalFileCount, setTotalFileCount] = useState(0);
  const [searchProfrileDB, setSearchProfileDB] = useState([]);
  const [profileFlag, setProfileFlag] = useState(false);

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
  });

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

  const updateDemandInfo = async (datas) => {
    let data = await {};
    await datas.map(async (file, index) => {
      await firestore
        .collection("Profiles")
        .doc(file)
        .set({
          status: "mapped",
          demand_id: formik.values.demand_id,
        })
        .then(async () => {
          data[file] = await {
            current_status: "Profile Submitted",
            status: {
              "profile submitted": new Date().toString(),
              "Screen Reject": "",
              Duplicate: "",
              "Feedback Pending": "",
              "Position Hold": "",
              "Interview Scheduled": "",
              "L1 Select": "",
              "No Show": "",
              "L1 Reject": "",
              "L2 Reject": "",
              "L2 Select": "",
              "Client Select": "",
              "Client Reject": "",
              "Client Hold": "",
              "Declined Before Offer": "",
              Offered: "",
              "Declined After Offer": "",
              "On Boarded": "",
            },
          };
          if ((await Object.values(data).length) - 1 === index) {
            await firestore
              .collection("Demands")
              .doc(formik.values.demand_id)
              .update({
                "info.file_count": totalFileCount,
                "profile_info.profiles": datas,
                "profile_info.status":
                  totalFileCount === formik.values.demand
                    ? "Submitted"
                    : "Inprogress",
                "profile_info.comments": "",
                "profile_info.profiles_status":
                  Object.values(data).length > 0
                    ? { data }
                    : { length: Object.values(data).length },
                "info.status":
                  totalFileCount == formik.values.demand
                    ? "Submitted"
                    : "Inprogress",
              })
              .then(async () => {
                await dispatch(
                  AlertActions.handleShow({
                    msg: (
                      <Fragment>
                        <p>Profile has been added sucessfully.</p>
                      </Fragment>
                    ),
                    flag: true,
                  })
                );
              })
              .catch((err) => {
                dispatch(
                  AlertActions.handleShow({
                    msg: "Failed. Unable to submit.",
                    flag: true,
                  })
                );
              });
          }
        })
        .catch((err) => {});
    });
    await setIsSaving(false);
  };

  const uploadDatasToDB = async () => {
    let res_error = await [];
    await files.map(async (file, index) => {
      let filename = await String(String(file.name).replaceAll(" ", "-")).split(
        "."
      )[0];
      await fireStorage
        .ref("profiles/resumes/" + filename)
        .put(file)
        .catch((err) => {
          res_error.push(filename);
        });
      if ((await files.length) - 1 === index) {
        if ((await res_error.length) === 0) {
          let new_data = addedProfiles.concat(filenames);
          await setAddedProfiles(new_data);
          await setFileNames([]);
          await setFiles([]);
          formik.setFieldValue("file_count", 0);
          await updateDemandInfo(new_data);
        } else {
          await dispatch(
            AlertActions.handleShow({
              msg: "Profile submitted is Failed.",
              flag: false,
            })
          );
        }
      }
    });
  };

  const onSave = async () => {
    await setIsSaving(true);
    let presentFileList = await [];
    let excessSizeFileList = await [];
    let res = await filenames.filter((file) => addedProfiles.includes(file));
    if ((await res.length) === 0) {
      if ((await searchProfrileDB.length) > 0 && files.length === 0) {
        let new_data = addedProfiles.concat(searchProfrileDB);
        await setAddedProfiles(new_data);
        await setFileNames([]);
        await setFiles([]);
        formik.setFieldValue("file_count", 0);
        await updateDemandInfo(new_data);
        await dispatch(
          AlertActions.handleShow({
            msg: (
              <Fragment>
                <p>Profile has been added sucessfully.</p>
              </Fragment>
            ),
            flag: true,
          })
        );
      }
      await files.map(async (file, index) => {
        let filename = String(String(file.name).replaceAll(" ", "-")).split(
          "."
        )[0];
        await firestore
          .collection("Profiles")
          .doc(filename)
          .get()
          .then(async (doc) => {
            if (await !doc.exists) {
              if (await !(file.size / 1024 > 300)) {
              } else {
                await excessSizeFileList.push(filename);
              }
            } else {
              await presentFileList.push(filename);
            }
          });
        if ((await files.length) - 1 === index) {
          if (
            (await presentFileList.length) === 0 &&
            excessSizeFileList.length === 0
          ) {
            await uploadDatasToDB(true);
          } else {
            await alertMsg(presentFileList, excessSizeFileList);
            await setIsSaving(false);
          }
        }
      });
    } else {
      await dispatch(
        AlertActions.handleShow({
          msg: "Already you have selected this profile. Please check the selected profiles.",
          flag: false,
        })
      );
      await setIsSaving(false);
    }
  };

  const onSubmit = async () => {
    await setIsLoading(true);
    await firestore
      .collection("Demands")
      .doc(formik.values.demand_id)
      .update({
        "info.status": "Closure Request Submitted",
        "profile_info.status": "Closure Request Submitted",
      })
      .then(async () => {
        formik.setFieldValue("status", "Closure Request Submited");
        await dispatch(
          AlertActions.handleShow({
            msg:
              "Closer Request has been submitted to the demand owner (" +
              formik.values.owner +
              ") successfully.",
            flag: true,
          })
        );
      })
      .catch((err) => {
        dispatch(
          AlertActions.handleShow({
            msg: "Failed.Unable to submit.",
            flag: false,
          })
        );
      });
    await setIsLoading(false);
    await setAddedProfiles([]);
    await setFileNames([]);
    await setFiles([]);
    await setTotalFileCount(0);
    await formik.resetForm();
  };

  const handleChange = (e) => {
    if (e.target.files) {
      let data = [];
      let count = 0;
      let profile = [...e.target.files];
      Object.values(e.target.files).map((file) => {
        let filename = String(String(file.name).replaceAll(" ", "-")).split(
          "."
        )[0];
        if (filenames.includes(filename)) {
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
          data.push(filename);
          profile.push(file);
          count += 1;
        }
      });

      if (data.length > 0) {
        setFiles(profile);
        setFileNames(data);
        setTotalFileCount(totalFileCount + count);
        formik.setFieldValue("file_count", data.length);
      }
    }
  };

  const removeProfilehandler = async (
    index,
    flag = false,
    flag1 = false,
    name = ""
  ) => {
    if (await flag) {
      let new_list = await addedProfiles;
      let profile_status = {};
      await firestore
        .collection("Demands")
        .doc(formik.values.demand_id)
        .get()
        .then(async (doc) => {
          let profile_status1 = await doc.data();
          profile_status = await profile_status1.profile_info.profiles_status;
        });

      firestore
        .collection("Profiles")
        .doc(addedProfiles[index])
        .update({
          demand_id: "",
          status: "unmapped",
        })
        .catch((err) => String(err));
      console.log(addedProfiles[index]);
      dispatch(ProfileActions.handleRemove(addedProfiles[index]));
      delete profile_status[addedProfiles[index]];
      await new_list.splice(index, 1);
      firestore
        .collection("Demands")
        .doc(formik.values.demand_id)
        .update({
          "profile_info.profiles": new_list,
          "info.file_count": new_list.length,
          "profile_info.profiles_status": profile_status,
        })
        .then(async () => {
          dispatch(
            AlertActions.handleShow({
              msg: "Removed profile : " + name,
              flag: true,
            })
          );
          setAddedProfiles(new_list);
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
      if (!flag1) {
        let new_list1 = files;
        new_list1.splice(index, 1);
        setFiles(new_list1);
      }
      let new_list2 = filenames;
      console.log(new_list2[index]);
      dispatch(ProfileActions.handleRemove(new_list2[index]));
      new_list2.splice(index, 1);
      setFileNames(new_list2);
      setTotalFileCount(totalFileCount - 1);
      formik.setFieldValue("file_count", files.length);
    }
  };

  const getDemandInfo = async (doc) => {
    await formik.setFieldValue("profile_id", "");
    await formik.setFieldTouched("profile_id", false);
    await setFileNames([]);
    await setIsSearching(true);
    await firestore
      .collection("Demands")
      .doc(doc)
      .get()
      .then(async (documentSnapshot) => {
        if (await documentSnapshot.exists) {
          let datas = await documentSnapshot.get("info");
          if (
            datas.assignees.includes(String(loggedUser.id)) ||
            datas.owner === loggedUser.id
          ) {
            if (datas.status !== "Submitted" && datas.status !== "Completed") {
              await formik.setValues({
                demand_id: formik.values.demand_id,
                profile_id: "",
                ...datas,
                assignees: datas.assignees.join(", "),
              });
              datas = await documentSnapshot.get("profile_info");
              await setTotalFileCount(datas.profiles.length);
              await setAddedProfiles(datas.profiles);
              await setFiles([]);
              await setSearchProfileDB([]);
            } else {
              dispatch(
                AlertActions.handleShow({
                  msg: "Already this demand has been submitted. If you need to view or modify, please go to 'manage supply' page.",
                  flag: false,
                })
              );
            }
          } else {
            dispatch(
              AlertActions.handleShow({
                msg: "Access Denied !. You are not part of this demand.",
                flag: false,
              })
            );
          }
        } else {
          formik.setErrors({ demand_id: "*Invalid Demand ID." });
        }
      });
    await setIsSearching(false);
  };

  const getProfileFromDB = (profile_id) => {
    formik.setFieldValue("profile_id", "");
    formik.setFieldTouched("profile_id", false);
    let data = [];
    firestore
      .collection("Profiles")
      .doc(profile_id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          data = doc.data();
          if (data.status === "mapped") {
            dispatch(
              AlertActions.handleShow({
                msg:
                  "This profile already mapped to demand id : " +
                  data.demand_id +
                  ". So, you can't add it. Please add other profile.",
                flag: false,
              })
            );
          } else if (false) {
            //here need to add functionality to check already profile mapped to this demand
          } else {
            dispatch(ProfileActions.handleAdd({ profile_id: {} }));
            setSearchProfileDB(profile_id);
            data = filenames;
            data.push(profile_id);
            setFileNames(data);
            setTotalFileCount(totalFileCount + 1);
            formik.setFieldValue("file_count", data.length);
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

  const onShowForm = (file) => {
    dispatch(AlertActions.handleShow({ msg: file, msgFlag: "" }));
    setProfileFlag(true);
  };

  const FileListTag =
    filenames.length > 0 ? (
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
                  searchProfrileDB.includes(file)
                    ? `bg-info`
                    : Object.keys(profileInfo.data).includes(file)
                    ? `bg-success`
                    : filenames &&
                      files[index] &&
                      files[index].size / 1024 > 300
                    ? `bg-danger`
                    : `bg-warning`
                }`}
              >
                <Card.Body className="d-flex justify-content-between text-white">
                  <Button
                    className="position-absolute top-0 end-0 me-1 btn-close bg-white rounded-circle"
                    style={{ height: "8px", width: "8px" }}
                    onClick={() =>
                      removeProfilehandler(
                        index,
                        false,
                        searchProfrileDB.includes(file),
                        ""
                      )
                    }
                  ></Button>
                  <b
                    className="mt-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => onShowForm(file)}
                  >
                    {file}
                  </b>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Fragment>
    ) : (
      ""
    );

  useEffect(() => {
    if (!alerts.show) {
      setProfileFlag(false);
    }
  }, [alerts.show]);
  return (
    <Fragment>
      <Alerts profile={profileFlag} />
      <Container className="d-flex justify-content-center ">
        <Card className={`my-3 ${sm ? `w-100` : `w-75`}`}>
          <Card.Header className="bg-primary text-center text-white">
            <h4>Create Supply</h4>
          </Card.Header>
          <Card.Body className="mb-4">
            <Form>
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
                          value={formik.values.demand_id}
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
                        (!formik.values.demand_id.length > 0 ||
                          formik.errors.demand_id) && (
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
                        <b>Recruiter ID'S</b>
                      </FormLabel>
                    </Col>
                    <Col md="8">
                      <FormControl
                        name="assignees"
                        readOnly
                        value={formik.values.assignees}
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
              {(formik.values.status.includes("Unstarted") ||
                formik.values.status.includes("Inprogress")) && (
                <Fragment>
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
                                    removeProfilehandler(
                                      index,
                                      true,
                                      false,
                                      file
                                    )
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
                            accept=".pdf"
                            onChange={handleChange}
                            value=""
                            placeholder="select profiles"
                          />
                        </div>
                        <div className="d-flex flex-wrap justify-content-around">
                          <p className="my-1">
                            Added file : <b>{formik.values.file_count}</b>
                          </p>
                          <p className="my-1">
                            Remaining :{" "}
                            <b>
                              {formik.values.demand >= totalFileCount
                                ? formik.values.demand - totalFileCount
                                : 0}
                            </b>
                          </p>
                        </div>
                        {FileListTag}
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
                              value={formik.values.profile_id}
                              isInvalid={
                                !formik.values.profile_id.length > 0 &&
                                formik.touched.profile_id
                              }
                              isValid={
                                formik.values.profile_id.length > 0 &&
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
                                disabled={!formik.values.profile_id.length > 0}
                              >
                                Add
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
                                Adding...
                                <span className="visually-hidden">
                                  Loading...
                                </span>
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
                            Remaining :{" "}
                            <b>
                              {formik.values.demand >= totalFileCount
                                ? formik.values.demand - totalFileCount
                                : 0}
                            </b>
                          </p>
                        </div>
                        {FileListTag}
                      </Card>
                    </Tab>
                  </Tabs>
                  <div className="text-center">
                    <div className="d-flex justify-content-between flex-wrap">
                      <Fragment>
                        {!isSaving && (
                          <Button
                            variant="primary"
                            className={sm ? `mt-3` : `my-3`}
                            disabled={
                              filenames.length > 0 || files.length > 0
                                ? Object.keys(profileInfo.data).length !==
                                  filenames.length
                                  ? true
                                  : false
                                : true
                            }
                            style={{ width: sm ? "100%" : "45%" }}
                            onClick={onSave}
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
                            className={`my-3`}
                            style={{ width: sm ? "100%" : "45%" }}
                            disabled={addedProfiles.length <= 0}
                            onClick={onSubmit}
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </Fragment>
                    </div>
                  </div>
                </Fragment>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
};
export default CreateSupply;
