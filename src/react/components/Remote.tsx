import {useMemo, useRef} from "react";
import { Box, Button, Grid, Paper } from "@mui/material";

interface RemoteProps {
    station: Station
}

interface LayoutProps {
    numberOfTraps: number
}

const classes = {
    singlesLayoutContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    multiContainer: {
        width: "100%",
        height: "100%"
    },
    multiItem: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
    }
}

const pullTrap = (trapNumbers: number[]) => {
    console.log(`Trap ${trapNumbers} Pulled`);
};

const SinglesLayout = () => {
    return (
        <Box sx={classes.singlesLayoutContainer}>
            <Button variant="contained" onClick={() => pullTrap([0])}>Pull</Button>
        </Box>
    )
}

const DoublesLayout = () => {
    return (
        <Grid container sx={classes.multiContainer}>
            <Grid item xs={6} sx={classes.multiItem}>
                <Button variant="contained" onClick={() => pullTrap([0])}>Trap A</Button>
            </Grid>
            <Grid item xs={6} sx={classes.multiItem}>
                <Button variant="contained" onClick={() => pullTrap([1])}>Trap B</Button>
            </Grid>
            <Grid item xs={12} sx={classes.multiItem}>
                <Button variant="contained" onClick={() => pullTrap([0,1])}>True Pair</Button>
            </Grid>
        </Grid>
    )
}

const NLayout = ({numberOfTraps}: LayoutProps) => {
    const doubleADown = useRef(-1);

    const onMouseDown = (trapNumber: number) => {
        console.log(doubleADown.current);
        if(doubleADown.current > -1) {
            pullTrap([doubleADown.current, trapNumber]);
            return;
        }

        if(doubleADown.current === -1) {
            doubleADown.current = trapNumber;
        }
    }

    const onMouseUp = (trapNumber: number) => {
        if(doubleADown.current === trapNumber) {
            pullTrap([trapNumber]);
        }

        doubleADown.current = -1;
    }

    const gridItems = useMemo(() => {
        const items = []

        for(let i = 0; i < numberOfTraps; i++) {
            items.push(
                <Grid item xs={6} sx={classes.multiItem}>
                    <Button variant="contained" onMouseDown={() => onMouseDown(i)} onMouseUp={() => onMouseUp(i)}>
                        {`Trap ${i < 27 ? String.fromCharCode(i + 65).toUpperCase() : i + 1}`}
                    </Button>
                </Grid>
            )
        }

        return items;
    }, [numberOfTraps]);


    return (
        <Grid container sx={classes.multiContainer}>
            {gridItems}
        </Grid>
    )
}

const ButtonLayout = ({numberOfTraps}: LayoutProps) => {
    if(numberOfTraps === 1) {
        return <SinglesLayout/>
    }
    else if(numberOfTraps == 2) {
        return <DoublesLayout/>
    }

    return <NLayout numberOfTraps={numberOfTraps}/>
}

const Remote = ({ station }: RemoteProps) => {
    return (
        <Box component={Paper} width="100%" height="100%" alignItems="center">
                <ButtonLayout numberOfTraps={station.traps}/>
        </Box>
    )
};

export default Remote;