import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { noteListContext } from "./note-list-provider.jsx";

function NoteItemDeleteDialog({ item, onClose }) {
  const [errorState, setErrorState] = useState();
  const { state, handlerMap } = useContext(noteListContext);

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!errorState?.message ? (
          <Alert variant={"danger"}>{errorState.message}</Alert>
        ) : null}
          {`Do you really want to delete this note?`}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={state === "pending"}
        >
          Close
        </Button>
        <Button
          variant="danger"
          disabled={state === "pending"}
          onClick={async () => {
            const result = await handlerMap.handleDelete({ id: item.id });
            if (result.ok) {
              onClose();
            } else {
              setErrorState(result.error);
            }
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoteItemDeleteDialog;
