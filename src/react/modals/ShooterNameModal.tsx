import { useState } from "react";
import {List, ListItem, OutlinedInput, Button } from "@mui/material";
import BaseModal from "./BaseModal";
import { useAsyncModal } from "./useModal";

const classes = {
    list: {
        width: "400px",
        height: "300px",
        overflow: "auto"
    },
    input: {
        width: "350px"
    }
};

const ShooterNameModal = ({id}: IdModalProps) => {
    const [names, setNames] = useState<string[]>([]);
    const [currentName, setCurrentName] = useState("");

    const { resolve } = useAsyncModal(id);

    const onPrimaryAction = () => {
        if(currentName) {
            names.push(currentName);
        }

        setCurrentName("");
        resolve(names);
    }

    const onSecondaryAction = () => {
        resolve([]);
    }

    const onAddShooter = () => {
        names.push(currentName);
        setNames(names);
        setCurrentName("");
    }

    return (
        <BaseModal
            id={id}
            title="Shooter Registration"
            primaryAction="Start"
            secondaryAction="Cancel"
            onPrimaryAction={onPrimaryAction}
            onSecondaryAction={onSecondaryAction}
            >
            <List sx={classes.list}>
                {names.map((n, index) => (
                    <ListItem>
                        <OutlinedInput sx={classes.input} value={names[index]} onChange={(e) => {
                            names[index] = e.target.value;
                            setNames([...names]);
                        }}/>
                    </ListItem>
                ))}
                <ListItem>
                    <OutlinedInput sx={classes.input} value={currentName} onChange={(e) => setCurrentName(e.target.value)}/>
                </ListItem>
            </List>
            <Button variant="contained" onClick={onAddShooter}>Add Shooter</Button>
        </BaseModal>
    );
}

export default ShooterNameModal;