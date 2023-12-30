import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import ShooterNameModal from "../modals/ShooterNameModal";
import ScoreCard from "../components/ScoreCard";
import Remote from "../components/Remote";
import { useNavigate, useParams } from "react-router-dom";
import Messages from "../../ipc/Messages";
import { useFromModal } from "../modals/useModal";

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
    const { openModalAsync } = useFromModal(modalId);
    const { courseName } = useParams();
    const [course, setCourse] = useState<Course>(defaultCourse);
    const [shooters, setShooters] = useState<string[]>([]);
    const [currentStation, setCurrentStation] = useState(0);
    const [finalizeScoreCard, setFinalizeScoreCard] = useState(false);
    const courseComplete = currentStation > course?.stations?.length - 1;

    const navigate = useNavigate();

    useEffect(() => {
        interop.invoke(Messages.LoadStations, courseName).then((stations: Station[]): void => {
            setCourse({
                name: courseName,
                stations
            })
        });
    }, [courseName]);

    useEffect(() => {
        openModalAsync().then((names: string[]) => {
            if(names?.length === 0) {
                navigate("../");
            }

            setShooters(names);
        });
    }, []);

    const onNextStation = () => {
        setCurrentStation((c) => {
            return c + 1;
        });
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
        setCurrentStation(0);
    }

    return(
        <Box>
            <Box sx={classes.header}>
                <Button onClick={onHome}>{"<"}Home</Button>
                {!courseComplete && <Typography variant="h1">Current Station: Station {currentStation + 1}</Typography>}
                {!courseComplete && <Button variant="contained" onClick={onNextStation}>Next Station</Button>}
            </Box>

            <Box display="flex" height={`calc(100vh - ${courseComplete ? "106" : "54"}px)` }>
                <Box maxWidth={courseComplete ? "100%" : "60%"}>
                    <ScoreCard course={course} shooters={shooters || []} complete={finalizeScoreCard} />
                </Box>
                {!courseComplete && (
                    <Box width="calc(50vw - 50px)" marginLeft="16px">
                        <Remote station={course?.stations[currentStation] || {} as Station}/>
                    </Box>
                )}
            </Box>
            {courseComplete && (
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