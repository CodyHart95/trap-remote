import { useState } from "react";
import BaseModal from "./BaseModal"
import TextBox from "../components/TextBox";
import { useAsyncModal } from "./useModal";

const validateIpAddress = (ipAddress: string) => {
    const ipParts = ipAddress.split(".");

    const allPartsConform = ipParts.reduce((prev, cur) => {
        try {
            return Boolean(cur.length < 4 && Number.parseInt(cur) > -1);
        }
        catch {
            return false;
        }
    }, false);

    return ipParts.length === 4 && allPartsConform;
};

const EditTrapModal = ({ id }: IdModalProps) => {
    const [nameError, setNameError] = useState("");
    const [ipError, setIpError] = useState("");
    const [trap, setTrap] = useState<Trap>({} as Trap)
    const [title, setTitle] = useState("");
    const [nameEditable, setNameEditable] = useState(true);

    const onOpenCallback = (trap: Trap) => {
        setTrap(trap || {} as Trap);
        setTitle(trap ? "Add Trap" : "Edit Trap");
        setNameEditable(Boolean(trap?.name));
    }
    const { resolve } = useAsyncModal(id, onOpenCallback);

    const onSave = () => {
        let ipAddressValid = true;

        if(!trap.name) {
            setNameError("Name is required");
        }

        if(!trap.ipAddress) {
            ipAddressValid = false;
            setIpError("IP Address is required");
        }
        else if(!validateIpAddress(trap.ipAddress)) {
            ipAddressValid = false;
            setIpError("Please enter a valid IP Address");
        }

        if(trap.name && ipAddressValid) {
            setIpError("");
            setNameError("");
            resolve(trap);
            return true;
        }

        return false;
    };

    return (
        <BaseModal id={id} title={title} onPrimaryAction={onSave} primaryAction="Save" secondaryAction="Cancel" maxWidth="sm">
            <TextBox
                label="Name"
                value={trap?.name || ""}
                onChange={e => setTrap({...trap, name: e.target.value})}
                helpertext={nameError}
                fullWidth
                sx={{marginBottom: "16px"}}
                disabled={nameEditable}/>
            <TextBox label="IP Address" value={trap.ipAddress} onChange={e => setTrap({...trap, ipAddress: e.target.value})} helpertext={ipError} fullWidth/>
        </BaseModal>
    )
}

export default EditTrapModal;