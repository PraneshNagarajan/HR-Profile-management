import "./Cards.css";
import { Fragment } from "react";
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

const Cards = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [level, setLevel] = useState(
    props.title === "Selected" ? props.title : ""
  );
  const onChangeLevelHandler = (value) => {
    setLevel(value);
  };

  const items = [];
  for (let i = 1; i <= 12; i++) {
    items.push(
      <Fragment key={i}>
        <DropdownItem
        
          className="text-center"
          onClick={(e) => {
            onChangeLevelHandler("Selected L" + i);
          }}
        >
          L{i}
        </DropdownItem>
        <Dropdown.Divider></Dropdown.Divider>{" "}
      </Fragment>
    );
  }
  return (
    <Card
      key={props.keys}
      style={{ width: props.width, height: "5rem" }}
      className="mx-1 my-2 text-center"
    >
      {props.title === "Selected" && (
        <DropdownButton
          variant={props.color}
          size="md"
          className="position-absolute top-0 w-100"
          title={<b>{level}</b>}
        >
          {items}
        </DropdownButton>
      )}
      {
        <Card.Body
          className={`${props.color === "light" ? `` : `text-white`} bg-${
            props.color
          } h-50 `}
        >
          <Card.Subtitle>
            <b>{props.title}</b>
          </Card.Subtitle>
        </Card.Body>
      }
      <Card.Body
        className={props.color === "light" ? "" : "text-" + props.color}
      >
        <b> {props.data}</b>
      </Card.Body>
    </Card>
  );
};

export default Cards;
