import {useState, ReactNode} from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Courses from "./Tabs/Courses";
import Traps from "./Tabs/Traps";
import Remotes from "./Tabs/Remotes";

interface TabProps {
    children: ReactNode;
    tab: number;
    currentTab: number;
}

const TabPannel = ({ children, tab, currentTab }: TabProps) => (
    <div hidden={tab !== currentTab}>
        {children}
    </div>
)

const Home = () => {
    const [value, setValue] = useState(0);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} aria-label="basic tabs example">
                <Tab label="Courses"/>
                <Tab label="Traps"/>
                <Tab label="Remotes"/>
                </Tabs>
            </Box>
            <TabPannel currentTab={value} tab={0}>
                <Courses/>
            </TabPannel>
            <TabPannel currentTab={value} tab={1}>
                <Traps/>
            </TabPannel>
            <TabPannel currentTab={value} tab={2}>
                <Remotes/>
            </TabPannel>
        </Box>
    )
};

export default Home;