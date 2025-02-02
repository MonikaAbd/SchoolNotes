import { useContext } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { noteListContext } from "./note-list-provider.jsx";

function NoteItemForm({ item, onClose }) {
  const { state, data, handlerMap } = useContext(noteListContext);

  return (
    <Modal show={true} onHide={onClose}>
        <Form
            onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const formData = new FormData(e.target);
                const values = Object.fromEntries(formData);

                console.log("Form Submitted", values);

                let result;
                if (item?.id) {
                    result = await handlerMap.handleUpdate({
                        id: item.id,
                        ...values,
                    });
                    console.log("Update Result:", result);
                } else {
                    result = await handlerMap.handleCreate({ ...values });
                    console.log("Create Result:", result);
                }

                if (result.ok) {
                    console.log("Success! Closing form.");
                    onClose();
                } else {
                    console.error("Error:", result);
                }
            }}
        >
        <Modal.Header closeButton>
          <Modal.Title>{item?.id ? "Update" : "Add"} note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Label>Date</Form.Label>
            <Form.Control
                type="date"
                name="date"
                defaultValue={
                    item?.date
                        ? new Date(item?.date).toISOString().slice(0, 10)
                        : new Date().toISOString().slice(0, 10)
                }
                disabled={state === "pending"}
                required
            />
          <Form.Label>Note</Form.Label>
          <Form.Control
            type="text"
            name="note"
            defaultValue={item?.note}
            disabled={state === "pending"}
          />
          <Form.Label>Category</Form.Label>
          <Form.Select
            type="select"
            name="categoryId"
            defaultValue={item?.categoryId}
            disabled={state === "pending"}
            required
          >
            {data?.categoryMap
              ? Object.keys(data.categoryMap).map((categoryId) => {
                  return (
                    <option key={categoryId} value={categoryId}>
                      {data.categoryMap[categoryId].name}
                    </option>
                  );
                })
              : null}
          </Form.Select>
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
            variant="primary"
            type="submit"
            disabled={state === "pending"}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NoteItemForm;
