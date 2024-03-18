import { useRef, useState } from "react";
import BaseModal from "./BaseModal";
import TextBox from "../components/TextBox";
import MultiSelect from "../components/MultiSelect";
import { useAsyncModal } from "./useModal";
import { Box } from "@mui/material";

interface EditRemoteButtonModalProps extends IdModalProps {
    availableTraps: Trap[]
}

const EditRemoteButtonModal = ({id, availableTraps}: EditRemoteButtonModalProps) => {
    const [text, setText] = useState("");
    const [traps, setTraps] = useState<Trap[]>([]);
    const [maxSelections, setMaxSelections] = useState(undefined);

    const { resolve } = useAsyncModal(id, (text: string, traps: Trap[], buttonType: ButtonType) => {
        setText(text);
        setTraps(traps);

        setMaxSelections(buttonType)
    });

    const onSave = () => {
        resolve({ text, traps });
        return true;
    };

    const onDelete = () => {
        resolve({ delete: true});
        return true;
    }

    return (
        <BaseModal id={id} title="Edit Remote Button" primaryAction="Save" onPrimaryAction={onSave} secondaryAction="Delete" onSecondaryAction={onDelete} maxWidth="sm" height="300px">
            <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
                <TextBox label="Button Text" value={text} onChange={e => setText(e.target.value)} sx={{marginBottom: "48px"}}/>
                <MultiSelect label="Traps" items={availableTraps} value={traps} onChange={setTraps} maxSelections={maxSelections} displayKey="name"/>
            </Box>
        </BaseModal>
    )
};

export default EditRemoteButtonModal;