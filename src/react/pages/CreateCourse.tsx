import { Box, Button, List, ListItem } from "@mui/material";
import { useState, useEffect } from "react";
import { contrastColor } from "../theme";
import useEditStationModal from "../modals/EditStationModal";
import { useSubscribe } from "../../utility/eventBus";
import EventBusMessages from "../../utility/EventBusMessages";
import PageHeader from "../components/PageHeader";
import TextBox from "../components/TextBox";
import useAddStationModal from "../modals/AddStationModal";
import Messages from "../../ipc/Messages";
import { useNavigate, useParams } from "react-router-dom";

const classes = {
    header: {
        borderBottom: `1px solid ${contrastColor}`,
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    stationItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    stationList: {
        overflow: "auto",
        maxHeight: "90vh",
        height: "90vh"
    }
}
const EditCourse = () => {
    const { courseName } = useParams();
    console.log(courseName);
    const [stations, setStations] = useState<Station[]>([]);
    const [name, setName] = useState<string>(courseName);
    const [EditStationModal, openEditStationModal] = useEditStationModal();
    const [AddStationModal, openAddStationModal] = useAddStationModal();
    const navigate = useNavigate();

    useEffect(() => {
        if(courseName) {
            interop.invoke(Messages.LoadStations, courseName).then(setStations);
        }
    }, [courseName])

    useSubscribe(EventBusMessages.StationUpdated, async (station: Station) => {
        setStations(s => {
            if(s.length < station.number) {
                s.push(station);
            }
            else {
                s[station.number] = station;
            }
            return [...s]
        })
    });

    const onAddStation = () => {
        openAddStationModal(stations.length + 1, name);
    }

    const onSave = async () => {
        await interop.invoke(Messages.SaveCourse, { name, stations });
        navigate("../");
    }

    const onBack = async () => {
        navigate("../");
    }

    return (
        <Box>
            <Button onClick={onBack}>Back</Button>
            <PageHeader text="Create Course" headerButton="Save" onClick={onSave}/>
            <TextBox label="Course Name" value={name} onChange={(e) => setName(e.target.value)} sx={{maxWidth: "250px"}}/>

            <PageHeader text="Stations" headerButton={ stations && "Add Station"} onClick={onAddStation}/>
            {!stations && <Button variant="contained" onClick={onAddStation}>Add Station</Button>}
            {stations &&
                <List sx={classes.stationList}>
                    {stations.map(s => (
                        <ListItem sx={classes.stationItem} key={s.number}>
                            Station {s.number + 1}
                            <Button onClick={() => openEditStationModal(s)}>Edit</Button>
                        </ListItem>
                    ))}
                </List>
            }
            <EditStationModal/>
            <AddStationModal/>
        </Box>
    )
};

export default EditCourse;