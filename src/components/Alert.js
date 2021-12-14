import { useState } from "react";
import {
  Button,
  ModalBody,
  Modal,
  ModalFooter,
  ModalTitle,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";
import ProfileData from "./ProfileData";
import Tables from "./Table";

const Alerts = (props) => {
  const alerts = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState("");

  const handleClose = () => {
    dispatch(AlertActions.handleClose());
    dispatch(AlertActions.cancelSubmit());
  };

  const handleConfirm = () => {
    dispatch(AlertActions.handleClose());
    dispatch(AlertActions.acceptSubmit(radioValue));
    setRadioValue("");
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
        {props.profile && props.profile.flag && <ModalTitle>{props.profile.view ? "Profile Info": "Add Profile Info"}</ModalTitle>}
        {(props.flag || props.status || !props.profile.flag ) && <ModalTitle>Status</ModalTitle>}
        {props.table && <ModalTitle>Comments</ModalTitle>}
      </ModalHeader>
      <ModalBody>
        {(props.flag || (props.profile && !props.profile.flag)) && (
          <p className={alerts.msgFlag ? "text-success" : "text-danger"}>
            <b>{alerts.msg}</b>
          </p>
        )}

        {props.profile && props.profile.flag && (
          <ProfileData view={props.profile.view} file={alerts.msg} />
        )}
        
        { props.table && (
          <Tables comments={props.table} />
        )}
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
      {(!props.profile  || !props.profile.flag ) && (
        <ModalFooter>
          {props.status && (
            <Button variant="primary" onClick={handleConfirm}>
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
