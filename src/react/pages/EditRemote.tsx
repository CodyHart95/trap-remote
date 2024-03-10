import { Box, Button, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import EditRemoteButtonModal from "../modals/EditRemoteButtonModal";
import Messages from "../../ipc/Messages";
import { DndProvider } from "react-dnd-multi-backend"
import { HTML5toTouch } from "rdndmb-html5-to-touch"
import { useModal } from "../modals/useModal";
import { useDrag, useDrop } from "react-dnd";
import { calculateButtonPosition } from "../utils/buttonHelpers";
import { v4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import TextBox from "../components/TextBox";
import ErrorModal from "../modals/ErrorModal";
import { ButtonType } from "../../enums";
import RemoteButton, { size as remoteButtonSize } from "../components/RemoteButton";
import { light } from "@mui/material/styles/createPalette";

const modalId = "edit-remote-button-modal";
const errorModalId = "edit-remote-error-modal";

const dragItemType = "tool-box-item";

interface DropAreaProps {
    buttonDefinitions: ButtonDefinition[];
    setButtonDefinition: (def: ButtonDefinition) => void;
}

interface DragItemProps {
    buttonDefinition: ButtonDefinition;
    setButtonDefinition: (def: ButtonDefinition) => void;
    isExisting?: boolean;
    style?: object;
}

const classes = {
    mainGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "50px 2fr",
        gap: "16px",
        height: "calc(100vh - 80px)",
        width:"100%"
    },
    dropArea: (columns: number, rows: number) => {

        const columnStyle = Array.from({length: columns}, () => `${remoteButtonSize.x}px`).join(" ");
        const rowStyle = Array.from({length: rows}, () => `${remoteButtonSize.y}px`).join(" ");
        return {
            width: "100%",
            display: "grid",
            gap: "16px",
            gridTemplateColumns: columnStyle,
            gridTemplateRows: rowStyle,
        }
    },
    toolBox: {
        "& > *": {margin: "16px !important"}, 
        gridColumn: 1, 
        gridRow: 2, 
    },
    dragItem: (extraStyles: any, isDragging: boolean) => ({
        opacity: isDragging ? 0.4 : 1,
        ...extraStyles
    }),
    resetButton: {
        gridColumn: 3, 
        justifySelf: "flex-end",
        alignSelf: "flex-end",
        margin: 0,
        padding: 0
    },
    nameBox: {
        background: "white", 
    },
    nameBoxContainer: {
        gridColumn: "1 / span 2"
    },
    dropCell: (row: number, column: number, isOver: boolean, isDragging: boolean) => {
        let border;

        if(isOver) {
            border = "1px dashed black"
        }
        else if(isDragging) {
            border = "1px solid black"
        }

        return {
            gridColumn: column,
            gridRow: row,
            border,
            background: isDragging ? "lightGray" : undefined,
        }
    },
    dragItemCell: (row: number, column: number) => ({
        gridColumn: column,
        gridRow: row
    })
}

const defaultSinglesDef: ButtonDefinition = {
    id: v4(),
    text: "Singles Button",
    buttonType: ButtonType.Singles,
    traps: [],
    position: { column: 0, row: 0 }
}

const defaultDoublesDef: ButtonDefinition = {
    id: v4(),
    text: "Doubles Button",
    buttonType: ButtonType.Doubles,
    traps: [],
    position: { column: 0, row: 0 }
}

const defaultCustomDef: ButtonDefinition = {
    id: v4(),
    text: "Custom Button",
    buttonType: ButtonType.Custom,
    traps: [],
    position: { column: 0, row: 0 }
}

const DragItem = ({buttonDefinition, setButtonDefinition, style, isExisting = false}: DragItemProps) => {
    const { openModalAsync } = useModal();

    const [{ isDragging }, drag] = useDrag(() => ({
        type: dragItemType,
        item: buttonDefinition,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId()
        })
    }));

    const onDoubleClick = useCallback(async (event: any) => {
        if(isExisting) {
            const newValue = await openModalAsync(modalId, buttonDefinition.text, buttonDefinition.traps, buttonDefinition.buttonType);
            event.currentTarget.innerText = newValue.text;

            setButtonDefinition({...buttonDefinition, ...newValue});
        }
    }, [isExisting, openModalAsync]);

    const onClick = (e: any) => {
        e.preventDefault()
    }

    return(
        <RemoteButton ref={drag} 
        id={buttonDefinition.id} 
        sx={classes.dragItem(style, isDragging)} 
        onDoubleClick={onDoubleClick} 
        onClick={onClick}
        >
            {buttonDefinition.text}
        </RemoteButton>
    )
}

const DropCell = ({setButtonDefinition, row, column, children=undefined}) => {
    const { openModalAsync } = useModal();

    const [{canDrop, isOver}, drop] = useDrop(() => ({
        accept: dragItemType,
        drop: (item: ButtonDefinition) => {
            if(item) {

                let newDef = item;

                if(item.id === defaultCustomDef.id || item.id === defaultSinglesDef.id || item.id === defaultDoublesDef.id) {
                    newDef = {
                        id: v4(),
                        buttonType: item.buttonType,
                        text: item.text,
                        traps: item.traps,
                        position: {
                            row,
                            column
                        }
                    }
                }

                setButtonDefinition(newDef);
                
                openModalAsync(modalId, newDef.text, newDef.traps, newDef.buttonType).then((newValue) => {
                    setButtonDefinition({...newDef, ...newValue});
                });
            }
            return ({ name: "remote" })
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver()
        })
    }));

    return (
        <Box ref={drop} sx={classes.dropCell(row, column, isOver, canDrop)}>
            {children}
        </Box>
    )
};

