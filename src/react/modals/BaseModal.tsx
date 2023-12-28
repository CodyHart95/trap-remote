import { Dialog, DialogActions, DialogContent, Box, Typography, Button, IconButton } from "@mui/material";
import React, {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';

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
    primaryAction?: string;
    secondaryAction?: string;
    maxWidth?: "sm" | "md" | "lg",
    onSecondaryAction?: () => void;
    onPrimaryAction?: () => void;
}
const useBaseModal = (): useModal<BaseModalProps> => {
    const [open, setOpen] = useState(false);

    const Render = ({ title, primaryAction, secondaryAction, onPrimaryAction, onSecondaryAction, maxWidth, children }: BaseModalProps) => {
        const onPrimaryActionInternal = () => {
            setOpen(false);
            onPrimaryAction && onPrimaryAction();
        }

        const onSecondaryActionInternal = () => {
            setOpen(false);
            onSecondaryAction && onSecondaryAction();
        }

        return (
            <Dialog open={open} maxWidth={maxWidth || "md"}>
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

    return [
        Render,
        () => setOpen(true),
    ]
}

export default useBaseModal;