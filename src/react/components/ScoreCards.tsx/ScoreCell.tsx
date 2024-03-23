import { Circle, Close } from "@mui/icons-material";
import { Box, TableCell } from "@mui/material";
import { useState } from "react";

export enum CellState {
    Empty,
    Hit,
    Miss
}

const classes = {
    cell: (cellNumber, stationBreak) => ({
        borderLeft: cellNumber % stationBreak === 0 && cellNumber !== 0 ? "1px solid black" : "1px solid lightGray",
        padding: 0,
        width: "40px",
        height: "40px",
    }),
}

const CellIcon = ({cellState}) => {
    if(cellState === CellState.Hit) {
        return <Circle/>
    }

    if(cellState === CellState.Miss) {
        return <Close/>
    }

    return undefined;
}

const ScoreCell = ({onChange, cellNumber, stationBreak}) => {
    const [cellState, setCellState] = useState(CellState.Empty);

    const onCellClick = () => {
        let newState = cellState;
        if(cellState === CellState.Miss) {
            newState = CellState.Empty;
        }
        else {
            newState += 1;
        }

        setCellState(newState);
        onChange(newState);
    }

    return (
        <TableCell onClick={onCellClick} sx={classes.cell(cellNumber, stationBreak)}>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                <CellIcon cellState={cellState}/>
            </Box>
        </TableCell>
    )
}

export default ScoreCell;