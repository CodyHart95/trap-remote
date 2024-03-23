import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ScoreCell, { CellState } from "./ScoreCell";
import { useRef } from "react";

const ShooterCells = ({stations, onScoreChange, shooter}) => {
    const numCells = stations.length * 5;

    const cells = [];

    for(let i = 0; i < numCells; i++) {
        cells.push(<ScoreCell onChange={(value) => onScoreChange(value, shooter, i)} cellNumber={i} stationBreak={5}/>);
    }

    return cells;
};


const SinglesCard = ({course, shooters}) => {
    const score = useRef({});

    const onScoreChange = (newValue: CellState, shooter: string, post: number) => {
        const cur = score.current;

        if(!cur[shooter]) {
            cur[shooter] = {};
        }

        if(!cur[shooter][post]) {
            cur[shooter][post] = {};
        }

        cur[shooter][post] = newValue;
        score.current = cur;
    }
    
    return (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Shooter</TableCell>
                    {course.stations.map(s => (
                        <TableCell colSpan={5} key={`head-${s.number}`}>Station {s.number + 1}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {shooters.map(s => (
                    <TableRow key={`row-${s}`}>
                        <TableCell>{s}</TableCell>
                        <ShooterCells stations={course.stations} onScoreChange={onScoreChange} shooter={s}/>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    );
}

export default SinglesCard;