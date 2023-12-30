import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { contrastColor } from "../theme";
import EditStationModal from "../modals/EditStationModal";
import PageHeader from "../components/PageHeader";
import TextBox from "../components/TextBox";
import AddStationModal from "../modals/AddStationModal";
import Messages from "../../ipc/Messages";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../modals/useModal";

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
        height: "calc(100vh - 235px)"
    }
}

const EditModalId = "EditModal";
const AddModalId = "AddModal";

const EditCourse = () => {
    const { courseName } = useParams();
    const [stations, setStations] = useState<Station[]>([]);
    const [name, setName] = useState<string>(courseName || "");
    const navigate = useNavigate();
    const { openModalAsync } = useModal();

    useEffect(() => {
        if(courseName) {
            interop.invoke(Messages.LoadStations, courseName).then(setStations);
        }
    }, [courseName])

    const onAddStation = async () => {
        const station = await openModalAsync(AddModalId, stations.length, name);
        stations.push(station);
        setStations([...stations]);
    }

    const onEditStation = async (station: Station) => {
        const updatedStation = await openModalAsync(EditModalId, station);
        stations[updatedStation.number] = updatedStation;
        setStations([...stations]);
    }

    const onSave = async () => {
        stations.forEach(s => s.course = name);
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
                            <Typography>Station {s.number + 1}</Typography>
                            <Button onClick={() => onEditStation(s)}>Edit</Button>
                        </ListItem>
                    ))}
                </List>
            }
            <EditStationModal id={EditModalId}/>
            <AddStationModal id={AddModalId} />
        </Box>
    )
};

export default EditCourse;