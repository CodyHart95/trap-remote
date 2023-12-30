import { useState } from "react";
import TextBox from "../components/TextBox";
import BaseModal from "./BaseModal";
import { useAsyncModal } from "./useModal";

const EditStationModal = ({id}: IdModalProps) => {
    const [localStation, setLocalStation] = useState<Station>({} as Station);

    const { resolve } = useAsyncModal(id, setLocalStation);

    const onSave = async () => {
        resolve(localStation);
    };

    return (
        <BaseModal id={id} title={ `Edit Station ${localStation.number}`} secondaryAction="Cancel" primaryAction="Save" onPrimaryAction={onSave}>
            <TextBox label="Number of Traps" type="number" value={localStation.traps} onChange={(e) => setLocalStation(l => ({...l, traps: Number(e.target.value)}))}/>
        </BaseModal>
    )
};

export default EditStationModal;