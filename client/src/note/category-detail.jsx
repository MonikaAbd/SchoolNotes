import { useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/esm/Stack";

import { noteListContext } from "./note-list-provider";
import NoteItem from "./note-item";

function CategoryDetail({
                            categoryId,
                            itemList,
                            setNoteItemFormData,
                            setNoteItemDeleteDialog,
                        }) {
    const { data } = useContext(noteListContext);

    return (
        <Accordion.Item eventKey={categoryId} style={{ width: "100%" }}>
            <Accordion.Header className="p-0">
                <Stack direction="horizontal" gap={2}>
                    <div>{data?.categoryMap[categoryId].name}</div>
                </Stack>
            </Accordion.Header>
            <Accordion.Body>
                <Row>
                    {itemList?.map((item) => {
                        return (
                            <NoteItem
                                item={item}
                                setNoteItemFormData={setNoteItemFormData}
                                setNoteItemDeleteDialog={setNoteItemDeleteDialog}
                            />
                        );
                    })}
                </Row>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default CategoryDetail;
