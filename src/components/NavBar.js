import React from "react";
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
import { Link, useLocation } from "react-router-dom";
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
  return (
    <Fragment>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="primary"
        variant="dark"
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
          <b className="h4">EnterpriseName</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto mt-2">
            {sm && <hr className="text-white my-1 line-break" />}
            <Nav.Link
              as={Link}
              to="/focalHomePage"
              active={location.pathname.includes("Home") ? `active` : ``}
            >
              <span className={sm ? "h6 ms-2" : "h5 me-2"}>
                <FaHome className="mb-1" /> Home
              </span>
            </Nav.Link>
            {sm && <hr className="text-white line-break mt-1" />}
            <NavDropdown
              active={
                location.pathname.includes("addEmployee") ||
                location.pathname.includes("manageEmployee")
                  ? `active`
                  : ``
              }
              title={
                <span>
                  <FaUsersCog className="mb-1" /> Employees
                </span>
              }
              id="collasible-nav-dropdown"
              className={`${
                location.pathname.includes("employee") ? "active" : ""
              } ${sm ? "h6 mx-2 mt-2" : "h5 me-2"}`}
            >
              <NavDropdown.Item
                as={Link}
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
                to="/manageEmployeeProfile/147852?activeTab=security-info"
              >
                {" "}
                <FaUserEdit style={{ width: "20px", height: "20px" }} /> Manage
                Employees
              </NavDropdown.Item>
            </NavDropdown>
            {sm && <hr className="text-white line-break" />}

            <NavDropdown
              title={
                <span>
                  <FaRegListAlt className="mb-1" /> Demands
                </span>
              }
              id="collasible-nav-dropdown"
              className={`${
                location.pathname.includes("employee") ? "active" : ""
              } ${sm ? "h6 mx-2" : "h5 me-2"}`}
            >
              <NavDropdown.Item className="text-primary fw-bold">
                {" "}
                <FaPlusCircle style={{ width: "20px", height: "20px" }} />{" "}
                Create Demand
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="text-warning fw-bold">
                {" "}
                <FaEdit style={{ width: "20px", height: "20px" }} /> Manage
                Demands
              </NavDropdown.Item>
            </NavDropdown>
            {sm && <hr className="text-white line-break" />}
            <NavDropdown
              title={
                <span>
                  <FaRegIdBadge className="mb-1" /> Profiles
                </span>
              }
              id="collasible-nav-dropdown"
              className={`${
                location.pathname.includes("employee") ? "active" : ""
              } ${sm ? "h6 mx-2" : "h5 me-2"}`}
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
            {sm && <hr className="text-white line-break" />}
          </Nav>
          <Nav className={`me-2 ${sm ? `mt-1` : `mt-2`}`}>
            {sm && (
              <Nav.Item>
                <span
                  className={`d-flex text-white mx-2 fw-bold mt-1`}
                  style={{ marginTop: sm ? "" : "0.75rem" }}
                >
                  <FaBell className="me-1 mt-1" />
                  Notifications
                  <span className="badge rounded-circle bg-warning ms-1 mt-1">
                    5
                  </span>
                </span>
                <hr className="text-white line-break1" />
              </Nav.Item>
            )}
            {user.photoUrl.length > 0 && (
              <Nav.Item>
                <NavDropdown
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
                  <NavDropdown.Item className="text-primary fw-bold">
                    {" "}
                    <FaKey style={{ width: "20px", height: "20px" }} /> Password
                    Management
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="text-warning fw-bold"
                    as={Link}
                    to={
                      "/manageEmployeeProfile/" +
                      user.id +
                      "?activeTab=personal-info"
                    }
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
                  variant="outline-light"
                  className={`position-relative me-4 ${
                    user.photoUrl.length > 0 ? `mt-2` : `mb-2`
                  }`}
                >
                  <b>
                    <FaBell className="me-1" />
                    Notifications
                  </b>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                    1000{" "}
                    <span className="visually-hidden">unread messages</span>
                  </span>
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
