import { useState } from "react";
import {
  Button,
  ModalBody,
  Modal,
  ModalFooter,
  ModalTitle,
  ButtonGroup,
  ToggleButton
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";

const Alerts = (props) => {
  const alerts = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState("");

  const handleClose = () => {
    dispatch(AlertActions.handleClose());
    dispatch(AlertActions.cancelSubmit())
  };
  const handleConfirm = () => {
    dispatch(AlertActions.handleClose());
    dispatch(AlertActions.acceptSubmit(radioValue))
    setRadioValue("")
  }

  return (
    <Modal show={alerts.show} backdrop="static" keyboard={false} centered>
      <ModalHeader className="bg-primary text-white">
        <ModalTitle>Status</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p className={alerts.msgFlag ? "text-success" : "text-danger"}>
        <b>{alerts.msg}</b>
      </p>
        
        {props.flag && 
         <ButtonGroup>
         {props.stepOptions.map((radio, idx) => (
           <ToggleButton
             key={idx}
             id={`radio-${idx}`}
             type="radio"
             variant={'outline-'+radio.color}
             name="radio"
             value={radio.status}
            checked={radioValue === radio.status}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
           >
             {radio.status}
           </ToggleButton>
         ))}
       </ButtonGroup>
        }
      </ModalBody>
      <ModalFooter>
        {props.flag && 
        <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
        }
        <Button variant="danger" onClick={handleClose}>Close</Button>
          {" "}
      </ModalFooter>
    </Modal>
  );
};
export default Alerts;
