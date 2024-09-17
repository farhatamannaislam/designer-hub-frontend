import React, { useCallback, useEffect, useState } from "react";
import { axiosReq } from "axios"; 
import styles from "../styles/NavBar.module.css";
import Dropdown from "./NotificationDropdown";
import Bell from "./Bell";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axiosReq.get("/notifications");
      setNotifications(data.results);
      setUnreadNotificationsCount(data.results.filter((notification) => !notification.read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markAsRead = useCallback(async () => {
    try {
      await Promise.all(
        notifications
          .filter((notification) => !notification.read)
          .map((notification) =>
            axiosReq.patch(`/notifications/${notification.id}/`, { read: true })
          )
      );
      // Update state to mark all as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
      setUnreadNotificationsCount(0);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  }, [notifications]);

  return (
    <Dropdown
      options={notifications}
      newField="read"
      onOpen={markAsRead}
      IconElement={
        <span className={styles.IconLink}>
          <Bell notificationCount={unreadNotificationsCount} />
          <span className={styles.IconText}>Notifications</span>
        </span>
      }
    />
  );
};

export default Notifications;

