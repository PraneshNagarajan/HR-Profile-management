import { Container, Nav, TabContent, Card } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

const Notifications = () => {
    const sm = useMediaQuery({ maxWidth: 768 });

    return(<Container fluid className={sm ? "my-3" : "p-5"}>
    <Nav variant="tabs" defaultActiveKey={"unread"}>
      <Nav.Item>
        <Nav.Link
          eventKey="unread"
        //   active={infos.activeTab.includes("unread")}
          onClick={(e) =>
            {}
          }
        >
          <span className="fw-bold text-success">Un-Read</span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="address-info"
        //   active={infos.activeTab.includes("read")}
          onClick={(e) =>
            {}
          }
        >
          <span className="fw-bold text-success">Read</span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="favourite"
        //   active={infos.activeTab.includes("read")}
          onClick={(e) =>
            {}
          }
        >
          <span className="fw-bold text-success">Marked</span>
        </Nav.Link>
      </Nav.Item>
    </Nav>
    <TabContent>
        <Card>
        <div>Test</div>
        </Card>
    </TabContent>
  </Container>)
}

export default Notifications