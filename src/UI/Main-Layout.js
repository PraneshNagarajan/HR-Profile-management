import { Fragment } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import NavBar from "../components/NavBar";
import FocalHomePage from "../pages/FocalHomePage";

const MainLayout = (props) => {
  return (
    <Fragment>
      <NavBar />
      {propTypes.children}
    </Fragment>
  );
};
export default MainLayout