import { Box, Button } from "@mui/material";
import classes from "./classes";

interface EmptyTabBodyProps {
    buttonText: string;
    onClick: () => void;
}

const EmptyTabBody = ({ buttonText, onClick}: EmptyTabBodyProps) => {
    return (
        <Box sx={classes.list} display="flex" alignItems="center" justifyContent="center">
            <Button variant="contained" onClick={onClick}>{buttonText}</Button>
        </Box>
    )
}

export default EmptyTabBody;