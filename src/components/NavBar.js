import React, { useState, useEffect } from "react";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/logo.png";
import axios from "axios";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from "../utils/utils";
import Notifications from "./Notifications";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      //console.log(err);
    }
  };

  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="fa-solid fa-circle-plus"></i> Add post
    </NavLink>
  );

  const addEventIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/events/create"
    >
      <i className="fa-solid fa-calendar-plus"></i> Add Event
    </NavLink>
  );

  const eventsPageIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/eventspage"
    >
      <i className="fa-solid fa-calendar-days"></i> Events
    </NavLink>
  );

  const loggedInIcons = (
    <>
      {isMobileView ? (
        <div className={styles.dropdownMenu}>
          <span className={`${styles.dropdownText} d-sm-inline-column`}>
            <i className="fas fa-stream"></i> Feed
          </span>
          <ul className={styles.dropdownList}>
            <li>
              <NavLink
                id={styles.dropdownItem}
                className={styles.NavLink}
                to="/postsfeed"
              >
                <i className="fa-solid fa-blog"></i> Posts
              </NavLink>
            </li>
            <li>
              <NavLink
                id={styles.dropdownItem}
                className={styles.NavLink}
                to="/eventsfeed"
              >
                <i className="fa-regular fa-calendar"></i> Events
              </NavLink>
            </li>
          </ul>
        </div>
      ) : (
        <NavDropdown
          id={styles.dropdownMenu}
          title={
            <span className={`${styles.dropdownText} d-sm-inline-column`}>
              <i className="fas fa-stream"></i> Feed
            </span>
          }
        >
          <NavDropdown.Item
            id={styles.dropdownItem}
            as={NavLink}
            className={styles.NavLink}
            to="/postsfeed"
          >
            <i className="fa-solid fa-blog"></i> Posts
          </NavDropdown.Item>
          <NavDropdown.Item
            id={styles.dropdownItem}
            as={NavLink}
            className={styles.NavLink}
            to="/eventsfeed"
          >
            <i className="fa-regular fa-calendar"></i> Events
          </NavDropdown.Item>
        </NavDropdown>
      )}

      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>

      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i> Sign out
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i> Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="60" width="80" />
          </Navbar.Brand>
        </NavLink>

       {/* Conditionally render notifications only when user is signed in */}
       {currentUser && <Notifications currentUser={currentUser} />}

        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fa-solid fa-house-user"></i>Home
            </NavLink>

            {/* Conditional rendering for Categories */}
            {isMobileView ? (
              <div className={styles.dropdownMenu}>
                <span className={`${styles.dropdownText} d-sm-inline-column`}>
                  <i className="fas fa-th-list"></i> Categories
                </span>
                <ul className={styles.dropdownList}>
                  <li>
                    <NavLink
                      className={styles.NavDropdown}
                      to="/category/formal"
                    >
                      Formal
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={styles.NavDropdown}
                      to="/category/casual"
                    >
                      Casual
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={styles.NavDropdown}
                      to="/category/party"
                    >
                      Party
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <NavDropdown
                title={<><i className="fas fa-th-list"></i> Categories</>}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item>
                  <NavLink className={styles.NavDropdown} to="/category/formal">
                    Formal
                  </NavLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <NavLink className={styles.NavDropdown} to="/category/casual">
                    Casual
                  </NavLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <NavLink className={styles.NavDropdown} to="/category/party">
                    Party
                  </NavLink>
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {currentUser && addPostIcon}
            {currentUser && addEventIcon}
            {eventsPageIcon}

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
