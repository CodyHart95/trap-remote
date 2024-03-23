import { useState, useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import ShooterNameModal from "../modals/ShooterNameModal";
import ScoreCard from "../components/ScoreCard";
import Remote from "../components/Remote";
import { useNavigate, useParams } from "react-router-dom";
import Messages from "../../ipc/Messages";
import { useModal } from "../modals/useModal";

const classes = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    container: {
        display: "flex",
        justifyContent: "space-between",
    },
    completeContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: "16px"
    }
}

const defaultCourse: Course = {
    name: "",
    stations: []
}

const modalId = "ShooterNameModal";

const RunCourse = () => {
    const { openModalAsync } = useModal();
    const { courseName } = useParams();
    const [course, setCourse] = useState<Course>(defaultCourse);
    const [shooters, setShooters] = useState<string[]>([]);
    const [currentStation, setCurrentStation] = useState<Station>({} as Station);
    const [finalizeScoreCard, setFinalizeScoreCard] = useState(false);
    const courseComplete = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
        interop.invoke(Messages.LoadStations, courseName).then((stations: Station[]): void => {
            setCourse({
                name: courseName,
                stations
            });

            setCurrentStation(stations[0]);
        });
    }, [courseName]);

    useEffect(() => {
        openModalAsync(modalId).then((names: string[]) => {
            if(names?.length === 0) {
                navigate("../");
            }

            setShooters(names);
        });
    }, []);

    const onNextStation = () => {
        if(currentStation.number + 1 === course.stations.length) {
            courseComplete.current = true;
        }
        else {
            setCurrentStation(c => {
                return course.stations[c.number + 1]
            });
        }
    }

    const onHome = () => {
        navigate("../");
    }

    const onComplete = () => {
        console.log("done");
        setFinalizeScoreCard(true);
        onHome();
    }

    const onRestart = () => {
        setShooters([...shooters]);
        setCurrentStation(course.stations[0]);
    }

    return(
        <Box height="100%">
            <Box sx={classes.header}>
                <Button onClick={onHome}>{"<"}Home</Button>
                {!courseComplete.current && <Typography variant="h1">Current Station: Station {currentStation?.number || 1}</Typography>}
                {!courseComplete.current && <Button variant="contained" onClick={onNextStation}>Next Station</Button>}
            </Box>

            <Box display="flex" height="100%">
                <Box maxWidth={courseComplete ? "100%" : "60%"}>
                    <ScoreCard course={course} shooters={shooters || []} complete={finalizeScoreCard} />
                </Box>
                {!courseComplete.current && (
                    <Box width="40%" marginLeft="16px">
                        <Remote remoteDefinition={currentStation.remote}/>
                    </Box>
                )}
            </Box>
            {courseComplete.current && (
                <Box sx={classes.completeContainer}>
                    <Button variant="contained" onClick={onRestart}>Restart</Button>
                    <Button variant="contained" onClick={onComplete}>Complete Course</Button>
                </Box>
            )}
            <ShooterNameModal id={modalId}/>
        </Box>
    )

};

export default RunCourse;