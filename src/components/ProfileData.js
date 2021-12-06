import { useFormik } from "formik";
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  FormGroup,
  FormControl,
  Form,
  FormLabel,
  Dropdown,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";
import { ProfileActions } from "../Redux/ProfileSlice";

const validate = (value) => {
  const errors = {};
  if (!value.candidateName) {
    errors.candidateName = "*Required.";
  } else if (!new RegExp("^[A-Z]+$").test(value.candidateName)) {
    errors.candidateName = "*Alphabets only allowed and must be in uppercase.";
  }

  if (!value.dob) {
    errors.dob = "*Required.";
  }

  if (!value.gender) {
    errors.gender = "*Required.";
  }

  if (!value.contactNo) {
    errors.contactNo = "*Required.";
  } else if (String(value.contactNo).length > 14) {
    errors.contactNo =
      "*Phone number must be with in 15 charcaters with country code.";
  } else if (!new RegExp("^[0-9]{1,3}[-]{1}").test(value.contactNo)) {
    errors.contactNo = "*Please enter hypen after country code.";
  } else if (!new RegExp("[0-9]{7,10}$").test(value.contactNo)) {
    errors.contactNo = "*Invalid Format (Numbers Only).";
  }

  if (!value.emailID) {
    errors.emailID = "*Required.";
  } else if (
    !new RegExp(
      "^[A-Za-z]{1}[A-Za-z0-9_.]+[@]{1}[A-Za-z]+[.]{1}[A-Za-z]{2,3}$"
    ).test(value.emailID)
  ) {
    errors.emailID = "*Invalid Format.";
  }

  if (!value.primarySkill) {
    errors.primarySkill = "*Required";
  }

  if (!String(value.primaryExperience)) {
    errors.primaryExperience = "*Required";
  }

  if (!value.secondarySkill) {
    errors.secondarySkill = "*Required";
  }

  if (!String(value.secondaryExperience)) {
    errors.secondaryExperience = "*Required";
  }

  if (!String(value.currentCTC)) {
    errors.currentCTC = "*Required";
  }

  if (!String(value.expectedCTC)) {
    errors.expectedCTC = "*Required";
  }

  if (!value.education) {
    errors.education = "*Required";
  }

  if (!String(value.mark)) {
    errors.mark = "*Required";
  } else if (!(value.mark <= 100 && value.mark >= 0)) {
    errors.mark = "*Mark percentage should be in 0 to 100.";
  }
  return errors;
};

