import { useCallback, useState } from "react";
import TextBox from "../components/TextBox";
import BaseModal from "./BaseModal";
import { useAsyncModal } from "./useModal";

const AddStationModal = ({id}: IdModalProps) => {
    const [localStation, setLocalStation] = useState<Station>({} as Station);

    const openCallback = (stationNumber: number, course: string) => {
        setLocalStation({ number: stationNumber, traps: 0, course, trapIpAddresses: [] });
    }

    const { resolve } = useAsyncModal(id, openCallback);

    const onSave = () => {
        resolve(localStation);
    };

    // TODO: Make this not suck. Will need to change up the UI
    const getIpAddressInputs = useCallback((localStation: Station) => {
        const ipAddresses = [];

        for(let i = 0; i < localStation.traps; i++) {
            ipAddresses.push(<TextBox
                label={`Trap ${i + 1} IP Address`}
                value={localStation.trapIpAddresses[i] }
                onChange={(e) => setLocalStation(l =>
                    {
                        l.trapIpAddresses[i] = e.target.value
                        return {...l, trapIpAddresses: [...l.trapIpAddresses]}
                    }
            )}/>)
        }

        return ipAddresses;
    }, []);

    return (
        <BaseModal id={id} title="Add Station" secondaryAction="Cancel" primaryAction="Save" onPrimaryAction={onSave}>
            <TextBox label="Number of Traps" type="number" value={localStation.traps} onChange={(e) => setLocalStation(l => ({...l, traps: Number(e.target.value)}))}/>
            {
                getIpAddressInputs(localStation)
            }
        </BaseModal>
    )
};

export default AddStationModal;