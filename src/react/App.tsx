import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider, Box } from "@mui/material";
import createRemoteTheme, {offWhite} from "./theme";
import CreateCourse from "./pages/CreateCourse";
import RunCourse from "./pages/RunCourse";
import ModalProvider from "./modals/useModal";
import EditRemote from "./pages/EditRemote";

const theme = createRemoteTheme();

const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <ModalProvider>
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<Home/>} />
                            <Route path="/addCourse" element={<CreateCourse/>}/>
                            <Route path="/addCourse/:courseName" element={<CreateCourse/>}/>
                            <Route path="/start/:courseName" element={<RunCourse/>}/>
                            <Route path="/remote" element={<EditRemote/>}/>
                            <Route path="/remote/:remoteId" element={<EditRemote/>}/>
                        </Routes>
                    </HashRouter>
            </ModalProvider>
        </ThemeProvider>
    )
}

export default App;