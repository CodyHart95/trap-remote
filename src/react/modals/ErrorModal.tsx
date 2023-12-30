import { Typography } from "@mui/material";
import BaseModal from "./BaseModal";
import { useRef } from "react";
import { useFromModal } from "./useModal";

const ErrorModal = ({id}: IdModalProps) => {
    const openCallback = (errorMessage: string) => message.current = errorMessage;

    useFromModal(id, openCallback);

    const message = useRef("");

    return (
        <BaseModal id={id} title="An Error Occured" primaryAction="Ok" maxWidth="sm">
            <Typography>{message.current}</Typography>
        </BaseModal>
    )
};

export default ErrorModal;