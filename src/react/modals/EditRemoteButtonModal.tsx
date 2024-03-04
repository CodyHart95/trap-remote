import { useRef, useState } from "react";
import BaseModal from "./BaseModal";
import TextBox from "../components/TextBox";
import MultiSelect from "../components/MultiSelect";
import { useAsyncModal } from "./useModal";

interface EditRemoteButtonModalProps extends IdModalProps {
    availableTraps: Trap[]
}

const EditRemoteButtonModal = ({id, availableTraps}: EditRemoteButtonModalProps) => {
    const [text, setText] = useState("");
    const [traps, setTraps] = useState<Trap[]>([]);
    const maxSelections = useRef(0);

    const { resolve } = useAsyncModal(id, (text: string, traps: Trap[], buttonType: ButtonType) => {
        setText(text);
        setTraps(traps);

        maxSelections.current = buttonType
    });

    const onSave = () => {
        resolve({ text, traps })
    };

    return (
        <BaseModal id={id} title="Edit Remote Button" primaryAction="Save" onPrimaryAction={onSave}>
            <TextBox label="Button Text" value={text} onChange={e => setText(e.target.value)}/>
            <MultiSelect items={availableTraps} value={traps} onChange={setTraps} maxSelections={maxSelections.current}/>
        </BaseModal>
    )
};

export default EditRemoteButtonModal;