import { Fragment } from "react";
import NavBar from "../components/NavBar";


const MainLayout = (props) => {
  return (
    <Fragment>
      <NavBar />
      {props.children}
    </Fragment>
  );
};
export default MainLayout