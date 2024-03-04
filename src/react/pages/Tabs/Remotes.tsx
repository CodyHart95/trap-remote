import {useState, useEffect} from "react";
import Messages from "../../../ipc/Messages";
import { List, ListItem, Typography, Button } from "@mui/material";
import classes from "./classes";
import { useNavigate } from "react-router-dom";
import EmptyTabBody from "./EmptyTabBody";


const Home = () => {
    const [remotes, setRemotes] = useState<Remote[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        interop.invoke(Messages.LoadRemotes).then((remotes: Remote[]) => {
            setRemotes(remotes);
        });
    }, []);

    const onAddRemote = () => {
        navigate("/remote");
    };

    const onEditRemote = (remoteName: string) => {
        navigate(`/remote/${remoteName}`);
    }

    const onDelete = (remote: Remote) => {
        interop.invoke(Messages.DeleteRemote, remote.name);
        const index = remotes.findIndex(c => c.name === remote.name);

        if(index > -1) {
            remotes.splice(index, 1);
            setRemotes([...remotes]);
        }
    }

    return (
        <>
            {remotes.length === 0 && <EmptyTabBody buttonText="Add Remote" onClick={onAddRemote}/>}
            {remotes.length > 0 && (
                <List sx={classes.list}>
                {remotes.map(remote => (
                    <ListItem key={remote.name} sx={classes.listItem}>
                        <Typography>
                            {remote.name}
                        </Typography>
                        <div>
                            <Button onClick={() => onEditRemote(remote.name)}>Edit</Button>
                            <Button onClick={() => onDelete(remote)} color="error">Delete</Button>
                        </div>
                    </ListItem>
                ))}
            </List>
            )}
        </>
    )
};

export default Home;