const DropArea = ({buttonDefinitions, setButtonDefinition}: DropAreaProps) => {
    const [gridDef, setGridDef] = useState<any[]>([]);
    let columns = 0;
    let rows = 0;

    if(gridDef[gridDef.length - 1]) {
        columns = gridDef[gridDef.length - 1].column
        rows = gridDef[gridDef.length - 1].row
    }

    const onDropResize = useCallback((e: any) => {
        const dropSize = e.target.getBoundingClientRect();
        const columns = Math.floor(dropSize.height / (remoteButtonSize.x + 16));
        const rows = Math.floor(dropSize.width / (remoteButtonSize.y + 16));

        const grid = [];
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                grid.push({row: i + 1, column: j + 1})
            }
        }

        setGridDef(grid)
    }, [])

    useEffect(() => {
        const dropArea = document.getElementById("drop-area");
        onDropResize({target: dropArea});
    }, [onDropResize]);

    return(
        <>
            <Box component={Paper} sx={classes.toolBox}>
                <DragItem buttonDefinition={defaultSinglesDef} setButtonDefinition={setButtonDefinition} />
                <DragItem buttonDefinition={defaultDoublesDef} setButtonDefinition={setButtonDefinition} />
                <DragItem buttonDefinition={defaultCustomDef} setButtonDefinition={setButtonDefinition} />
            </Box>
            <Box id="drop-area" component={Paper} onResize={onDropResize} sx={classes.dropArea(columns, rows)}>
                {gridDef.map(def => {
                    const buttonDef = buttonDefinitions.find(b => b.position.column === def.column && b.position.row === def.row);

                    if(buttonDef) {
                        return (
                            <Box sx={classes.dragItemCell(def.row, def.column)}>
                                <DragItem isExisting={true} buttonDefinition={buttonDef} setButtonDefinition={setButtonDefinition}/>
                            </Box>
                        )
                    }
                    return <DropCell setButtonDefinition={setButtonDefinition} row={def.row} column={def.column}/>
                })}
            </Box>
        </>
    )
}


const EditRemote = () => {
    const [buttonDefinitions, setButtonDefinitions] = useState<ButtonDefinition[]>([]);
    const [availableTraps, setAvailableTraps] = useState<Trap[]>([]);
    const [name, setName] = useState("");
    const originalButtons = useRef<ButtonDefinition[]>([])


    const { remoteId } = useParams();
    const navigate = useNavigate();
    const { openModal } = useModal();

    const title = remoteId ? "Create Remote" : "Edit Remote";

    useEffect(() => {
        interop.invoke(Messages.LoadTraps).then((traps) => {
            setAvailableTraps(traps);
        });

        interop.invoke(Messages.GetRemote, remoteId).then((remote: Remote) => {
            if(remote) {
                setName(remote.name);
                setButtonDefinitions(remote.buttonDefinitions);
                originalButtons.current = [...remote.buttonDefinitions];
            }
        });
    }, []);

    /*
    TODO:
    Figure out why the button positioning math is wrong
    Delete button methods - Right click menu? Drag off remote area?
    Test Remote?
    Default Remotes - Singles and Doubles
    */

    const setButtonDefinition = useCallback((buttonDefinition: ButtonDefinition) => {
        setButtonDefinitions(defs => {
            const existingDefIndex = defs.findIndex(b => b.id === buttonDefinition.id);

            if(existingDefIndex > -1) {
                defs[existingDefIndex] = buttonDefinition;
            }
            else {
                defs.push(buttonDefinition);
            }

            return [...defs];
        });
    }, [buttonDefinitions])

    const close = () => navigate("../");
    const save = async () => {
        try {
            const remote = {
                name,
                buttonDefinitions
            }
            await interop.invoke(Messages.SaveRemote, remote);
            close();
        }
        catch (err) {
            openModal(errorModalId, `An error occured saving the remote:\n ${err.message}`)
        }
    }

    const onReset = () => {
        setButtonDefinitions([...originalButtons.current]);
    }

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{marginBottom: "24px"}}>
                <Typography variant="h2">{title}</Typography>
                <Box display="flex">
                    <Button variant="contained" onClick={save}>Save</Button>
                    <Button color="error" onClick={close} sx={{marginLeft: "8px"}}>Cancel</Button>
                </Box>
            </Box>
            <Box sx={classes.mainGrid}>
                <TextBox label="Remote Name" value={name} onChange={(e) => setName(e.target.value)} containerProps={{sx: classes.nameBoxContainer}} sx={classes.nameBox}/>
                <Button onClick={onReset} sx={classes.resetButton}>Reset Buttons</Button>
                
                <DndProvider options={HTML5toTouch}>
                    <DropArea buttonDefinitions={buttonDefinitions} setButtonDefinition={setButtonDefinition}/>
                </DndProvider>
            </Box>
            <EditRemoteButtonModal id={modalId} availableTraps={availableTraps}/>
            <ErrorModal id={errorModalId}/>
        </>
    )
};

export default EditRemote;