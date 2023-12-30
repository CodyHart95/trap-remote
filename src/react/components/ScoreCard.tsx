import { useState, useEffect } from "react";
import { TableContainer, Table, TableRow, Paper, TableHead, TableCell, TableBody, Checkbox, Box } from "@mui/material";

interface ScoreCardProps {
    course: Course,
    shooters: string[],
    complete: boolean
}

interface ShooterScore {
    TrapA: boolean;
    TrapB?: boolean;
}

interface ScoreCardData {
    [shooter: string]: ShooterScore[];
}

const classes = {
    scoreCell: {
        borderLeft: "1px solid #e0e0e0",
        borderRight: "1px solid #e0e0e0"
    },
    doubleScoreCell: {
        borderLeft: "1px solid #e0e0e0",
        borderRight: "1px solid #e0e0e0",
        alignItems: "center",
    }
}

const ScoreCard = ({ course, shooters, complete }: ScoreCardProps) => {
    const [score, setScore] = useState<ScoreCardData>({});

    useEffect(() => {
        for(const shooter of shooters) {
            if(!score[shooter]) {
                const shooterScore = [];
                for(const station of course.stations) {
                    const stationValue = {} as ShooterScore;
                    for(let i = 0; i < 5; i++) {
                        if(station.traps === 1) {
                            stationValue.TrapA = false;
                        }
                        else {
                            stationValue.TrapA = false;
                            stationValue.TrapB = false;
                        }

                        shooterScore.push(stationValue);
                    }
                }

                score[shooter] = shooterScore;
            }
        }

        setScore({...score});
    }, [course, shooters]);

    useEffect(() => {
        if(complete) {
            console.log(JSON.stringify(score));
        }
    }, [complete]);

    const updateShooterScore = (value: boolean, target: "TrapA" | "TrapB", trap: number, shooter: string, station: Station) => {

        const shooterScore = score[shooter];

        if(station.number === 0) {
            shooterScore[trap][target] = value;
        }
        else {
            const index = (station.number) * (trap + 5);
            shooterScore[index][target] = value;
        }

        setScore({...score, [shooter]: [...shooterScore]})
    }

    return (
        <TableContainer component={Paper} sx={{height: "100%"}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Shooter</TableCell>
                        {course.stations.map(s => (
                            <TableCell colSpan={5}>Station {s.number + 1}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        shooters.map(shooter => (
                            <TableRow>
                                <TableCell>{shooter}</TableCell>
                                {course.stations.map(station => {
                                    const cells = [];
                                    for(let i = 0; i < 5; i++) {
                                        if(station.traps === 1) {
                                            cells.push(
                                            <TableCell sx={{...classes.scoreCell, borderRight: i === 4 && "1px solid black" }}>
                                                <Checkbox onChange={(e) => updateShooterScore(!!e.target.value, "TrapA", i, shooter, station)}/>
                                            </TableCell>)
                                        }
                                        else {
                                            cells.push(
                                                <TableCell sx={{...classes.scoreCell, borderRight: i === 4 && "1px solid black"}}>
                                                    <Box display="flex" alignItems="center">
                                                        <Checkbox onChange={(e) => updateShooterScore(!!e.target.value, "TrapA", i, shooter, station)}/>
                                                        /
                                                        <Checkbox onChange={(e) => updateShooterScore(!!e.target.value, "TrapB", i, shooter, station)}/>
                                                    </Box>

                                                </TableCell>
                                            )
                                        }
                                    }

                                    return cells;
                                })}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ScoreCard