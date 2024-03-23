import { Box, Paper } from "@mui/material";
import RemoteButton, { size as remoteButtonSize } from "../components/RemoteButton";
import { useEffect, useState } from "react";
import Messages from "../../ipc/Messages";

const adjustButtonPosForSize = (gridDef, buttonDefs: ButtonDefinition[]) => {
    if(buttonDefs) {
        const maxCols = buttonDefs.find(def => buttonDefs.every(b => b.position.column <= def.position.column)).position.column;
        const maxRows = buttonDefs.find(def => buttonDefs.every(b => b.position.row <= def.position.row)).position.row;

        const colRatio = maxCols > gridDef.columns ? gridDef.columns / maxCols : 1;
        const rowRatio = maxRows > gridDef.rows ? gridDef.rows / maxRows : 1;
      
        const adjustedDefs = buttonDefs.map(def => ({
          ...def,
          position: {
            column: Math.round(def.position.column * colRatio),
            row: Math.round(def.position.row* rowRatio)
          }
        }));

        
        // Resolve collisions recursively
        const resolveCollisions = (def: ButtonDefinition) => {
            const key = `${def.position.column},${def.position.row}`;
            if (gridCellMap[key]) {
                // Collision detected
                const offset = gridCellMap[key].length;
                if(def.position.row + offset > gridDef.rows) {
                    def.position.row = 1;
                    def.position.column += 1;
                    return resolveCollisions(def);
                }

                def.position.row += offset; // Shift the item horizontally
                return resolveCollisions(def); // Recursively check for collisions
            }
            if (!gridCellMap[key]) {
                gridCellMap[key] = [];
            }

            gridCellMap[key].push(def.id);
            return def;
        }

        // Initialize grid cell map
        const gridCellMap = {};

        // Adjust positions and resolve collisions
        const adjustedAndResolvedItems = adjustedDefs.map(item => resolveCollisions(item));

        return adjustedAndResolvedItems;
    }
};

const classes = {
    mainBox: (gridDef) => {
        const columnStyle = Array.from({length: gridDef.columns}, () => `${remoteButtonSize.x}px`).join(" ");
        const rowStyle = Array.from({length: gridDef.rows}, () => `${remoteButtonSize.y}px`).join(" ");
        return {
            width: "500px%",
            height: "calc(100% - 20px)",
            display: "grid",
            gap: "16px",
            gridTemplateColumns: columnStyle,
            gridTemplateRows: rowStyle,
        }
    },
    indicator: (isConnected) => ({
        margin: "8px 8px 8px auto",
        width: "20px",
        height: "20px",
        borderRadius: "20px",
        backgroundColor: isConnected ? "green" : "red"
    }),
    button: ({row, column}) => ({
        cursor: "pointer",
        gridRow: row,
        gridColumn: column
    })
}
interface RemoteProps {
    remoteDefinition: Remote;
}

interface TrapStatus {
    trap: Trap,
    connected: boolean;
}

const Remote = ({ remoteDefinition }: RemoteProps) => {
    const [gridDef, setGridDef] = useState<any>({});
    const [trapStatuses, setTrapStatuses] = useState<TrapStatus[]>([]);
    const [adjustedButtonPositions, setAdjustedButtonPositions] = useState<any>([])

    useEffect(() => {
        const container = document.getElementById("remote-container");
        const rect = container.getBoundingClientRect();

        const columns = Math.floor(rect.width / (remoteButtonSize.x + 16));
        const rows = Math.floor(rect.height / (remoteButtonSize.y + 16));
        setGridDef({columns, rows});

        if(remoteDefinition) {
            const adjustedPositions = adjustButtonPosForSize({columns, rows}, remoteDefinition.buttonDefinitions);
            setAdjustedButtonPositions(adjustedPositions);

            const traps = remoteDefinition.buttonDefinitions.flatMap(b => b.traps);

            setTrapStatuses(traps.map(trap => ({
                trap,
                connected: false
            })));
    
            const onTrapConnected = (trap) => {
                setTrapStatuses(s => {
                    const newStatus = [...s]
                    const status = newStatus.find(s => s.trap.name === trap)
                    if(status) {
                        status.connected = true
                    }
                    
                    return newStatus;
                });
            }
           
            interop.receive(Messages.TrapConnected, onTrapConnected);
    
            const onTrapDisconnected = (trap) => {
                setTrapStatuses(s => {
                    const newStatus = [...s]
                    const status = newStatus.find(s => s.trap.name === trap)
    
                    if(status) {
                        status.connected = false;
                    }
                    
                    return newStatus;
                });
            }
    
            interop.receive(Messages.TrapDisconnected, onTrapDisconnected);
    
            interop.invoke(Messages.OpenShellys, traps);
    
            return () => {
                interop.removeListener(Messages.TrapConnected, onTrapConnected);
                interop.removeListener(Messages.TrapDisconnected, onTrapDisconnected);
                interop.invoke(Messages.DisconnectShellys, traps);
            }
        }
    }, [remoteDefinition]);

    const onButtonClick = async (buttonDefinition: ButtonDefinition) => {
        const promises = buttonDefinition.traps.map((trap) => interop.invoke(Messages.FireTrap, trap.ipAddress));
        await Promise.allSettled(promises);
    };

    return (
        <Box component={Paper} border="1px solid darkGray" height="calc(100% - 20px)">
            <Box sx={classes.indicator(trapStatuses.every(s => s.connected))}/>
            <Box id="remote-container"  sx={classes.mainBox(gridDef)}>
                {
                    adjustedButtonPositions?.map((definition) => (
                        <RemoteButton key={definition.id} onClick={() => onButtonClick(definition)} sx={classes.button(definition.position)}>
                            { definition.text }
                        </RemoteButton>
                    ))
                }
            </Box>
        </Box>
    )
};

export default Remote;