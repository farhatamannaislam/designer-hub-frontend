import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown, Dropdown } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get("/notifications/");
        setNotifications(data.results);
        setUnreadCount(data.results.filter((notification) => !notification.read).length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((notification) => !notification.read)
          .map((notification) =>
            axios.patch(`/notifications/${notification.id}/`, { read: true })
          )
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/notifications/${notificationId}/`, { read: true });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="fa-solid fa-plus"></i>Add post
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>

      <Dropdown alignRight>
        <Dropdown.Toggle variant="link" id="notification-dropdown" className={styles.NavLink}>
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && <span className={styles.NotificationCount}>{unreadCount}</span>}
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles.NotificationDropdown}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Dropdown.Item
                key={notification.id}
                className={notification.read ? '' : styles.UnreadNotification}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                {notification.message}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item>No new notifications</Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item onClick={markAllAsRead}>Mark all as read</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>

      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign out
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
        <i className="fa-solid fa-arrow-right-to-bracket"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
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

        {currentUser && addPostIcon}

        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />

        {/* Categories Dropdown */}
        <NavDropdown title={<><i className="fas fa-th-list"></i> Categories</>} id="basic-nav-dropdown">
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

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;


