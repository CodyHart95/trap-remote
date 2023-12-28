import { Box, OutlinedInput, InputLabel, Typography, OutlinedInputProps } from "@mui/material";
import styled from "@emotion/styled";

const Label = styled(InputLabel)`
    color: black;
`;

interface TextBoxProps extends OutlinedInputProps {
    label: string;
    helpertext?: string;
}

const TextBox = (props: TextBoxProps) => (
    <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
        <Label htmlFor={props.id} sx={{ fontWeight: "Bold" }}>
            {props.label}
        </Label>
        <OutlinedInput {...props} size="small" fullWidth notched={false} />
        <Typography variant="body2" sx={(theme) => ({ color: theme.palette.error.main })}>
            {props.helpertext}
        </Typography>
    </Box>
);

export default TextBox;