const ProfileData = (props) => {
  const dispatch = useDispatch();
  const profileInfo = useSelector((state) => state.profileInfo);

  const formik = useFormik({
    initialValues: {
      candidateID: "P" + new Date().getTime(),
      candidateName: "",
      dob: "",
      gender: "- Selcet Gender -",
      contactNo: "",
      emailID: "",
      currentCTC: "",
      expectedCTC: "",
      primarySkill: "",
      primaryExperience: "",
      secondarySkill: "",
      secondaryExperience: "",
      education: "",
      mark: "",
    },
    validate,
  });

  useEffect(() => {
    if (props.view) {
      if (Object.keys(profileInfo.data).includes(props.file)) {
        formik.setValues(profileInfo.data[props.file]);
      } else {
        formik.setValues(profileInfo.added_data[props.file]);
      }
    }
  }, [profileInfo]);

  const handleClose = () => {
    dispatch(AlertActions.handleClose());
  };

  const handleConfirm = () => {
    dispatch(AlertActions.handleClose());
    dispatch(ProfileActions.handleAdd({ [props.file]: formik.values }));
    formik.resetForm();
    formik.setFieldValue("gender", "- Select Gender -");
  };
  console.log(profileInfo.data);
  return (
    <Form>
      <Row>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Profile ID</FormLabel>
            <FormControl
              type="text"
              name="candidateID"
              disabled
              value={formik.values.candidateID}
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Candidate Name</FormLabel>
            <FormControl
              type="text"
              name="candidateName"
              readOnly={props.view}
              value={formik.values.candidateName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.candidateName &&
                (formik.touched.candidateName ||
                  formik.values.candidateName.length > 0)
              }
              isValid={
                !formik.errors.candidateName &&
                (formik.touched.candidateName ||
                  formik.values.candidateName.length > 0)
              }
            />
            <div className="invalid-feedback">
              {formik.errors.candidateName}
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup>
            <FormLabel htmlFor="date of birth">Date of Birth</FormLabel>
            <FormControl
              type="date"
              name="dob"
              readOnly={props.view}
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.errors.dob && formik.touched.dob}
              isValid={
                (!formik.errors.dob && formik.touched.dob) ||
                formik.values.dob.length > 0
              }
            />
            <div className="invalid-feedback">{formik.errors.dob}</div>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormLabel>Gender</FormLabel>
          <Dropdown>
            <Dropdown.Toggle
              disabled={props.view}
              variant={`outline-${
                !formik.touched.gender
                  ? props.view
                    ? `secondary`
                    : `primary`
                  : !formik.values.gender.includes("-") && formik.touched.gender
                  ? `success`
                  : formik.values.gender.includes("-") && formik.touched.gender
                  ? `danger`
                  : ``
              }`}
              className="w-100 text-dark"
              name="gender"
              onBlur={formik.handleBlur}
            >
              {formik.values.gender}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100 text-center">
              <Dropdown.Item
                onClick={(e) => {
                  formik.setFieldValue("gender", "Male");
                  formik.setFieldValue(
                    "candidateID",
                    formik.values.candidateID + "M"
                  );
                }}
              >
                Male
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={(e) => {
                  formik.setFieldValue("gender", "Female");
                  formik.setFieldValue(
                    "candidateID",
                    formik.values.candidateID + "F"
                  );
                }}
              >
                Female
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={(e) => {
                  formik.setFieldValue("gender", "Others");
                  formik.setFieldValue(
                    "candidateID",
                    formik.values.candidateID + "O"
                  );
                }}
              >
                Others
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {formik.values.gender.includes("-") && formik.touched.gender && (
            <p className="text-danger" style={{ fontSize: ".9rem" }}>
              *Required.
            </p>
          )}
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Contact Number</FormLabel>
            <FormControl
              type="text"
              name="contactNo"
              placeholder="91-9999999999"
              readOnly={props.view}
              value={formik.values.contactNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.contactNo &&
                (formik.touched.contactNo || formik.values.contactNo.length > 0)
              }
              isValid={
                !formik.errors.contactNo &&
                (formik.touched.contactNo || formik.values.contactNo.length > 0)
              }
            />
            <div className="invalid-feedback">{formik.errors.contactNo}</div>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Email ID</FormLabel>
            <FormControl
              type="text"
              name="emailID"
              readOnly={props.view}
              value={formik.values.emailID}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.emailID &&
                (formik.touched.emailID || formik.values.emailID.length > 0)
              }
              isValid={
                !formik.errors.emailID &&
                (formik.touched.emailID || formik.values.emailID.length > 0)
              }
            />
            <div className="invalid-feedback">{formik.errors.emailID}</div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Primary Skill</FormLabel>
            <FormControl
              type="text"
              name="primarySkill"
              readOnly={props.view}
              value={formik.values.primarySkill}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.primarySkill &&
                (formik.touched.primarySkill ||
                  formik.values.primarySkill.length > 0)
              }
              isValid={
                !formik.errors.primarySkill &&
                (formik.touched.primarySkill ||
                  formik.values.primarySkill.length > 0)
              }
            />
            <div className="invalid-feedback">{formik.errors.primarySkill}</div>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Experience (years)</FormLabel>
            <FormControl
              type="number"
              min="0"
              name="primaryExperience"
              readOnly={props.view}
              value={formik.values.primaryExperience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.primaryExperience &&
                (formik.touched.primaryExperience ||
                  formik.values.primaryExperience > 0)
              }
              isValid={
                !formik.errors.primaryExperience &&
                (formik.touched.primaryExperience ||
                  formik.values.primaryExperience > 0)
              }
            />
            <div className="invalid-feedback">
              {formik.errors.primaryExperience}
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Secondary Skill</FormLabel>
            <FormControl
              type="text"
              name="secondarySkill"
              readOnly={props.view}
              value={formik.values.secondarySkill}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.secondarySkill &&
                (formik.touched.secondarySkill ||
                  formik.values.secondarySkill.length > 0)
              }
              isValid={
                !formik.errors.secondarySkill &&
                (formik.touched.secondarySkill ||
                  formik.values.secondarySkill.length > 0)
              }
            />
            <div className="invalid-feedback">
              {formik.errors.secondarySkill}
            </div>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Experience (years)</FormLabel>
            <FormControl
              type="number"
              min="0"
              name="secondaryExperience"
              readOnly={props.view}
              value={formik.values.secondaryExperience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.secondaryExperience &&
                (formik.touched.secondaryExperience ||
                  formik.values.secondaryExperience > 0)
              }
              isValid={
                !formik.errors.secondaryExperience &&
                (formik.touched.secondaryExperience ||
                  formik.values.secondaryExperience > 0)
              }
            />
            <div className="invalid-feedback">
              {formik.errors.secondaryExperience}
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Current CTC (lakhs)</FormLabel>
            <FormControl
              type="number"
              name="currentCTC"
              min="0"
              readOnly={props.view}
              value={formik.values.currentCTC}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.currentCTC &&
                (formik.touched.currentCTC || formik.values.currentCTC > 0)
              }
              isValid={
                !formik.errors.currentCTC &&
                (formik.touched.currentCTC || formik.values.currentCTC > 0)
              }
            />
            <div className="invalid-feedback">{formik.errors.currentCTC}</div>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Expected CTC (lakhs)</FormLabel>
            <FormControl
              type="number"
              name="expectedCTC"
              min="0"
              readOnly={props.view}
              value={formik.values.expectedCTC}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.expectedCTC &&
                (formik.touched.expectedCTC || formik.values.expectedCTC > 0)
              }
              isValid={
                !formik.errors.expectedCTC &&
                (formik.touched.expectedCTC || formik.values.expectedCTC > 0)
              }
            />
            <div className="invalid-feedback">{formik.errors.expectedCTC}</div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Highest Education</FormLabel>
            <FormControl
              type="text"
              name="education"
              readOnly={props.view}
              value={formik.values.education}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.education &&
                (formik.touched.education || formik.values.education.length > 0)
              }
              isValid={
                !formik.errors.education &&
                (formik.touched.education || formik.values.education.length > 0)
              }
            />
            <div className="invalid-feedback">{formik.errors.education}</div>
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup className="my-2">
            <FormLabel>Marks/CGPA (%)</FormLabel>
            <FormControl
              type="number"
              name="mark"
              min="0"
              value={formik.values.mark}
              readOnly={props.view}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.mark &&
                (formik.touched.mark || formik.values.mark > 0)
              }
              isValid={
                !formik.errors.mark &&
                (formik.touched.mark || formik.values.mark > 0)
              }
            />
            <div className="invalid-feedback">{formik.errors.mark}</div>
          </FormGroup>
        </Col>
      </Row>
      {!props.view && <hr />}
      <div
        className={`d-flex justify-content-${props.view ? `between` : `end`}`}
      >
        <Button
          variant="danger"
          className={props.view ? "" : "me-4"}
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={props.view || !(formik.dirty && formik.isValid)}
        >
          {props.flag ? "Confirm" : "Save"}
        </Button>
      </div>
    </Form>
  );
};

export default ProfileData;
