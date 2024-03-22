import { useState } from "react";
import Remote from "../components/Remote";
import BaseModal from "./BaseModal";
import { useFromModal } from "./useModal";

const TestRemoteModal = ({ id }) => {

    const [remote, setRemote] = useState({} as Remote);
    const onOpen = (remote: Remote) => {
        setRemote(remote);
    };

    const { closeModal } = useFromModal(id, onOpen);

    return (
        <BaseModal title={remote.name} id={id} onPrimaryAction={closeModal} primaryAction="Done" height="100vh">
            <Remote remoteDefinition={remote}/>
        </BaseModal>
    )
};

export default TestRemoteModal;