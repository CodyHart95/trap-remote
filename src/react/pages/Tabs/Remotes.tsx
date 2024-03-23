import {useState, useEffect} from "react";
import Messages from "../../../ipc/Messages";
import { List, ListItem, Typography, Button } from "@mui/material";
import classes from "./classes";
import { useNavigate } from "react-router-dom";
import EmptyTabBody from "./EmptyTabBody";
import { useModal } from "../../modals/useModal";
import TestRemoteModal from "../../modals/TestRemoteModal";

const modalId = "test-remote-modal";

const Home = () => {
    const [remotes, setRemotes] = useState<Remote[]>([]);
    const { openModal } = useModal();
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

    const onDuplicate = (remote: Remote) => {
        let name = remote.name;
        const suffix = remote.name.substring(remote.name.length - 3);
        if(/\((\d+)\)/gm.test(suffix)) {
            name = remote.name.substring(0, remote.name.length - 4);
        }
        const similarNameCount = remotes.filter((r) => r.name.startsWith(name));
        const newRemote = {...remote};

        if(similarNameCount.length > 0) {
            newRemote.name = `${name} (${similarNameCount.length})`
        }

        remotes.push(newRemote);
        setRemotes([...remotes]);

        interop.invoke(Messages.SaveRemote, newRemote);
    }

    const onTest = (remote) => {
        openModal(modalId, remote);
    }

    return (
        <>
            {remotes.length === 0 && <EmptyTabBody buttonText="Add Remote" onClick={onAddRemote}/>}
            {remotes.length > 0 && (
                <List sx={classes.list}>
                    <ListItem>
                        <Button variant="contained" onClick={onAddRemote}>Add Remote</Button>
                    </ListItem>
                    {remotes.map(remote => (
                        <ListItem key={remote.name} sx={classes.listItem}>
                            <Typography>
                                {remote.name}
                            </Typography>
                            <div>
                                <Button onClick={() => onEditRemote(remote.name)}>Edit</Button>
                                <Button onClick={() => onDelete(remote)} color="error">Delete</Button>
                                <Button onClick={() => onDuplicate(remote)}>Duplicate</Button>
                                <Button onClick={() => onTest(remote)}>Test</Button>
                            </div>
                        </ListItem>
                    ))}
            </List>
            )}
            <TestRemoteModal id={modalId} />
        </>
    )
};

export default Home;