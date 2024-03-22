import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { contrastColor } from "../theme";
import EditStationModal from "../modals/EditStationModal";
import PageHeader from "../components/PageHeader";
import TextBox from "../components/TextBox";
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

const EditCourse = () => {
    const { courseName } = useParams();
    const [stations, setStations] = useState<Station[]>([]);
    const [name, setName] = useState<string>(courseName || "");
    const remotes = useRef<Remote[]>([]);
    const navigate = useNavigate();
    const { openModalAsync } = useModal();

    useEffect(() => {
        if(courseName) {
            interop.invoke(Messages.LoadStations, courseName).then(setStations);
        }

        interop.invoke(Messages.LoadRemotes).then((r) => {
            remotes.current = r
        });
    }, [courseName])

    const onAddStation = async () => {
        const newStation: Partial<Station> = {
            number: stations.length,
            course: name
        }
        const station = await openModalAsync(EditModalId, newStation, remotes.current);
        if(station) {
            stations.push(station);
            setStations([...stations]);
        }
    }

    const onEditStation = async (station: Station) => {
        const updatedStation = await openModalAsync(EditModalId, station, remotes.current);

        if(updatedStation) {
            stations[updatedStation.number] = updatedStation;
            setStations([...stations]);
        }
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
        </Box>
    )
};

export default EditCourse;