import { Box, Paper } from "@mui/material";
import RemoteButton, { size as remoteButtonSize } from "../components/RemoteButton";
import { useEffect, useState } from "react";
import Messages from "../../ipc/Messages";

const classes = {
    mainBox: (gridDef) => {
        const columnStyle = Array.from({length: gridDef.columns}, () => `${remoteButtonSize.x}px`).join(" ");
        const rowStyle = Array.from({length: gridDef.rows}, () => `${remoteButtonSize.y}px`).join(" ");
        return {
            width: "100%",
            height: "100%",
            display: "grid",
            gap: "16px",
            gridColumn: "2 / span 2",
            gridTemplateColumns: columnStyle,
            gridTemplateRows: rowStyle,
        }
    },
    button: ({row, column}) => ({
        cursor: "pointer",
        gridRow: row,
        gridColumn: column
    })
}
interface RemoteProps {
    remoteDefinition: Remote;
}

const Remote = ({ remoteDefinition }: RemoteProps) => {
    const [gridDef, setGridDef] = useState<any>({});

    useEffect(() => {
        const container = document.getElementById("remote-container");
        const rect = container.getBoundingClientRect();

        const columns = Math.floor(rect.width / (remoteButtonSize.x + 16));
        const rows = Math.floor(rect.height / (remoteButtonSize.y + 16));
        setGridDef({columns, rows});
    }, [remoteDefinition]);

    const onButtonClick = async (buttonDefinition: ButtonDefinition) => {
        const promises = buttonDefinition.traps.map((trap) => interop.invoke(Messages.FireTrap, trap.ipAddress));
        await Promise.allSettled(promises);
    };

    return (
        <Box id="remote-container" component={Paper} sx={classes.mainBox(gridDef)}>
            {
                remoteDefinition.buttonDefinitions.map((definition) => (
                    <RemoteButton onClick={() => onButtonClick(definition)} sx={classes.button(definition.position)}>
                        { definition.text }
                    </RemoteButton>
                ))
            }
        </Box>
    )
};

export default Remote;