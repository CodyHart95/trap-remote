import { useRef, useState } from "react";
import BaseModal from "./BaseModal";
import { useAsyncModal } from "./useModal";
import { Box, MenuItem, Select, Typography } from "@mui/material";

const EditStationModal = ({id}: IdModalProps) => {
    const [localStation, setLocalStation] = useState<Station>({} as Station);
    const [remoteNames, setRemoteNames] = useState<string[]>([]);
    const [selectedRemoteName, setSelectedRemoteName] = useState("");
    const remotes = useRef<Remote[]>([])

    const onOpen = (station: Station, remoteDefs: Remote[]) => {
        setLocalStation(station);
        setRemoteNames(remoteDefs.map(r => r.name));
        remotes.current = remoteDefs
    }
    const { resolve } = useAsyncModal(id, onOpen);

    const onSave = () => {
        localStation.remote = remotes.current.find(r => r.name === selectedRemoteName);
        resolve(localStation);
        return true;
    };

    const onCancel = () => {
        resolve(null);
    }

    const onRemoteChange = (event) => {
        setSelectedRemoteName(event.target.value);
    }

    return (
        <BaseModal 
            id={id} 
            title={ `Edit Station ${localStation.number}`} 
            secondaryAction="Cancel" 
            onSecondaryAction={onCancel} 
            primaryAction="Save" 
            onPrimaryAction={onSave}
            maxWidth="sm"
            height="200px">
                <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                    <div>
                        <Typography variant="h3">Select Remote</Typography>
                        <Select 
                            sx={{width: "400px" }}
                            value={selectedRemoteName} 
                            onChange={onRemoteChange} 
                            >
                                {
                                    remoteNames.map((r) => (
                                        <MenuItem key={r} value={r}>{r}</MenuItem>
                                    ))
                                }
                        </Select>
                    </div>
                </Box>
        </BaseModal>
    )
};

export default EditStationModal;