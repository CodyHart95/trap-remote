import { Dialog, DialogActions, DialogContent, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useFromModal } from "./useModal";

const classes = {
    dialoagTitle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px"
    }
}

interface BaseModalProps extends React.PropsWithChildren {
    title: string;
    id: string;
    primaryAction?: string;
    secondaryAction?: string;
    maxWidth?: "sm" | "md" | "lg";
    onSecondaryAction?: () => void;
    onPrimaryAction?: () => void;
}

const BaseModal = ({ id, title, primaryAction, secondaryAction, onPrimaryAction, onSecondaryAction, maxWidth, children }: BaseModalProps) => {
    const { isOpen, closeModal } = useFromModal(id);

    const onPrimaryActionInternal = () => {
        closeModal();
        onPrimaryAction && onPrimaryAction();
    }

    const onSecondaryActionInternal = () => {
        closeModal();
        onSecondaryAction && onSecondaryAction();
    }

    return (
        <Dialog open={isOpen} maxWidth={maxWidth || "md"}>
            <Box sx={classes.dialoagTitle}>
                <Typography>{title}</Typography>
                <IconButton onClick={onSecondaryActionInternal} sx={{padding: 0}}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {primaryAction && <Button onClick={onPrimaryActionInternal} variant="contained">{primaryAction}</Button>}
                {secondaryAction && <Button onClick={onSecondaryActionInternal} sx={{marginLeft: "8px"}}>{secondaryAction}</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default BaseModal;