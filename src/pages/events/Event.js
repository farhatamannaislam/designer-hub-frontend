// React imports
import React from "react";
import { Link, useHistory } from "react-router-dom";
// CSS imports
import styles from "../../styles/Event.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
// Bootstrap imports
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";

// Component imports
import Avatar from "../../components/Avatar";
import { EditDeleteDropdown } from "../../components/EditDeleteDropdown";
// Axios imports
import { axiosRes } from "../../api/axiosDefaults";

const Event = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    title,
    description,
    event_date,
    tags,
    image,
    updated_at,
    eventPage,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/events/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/events/${id}/`);
      history.goBack();
    } catch (err) {
    }
  };

  return (
    <Card className={styles.Event}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && eventPage && (
              <EditDeleteDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Card.Body>
        {title && (
          <Card.Text>
            <b>{title}</b>
          </Card.Text>
        )}
        {description && (
          <Card.Text className={styles.Description}>{description}</Card.Text>
        )}
        <Container className="event-grid">
          <Row>
            <Col xs={12} md={4}>
              {event_date && (
                <Card.Text>
                  <i className="fa-regular fa-calendar-days"></i>
                  {event_date}
                </Card.Text>
              )}
            </Col>
          </Row>
        </Container>
      </Card.Body>
      <Link to={`/events/${id}`}>
        <Card.Img src={image} alt="Event image" />
      </Link>
      <Card.Body>
        {tags && (
          <Card.Text className={styles.Tags}>
            <i className="fa-solid fa-tag"></i>
            {tags}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default Event;