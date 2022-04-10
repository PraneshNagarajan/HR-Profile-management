import { Fragment } from "react";
import NavBar from "../components/NavBar";

const MainLayout = (props) => {
  return (
    <Fragment>
      {props.showNavbar && <NavBar />}
      {props.children}
    </Fragment>
  );
};
export default MainLayout;
