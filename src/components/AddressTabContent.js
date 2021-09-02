import { useFormik } from "formik";
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  FormGroup,
  FormControl,
  FormCheck,
  TabContent,
  Form,
  FormLabel,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { InfoActions } from "../Redux/EmployeeInfoSlice";
import { useMediaQuery } from "react-responsive";

const initialValues = {
  flatno: "",
  street: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pincode: "",
};

const validate = (value) => {
  const errors = {};
  if (!value.flatno) {
    errors.flatno = "*Required.";
  }

  if (!value.street) {
    errors.street = "*Required.";
  } else if (!new RegExp("^[A-Za-z ]*$").test(value.street)) {
    errors.street = "Alphabets only allowed.";
  }

  if (!value.landmark) {
    errors.landmark = "*Required.";
  } else if (!new RegExp("^[A-Za-z ]*$").test(value.landmark)) {
    errors.landmark = "Alphabets only allowed.";
  }

  if (!value.city) {
    errors.city = "*Required.";
  } else if (!new RegExp("^[A-Za-z]*$").test(value.city)) {
    errors.city = "Alphabets only allowed.";
  }

  if (!value.district) {
    errors.district = "*Required.";
  } else if (!new RegExp("^[A-Za-z]*$").test(value.district)) {
    errors.district = "Alphabets only allowed.";
  }

  if (!value.state) {
    errors.state = "*Required.";
  } else if (!new RegExp("^[A-Za-z]*$").test(value.state)) {
    errors.state = "Alphabets only allowed.";
  }

  if (!value.country) {
    errors.country = "*Required.";
  } else if (!new RegExp("^[A-Za-z]*$").test(value.country)) {
    errors.country = "Alphabets only allowed.";
  }

  if (!value.pincode) {
    errors.pincode = "*Required.";
  } else if (!new RegExp("^[0-9]*$").test(value.pincode)) {
    errors.pincode = "Numbers only allowed.";
  }
  return errors;
};

