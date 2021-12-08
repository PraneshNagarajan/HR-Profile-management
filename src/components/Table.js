import { Table } from "react-bootstrap";
import { Fragment } from "react/cjs/react.production.min";

const Tables = (props) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>NO</th>
          <th>COMMENTS</th>
          <th>TIME</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(props.comments)
          .sort()
          .reverse()
          .map((pKey, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{props.comments[pKey].comment}</td>
                <td>{props.comments[pKey].date}</td>
                <td>{props.comments[pKey].commented_by}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default Tables;
