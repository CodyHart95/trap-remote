import { Box, Button, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EditRemoteButtonModal from "../modals/EditRemoteButtonModal";
import Messages from "../../ipc/Messages";
import { DndProvider } from "react-dnd-multi-backend"
import { HTML5toTouch } from "rdndmb-html5-to-touch"
import { useModal } from "../modals/useModal";
import { XYCoord, useDrag, useDrop } from "react-dnd";
import { calculateButtonPosition } from "../utils/buttonHelpers";
import { v4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import TextBox from "../components/TextBox";
import ErrorModal from "../modals/ErrorModal";
import { ButtonType } from "../../enums";

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

const defaultSinglesDef: ButtonDefinition = {
    id: v4(),
    text: "Singles Button",
    buttonType: ButtonType.Singles,
    traps: [],
    position: { x: 0, y: 0 }
}

const defaultDoublesDef: ButtonDefinition = {
    id: v4(),
    text: "Doubles Button",
    buttonType: ButtonType.Doubles,
    traps: [],
    position: { x: 0, y: 0 }
}

const defaultCustomDef: ButtonDefinition = {
    id: v4(),
    text: "Custom Button",
    buttonType: ButtonType.Custom,
    traps: [],
    position: { x: 0, y: 0 }
}

const DragItem = ({buttonDefinition, setButtonDefinition, style, isExisting = false}: DragItemProps) => {
    const boundingBox = useRef(null);
    const lastPos = useRef<XYCoord>({} as XYCoord);
    const { openModalAsync } = useModal();

    const [{ isDragging }, drag] = useDrag(() => ({
        type: dragItemType,
        item: buttonDefinition,
        isDragging: (monitor) => {
            const currPos = monitor.getClientOffset();
            if(currPos) {
                lastPos.current = currPos;
            }

            return Boolean(monitor.getItem());
        },
        end: async (item, monitor) => {
            const dropResult = monitor.getDropResult<ButtonDefinition>();

            if(item && dropResult) {
                const dropArea = document.getElementById("drop-area");
                const dropAreaRect = dropArea.getBoundingClientRect();

                const itemX = lastPos.current.x;
                const itemY = lastPos.current.y;

                const relativePositionX = itemX - dropAreaRect.left;
                const relativePositionY = itemY - dropAreaRect.top;

                // Calculate percentage position
                const percentagePositionX = (relativePositionX / dropAreaRect.width) * 100;
                const percentagePositionY = (relativePositionY / dropAreaRect.height) * 100;

                buttonDefinition.position = {x: percentagePositionX, y: percentagePositionY};
                setButtonDefinition(buttonDefinition);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId()
        })
    }));

    const onDoubleClick = useCallback(async (event: any) => {
        if(isExisting) {
            const newValue = await openModalAsync(modalId, buttonDefinition.text, buttonDefinition.traps);
            event.currentTarget.innerText = newValue.text;

            setButtonDefinition({...buttonDefinition, ...newValue});
        }
    }, [isExisting]);

    const onClick = (e: any) => {
        e.preventDefault()
    }

    const combinedRef = (el: any) => {
        drag(el);
        if(el) {
            boundingBox.current = el.getBoundingClientRect();
        }
    }

    return(
        <Button ref={combinedRef} variant="contained" sx={{opacity: isDragging ? 0.4 : 1, ...style}} onDoubleClick={onDoubleClick} onClick={onClick}>
            {buttonDefinition.text}
        </Button>
    )
}

const DropArea = ({buttonDefinitions, setButtonDefinition}: DropAreaProps) => {
    const dropArea = useRef(null);
    const [{canDrop, item}, drop] = useDrop(() => ({
        accept: dragItemType,
        drop: () => ({ name: "remote" }),
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            item: monitor.getItem(),
        })
    }));

    const dropStyles = useMemo(() => ({
        borderStyle: item && "dashed",
        background: canDrop && "lightGray",
    }), [item, canDrop]);

    return(
        <Box display="flex" width="100%" height="85%" gap="16px">
            <Box component={Paper} width="30%" maxWidth="200px" sx={{"& > *": {marginTop: "16px", marginLeft: "16px"}}}>
                <DragItem buttonDefinition={defaultSinglesDef} setButtonDefinition={setButtonDefinition} />
                <DragItem buttonDefinition={defaultDoublesDef} setButtonDefinition={setButtonDefinition} />
                <DragItem buttonDefinition={defaultCustomDef} setButtonDefinition={setButtonDefinition} />
            </Box>
            <Box id="drop-area" ref={drop} component={Paper} width="70%" sx={dropStyles} maxWidth="460px">
                {buttonDefinitions.map((d) => {
                    if(dropArea.current) {
                        const buttonPos = calculateButtonPosition(dropArea.current, d);
                        const dragClass = {
                            left: `${buttonPos.x}px`,
                            top: `${buttonPos.y}px`,
                            position: "relative"
                        }
                        return <DragItem isExisting={true} buttonDefinition={d} setButtonDefinition={setButtonDefinition} style={dragClass}/>
                    }
                })}
            </Box>
        </Box>
    )
}


const EditRemote = () => {
    const [buttonDefinitions, setButtonDefinitions] = useState<ButtonDefinition[]>([]);
    const [availableTraps, setAvailableTraps] = useState<Trap[]>([]);
    const [name, setName] = useState("");
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

    const setButtonDefinition = (buttonDefinition: ButtonDefinition) => {
        const existingDefIndex = buttonDefinitions.findIndex(b => b.id === buttonDefinition.id);

        if(existingDefIndex > -1) {
            buttonDefinitions[existingDefIndex] = buttonDefinition;
        }
        else {
            buttonDefinitions.push(buttonDefinition);
        }

        setButtonDefinitions([...buttonDefinitions]);
    }

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

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{marginBottom: "24px"}}>
                <Typography variant="h2">{title}</Typography>
                <Box display="flex">
                    <Button variant="contained" onClick={save}>Save</Button>
                    <Button color="error" onClick={close} sx={{marginLeft: "8px"}}>Cancel</Button>
                </Box>
            </Box>
            <Box height="calc(100vh - 80px)" width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <TextBox label="Remote Name" value={name} onChange={(e) => setName(e.target.value)} sx={{background: "white", maxWidth: "300px", marginBottom: "16px"}}/>
                <DndProvider options={HTML5toTouch}>
                    <DropArea buttonDefinitions={buttonDefinitions} setButtonDefinition={setButtonDefinition}/>
                </DndProvider>
                <EditRemoteButtonModal id={modalId} availableTraps={availableTraps}/>
                <ErrorModal id={errorModalId}/>
            </Box>
        </>
    )
};

export default EditRemote;