const AddressTabContent = (props) => {
  const [addressFlag, setAddressFlag] = useState(false);
  const dispatch = useDispatch();
  const sm = useMediaQuery({ maxWidth: 768 });
  const infos = useSelector((state) => state.info);

  useEffect(() => {
    if (addressFlag) {
      formik_permanentAdd.setValues(formik_presentAdd.values);
    } else if (props.view) {
      formik_permanentAdd.setValues(infos.address.permanent);
    } else {
      formik_permanentAdd.setValues(initialValues);
    }
  }, [addressFlag]);

  const formik_presentAdd = useFormik({
    initialValues: props.view ? infos.address.present : initialValues,
    validate,
  });

  const formik_permanentAdd = useFormik({
    initialValues,
    validate,
  });

  useEffect(() => {
    if (infos.submitted) {
      formik_permanentAdd.resetForm();
      formik_presentAdd.resetForm();
      setAddressFlag(false);
    }
  }, [infos.submitted]);

  return (
    <TabContent>
      <Card>
        <Card.Body className="mb-3">
          <h4>Present Address</h4>
          <Form>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Flat No</FormLabel>
                  <FormControl
                    type="text"
                    name="flatno"
                    value={formik_presentAdd.values.flatno}
                    onChange={formik_presentAdd.handleChange}
                    onBlur={formik_presentAdd.handleBlur}
                    isInvalid={
                      formik_presentAdd.errors.flatno &&
                      (formik_presentAdd.touched.flatno ||
                        formik_presentAdd.values.flatno.length > 0)
                    }
                    isValid={
                      !formik_presentAdd.errors.flatno &&
                      (formik_presentAdd.touched.flatno ||
                        formik_presentAdd.values.flatno.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_presentAdd.errors.flatno}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Street Name</FormLabel>
                  <FormControl
                    type="text"
                    name="street"
                    value={formik_presentAdd.values.street}
                    onChange={formik_presentAdd.handleChange}
                    onBlur={formik_presentAdd.handleBlur}
                    isInvalid={
                      formik_presentAdd.errors.street &&
                      (formik_presentAdd.touched.street ||
                        formik_presentAdd.values.street.length > 0)
                    }
                    isValid={
                      !formik_presentAdd.errors.street &&
                      (formik_presentAdd.touched.street ||
                        formik_presentAdd.values.street.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_presentAdd.errors.street}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Landmark</FormLabel>
                  <FormControl
                    type="text"
                    name="landmark"
                    value={formik_presentAdd.values.landmark}
                    onChange={formik_presentAdd.handleChange}
                    onBlur={formik_presentAdd.handleBlur}
                    isInvalid={
                      formik_presentAdd.errors.landmark &&
                      (formik_presentAdd.touched.landmark ||
                        formik_presentAdd.values.landmark.length > 0)
                    }
                    isValid={
                      !formik_presentAdd.errors.landmark &&
                      (formik_presentAdd.touched.landmark ||
                        formik_presentAdd.values.landmark.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_presentAdd.errors.landmark}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>City</FormLabel>
                  <FormControl
                    type="text"
                    name="city"
                    value={formik_presentAdd.values.city}
                    onChange={formik_presentAdd.handleChange}
                    onBlur={formik_presentAdd.handleBlur}
                    isInvalid={
                      formik_presentAdd.errors.city &&
                      (formik_presentAdd.touched.city ||
                        formik_presentAdd.values.city.length > 0)
                    }
                    isValid={
                      !formik_presentAdd.errors.city &&
                      (formik_presentAdd.touched.city ||
                        formik_presentAdd.values.city.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_presentAdd.errors.city}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>district</FormLabel>
                  <FormControl
                    type="text"
                    name="district"
                    value={formik_presentAdd.values.district}
                    onChange={formik_presentAdd.handleChange}
                    onBlur={formik_presentAdd.handleBlur}
                    isInvalid={
                      formik_presentAdd.errors.district &&
                      (formik_presentAdd.touched.district ||
                        formik_presentAdd.values.district.length > 0)
                    }
                    isValid={
                      !formik_presentAdd.errors.district &&
                      (formik_presentAdd.touched.district ||
                        formik_presentAdd.values.district.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_presentAdd.errors.district}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>State</FormLabel>
                  <FormControl
                    type="text"
                    name="state"
                    value={formik_presentAdd.values.state}
                    onChange={formik_presentAdd.handleChange}
                    onBlur={formik_presentAdd.handleBlur}
                    isInvalid={
                      formik_presentAdd.errors.state &&
                      (formik_presentAdd.touched.state ||
                        formik_presentAdd.values.state.length > 0)
                    }
                    isValid={
                      !formik_presentAdd.errors.state &&
                      (formik_presentAdd.touched.state ||
                        formik_presentAdd.values.state.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_presentAdd.errors.state}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Country</FormLabel>
                  <FormControl
                    type="text"
                    name="country"
                    value={formik_presentAdd.values.country}
                    onChange={formik_presentAdd.handleChange}
                    onBlur={formik_presentAdd.handleBlur}
                    isInvalid={
                      formik_presentAdd.errors.country &&
                      (formik_presentAdd.touched.country ||
                        formik_presentAdd.values.country.length > 0)
                    }
                    isValid={
                      !formik_presentAdd.errors.country &&
                      (formik_presentAdd.touched.country ||
                        formik_presentAdd.values.country.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_presentAdd.errors.country}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Pincode</FormLabel>
                  <FormControl
                    type="number"
                    name="pincode"
                    value={formik_presentAdd.values.pincode}
                    onChange={formik_presentAdd.handleChange}
                    onBlur={formik_presentAdd.handleBlur}
                    isInvalid={
                      formik_presentAdd.errors.pincode &&
                      (formik_presentAdd.touched.pincode ||
                        String(formik_presentAdd.values.pincode).length > 0)
                    }
                    isValid={
                      !formik_presentAdd.errors.pincode &&
                      (formik_presentAdd.touched.pincode ||
                        String(formik_presentAdd.values.pincode).length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_presentAdd.errors.pincode}
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Form>
          <hr className="my-5" />
          <h4>Permenant Address</h4>
          <FormGroup>
            <FormCheck
              type="checkbox"
              checked={addressFlag}
              disabled={props.view}
              onChange={() => {}}
              label="Same as Present address"
              onClick={(e) => setAddressFlag(!addressFlag)}
            ></FormCheck>
          </FormGroup>
          {/* Permenant adrees form */}
          <Form>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Flat No</FormLabel>
                  <FormControl
                    type="text"
                    name="flatno"
                    readOnly={addressFlag || props.view}
                    value={
                      addressFlag
                        ? formik_presentAdd.values.flatno
                        : formik_permanentAdd.values.flatno
                    }
                    onChange={formik_permanentAdd.handleChange}
                    onBlur={formik_permanentAdd.handleBlur}
                    isInvalid={
                      formik_permanentAdd.errors.flatno &&
                      (formik_permanentAdd.touched.flatno ||
                        formik_permanentAdd.values.flatno.length > 0)
                    }
                    isValid={
                      !formik_permanentAdd.errors.flatno &&
                      (formik_permanentAdd.touched.flatno ||
                        formik_permanentAdd.values.flatno.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_permanentAdd.errors.flatno}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Street Name</FormLabel>
                  <FormControl
                    type="text"
                    name="street"
                    readOnly={addressFlag || props.view}
                    value={
                      addressFlag
                        ? formik_presentAdd.values.street
                        : formik_permanentAdd.values.street
                    }
                    onChange={formik_permanentAdd.handleChange}
                    onBlur={formik_permanentAdd.handleBlur}
                    isInvalid={
                      formik_permanentAdd.errors.street &&
                      (formik_permanentAdd.touched.street ||
                        formik_permanentAdd.values.street.length > 0)
                    }
                    isValid={
                      !formik_permanentAdd.errors.street &&
                      (formik_permanentAdd.touched.street ||
                        formik_permanentAdd.values.street.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_permanentAdd.errors.street}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Landmark</FormLabel>
                  <FormControl
                    type="text"
                    name="landmark"
                    readOnly={addressFlag || props.view}
                    value={
                      addressFlag
                        ? formik_presentAdd.values.landmark
                        : formik_permanentAdd.values.landmark
                    }
                    onChange={formik_permanentAdd.handleChange}
                    onBlur={formik_permanentAdd.handleBlur}
                    isInvalid={
                      formik_permanentAdd.errors.landmark &&
                      (formik_permanentAdd.touched.landmark ||
                        formik_permanentAdd.values.landmark.length > 0)
                    }
                    isValid={
                      !formik_permanentAdd.errors.landmark &&
                      (formik_permanentAdd.touched.landmark ||
                        formik_permanentAdd.values.landmark.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_permanentAdd.errors.landmark}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>City</FormLabel>
                  <FormControl
                    type="text"
                    name="city"
                    readOnly={addressFlag || props.view}
                    value={
                      addressFlag
                        ? formik_presentAdd.values.city
                        : formik_permanentAdd.values.city
                    }
                    onChange={formik_permanentAdd.handleChange}
                    onBlur={formik_permanentAdd.handleBlur}
                    isInvalid={
                      formik_permanentAdd.errors.city &&
                      (formik_permanentAdd.touched.city ||
                        formik_permanentAdd.values.city.length > 0)
                    }
                    isValid={
                      !formik_permanentAdd.errors.city &&
                      (formik_permanentAdd.touched.city ||
                        formik_permanentAdd.values.city.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_permanentAdd.errors.city}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>district</FormLabel>
                  <FormControl
                    type="text"
                    name="district"
                    readOnly={addressFlag || props.view}
                    value={
                      addressFlag
                        ? formik_presentAdd.values.district
                        : formik_permanentAdd.values.district
                    }
                    onChange={formik_permanentAdd.handleChange}
                    onBlur={formik_permanentAdd.handleBlur}
                    isInvalid={
                      formik_permanentAdd.errors.district &&
                      (formik_permanentAdd.touched.district ||
                        formik_permanentAdd.values.district.length > 0)
                    }
                    isValid={
                      !formik_permanentAdd.errors.district &&
                      (formik_permanentAdd.touched.district ||
                        formik_permanentAdd.values.district.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_permanentAdd.errors.district}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>State</FormLabel>
                  <FormControl
                    type="text"
                    name="state"
                    readOnly={addressFlag || props.view}
                    value={
                      addressFlag
                        ? formik_presentAdd.values.state
                        : formik_permanentAdd.values.state
                    }
                    onChange={formik_permanentAdd.handleChange}
                    onBlur={formik_permanentAdd.handleBlur}
                    isInvalid={
                      formik_permanentAdd.errors.state &&
                      (formik_permanentAdd.touched.state ||
                        formik_permanentAdd.values.state.length > 0)
                    }
                    isValid={
                      !formik_permanentAdd.errors.state &&
                      (formik_permanentAdd.touched.state ||
                        formik_permanentAdd.values.state.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_permanentAdd.errors.state}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Country</FormLabel>
                  <FormControl
                    type="text"
                    name="country"
                    readOnly={addressFlag || props.view}
                    value={
                      addressFlag
                        ? formik_presentAdd.values.country
                        : formik_permanentAdd.values.country
                    }
                    onChange={formik_permanentAdd.handleChange}
                    onBlur={formik_permanentAdd.handleBlur}
                    isInvalid={
                      formik_permanentAdd.errors.country &&
                      (formik_permanentAdd.touched.country ||
                        formik_permanentAdd.values.country.length > 0)
                    }
                    isValid={
                      !formik_permanentAdd.errors.country &&
                      (formik_permanentAdd.touched.country ||
                        formik_permanentAdd.values.country.length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_permanentAdd.errors.country}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="my-2">
                  <FormLabel>Pincode</FormLabel>
                  <FormControl
                    type="number"
                    name="pincode"
                    readOnly={addressFlag || props.view}
                    value={
                      addressFlag
                        ? formik_presentAdd.values.pincode
                        : formik_permanentAdd.values.pincode
                    }
                    onChange={formik_permanentAdd.handleChange}
                    onBlur={formik_permanentAdd.handleBlur}
                    isInvalid={
                      formik_permanentAdd.errors.pincode &&
                      (formik_permanentAdd.touched.pincode ||
                        String(formik_permanentAdd.values.pincode).length > 0)
                    }
                    isValid={
                      !formik_permanentAdd.errors.pincode &&
                      (formik_permanentAdd.touched.pincode ||
                        String(formik_permanentAdd.values.pincode).length > 0)
                    }
                  />
                  <div className="invalid-feedback">
                    {formik_permanentAdd.errors.pincode}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <div className={sm ? "" : "float-end"}>
              <Button
                className={sm ? "w-100" : ""}
                disabled={
                  (!(formik_presentAdd.dirty && formik_presentAdd.isValid) ||
                    !(
                      formik_permanentAdd.dirty && formik_permanentAdd.isValid
                    )) &&
                  !props.view
                }
                onClick={(e) =>
                  dispatch(
                    InfoActions.getAddressInfo({
                      present: formik_presentAdd.values,
                      permanent: formik_permanentAdd.values,
                    })
                  )
                }
              >
                Save && Next
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </TabContent>
  );
};
export default AddressTabContent;
