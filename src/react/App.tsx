import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider, Box } from "@mui/material";
import createRemoteTheme, {offWhite} from "./theme";
import CreateCourse from "./pages/CreateCourse";
import RunCourse from "./pages/RunCourse";
import ModalProvider from "./modals/useModal";

const theme = createRemoteTheme();

const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <ModalProvider>
                <Box sx={{backgroundColor: offWhite, padding: "8px"}}>
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<Home/>} />
                            <Route path="/addCourse" element={<CreateCourse/>}/>
                            <Route path="/addCourse/:courseName" element={<CreateCourse/>}/>
                            <Route path="/start/:courseName" element={<RunCourse/>}/>
                        </Routes>
                    </HashRouter>
                </Box>
            </ModalProvider>
        </ThemeProvider>
    )
}

export default App;