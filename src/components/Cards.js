import "./Cards.css";
import { Fragment } from "react";
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import { useEffect } from "react";

const Cards = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const [datas, setDatas] = useState([]);
  const [level, setLevel] = useState("Selected Total");

  const onChangeLevelHandler = (title, value) => {
    setLevel(title);
    setDatas((prevItems) => {
      const res = prevItems.filter((item) => item.title === "Selected");
      res[0].count = value;
      return [...prevItems];
    });
  };
  useEffect(() => {
    setDatas(props.data);
  }, []);

  return (
    <Fragment>
      {datas.map((data, index) => {
        return (
          <Card
            key={index}
            style={{ width: data.width, height: "5rem" }}
            className="mx-1 my-2 text-center"
          >
            {data.title === "Selected" && (
              <DropdownButton
                variant={data.color}
                size="md"
                className="position-absolute top-0 w-100"
                title={<b>{level}</b>}
              >
                {Object.values(data.levelData).map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <DropdownItem
                        className="text-center"
                        onClick={(e) => {
                          onChangeLevelHandler(
                            "Selected " + item.title,
                            item.count
                          );
                        }}
                      >
                        {item.title}
                      </DropdownItem>
                      {Object.values(data.levelData).length != index + 1 && (
                        <Dropdown.Divider></Dropdown.Divider>
                      )}
                    </Fragment>
                  );
                })}
              </DropdownButton>
            )}
            {
              <Card.Body
                className={`${data.color === "light" ? `` : `text-white`} bg-${
                  data.color
                } h-50 `}
              >
                <Card.Subtitle>
                  <b>{data.title}</b>
                </Card.Subtitle>
              </Card.Body>
            }
            <Card.Body
              className={data.color === "light" ? "" : "text-" + data.color}
            >
              <b> {data.count}</b>
            </Card.Body>
          </Card>
        );
      })}
    </Fragment>
  );
};

export default Cards;
