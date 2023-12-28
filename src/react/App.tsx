import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider, Box } from "@mui/material";
import createRemoteTheme, {offWhite} from "./theme";
import CreateCourse from "./pages/CreateCourse";

const theme = createRemoteTheme();

const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{backgroundColor: offWhite, padding: "8px"}}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/addCourse" element={<CreateCourse/>}/>
                        <Route path="/addCourse/:courseName" element={<CreateCourse/>}/>
                    </Routes>
                </HashRouter>
            </Box>
        </ThemeProvider>
    )
}

export default App;