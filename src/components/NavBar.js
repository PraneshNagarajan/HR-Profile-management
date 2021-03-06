import React, { useState } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  FormGroup,
  NavbarBrand,
  Badge,
} from "react-bootstrap";
import "./NavBar.css";
import { Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import {
  FaHome,
  FaUsersCog,
  FaRegListAlt,
  FaRegIdBadge,
  FaRegUserCircle,
  FaUserPlus,
  FaUserEdit,
  FaPlusCircle,
  FaEdit,
  FaIdCard,
  FaKey,
  FaBell,
} from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

const NavBar = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const user = useSelector((state) => state.auth);
  const location = useLocation();
  const history = useHistory();
  const [isExpanded, setExpanded] = useState(false);
  const notification = useSelector((state) => state.notification);

  return (
    <Fragment>
      <Navbar
        collapseOnSelect
        expand="lg"
        expanded={isExpanded}
        bg="primary"
        variant="dark"
        sticky="top"
        style={{
          paddingTop: sm ? ".5rem" : "0rem",
          paddingBottom: sm ? ".5rem" : "0rem",
        }}
      >
        <Navbar.Brand>
          <img
            alt=""
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-TLdbAqtzJd2i6o0TLdIxnQUzhKNKb58koA&usqp=CAU"
            width="30"
            height="30"
            className={`d-inline-block align-top ${sm ? `ms-2` : `ms-3`}`}
          />{" "}
          <b className="h4 fst-italic">eC-hiRe</b>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(!isExpanded)}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto mt-2">
            {sm && <hr className="text-white my-1 line-break" />}
            <Nav.Link
              disabled={!(user.photoUrl.length > 0 && user.security)}
              as={Link}
              onClick={() => setExpanded(!isExpanded)}
              to={
                user.role === "FOCAL"
                  ? "/focalHomePage"
                  : user.role === "ADMIN"
                  ? "/adminHomePage"
                  : "/userHomePage"
              }
              active={
                location.pathname.includes("Home") &&
                user.photoUrl.length > 0 &&
                user.security
                  ? `active`
                  : ``
              }
            >
              <span className={sm ? "h6 ms-2" : "h5 me-2"}>
                <FaHome className="mb-1" /> Home
              </span>
            </Nav.Link>
            {sm && <hr className="text-white line-break mt-1" />}
            {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
              <Fragment>
                <NavDropdown
                  disabled={!(user.photoUrl.length > 0 && user.security)}
                  // active={location.pathname.includes("Employee") ? `active` : ``}
                  title={
                    <span>
                      <FaUsersCog className="mb-1" /> Employee
                    </span>
                  }
                  id="collasible-nav-dropdown"
                  className={`${
                    location.pathname.includes("Employee") ? "active" : ""
                  } ${sm ? "h6 mx-2 mt-1" : "h5 me-2"}`}
                >
                  <NavDropdown.Item
                    as={Link}
                    onClick={() => setExpanded(!isExpanded)}
                    to="/addEmployees"
                    className="text-primary fw-bold"
                  >
                    {" "}
                    <FaUserPlus style={{ width: "20px", height: "20px" }} /> Add
                    Employee
                  </NavDropdown.Item>
                  <NavDropdown.Divider className="text-primary" />
                  <NavDropdown.Item
                    className="text-warning fw-bold"
                    as={Link}
                    onClick={() => setExpanded(!isExpanded)}
                    to="/manageEmployees"
                  >
                    {" "}
                    <FaUserEdit
                      style={{ width: "20px", height: "20px" }}
                    />{" "}
                    Manage Employees
                  </NavDropdown.Item>
                </NavDropdown>
                {sm && <hr className="text-white line-break" />}
              </Fragment>
            )}

            {(user.role === "FOCAL" || user.role === "ADMIN") && (
              <Nav.Link
                className={sm ? "mt-1" : ""}
                disabled={!(user.photoUrl.length > 0 && user.security)}
                as={Link}
                onClick={() => setExpanded(!isExpanded)}
                to={
                  user.role === "FOCAL"
                    ? "/createDemand"
                    : user.role === "ADMIN"
                    ? "/manageDemand"
                    : ""
                }
                active={location.pathname.includes("Demand")}
              >
                <span className={sm ? "h6 ms-2" : "h5 me-2"}>
                  <FaRegListAlt className="mb-1" /> {" Demand"}
                </span>
                {sm && <hr className="text-white line-break mt-3" />}
              </Nav.Link>
            )}
            {(user.role === "FOCAL" || user.role.includes("RECRUITER")) && (
              <Nav.Link
                disabled={!(user.photoUrl.length > 0 && user.security)}
                as={Link}
                onClick={() => setExpanded(!isExpanded)}
                to={
                  user.role === "FOCAL"
                    ? "/manageSupplies"
                    : user.role.includes("RECRUITER")
                    ? "/supplies"
                    : ""
                }
                active={location.pathname.includes("Suppl")}
              >
                <span className={sm ? "h6 ms-2" : "h5 me-2"}>
                  <FaRegListAlt className="mb-1" /> {" Supply"}
                </span>
              </Nav.Link>
            )}

            {sm && <hr className="text-white line-break mt-1" />}
            {user.role !== "ADMIN" && (
              <NavDropdown
                disabled={!(user.photoUrl.length > 0 && user.security)}
                title={
                  <span>
                    <FaRegIdBadge className="mb-1" /> Profile
                  </span>
                }
                id="collasible-nav-dropdown"
                className={`${
                  location.pathname.includes("employee") ? "active" : ""
                } ${sm ? "h6 mx-2 mt-1" : "h5 me-2"}`}
              >
                <NavDropdown.Item className="text-primary fw-bold">
                  {" "}
                  <FaIdCard style={{ width: "20px", height: "20px" }} /> Add
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item className="text-warning fw-bold">
                  {" "}
                  <FaEdit style={{ width: "20px", height: "20px" }} /> Manage
                  Profiles
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {sm && <hr className="text-white line-break" />}
          </Nav>
          <Nav className={`me-2 ${sm ? `mt-1` : `mt-2`}`}>
            {sm && (
              <Nav.Link
                disabled={
                  !(user.photoUrl.length > 0 && user.security) ||
                  notification.data === undefined
                }
                as={Link}
                onClick={() => setExpanded(!isExpanded)}
                to="\notifications"
              >
                <span
                  className={`d-flex  mx-2 fw-bold ${
                    user.photoUrl.length > 0 &&
                    user.security &&
                    notification.data !== undefined
                      ? `text-white`
                      : ``
                  }`}
                  style={{ marginTop: sm ? "" : "0.75rem" }}
                >
                  <FaBell className="me-1 mt-1" />
                  Notifications
                  {notification.count > 0 && (
                    <span
                      className={` ms-1 ${
                        user.photoUrl.length > 0 && user.security
                          ? "badge rounded-circle bg-warning mt-1"
                          : ""
                      }`}
                    >
                      {notification.count}
                    </span>
                  )}
                </span>
                <hr className="text-white line-break1" />
              </Nav.Link>
            )}
            {user.photoUrl.length > 0 && (
              <Nav.Item>
                <NavDropdown
                  disabled={!(user.photoUrl.length > 0 && user.security)}
                  title={
                    <span>
                      <img
                        src={user.photoUrl}
                        height="35px"
                        width="35px"
                        style={{
                          borderRadius: "50%",
                          border: "1px solid white",
                        }}
                      />{" "}
                      {user.name}
                    </span>
                  }
                  id="collasible-nav-dropdown"
                  className={`active ${sm ? "h6 mx-2 " : "h5 me-2"}`}
                >
                  <NavDropdown.Item
                    className="text-primary fw-bold"
                    as={Link}
                    onClick={() => setExpanded(!isExpanded)}
                    to="/changePassword"
                  >
                    {" "}
                    <FaKey style={{ width: "20px", height: "20px" }} /> Password
                    Management
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="text-warning fw-bold"
                    as={Link}
                    onClick={() => setExpanded(!isExpanded)}
                    to={"/manageEmployeeProfile/view/"+user.id+"?activeTab=personal-info"}
                  >
                    {" "}
                    <FaEdit style={{ width: "20px", height: "20px" }} />
                    Edit Profile
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav.Item>
            )}
            {sm && <hr className="text-white line-break" />}
            {!sm && (
              <Nav.Item>
                <Button
                  disabled={
                    !(user.photoUrl.length > 0 && user.security) ||
                    notification.data === undefined
                  }
                  variant="outline-light"
                  className={`position-relative me-4 ${
                    user.photoUrl.length > 0 ? `mt-2` : `mb-2`
                  }`}
                  onClick={() => history.push("/notifications")}
                >
                  <b>
                    <FaBell className="me-1" />
                    Notifications
                  </b>
                  {notification.count > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                      {notification.count}
                      <span className="visually-hidden">unread messages</span>
                    </span>
                  )}
                </Button>
              </Nav.Item>
            )}
            <Nav.Item>
              <FormGroup>
                <Button
                  variant="outline-light"
                  size=""
                  className={`text-center ${sm ? `ms-2` : ``} ${
                    user.photoUrl.length > 0 ? `mt-2` : `mb-2`
                  }`}
                  style={{ width: sm ? "97%" : "" }}
                  onClick={() => window.location.reload()}
                >
                  {" "}
                  <b>Logout</b>
                </Button>
              </FormGroup>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Fragment>
  );
};

export default NavBar;
