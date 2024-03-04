import {useState, useEffect} from "react";
import Messages from "../../../ipc/Messages";
import { List, ListItem, Typography, Button } from "@mui/material";
import classes from "./classes";
import EditTrapModal from "../../modals/EditTrapModal";
import { useModal } from "../../modals/useModal";
import EmptyTabBody from "./EmptyTabBody";

const trapModalId = "edit-trap-modal";

const Home = () => {
    const [traps, setTraps] = useState<Trap[]>([]);
    const { openModalAsync } = useModal()

    useEffect(() => {
        interop.invoke(Messages.LoadTraps, null).then((traps: Trap[]) => {
            setTraps(traps);
        });
    }, []);

    const onEditTrap = async (trap?: Trap) => {
        const newTrap = await openModalAsync(trapModalId, trap);
        const newTraps = await interop.invoke(Messages.SaveTrap, newTrap);
        setTraps(newTraps);
    }

    const onDelete = async (trap: Trap) => {
        const newTraps = await interop.invoke(Messages.DeleteTrap, trap.name);
        setTraps(newTraps);
    }

    const onThrow = async (trap: Trap) => {
        await interop.invoke(Messages.FireTrap, trap.ipAddress)
    }

    return (
        <>
            {traps.length === 0 && <EmptyTabBody buttonText="Add Trap" onClick={() => onEditTrap()}/>}
            {traps.length > 0 && (
                <List sx={classes.list}>
                    <ListItem>
                        <Button variant="contained" onClick={() => onEditTrap()}>Add Trap</Button>
                    </ListItem>
                    {traps.map(trap => (
                        <ListItem key={trap.name} sx={classes.listItem}>
                            <Typography>
                                {trap.name}
                            </Typography>
                            <div>
                                <Button onClick={() => onThrow(trap)}>Throw</Button>
                                <Button onClick={() => onEditTrap(trap)}>Edit</Button>
                                <Button onClick={() => onDelete(trap)} color="error">Delete</Button>
                            </div>
                        </ListItem>
                    ))}
                </List>
            )}
            <EditTrapModal id={trapModalId}/>
        </>
    )
};

export default Home;