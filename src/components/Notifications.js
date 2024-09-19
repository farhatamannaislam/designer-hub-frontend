
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/NavBar.module.css";

const Notifications = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

  return (
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
  );
};

export default Notifications;
