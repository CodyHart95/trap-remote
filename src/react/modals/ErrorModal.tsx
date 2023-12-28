import { Typography } from "@mui/material";
import useBaseModal from "./BaseModal";
import { useRef } from "react";

const useErrorModal = (): useModal<object> => {
    const [ BaseModal, open ] = useBaseModal();
    const message = useRef("");

    const openErrorModal = (errorMessage: string) => {
        message.current = errorMessage;
        open();
    }

    const ErrorModal = () => {
        return (
            <BaseModal title="An Error Occured" primaryAction="Ok" maxWidth="sm">
                <Typography>{message.current}</Typography>
            </BaseModal>
        )
    }

    return [
        ErrorModal,
        openErrorModal
    ]
};

export default useErrorModal;