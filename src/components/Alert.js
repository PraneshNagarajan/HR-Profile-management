import {
  Button,
  ModalBody,
  Modal,
  ModalFooter,
  ModalTitle,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { AlertActions } from "../Redux/AlertSlice";

const Alerts = () => {
  const alerts = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(AlertActions.handleClose());
  };
  return (
    <Modal show={alerts.show} backdrop="static" keyboard={false} centered>
      <ModalHeader className="bg-primary text-white">
        <ModalTitle>Status</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p className={alerts.msgFlag ? "text-success" : "text-danger"}>
          <b>{alerts.msg}</b>
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="danger" onClick={handleClose}>
          {" "}
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
export default Alerts;
