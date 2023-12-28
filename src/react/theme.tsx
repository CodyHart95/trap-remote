/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        secondary: true;
    }
}

export const primaryColor = "#FF8D27";
export const secondaryColor = "#AEADAC";
export const contrastColor = "#1A1616";
export const offWhite = "#efefef";
const textPrimary = "#45505B";

export const Theme = {
    palette: {
        primary: {
            main: primaryColor,
            secondary: secondaryColor,
            contrast: contrastColor,
        },
        text: {
            primary: textPrimary,
            secondary: primaryColor,
        },
        error: {
            main: "#BF2308",
        },
        link: {
            main: "#0065D2",
        },
    },
    typography: {
        fontFamily: "Roboto",
        fontSize: 14,
        h1: { fontSize: "20px", fontWeight: "bold", color: textPrimary },
        h2: { fontSize: "16px", color: textPrimary },
        h3: { fontSize: "14px", fontWeight: "bold", color: textPrimary },
        body1: { fontSize: "14px", fontWeight: 400, color: textPrimary },
        body2: { fontSize: "12px", fontWeight: 400, color: "#637381" },
        button: {
            textTransform: "none",
        },
    },
    border: "1px solid #DFE4E8",
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: "contained" },
                    style: {
                        boxShadow:
                            "0px 1px 1px rgba(33, 44, 54, 0.35), inset 0px 2px 0px rgba(255, 255, 255, 0.35)",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "white",
                        padding: "3px 8px",
                        minWidth: "80px",
                    },
                },
                {
                    props: { variant: "secondary" },
                    style: {
                        border: "1px solid #818F9C",
                        boxSizing: "border-box",
                        boxShadow: "0px 1px 1px rgba(33, 44, 54, 0.35)",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "black",
                        backgroundColor: secondaryColor,
                        padding: "3px 8px",
                        minWidth: "80px",
                        ":hover": {
                            backgroundColor: "#E4E6E8",
                        },
                    },
                },
                {
                    props: { variant: "outlined" },
                    style: {
                        fontSize: "14px",
                        borderRadius: "5px",
                        height: "40px",
                        color: primaryColor,
                        border: `1px solid ${primaryColor}`,
                    },
                },
            ],
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: "0px 1px 1px 0.5px rgb(46 91 255 / 15%)",
                },
            },
        },
    },
};

//@ts-ignore
const createRemoteTheme = () => createTheme(Theme);
export default createRemoteTheme;
