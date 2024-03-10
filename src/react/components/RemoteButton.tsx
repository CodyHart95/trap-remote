import { styled } from "@mui/material";

type RemoteButtonProps = {
    buttonDefinition?: ButtonDefinition,
    shouldPosition?: boolean,
}

export const size = {x: 150, y: 50}

const RemoteButton = styled("div")<RemoteButtonProps>((props) => ({
    background: props.theme.palette.primary.main,
    boxShadow: "0px 1px 1px rgba(33, 44, 54, 0.35), inset 0px 2px 0px rgba(255, 255, 255, 0.35)",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    color: "white",
    width: size.x,
    height: size.y,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Roboto",
}));

export default RemoteButton;