import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";

function PendingItem() {
  return (
    <ListGroup variant="flush">
        <ListGroup.Item>
      <Placeholder as="ListGroup.Item" animation="glow">
        <Placeholder xs="12" style={{ height: "24px" }} />
      </Placeholder>
        </ListGroup.Item>
    </ListGroup>
  );
}

export default PendingItem;
