import { useState } from "react";
import TextBox from "../components/TextBox";
import useBaseModal from "./BaseModal";
import { emit } from "../../utility/eventBus";
import EventBusMessages from "../../utility/EventBusMessages";

const useAddStationModal = (): useModal<object> => {
    const [localStation, setLocalStation] = useState<Station>({} as Station);
    const [ BaseModal, openBaseModal ] = useBaseModal()

    const onSave = async () => {
        emit(EventBusMessages.StationUpdated, localStation);
    };

    const open = (stationNumber: number, course: string) => {
        setLocalStation({ number: stationNumber, traps: 0, course });
        openBaseModal();
    }

    const AddStationModal = () => (
        <>
            <BaseModal title="Add Station" secondaryAction="Cancel" primaryAction="Save" onPrimaryAction={onSave}>
                <TextBox label="Number of Traps" type="number" value={localStation.traps} onChange={(e) => setLocalStation(l => ({...l, traps: Number(e.target.value)}))}/>
            </BaseModal>
        </>
    )

    return [
        AddStationModal,
        open
    ]
};

export default useAddStationModal;