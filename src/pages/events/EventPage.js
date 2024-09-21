// React imports
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
// Bootstrap imports
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
// CSS imports
import appStyles from "../../App.module.css";

// Axios imports
import { axiosReq } from "../../api/axiosDefaults";
// Component imports
import Event from "./Event";

import PopularProfiles from "../profiles/PopularProfiles";



function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data: event } = await axiosReq.get(`/events/${id}`);
        setEvent({ results: [event] });
      } catch (err) {
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Event {...event.results[0]} setEvents={setEvent} eventPage />
        <Container className={appStyles.Content}>
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default EventPage;