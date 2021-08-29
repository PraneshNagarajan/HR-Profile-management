import { useFormik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Dropdown,
  FormControl,
  FormLabel,
  TabContent,
  Form,
  FormGroup,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { InfoActions } from "../Redux/EmployeeInfoSlice";

const initialValues = {
  id: "",
  email: "",
};
const validate = (value) => {
  const errors = {};
  if (!value.id) {
    errors.id = "*Required.";
  }

  if (!value.email) {
    errors.email = "*Required.";
  } else if (
    !new RegExp(
      "^[A-Za-z]{1}[A-Za-z0-9_.]+[@]{1}[A-Za-z]+[.]{1}[A-Za-z]{2,3}$"
    ).test(value.email)
  ) {
    errors.email = "*Invalid Format.";
  }
  return errors;
};
const EmployeeTabContent = () => {
  const dispatch = useDispatch();
  const sm = useMediaQuery({ maxWidth: 768 });
  const [selectedRole, setRole] = useState("- Select Role -");
  const [selectedPermission, setPermission] = useState("- Select Permission -");
  const infos = useSelector((state) => state.info);

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (value) => {
      dispatch(InfoActions.getEmployeeInfo());
    },
  });

  useEffect(() => {
    if (infos.submitted) {
      formik.resetForm();
      setPermission("- Select Permission -");
      setRole("- Select Role -");
      dispatch(InfoActions.getSubmittedStatus());
    }
  }, [infos.submitted]);

  return (
    <TabContent>
      <Card>
        <Card.Body className="mb-5">
          <Form
            className="mb-5"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <Row className="my-2">
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup>
                  <FormLabel htmlFor="employee id">Employee Id</FormLabel>
                  <FormControl
                    type="text"
                    name="id"
                    value={formik.values.id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.id &&
                      (formik.touched.id || formik.values.id.length > 0)
                    }
                    isValid={
                      !formik.errors.id &&
                      (formik.touched.id || formik.values.id.length > 0)
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.id}</div>
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Roles</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    variant={`outline-${
                      !formik.touched.role
                        ? `primary`
                        : !selectedRole.includes("Role") && formik.touched.role
                        ? `success`
                        : selectedRole.includes("Role") && formik.touched.role
                        ? `danger`
                        : ``
                    }`}
                    name="role"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {selectedRole}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={(e) => {
                        setRole("Junior-Recruiter");
                        setPermission("- Select Permission -");
                      }}
                      active={selectedRole.includes("Junior")}
                    >
                      Recruiter
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => {
                        setRole("Senior-Recruiter");
                        setPermission("- Select Permission -");
                      }}
                      active={selectedRole.includes("Senior")}
                    >
                      Senior-Recruiter
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => {
                        setRole("Focal");
                      }}
                      active={selectedRole.includes("Focal")}
                    >
                      Focal
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {selectedRole.includes("-") && (
                  <div className="text-danger">{formik.errors.role}</div>
                )}
              </Col>
            </Row>
            <Row className="my-5">
              <Col md={{ span: "5", offset: "1" }}>
                <FormGroup>
                  <FormLabel htmlFor="employee id">Employee email Id</FormLabel>
                  <FormControl
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.errors.email &&
                      (formik.touched.email || formik.values.email.length > 0)
                    }
                    isValid={
                      !formik.errors.email &&
                      (formik.touched.email || formik.values.email.length > 0)
                    }
                  />
                  <div className="invalid-feedback">{formik.errors.email}</div>
                </FormGroup>
              </Col>
              <Col md="5">
                <FormLabel>Permissions</FormLabel>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={!selectedRole.includes("Focal")}
                    variant={`outline-${
                      !selectedRole.includes("Focal")
                        ? `primary`
                        : !selectedPermission.includes("-") &&
                          formik.touched.permission
                        ? `success`
                        : selectedPermission.includes("-")
                        ? `danger`
                        : ``
                    }`}
                    name="permission"
                    className="w-100"
                    onBlur={formik.handleBlur}
                  >
                    {selectedPermission}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    <Dropdown.Item
                      onClick={(e) => {
                        setPermission("View & Edit");
                      }}
                      active={selectedPermission.includes("Write")}
                    >
                      View & Edit
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={(e) => {
                        setPermission("Read Only");
                      }}
                      active={selectedPermission.includes("Only")}
                    >
                      View Only
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {selectedRole.includes("Focal") &&
                  selectedPermission.includes("-") && (
                    <div className="text-danger">*Required.</div>
                  )}
              </Col>
            </Row>
            <div className={sm ? "" : "float-end"}>
              <Button
                className={sm ? "w-100" : ""}
                disabled={
                  !(formik.dirty && formik.isValid) ||
                  selectedRole.includes("Role") ||
                  selectedRole.includes("Focal")
                    ? selectedPermission.includes("-")
                    : false ||
                      !infos.personal.length > 0 ||
                      !infos.address.length > 0
                }
                type="submit"
              >
                Save && Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </TabContent>
  );
};
export default EmployeeTabContent;
