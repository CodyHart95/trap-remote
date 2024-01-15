import {useEffect, useMemo, useRef, useState} from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import Messages from "../../ipc/Messages";
import { ipcMain } from "electron";

interface RemoteProps {
    station: Station
}

interface LayoutProps {
    trapIpAddresses: string[]
}

interface Indecator {
    [ipAddress: string]: boolean
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
    },
    indecator: (on: boolean) => ({
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        margin: "10px",
        display: "inline-block",
        backgroundColor: on ? "green" : "red"
    })
}

const pullTrap = async (ipAddresses: string[]) => {
    const pulls = ipAddresses.map((ipAddress) => {
        interop.invoke(Messages.FireTrap, ipAddress)
    });

    await Promise.allSettled(pulls);
};

const SinglesLayout = ({ trapIpAddresses }: LayoutProps) => {
    return (
        <Box sx={classes.singlesLayoutContainer}>
            <Button variant="contained" onClick={() => pullTrap(trapIpAddresses)}>Pull</Button>
        </Box>
    )
}

const DoublesLayout = ({ trapIpAddresses }: LayoutProps) => {
    return (
        <Grid container sx={classes.multiContainer}>
            <Grid item xs={6} sx={classes.multiItem}>
                <Button variant="contained" onClick={() => pullTrap([trapIpAddresses[0]])}>Trap A</Button>
            </Grid>
            <Grid item xs={6} sx={classes.multiItem}>
                <Button variant="contained" onClick={() => pullTrap([trapIpAddresses[1]])}>Trap B</Button>
            </Grid>
            <Grid item xs={12} sx={classes.multiItem}>
                <Button variant="contained" onClick={() => pullTrap(trapIpAddresses)}>True Pair</Button>
            </Grid>
        </Grid>
    )
}

const NLayout = ({ trapIpAddresses }: LayoutProps) => {
    const doubleADown = useRef("");

    const onMouseDown = (ipAddress: string) => {
        if(doubleADown.current) {
            pullTrap([doubleADown.current, ipAddress]);
            return;
        }

        if(doubleADown.current) {
            doubleADown.current = ipAddress;
        }
    }

    const onMouseUp = (ipAddress: string) => {
        if(doubleADown.current === ipAddress) {
            pullTrap([ipAddress]);
        }

        doubleADown.current = ipAddress;
    }

    const gridItems = useMemo(() => {
        return trapIpAddresses.map((ip, i) => (
            <Grid item xs={6} sx={classes.multiItem}>
                <Button variant="contained" onMouseDown={() => onMouseDown(ip)} onMouseUp={() => onMouseUp(ip)}>
                {`Trap ${i < 27 ? String.fromCharCode(i + 65).toUpperCase() : i + 1}`}
                </Button>
            </Grid>
        ));
    }, [trapIpAddresses]);


    return (
        <Grid container sx={classes.multiContainer}>
            {gridItems}
        </Grid>
    )
}

const ButtonLayout = ({trapIpAddresses}: LayoutProps) => {
    if(trapIpAddresses.length === 1) {
        return <SinglesLayout trapIpAddresses={trapIpAddresses}/>
    }
    else if(trapIpAddresses.length == 2) {
        return <DoublesLayout trapIpAddresses={trapIpAddresses}/>
    }

    return <NLayout trapIpAddresses={trapIpAddresses}/>
}

const Indecator = ({ trapIpAddresses }: LayoutProps) => {
    const [indecators, setIndecators] = useState<Indecator>({});

    useEffect(() => {

        const statusPromises = trapIpAddresses.map((ipAddress) => interop.invoke(Messages.TrapStatus, ipAddress));

        Promise.all(statusPromises).then((statuses) => {
            console.log(statuses);
            statuses.forEach(s => indecators[s.ipAddress] = s.status);
        });

        setIndecators({...indecators});
    }, [trapIpAddresses]);

    useEffect(() => {
        interop.receive(Messages.TrapConnected, (ipAddress) => {
            setIndecators(i => ({ ...i, [ipAddress]: true }));
        });

        interop.receive(Messages.TrapDisconnected, (ipAddress) => {
            setIndecators(i => ({ ...i, [ipAddress]: false }));
        });
    })

    return (
        <Box width="100%" display="flex" alignItems="center" justifyContent="end">
            {
                Object.values(indecators).map(i => <Box sx={ () => classes.indecator(i) }/>)
            }
        </Box>
    )
};

const Remote = ({ station }: RemoteProps) => {
    return (
        <Box component={Paper} width="100%" height="100%" alignItems="center">
            <Indecator trapIpAddresses={station.trapIpAddresses}/>
            <ButtonLayout trapIpAddresses={station.trapIpAddresses}/>
        </Box>
    )
};

export default Remote;