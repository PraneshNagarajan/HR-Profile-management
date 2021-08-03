
import { Alert } from 'react-bootstrap';
import { useTimer } from 'react-timer-hook';
const Timer = (props) => {
    const expiryTimestamp = props.expiryTimestamp;
    const {
        seconds,
        minutes
      } = useTimer({ expiryTimestamp });

      return(
       <Alert variant="warning" className="text-center mt-4"><b><span>Try after {minutes}</span>:<span>{seconds} seconds</span></b></Alert>
      )
}
export default Timer