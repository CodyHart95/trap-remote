import { Typography, Box, Button } from "@mui/material";

interface PageHeaderProps {
    text: string;
    headerButton?: string;
    onClick?: () => void;
}

const classes = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        borderBottom: "1px solid black"
    }
}

const PageHeader = ({text, headerButton, onClick}: PageHeaderProps) => (
    <Box sx={classes.container}>
        <Typography variant="h3">{text}</Typography>
        {headerButton && <Button onClick={onClick}>{headerButton}</Button>}
    </Box>
);

export default PageHeader;