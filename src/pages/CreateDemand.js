import {
  Card,
  Row,
  Col,
  Container,
  Button,
  Dropdown,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  FormCheck,
  Spinner,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { Fragment, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./CreateDemand.css";
import Spinners from "../components/Spinners";
import Alerts from "../components/Alert";
import Multiselect from "multiselect-react-dropdown";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { firestore } from "../firebase";
import { useDispatch } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";
import { FaQuestionCircle } from "react-icons/fa";

const CreateDemand = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.auth);
  const [ptIsChecked, setPrimaryTechIsChecked] = useState(
    props.techFlag ? false : true
  );
  const [psIsChecked, setPrimarySkillIsChecked] = useState(
    props.techFlag ? false : true
  );
  const [stIsChecked, setSecondaryTechIsChecked] = useState(
    props.techFlag ? false : true
  );
  const [ssIsChecked, setSecondarySkillIsChecked] = useState(
    props.techFlag ? false : true
  );
  const [apsIsChecked, setAddPrimarySkillIsChecked] = useState(
    props.techFlag ? false : true
  );
  const [aptIsChecked, setAddPrimaryTechIsChecked] = useState(
    props.techFlag ? false : true
  );

  const [clientIsChecked, setClientIsChecked] = useState(
    props.clientFlag ? false : true
  );
  const [end_clientIsChecked, setEndClientIsChecked] = useState(
    props.clientFlag ? false : true
  );
  const [isLoading, setIsLoading] = useState(false);
  let uploadFlag = false;
  const pre_requisite = useSelector((state) => state.demandPreRequisite);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [recruiterIsChecked, setRecruiterIsChecked] = useState(false);
  const [users, setUsers] = useState([]);
  const [addPrimarySkill, setAddPrimarySkill] = useState([]);
  const [addSecondarySkill, setAddSecondarySkill] = useState([]);
  const multiselectRecruiterRef = useRef();
  const multiselectAddPrimarySkillRef = useRef();
  const multiselectAddSecondarySkillRef = useRef();

  const stateHandler = () => {
    formik.resetForm();
    formik.setValues({
      location: "",
      panlocation: "",
      type: "- Select the type -",
      demand: 1,
      demandallot: "",
      status: "Unstarted",
      file_count: 0,
      clientname: "- Select the Client -",
      endclientname: "- Select the End-Client -",
      primarytech: "- Select the Techonology -",
      primaryskill: "- Select the Skill -",
      addprimarytech: "- Select the Techonology -",
      addprimaryskill: "- Select the Skill -",
      secondarytech: "- Select the Techonology -",
      secondaryskill: "- Select the Skill -",
    });
    setPrimaryTechIsChecked(false);
    setPrimarySkillIsChecked(false);
    setAddPrimaryTechIsChecked(false);
    setAddPrimarySkillIsChecked(false);
    setSecondaryTechIsChecked(false);
    setSecondarySkillIsChecked(false);
    setClientIsChecked(false);
    setEndClientIsChecked(false);
    setSelectedRecruiters([]);
    multiselectRecruiterRef.current.resetSelectedValues();
    if (addPrimarySkill.length > 0) {
      multiselectAddPrimarySkillRef.current.resetSelectedValues();
    }
    if (addSecondarySkill.length > 0) {
      multiselectAddSecondarySkillRef.current.resetSelectedValues();
    }
    setRecruiterIsChecked(false);
  };

  //  popover
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Note</Popover.Title>
      <Popover.Content>
        Click the "View all recruiter" button to access all recruiters across
        the app otherwise, you can access the limited recruiters who tagged
        under your name.
      </Popover.Content>
    </Popover>
  );

  const onAlert = (msg, flag) => {
    dispatch(
      AlertActions.handleShow({
        msg,
        flag,
      })
    );
  };

  const checkIsSkillPresentHandler = (tech, skill) => {
    let data = [...pre_requisite.technologies[tech]];
    if (
      !(
        pre_requisite.technologies[tech].findIndex((item) => item === skill) >=
        0
      )
    ) {
      data.push(skill);
      addSkills(tech, { sets: data }, !props.techFlag, false);
    } else {
      setIsLoading(false);
      onAlert(
        "Duplicate entry. " +
          skill +
          " is found already under " +
          tech +
          " . Data added failed. Create_demand_line:143. ",
        false
      );
      uploadFlag = false;
    }
  };

  const addSkills = (doc, data, flag, method) => {
    uploadFlag = true;
    if (method) {
      firestore
        .collection("Skills")
        .doc(doc)
        .set(data)
        .catch((err) => {
          onAlert("Create_demand_line:160. " + String(err));
        });
    } else {
      firestore
        .collection("Skills")
        .doc(doc)
        .update(data)
        .catch((err) => {
          onAlert("Create_demand_line:168. " + String(err));
        });
    }
    if (flag) {
      firestore
        .collection("Skills")
        .doc("new")
        .delete()
        .catch((err) => onAlert("Create_demand_line:173.", false));
    }
  };

  const onMapDemandToRecruiters = (id) => {
    let assignedUsers = selectedRecruiters;
    assignedUsers.push(String(loggedUser.id));
    assignedUsers.map((recruiter, idx) => {
      let position = pre_requisite.users.findIndex(
        (item) => item.id === recruiter
      );
      let newDemandList = pre_requisite.users[position].demands
        ? [...pre_requisite.users[position].demands]
        : [];
      newDemandList.push(id);
      firestore
        .collection("Employee-Info")
        .doc("users")
        .update({
          [recruiter + ".demands"]: newDemandList,
        })
        .catch((err) =>
          onAlert("Create_demand_line:195. " + String(err), false)
        );
    });
  };

  const formik = useFormik({
    initialValues: {
      assignees: "",
      clientname: props.clientFlag ? "- Select the Client -" : "",
      endclientname: props.clientFlag ? "- Select the End-Client -" : "",
      location: "",
      panlocation: "",
      type: "- Select the type -",
      demand: 1,
      demandallot: "",
      primarytech: props.techFlag ? "- Select the Techonology -" : "",
      addprimarytech: props.techFlag ? "- Select the Techonology -" : "",
      primaryskill: props.techFlag ? "- Select the Skill -" : "",
      addprimaryskill: props.techFlag ? "- Select the Skill -" : "",
      secondarytech: props.techFlag ? "- Select the Techonology -" : "",
      secondaryskill: props.techFlag ? "- Select the Skill -" : "",
      status: "Unstarted",
      file_count: 0,
    },
    validate: (value) => {
      const errors = {};
      if (value.clientname.includes("-") || !value.clientname) {
        errors.clientname = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.clientname)) {
        errors.clientname =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (value.endclientname.includes("-") || !value.endclientname) {
        errors.endclientname = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.endclientname)) {
        errors.endclientname =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (!value.location) {
        errors.location = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.location)) {
        errors.location =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (!value.panlocation) {
        errors.panlocation = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.panlocation)) {
        errors.panlocation =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (value.type.includes("-")) {
        errors.type = "*Required.";
      }

      if (value.demand <= 0) {
        errors.demand = "*Value must be greater than 0.";
      }

      if (!value.demandallot) {
        errors.demandallot = "*Required.";
      }

      if (value.primarytech.includes("-") || !value.primarytech) {
        errors.primarytech = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.primarytech)) {
        errors.primarytech =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (value.primaryskill.includes("-") || !value.primaryskill) {
        errors.primaryskill = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.primaryskill)) {
        errors.primaryskill =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (value.addprimarytech.includes("-") || !value.addprimarytech) {
        errors.addprimarytech = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.addprimarytech)) {
        errors.addprimarytech =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (value.addprimaryskill.includes("-") || !value.addprimaryskill) {
        errors.addprimaryskill = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.addprimaryskill)) {
        errors.addprimaryskill =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (value.secondarytech.includes("-") || !value.secondarytech) {
        errors.secondarytech = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.secondarytech)) {
        errors.secondarytech =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }

      if (value.secondaryskill.includes("-") || !value.secondaryskill) {
        errors.secondaryskill = "*Required.";
      } else if (!new RegExp("^[A-Z_ ]+$").test(value.secondaryskill)) {
        errors.secondaryskill =
          'Character must be in uppercase. whitespace and "_" characters only allowed.';
      }
      return errors;
    },
    onSubmit: (value) => {
      setIsLoading(true);
      uploadFlag = true;
      let data = [];
      if (
        (value.primarytech === value.secondarytech) === value.addprimaryskill &&
        ptIsChecked &&
        stIsChecked &&
        aptIsChecked
      ) {
        if (!props.techFlag) {
          addSkills(
            value.primarytech,
            {
              sets: [
                value.primaryskill,
                value.secondaryskill,
                value.addprimaryskill,
              ],
            },
            !props.techFlag,
            true
          );
        } else {
          data.push(value.primaryskill);
          data.push(value.secondaryskill);
          data.push(value.addprimaryskill);
          if (!pre_requisite.technologies[value.primarytech]) {
            addSkills(value.primarytech, { sets: data }, !props.techFlag, true);
          } else {
            checkIsSkillPresentHandler(value.primarytech, value.primaryskill);
            checkIsSkillPresentHandler(
              value.secondarytech,
              value.secondaryskill
            );
            checkIsSkillPresentHandler(
              value.addprimarytech,
              value.addprimaryskill
            );
          }
        }
      } else {
        if (stIsChecked || ssIsChecked) {
          data.push(value.secondaryskill);
          if (!pre_requisite.technologies[value.secondarytech]) {
            addSkills(
              value.secondarytech,
              { sets: data },
              !props.techFlag,
              true
            );
          } else {
            checkIsSkillPresentHandler(
              value.secondarytech,
              value.secondaryskill
            );
          }
        }
        //apt added
        data = [];
        if (aptIsChecked || apsIsChecked) {
          data.push(value.addprimaryskill);
          if (!pre_requisite.technologies[value.addprimarytech]) {
            addSkills(
              value.addprimarytech,
              { sets: data },
              !props.techFlag,
              true
            );
          } else {
            checkIsSkillPresentHandler(
              value.addprimarytech,
              value.addprimaryskill
            );
          }
        }
        data = [];
        if (ptIsChecked || psIsChecked) {
          data.push(value.primaryskill);
          if (!pre_requisite.technologies[value.primarytech]) {
            addSkills(value.primarytech, { sets: data }, !props.techFlag, true);
          } else {
            checkIsSkillPresentHandler(value.primarytech, value.primaryskill);
          }
        }
        data = [];
        if (!props.clientFlag) {
          firestore
            .collection("Clients")
            .doc(value.clientname)
            .set({ names: [value.endclientname] })
            .then(() => {
              firestore
                .collection("Clients")
                .doc("new")
                .delete()
                .catch((err) => onAlert("Create_demand_line:366.", false));
            })
            .catch((err) => {
              onAlert("Create_demand_line:368. " + String(err), false);
            });
        } else if (clientIsChecked || end_clientIsChecked) {
          if (!pre_requisite.clients[value.clientname]) {
            data = [value.endclientname];
            firestore
              .collection("Clients")
              .doc(value.clientname)
              .set({ names: data })
              .then(() => {
                uploadFlag = true;
              })
              .catch((err) => {
                onAlert("Create_demand_line:383. " + String(err), false);
              });
          } else {
            if (
              !(
                pre_requisite.clients[value.clientname].findIndex(
                  (item) => item === value.endclientname
                ) >= 0
              )
            ) {
              data.push(value.endclientname);
              data.push(...pre_requisite.clients[value.clientname]);
              firestore
                .collection("Clients")
                .doc(value.clientname)
                .update({ names: data })
                .then(() => {
                  uploadFlag = true;
                })
                .catch((err) => {
                  onAlert("Create_demand_line:400. " + String(err), false);
                });
            } else {
              setIsLoading(false);
              onAlert(
                "Duplicate entry. " +
                  value.endclientname +
                  " is found already under " +
                  value.clientname +
                  ".Create_demand_line:408. ",
                false
              );
            }
          }
        }
      }
      if (uploadFlag) {
        const demandID = "D" + new Date().getTime();
        firestore
          .collection("Demands")
          .doc(demandID)
          .update({
            [demandID]: {
              info: {
                ...value,
                owners: [loggedUser.id],
                assignees: selectedRecruiters,
              },
              profile_info: {
                profiles: [],
                profiles_status: {},
              },
            },
          })
          .then(async () => {
            await onMapDemandToRecruiters(demandID);
            await stateHandler();
            await onAlert("Demand created successfully.", true);
          })
          .catch(async (err) => {
            if (await String(err).includes("No document to update")) {
              await firestore
                .collection("Demands")
                .doc(demandID)
                .set({
                  info: {
                    ...value,
                    owners: [loggedUser.id],
                    assignees: selectedRecruiters,
                    addprimaryskill: addPrimarySkill,
                    secondaryskill: addSecondarySkill,
                  },
                  profile_info: {
                    comments: "",
                    profiles: [],
                    profiles_status: {},
                  },
                })
                .then(async () => {
                  await onMapDemandToRecruiters(demandID);
                  await stateHandler();
                  await onAlert("Data added successfully.", true);
                  selectedRecruiters.map((user, index) => {
                    firestore
                      .collection("Employee-Info")
                      .doc("users")
                      .get()
                      .then((list) => {
                        firestore
                          .collection("Notifications")
                          .doc(list.data()[user].email)
                          .update({
                            [new Date().getTime()]: {
                              msg:
                                "New Demand has been assigned for you.-Demand No : " +
                                demandID,
                              status: "unread",
                              link: true,
                              url: "/createSupply/" + demandID,
                              date: new Date().toString(),
                            },
                          })
                          .then(async () => {
                            if (selectedRecruiters.length - 1 == index) {
                              onAlert("Data added successfully.", true);
                            }
                          })
                          .catch(async (err) => {
                            onAlert(
                              "Create_demand_line:509. " + String(err),
                              false
                            );
                          });
                      });
                  });
                })
                .catch(async (err) => {
                  await onAlert(
                    "Data added failed. Create_demand_line:498. " + String(err),
                    false
                  );
                });
            } else {
              await onAlert(
                "Data addedd failed. Create_demand_line:502. ",
                false
              );
            }
            await setIsLoading(false);
          });
        if (!isLoading) {
          uploadFlag = true;
        }
      }
    },
  });

  useEffect(() => {
    let recruiters = [];
    pre_requisite.users.map((recruiter, idx) => {
      if (
        (recruiter.supervisor === String(loggedUser.id) ||
          recruiter.manager === String(loggedUser.id) ||
          recruiterIsChecked) &&
        recruiter.role.includes("RECRUITER")
      ) {
        recruiters.push({
          key: recruiter.id,
          value: recruiter.id + "(" + recruiter.name + ")",
        });
      }
      if (idx === pre_requisite.users.length - 1) {
        setUsers(recruiters);
      }
    });
  }, [pre_requisite.users, recruiterIsChecked]);

  const onSelectUsers = (list, item) => {
    let options = [...selectedRecruiters];
    options.push(item.key);
    setSelectedRecruiters(options);
    formik.setFieldValue("assignees", options.join(" "));
    formik.setFieldTouched("assignees", true);
  };

  const onRemoveUsers = (list, item) => {
    let options = selectedRecruiters;
    let index = selectedRecruiters.findIndex((id) => id === item.key);
    options.splice(index, 1);
    setSelectedRecruiters(options);
    formik.setFieldValue("assignees", options.join(" "));
  };

  const onSelectAddPrimarySkill = (list, item) => {
    let options = [...addPrimarySkill];
    options.push(item.item);
    setAddPrimarySkill(options);
    formik.setFieldValue("addprimaryskill", options.join(" "));
    formik.setFieldError("addprimaryskill", "");
  };

  const onRemoveAddPrimarySkill = (list, item) => {
    let options = addPrimarySkill;
    let index = addPrimarySkill.findIndex((id) => id === item.item);
    options.splice(index, 1);
    setAddPrimarySkill(options);
    formik.setFieldValue("addprimaryskill", options.join(" "));
  };

  const onSelectAddSecondarySkill = (list, item) => {
    let options = [...addSecondarySkill];
    options.push(item.item);
    setAddSecondarySkill(options);
    formik.setFieldValue("secondaryskill", options.join(" "));
    formik.setFieldError("addsecondaryskill", true);
  };

  const onRemoveAddSecondarySkill = (list, item) => {
    let options = addSecondarySkill;
    let index = addSecondarySkill.findIndex((id) => id === item.item);
    options.splice(index, 1);
    setAddSecondarySkill(options);
    formik.setFieldValue("secondaryskill", options.join(" "));
  };

  return (
    <Fragment>
      {!Object.values(pre_requisite.users).length > 0 && <Spinners />}
      <Alerts flag={true} />
      {Object.values(pre_requisite.users).length > 0 && (
        <Container className="d-flex justify-content-center ">
          <Card className={`my-3 ${sm ? `w-100` : `w-75`}`}>
            <Card.Header className="bg-primary text-center text-white">
              <h4>Create Demand</h4>
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
                          <b>Recruiter Name</b>
                        </FormLabel>
                      </Col>
                      <Col md="8">
                        <Multiselect
                          ref={multiselectRecruiterRef}
                          displayValue="value"
                          onRemove={onRemoveUsers}
                          onSelect={onSelectUsers}
                          options={users}
                          showCheckbox="false"
                          placeholder={
                            selectedRecruiters.length > 0
                              ? ""
                              : "Select Recruiters"
                          }
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col md={{ span: "8", offset: "4" }}>
                  <Row>
                    <Col md="5">
                      <FormCheck
                        type="checkbox"
                        label="View all Recruiters"
                        checked={recruiterIsChecked}
                        onChange={() => {}}
                        onClick={() =>
                          setRecruiterIsChecked(!recruiterIsChecked)
                        }
                        className={sm ? "" : "ms-2  "}
                      />
                    </Col>
                    <Col md="7">
                      <OverlayTrigger
                        trigger="click"
                        placement="right"
                        overlay={popover}
                      >
                        <FaQuestionCircle
                          size="20"
                          variant="success"
                          style={{ color: "#0d6efd" }}
                        />
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </Col>

                <Col md="12">
                  <div className="row">
                    <Col md="6" className="my-2">
                      <FormLabel>
                        <b>Client Name</b>
                      </FormLabel>
                      {clientIsChecked && (
                        <FormGroup>
                          <FormControl
                            type="text"
                            name="clientname"
                            value={formik.values.clientname}
                            isInvalid={
                              formik.errors.clientname &&
                              formik.touched.clientname &&
                              formik.values.clientname.includes("-")
                            }
                            isValid={
                              !formik.errors.clientname &&
                              formik.touched.clientname &&
                              !formik.values.clientname.includes("-")
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </FormGroup>
                      )}

                      {!clientIsChecked &&
                        Object.values(pre_requisite.clients).length > 0 && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                              name="clientname"
                              onBlur={formik.handleBlur}
                              variant={`outline-${
                                !formik.touched.clientname
                                  ? `primary`
                                  : !formik.values.clientname.includes("-") &&
                                    formik.touched.clientname
                                  ? `success`
                                  : formik.values.clientname.includes("-") &&
                                    formik.touched.clientname
                                  ? `danger`
                                  : ``
                              }`}
                              className="w-100"
                            >
                              {formik.values.clientname}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                              {Object.keys(pre_requisite.clients).map(
                                (client, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item
                                        className="text-center"
                                        active={formik.values.clientname.includes(
                                          client
                                        )}
                                        onClick={() => {
                                          formik.setFieldValue(
                                            "clientname",
                                            client
                                          );
                                        }}
                                      >
                                        {client}
                                      </Dropdown.Item>
                                      {Object.keys(pre_requisite.clients)
                                        .length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      {formik.errors.clientname &&
                        formik.touched.clientname && (
                          <div className="text-danger">
                            {formik.errors.clientname}
                          </div>
                        )}
                      {props.clientFlag && (
                        <FormCheck
                          type="checkbox"
                          label="Enter manually."
                          checked={clientIsChecked}
                          onChange={() => {}}
                          onClick={() => {
                            setClientIsChecked(!clientIsChecked);
                            setEndClientIsChecked(!clientIsChecked);
                            formik.setFieldValue(
                              "clientname",
                              !clientIsChecked ? "" : "- Select the Client -"
                            );
                            formik.setFieldValue(
                              "endclientname",
                              !clientIsChecked ? "" : "- Select the EndClient -"
                            );
                          }}
                        />
                      )}
                    </Col>

                    <Col md="6" className="my-2">
                      <FormLabel>
                        <b>End Client Name</b>
                      </FormLabel>
                      {end_clientIsChecked && (
                        <FormGroup>
                          <FormControl
                            type="text"
                            name="endclientname"
                            value={formik.values.endclientname}
                            isInvalid={
                              formik.errors.endclientname &&
                              formik.touched.endclientname &&
                              formik.values.endclientname.includes("-")
                            }
                            isValid={
                              !formik.errors.endclientname &&
                              formik.touched.endclientname &&
                              !formik.values.endclientname.includes("-")
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </FormGroup>
                      )}
                      {!end_clientIsChecked && (
                        <Dropdown className="dropbox">
                          <Dropdown.Toggle
                            name="endclientname"
                            onBlur={formik.handleBlur}
                            variant={`outline-${
                              !formik.touched.endclientname
                                ? `primary`
                                : !formik.values.endclientname.includes("-") &&
                                  formik.touched.endclientname
                                ? `success`
                                : formik.values.endclientname.includes("-") &&
                                  formik.touched.endclientname
                                ? `danger`
                                : ``
                            }`}
                            className="w-100"
                          >
                            {formik.values.endclientname}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            {!formik.values.clientname.includes("-") &&
                              Object.values(pre_requisite.clients).length > 0 &&
                              pre_requisite.clients[
                                formik.values.clientname
                              ].map((endclient, index) => {
                                return (
                                  <Fragment key={index}>
                                    <Dropdown.Item
                                      className="text-center"
                                      onClick={() =>
                                        formik.setFieldValue(
                                          "endclientname",
                                          endclient
                                        )
                                      }
                                      active={formik.values.endclientname.includes(
                                        endclient
                                      )}
                                    >
                                      {endclient}
                                    </Dropdown.Item>
                                    {pre_requisite.clients[
                                      formik.values.clientname
                                    ].length -
                                      1 >
                                      index && <Dropdown.Divider />}
                                  </Fragment>
                                );
                              })}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                      {formik.errors.endclientname &&
                        formik.touched.endclientname && (
                          <div className="text-danger">
                            {formik.errors.endclientname}
                          </div>
                        )}
                      {!clientIsChecked && (
                        <FormCheck
                          type="checkbox"
                          label="Enter manually."
                          checked={end_clientIsChecked}
                          onChange={() => {}}
                          onClick={() => {
                            setEndClientIsChecked(!end_clientIsChecked);
                            formik.setFieldValue(
                              "endclientname",
                              !end_clientIsChecked
                                ? ""
                                : "- Select the EndClient -"
                            );
                          }}
                        />
                      )}
                    </Col>
                  </div>
                </Col>

                <Col md="12">
                  <div className="row">
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Demand Location</b>
                        </FormLabel>
                        <FormControl
                          type="text"
                          name="location"
                          value={formik.values.location}
                          isInvalid={
                            formik.errors.location && formik.touched.location
                          }
                          isValid={
                            !formik.errors.location && formik.touched.location
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.location && formik.touched.location && (
                          <div className="text-danger">
                            {" "}
                            {formik.errors.location}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Demand Location (State)</b>
                        </FormLabel>
                        <FormControl
                          type="text"
                          name="panlocation"
                          value={formik.values.panlocation}
                          isInvalid={
                            formik.errors.panlocation &&
                            formik.touched.panlocation
                          }
                          isValid={
                            !formik.errors.panlocation &&
                            formik.touched.panlocation
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.panlocation &&
                          formik.touched.panlocation && (
                            <div className="text-danger">
                              {" "}
                              {formik.errors.panlocation}
                            </div>
                          )}
                      </FormGroup>
                    </Col>
                  </div>
                </Col>

                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <Row>
                      <Col md="4">
                        <FormLabel>
                          <b>Type</b>
                        </FormLabel>
                      </Col>
                      <Col md="8">
                        <Dropdown className="dropbox">
                          <Dropdown.Toggle
                            name="type"
                            onBlur={formik.handleBlur}
                            variant={`outline-${
                              !formik.touched.type
                                ? `primary`
                                : !formik.values.type.includes("-") &&
                                  formik.touched.type
                                ? `success`
                                : formik.values.type.includes("-") &&
                                  formik.touched.type
                                ? `danger`
                                : ``
                            }`}
                            className="w-100"
                          >
                            {formik.values.type}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            <Dropdown.Item
                              className="text-center"
                              onClick={() =>
                                formik.setFieldValue("type", "Full Time")
                              }
                            >
                              Full Time
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="text-center"
                              onClick={() =>
                                formik.setFieldValue("type", "Part Time")
                              }
                            >
                              Contractor
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        {formik.errors.type && formik.touched.type && (
                          <div className="text-danger">
                            {formik.errors.type}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
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
                          value={formik.values.demand}
                          min="1"
                          isInvalid={
                            formik.errors.demand && formik.touched.demand
                          }
                          isValid={
                            !formik.errors.demand && formik.touched.demand
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.demand && formik.touched.demand && (
                          <div className="text-danger">
                            {formik.errors.demand}
                          </div>
                        )}
                      </FormGroup>{" "}
                    </Col>
                    <Col md="6">
                      <FormGroup className="my-2">
                        <FormLabel>
                          <b>Date of Demand Allocation</b>
                        </FormLabel>
                        <FormControl
                          type="date"
                          name="demandallot"
                          value={formik.values.demandallot}
                          isInvalid={
                            formik.errors.demandallot &&
                            formik.touched.demandallot
                          }
                          isValid={
                            !formik.errors.demandallot &&
                            formik.touched.demandallot
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.demandallot &&
                          formik.touched.demandallot && (
                            <div className="text-danger">
                              {formik.errors.demandallot}
                            </div>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                {/* Primary Skills */}
                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <FormLabel>
                      <b>Primary Skills</b>
                    </FormLabel>
                    <Row>
                      <Col md="6" className="my-1">
                        {ptIsChecked && (
                          <FormGroup>
                            <FormLabel>
                              <b>Enter the technology</b>
                            </FormLabel>
                            <FormControl
                              type="text"
                              name="primarytech"
                              value={formik.values.primarytech}
                              isInvalid={
                                formik.errors.primarytech &&
                                formik.touched.primarytech &&
                                formik.values.primarytech.includes("-")
                              }
                              isValid={
                                !formik.errors.primarytech &&
                                formik.touched.primarytech &&
                                !formik.values.primarytech.includes("-")
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </FormGroup>
                        )}
                        {!ptIsChecked && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                              name="primarytech"
                              onBlur={formik.handleBlur}
                              variant={`outline-${
                                !formik.touched.primarytech
                                  ? `primary`
                                  : !formik.values.primarytech.includes("-") &&
                                    formik.touched.primarytech
                                  ? `success`
                                  : formik.values.primarytech.includes("-") &&
                                    formik.touched.primarytech
                                  ? `danger`
                                  : ``
                              }`}
                              id="dropdown-basic"
                              className="w-100"
                            >
                              {formik.values.primarytech}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                              {Object.keys(pre_requisite.technologies).map(
                                (tech, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item
                                        className="text-center"
                                        active={formik.values.primarytech.includes(
                                          tech
                                        )}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "primarytech",
                                            tech
                                          )
                                        }
                                      >
                                        {tech}
                                      </Dropdown.Item>
                                      {Object.keys(pre_requisite.technologies)
                                        .length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {formik.errors.primarytech &&
                          formik.touched.primarytech && (
                            <div className="text-danger">
                              {formik.errors.primarytech}
                            </div>
                          )}
                        {props.techFlag && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            checked={ptIsChecked}
                            onChange={() => {}}
                            onClick={() => {
                              setPrimaryTechIsChecked(!ptIsChecked);
                              setPrimarySkillIsChecked(!ptIsChecked);
                              formik.setFieldValue(
                                "primarytech",
                                !ptIsChecked ? "" : "- Select the Technology -"
                              );
                              formik.setFieldValue(
                                "primaryskill",
                                !ptIsChecked ? "" : "- Select the Skill -"
                              );
                            }}
                          />
                        )}
                      </Col>
                      <Col md="6" className="my-1">
                        {(ptIsChecked || psIsChecked) && (
                          <FormGroup>
                            {ptIsChecked && (
                              <FormLabel>
                                <b>Enter the Skill</b>
                              </FormLabel>
                            )}
                            <FormControl
                              type="text"
                              name="primaryskill"
                              value={formik.values.primaryskill}
                              isInvalid={
                                formik.errors.primaryskill &&
                                formik.touched.primaryskill &&
                                formik.values.primaryskill.includes("-")
                              }
                              isValid={
                                !formik.errors.primaryskill &&
                                formik.touched.primaryskill &&
                                !formik.values.primaryskill.includes("-")
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </FormGroup>
                        )}
                        {!ptIsChecked && !psIsChecked && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                              name="primaryskill"
                              onBlur={formik.handleBlur}
                              variant={`outline-${
                                !formik.touched.primaryskill
                                  ? `primary`
                                  : !formik.values.primaryskill.includes("-") &&
                                    formik.touched.primaryskill
                                  ? `success`
                                  : formik.values.primaryskill.includes("-") &&
                                    formik.touched.primaryskill
                                  ? `danger`
                                  : ``
                              }`}
                              className="w-100"
                            >
                              {formik.values.primaryskill}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                              {!formik.values.primarytech.includes("-") &&
                                (pre_requisite.technologies.length > 0 ||
                                  Object.values(pre_requisite.technologies)
                                    .length > 0) &&
                                pre_requisite.technologies[
                                  formik.values.primarytech
                                ].map((skill, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item
                                        className="text-center"
                                        active={formik.values.primaryskill.includes(
                                          skill
                                        )}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "primaryskill",
                                            skill
                                          )
                                        }
                                      >
                                        {skill}
                                      </Dropdown.Item>
                                      {pre_requisite.technologies[
                                        formik.values.primarytech
                                      ].length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                })}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {formik.errors.primaryskill &&
                          formik.touched.primaryskill && (
                            <div className="text-danger">
                              {formik.errors.primaryskill}
                            </div>
                          )}
                        {!ptIsChecked && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            checked={psIsChecked}
                            onChange={() => {}}
                            onClick={() => {
                              setPrimarySkillIsChecked(!psIsChecked);
                              formik.setFieldValue(
                                "primaryskill",
                                !psIsChecked ? "" : "- Select the Skill -"
                              );
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                {/* Addtional Primary Skill */}
                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <FormLabel>
                      <b>Addtional Primary Skills</b>
                    </FormLabel>
                    <Row>
                      <Col md="6" className="my-1">
                        {aptIsChecked && (
                          <FormGroup>
                            <FormLabel>
                              <b>Enter the technology</b>
                            </FormLabel>
                            <FormControl
                              type="text"
                              name="addprimarytech"
                              value={formik.values.addprimarytech}
                              isInvalid={
                                formik.errors.addprimarytech &&
                                formik.touched.addprimarytech &&
                                formik.values.addprimarytech.includes("-")
                              }
                              isValid={
                                !formik.errors.addprimarytech &&
                                formik.touched.addprimarytech &&
                                !formik.values.addprimarytech.includes("-")
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </FormGroup>
                        )}
                        {!aptIsChecked && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                              name="addprimarytech"
                              onBlur={formik.handleBlur}
                              variant={`outline-${
                                !formik.touched.addprimarytech
                                  ? `primary`
                                  : !formik.values.addprimarytech.includes(
                                      "-"
                                    ) && formik.touched.addprimarytech
                                  ? `success`
                                  : formik.values.addprimarytech.includes(
                                      "-"
                                    ) && formik.touched.addprimarytech
                                  ? `danger`
                                  : ``
                              }`}
                              id="dropdown-basic"
                              className="w-100"
                            >
                              {formik.values.addprimarytech}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                              {Object.keys(pre_requisite.technologies).map(
                                (tech, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item
                                        className="text-center"
                                        active={formik.values.addprimarytech.includes(
                                          tech
                                        )}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "addprimarytech",
                                            tech
                                          )
                                        }
                                      >
                                        {tech}
                                      </Dropdown.Item>
                                      {Object.keys(pre_requisite.technologies)
                                        .length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {formik.errors.addprimarytech &&
                          formik.touched.addprimarytech && (
                            <div className="text-danger">
                              {formik.errors.addprimarytech}
                            </div>
                          )}
                        {props.techFlag && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            checked={aptIsChecked}
                            onChange={() => {}}
                            onClick={() => {
                              setAddPrimaryTechIsChecked(!aptIsChecked);
                              setAddPrimarySkillIsChecked(!aptIsChecked);
                              formik.setFieldValue(
                                "addprimarytech",
                                !aptIsChecked ? "" : "- Select the Technology -"
                              );
                            }}
                          />
                        )}
                      </Col>
                      <Col md="6" className="my-1">
                        {(aptIsChecked || apsIsChecked) && (
                          <FormGroup>
                            {aptIsChecked && (
                              <FormLabel>
                                <b>Enter the Skill</b>
                              </FormLabel>
                            )}
                            <FormControl
                              type="text"
                              name="addprimaryskill"
                              value={formik.values.addprimaryskill}
                              isInvalid={
                                formik.errors.addprimaryskill &&
                                formik.touched.addprimaryskill &&
                                formik.values.addprimaryskill.includes("-")
                              }
                              isValid={
                                !formik.errors.addprimaryskill &&
                                formik.touched.addprimaryskill &&
                                !formik.values.addprimaryskill.includes("-")
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </FormGroup>
                        )}
                        {!aptIsChecked && !apsIsChecked && (
                          <Multiselect
                            ref={multiselectAddPrimarySkillRef}
                            displayValue="item"
                            onRemove={onRemoveAddPrimarySkill}
                            onSelect={onSelectAddPrimarySkill}
                            options={
                              formik.values.addprimarytech.includes("-") ||
                              aptIsChecked
                                ? []
                                : pre_requisite.technologies[
                                    formik.values.addprimarytech
                                  ].map((item) => {
                                    return { item };
                                  })
                            }
                            showCheckbox="false"
                            placeholder={
                              addPrimarySkill.length > 0
                                ? ""
                                : "Select Technologies"
                            }
                          />
                        )}
                        {formik.errors.addprimaryskill &&
                          formik.touched.addprimaryskill && (
                            <div className="text-danger">
                              {formik.errors.addprimaryskill}
                            </div>
                          )}
                        {!aptIsChecked && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            checked={apsIsChecked}
                            onChange={() => {}}
                            onClick={() => {
                              setAddPrimarySkillIsChecked(!apsIsChecked);
                              formik.setFieldValue(
                                "addprimaryskill",
                                !apsIsChecked ? "" : "- Select the Skill -"
                              );
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                {/* Secondary Skills */}
                <Col md={{ span: 12 }}>
                  <FormGroup className="my-2">
                    <FormLabel>
                      <b>Secondary Skills</b>
                    </FormLabel>
                    <Row>
                      <Col md="6" className="my-1">
                        {stIsChecked && (
                          <FormGroup>
                            <FormLabel>
                              <b>Enter the technology</b>
                            </FormLabel>
                            <FormControl
                              type="text"
                              name="secondarytech"
                              value={formik.values.secondarytech}
                              isInvalid={
                                formik.errors.secondarytech &&
                                formik.touched.secondarytech &&
                                formik.values.secondarytech.includes("-")
                              }
                              isValid={
                                !formik.errors.secondarytech &&
                                formik.touched.secondarytech &&
                                !formik.values.secondarytech.includes("-")
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </FormGroup>
                        )}
                        {!stIsChecked && (
                          <Dropdown className="dropbox">
                            <Dropdown.Toggle
                              name="secondarytech"
                              onBlur={formik.handleBlur}
                              variant={`outline-${
                                !formik.touched.secondarytech
                                  ? `primary`
                                  : !formik.values.secondarytech.includes(
                                      "-"
                                    ) && formik.touched.secondarytech
                                  ? `success`
                                  : formik.values.secondarytech.includes("-") &&
                                    formik.touched.secondarytech
                                  ? `danger`
                                  : ``
                              }`}
                              className="w-100"
                            >
                              {formik.values.secondarytech}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                              {Object.keys(pre_requisite.technologies).map(
                                (tech, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Dropdown.Item
                                        className="text-center"
                                        active={formik.values.secondarytech.includes(
                                          tech
                                        )}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "secondarytech",
                                            tech
                                          )
                                        }
                                      >
                                        {tech}
                                      </Dropdown.Item>
                                      {Object.keys(pre_requisite.technologies)
                                        .length -
                                        1 >
                                        index && <Dropdown.Divider />}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {formik.errors.secondarytech &&
                          formik.touched.secondarytech && (
                            <div className="text-danger">
                              {formik.errors.secondarytech}
                            </div>
                          )}
                        {props.techFlag && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            checked={stIsChecked}
                            onChange={() => {}}
                            onClick={() => {
                              setSecondaryTechIsChecked(!stIsChecked);
                              setSecondarySkillIsChecked(!stIsChecked);
                              formik.setFieldValue(
                                "secondarytech",
                                !stIsChecked ? "" : "- Select the Technology -"
                              );
                              formik.setFieldValue(
                                "secondaryskill",
                                !stIsChecked ? "" : "- Select the Skill -"
                              );
                            }}
                          />
                        )}
                      </Col>
                      <Col md="6" className="my-1">
                        {(stIsChecked || ssIsChecked) && (
                          <FormGroup>
                            {stIsChecked && (
                              <FormLabel>
                                <b>Enter the Skill</b>
                              </FormLabel>
                            )}
                            <FormControl
                              type="text"
                              name="secondaryskill"
                              value={formik.values.secondaryskill}
                              isInvalid={
                                formik.errors.secondaryskill &&
                                formik.touched.secondaryskill &&
                                formik.values.secondaryskill.includes("-")
                              }
                              isValid={
                                !formik.errors.secondaryskill &&
                                formik.touched.secondaryskill &&
                                !formik.values.secondaryskill.includes("-")
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </FormGroup>
                        )}
                        {!stIsChecked && !ssIsChecked && (
                          <Multiselect
                            ref={multiselectAddSecondarySkillRef}
                            displayValue="item"
                            onRemove={onRemoveAddSecondarySkill}
                            onSelect={onSelectAddSecondarySkill}
                            options={
                              formik.values.secondarytech.includes("-") ||
                              stIsChecked
                                ? []
                                : pre_requisite.technologies[
                                    formik.values.secondarytech
                                  ].map((item) => {
                                    return { item };
                                  })
                            }
                            showCheckbox="false"
                            placeholder={
                              addSecondarySkill.length > 0
                                ? ""
                                : "Select Technologies"
                            }
                          />
                        )}
                        {formik.errors.secondaryskill &&
                          formik.touched.secondaryskill && (
                            <div className="text-danger">
                              {formik.errors.secondaryskill}
                            </div>
                          )}
                        {!stIsChecked && (
                          <FormCheck
                            type="checkbox"
                            label="Enter manually."
                            checked={ssIsChecked}
                            onChange={() => {}}
                            onClick={() => {
                              setSecondarySkillIsChecked(!ssIsChecked);
                              formik.setFieldValue(
                                "secondaryskill",
                                !ssIsChecked ? "" : "- Select the Skill -"
                              );
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
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
export default CreateDemand;
