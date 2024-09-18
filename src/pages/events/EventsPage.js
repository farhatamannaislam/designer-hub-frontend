import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Row, Col, Container, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import Event from "./Event";
import PopularProfiles from "../profiles/PopularProfiles";
import { fetchMoreData } from "../../utils/utils";
import appStyles from "../../App.module.css"; 
import NoResults from "../../assets/no-results.png"; 

function EventsPage({ message, filter = "" }) {
  const [events, setEvents] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axiosReq.get(
          `/events/?${filter}query=${query}`
        );
        console.log('Fetched Events:', data);
        setEvents(data);
        setHasLoaded(true);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchEvents();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <i className={`fas fa-search ${appStyles.SearchIcon}`} />
        <Form
          className={appStyles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mr-sm-2"
            placeholder="Search events by title, profile, event date, or tags..."
          />
        </Form>
        
        {hasLoaded ? (
          <>
            {events.results.length ? (
              <InfiniteScroll
                children={events.results.map((event) => (
                  <Event key={event.id} {...event} setEvents={setEvents} />
                ))}
                dataLength={events.results.length}
                loader={<Asset spinner />}
                hasMore={!!events.next}
                next={() => fetchMoreData(events, setEvents)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default EventsPage;
