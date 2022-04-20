import { useState, useEffect ,useRef ,Fragment } from "react";
import {
  Row,
  Col,
  FormLabel,
  Button,
  ModalBody,
  Modal,
  ModalFooter,
  ModalTitle,
  ButtonGroup,
  ToggleButton,
  Dropdown,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import Multiselect from "multiselect-react-dropdown";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";
import ProfileData from "./ProfileData";
import Tables from "./Table";

const Alerts = (props) => {
  const alerts = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState("");
  const sm = useMediaQuery({ maxWidth: 768 });
  const [selectedReportees, setSelectedReportees] = useState([]);
  const [newSupervisor, setNewSupervisor] = useState("- Select Supervisor -")
  const multiselectReporteesRef = useRef()

  useEffect(() => {
    if(alerts.accept) {
      setSelectedReportees([])
    }
  },[alerts.accept])

  const handleClose = () => {
    dispatch(AlertActions.handleClose());
    dispatch(AlertActions.cancelSubmit());
  };

  const handleConfirm = () => {
    if(props.delete) {
      dispatch(AlertActions.handleClose());
      dispatch(AlertActions.acceptSubmit({id: props.delete.id, selectedReportees, newSupervisor}));
    } else {
      dispatch(AlertActions.handleClose());
      dispatch(AlertActions.acceptSubmit(radioValue));
      setRadioValue("");
    }
  };

  const onSelectUsers = (list, item) => {
    let options = [...selectedReportees];
    options.push(item.value);
    setSelectedReportees(options);
    // formik.setFieldValue("assignees", options.join(" "));
    // formik.setFieldTouched("assignees", true);
  };
console.log(selectedReportees)
  const onRemoveUsers = (list, item) => {
    let options = selectedReportees;
    let index = selectedReportees.findIndex((id) => id === item.key);
    options.splice(index, 1);
    setSelectedReportees(options);
    // formik.setFieldValue("assignees", options.join(" "));
  };
  
 

  return (
    <Modal
      show={alerts.show}
      backdrop="static"
      keyboard={false}
      centered
      scrollable="true"
    >
      <ModalHeader className="bg-primary text-white">
        {props.profile && props.profile.flag && (
          <ModalTitle>
            {props.profile.view ? "Profile Info" : "Add Profile Info"}
          </ModalTitle>
        )}
        {(props.flag ||
          props.status ||
          (props.profile && !props.profile.flag)) && (
          <ModalTitle>Status</ModalTitle>
        )}
        {props.table && <ModalTitle>Comments</ModalTitle>}
        {props.delete && <ModalTitle>Delete Employee</ModalTitle>}
      </ModalHeader>
      <ModalBody >
        {(props.flag || (props.profile && !props.profile.flag)) && (
          <p className={alerts.msgFlag ? "text-success" : "text-danger"}>
            <b>{alerts.msg}</b>
          </p>
        )}

        {props.profile && props.profile.flag && (
          <ProfileData view={props.profile.view} file={alerts.msg} data={props.profile.data} />
        )}
        
        {props.delete &&
         <div style={{height: "300px"}} >
         <Row>
           <Col md="7">
           <FormLabel>Select Recuriters</FormLabel>
           <Multiselect
                          ref={multiselectReporteesRef}
                          displayValue="value"
                          onRemove={onRemoveUsers}
                          onSelect={onSelectUsers}
                          options={props.delete.reportees}
                          showCheckbox="false"
                          closeOnSelect={false}
                          placeholder={
                            selectedReportees.length > 0
                              ? ""
                              : "- Select Recruiters -"
                          }
                        />
           </Col>
           <Col md="5" className={sm ? "mt-3" : ""}>  
                       <FormLabel>Transfer Reportees To</FormLabel>
                  <Dropdown>
                    <Dropdown.Toggle
                      name="admin_permission"
                      className="w-100"
                      variant="outline-primary"
                    >
                      {newSupervisor}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                        {props.delete.roles.map((recruiter, index) => {
                          return (
                            <Fragment key={index}>
                              <Dropdown.Item
                                className="text-center"
                                onClick={() => setNewSupervisor(recruiter.id)}
                              >
                                {recruiter.id}
                              </Dropdown.Item>
                              {index < props.delete.roles.length - 1 && (
                                <Dropdown.Divider />
                              )}
                            </Fragment>
                          );
                        })}
                      </Dropdown.Menu>
                  </Dropdown>
                       </Col>
         </Row>
                      
          </div>
       }
        {props.table && <Tables comments={props.table} />}
        {props.status && (
          <ButtonGroup>
            {props.status.stepOptions.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={"outline-" + radio.color}
                name="radio"
                value={radio.status}
                checked={radioValue === radio.status}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                {radio.status}
              </ToggleButton>
            ))}
          </ButtonGroup>
        )}
      </ModalBody>
      {(!props.profile || !props.profile.flag) && (
        <ModalFooter>
          {props.status || props.delete && (
            <Button variant="primary" onClick={handleConfirm} disabled={props.delete ? (!newSupervisor.includes("-") ? false: true):false}>
              {props.flag ? "Confirm" : "Save"}
            </Button>
          )}
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>{" "}
        </ModalFooter>
      )}
    </Modal>
  );
};
export default Alerts;
