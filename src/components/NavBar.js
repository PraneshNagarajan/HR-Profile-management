import React from "react";
import { Navbar, Nav, NavDropdown, Button, FormGroup } from "react-bootstrap";
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
  FaKey
} from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

const NavBar = () => {
  const sm = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  return (
    <Fragment>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
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
              to="/homePage"
              active={location.pathname.includes("home") ? `active` : ``}
            >
              <span className={sm ? "h6 ms-2" : "h5 me-2"}>
                <FaHome className="mb-1" /> Home
              </span>
            </Nav.Link>
            {sm && <hr className="text-white line-break mt-1" />}
            <NavDropdown
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
              <NavDropdown.Item className="text-primary fw-bold">
                {" "}
                <FaUserPlus style={{ width: "20px", height: "20px" }} /> Add
                Employee
              </NavDropdown.Item>
              <NavDropdown.Divider className="text-primary" />
              <NavDropdown.Item className="text-warning fw-bold">
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
                  <FaRegIdBadge className="mb-" /> Profiles
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
            <Nav.Item className="">
              <NavDropdown
                title={
                  <span>
                    <FaRegUserCircle className="mb-1" /> UserName
                  </span>
                }
                id="collasible-nav-dropdown"
                className={`active ${sm ? "h6 mx-2 " : "h5 me-3"}`}
              >
                <NavDropdown.Item className="text-primary fw-bold">
                {" "}
                <FaKey style={{ width: "20px", height: "20px" }} /> Password Management
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item className="text-warning fw-bold">
                {" "}
                <FaEdit style={{ width: "20px", height: "20px" }} />
Edit Profile
                </NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>
            {sm && <hr className="text-white line-break" />}
            <Nav.Item>
              <FormGroup>
                <Button
                  variant="outline-light"
                  size=""
                  className={`text-center mt-1 ${sm ? `ms-2 mt-2` : ``}`}
                  style={{ width: sm ? "97%" : "" }}
                >
                  {" "}
                  Logout
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
