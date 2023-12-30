import { useState } from "react";
import TextBox from "../components/TextBox";
import BaseModal from "./BaseModal";
import { useAsyncModal } from "./useModal";

const AddStationModal = ({id}: IdModalProps) => {
    const [localStation, setLocalStation] = useState<Station>({} as Station);

    const openCallback = (stationNumber: number, course: string) => {
        setLocalStation({ number: stationNumber, traps: 0, course });
    }

    const { resolve } = useAsyncModal(id, openCallback);

    const onSave = () => {
        resolve(localStation);
    };

    return (
        <BaseModal id={id} title="Add Station" secondaryAction="Cancel" primaryAction="Save" onPrimaryAction={onSave}>
            <TextBox label="Number of Traps" type="number" value={localStation.traps} onChange={(e) => setLocalStation(l => ({...l, traps: Number(e.target.value)}))}/>
        </BaseModal>
    )
};

export default AddStationModal;