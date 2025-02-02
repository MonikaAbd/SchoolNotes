import { useContext, useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";

import Icon from "@mdi/react";
import { mdiCashPlus } from "@mdi/js";

import { noteListContext } from "./note-list-provider";
import PendingItem from "./pending-item";
import NoteItemForm from "./note-item-form";
import NoteItemDeleteDialog from "./note-item-delete-dialog";
import CategoryDetail from "./category-detail";

function DashboardContent() {
    const [noteItemFormData, setNoteItemFormData] = useState();
    const [noteItemDeleteDialog, setNoteItemDeleteDialog] = useState();
    const { state, data, selectedYear, setSelectedYear, handlerMap } = useContext(noteListContext);
    const currentYear = new Date().getFullYear().toString();
    const yearToUse = selectedYear || currentYear;

    // Group notes by category (filtering by selected year)
    const groupedNotes = data?.itemList
        ?.filter(item => new Date(item.date).getFullYear().toString() === yearToUse)  //  Filter notes by year
        .reduce((acc, item) => {
            if (!acc[item.categoryId]) {
                acc[item.categoryId] = [];
            }
            acc[item.categoryId].push(item);
            return acc;
        }, {});

    async function handleCreate(dtoIn) {
        const result = await handlerMap.handleCreate(dtoIn);
        if (result.ok) {
            setNoteItemFormData(null);
            await handlerMap.handleLoad(); // Refresh note list after adding a new note
        } else {
            console.error("Error creating note:", result.error);
        }
    }

    async function handleSubmit(e, item) {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData);

        console.log("📝 Form Submitted! Values:", values);

        let result;
        if (item?.id) {
            result = await handlerMap.handleUpdate({ id: item.id, ...values });
        } else {
            result = await handleCreate(values);
        }

        if (result.ok) {
            console.log("Note saved successfully!");
            setNoteItemFormData(null);
        } else {
            console.error("Error saving note:", result.error);
        }
    }

    return (
        <Card className="border-0">
            {!!noteItemFormData && (
                <NoteItemForm
                    item={noteItemFormData}
                    onClose={() => setNoteItemFormData(null)}
                    onSubmit={(e) => handleSubmit(e, noteItemFormData)}
                />
            )}
            {!!noteItemDeleteDialog && (
                <NoteItemDeleteDialog
                    item={noteItemDeleteDialog}
                    onClose={() => setNoteItemDeleteDialog(null)}
                />
            )}
            <Card.Header className="sticky-top " bsPrefix="bg-white" style={{ top: "56px", padding: "8px" }}>
                <Stack direction="horizontal" gap={3}>
                    <div>
                        <Form.Control
                            size="lg"
                            type="number"
                            min="2000"
                            max="2100"
                            placeholder="Select year"
                            value={selectedYear || currentYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        />
                    </div>
                    <div className="ms-auto">
                        <Button
                            variant="warning"
                            size="sm"
                            disabled={state === "pending"}
                            onClick={() => setNoteItemFormData({})}
                        >
                            <Icon path={mdiCashPlus} size={0.8} /> Add note
                        </Button>
                    </div>
                </Stack>
            </Card.Header>
            <Card.Body className="px-0" style={{ position: "relative", top: "40px" }}>
                {state === "pending" ? [0, 1, 2, 3].map((item) => <PendingItem key={item} />) : null}
                {state === "ready" && (
                    <Card className="border-0">
                        <Card.Body>
                            <Card.Title>All Notes</Card.Title>
                            <Card.Text>
                                <Accordion>
                                    {groupedNotes &&
                                        Object.entries(groupedNotes).map(([categoryId, itemList]) => (
                                            <CategoryDetail
                                                key={categoryId}
                                                categoryId={categoryId}
                                                itemList={itemList}
                                                setNoteItemFormData={setNoteItemFormData}
                                                setNoteItemDeleteDialog={setNoteItemDeleteDialog}
                                            />
                                        ))}
                                </Accordion>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}
            </Card.Body>
        </Card>
    );
}

export default DashboardContent;
