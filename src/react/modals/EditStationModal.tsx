import { useState } from "react";
import TextBox from "../components/TextBox";
import useBaseModal from "./BaseModal";
import { emit } from "../../utility/eventBus";
import EventBusMessages from "../../utility/EventBusMessages";

const useEditStationModal = (): useModal<object> => {
    const [localStation, setLocalStation] = useState<Station>({} as Station);
    const [ BaseModal, openBaseModal ] = useBaseModal()

    const onSave = async () => {
        emit(EventBusMessages.StationUpdated, localStation)
    };

    const open = (station: Station) => {
        setLocalStation(station);
        openBaseModal();
    }

    const EditStationModal = () => (
        <>
            <BaseModal title={ `Edit Station ${localStation.number}`} secondaryAction="Cancel" primaryAction="Save" onPrimaryAction={onSave}>
                <TextBox label="Number of Traps" type="number" value={localStation.traps} onChange={(e) => setLocalStation(l => ({...l, traps: Number(e.target.value)}))}/>
            </BaseModal>
        </>
    )

    return [
        EditStationModal,
        open
    ]
};

export default useEditStationModal;