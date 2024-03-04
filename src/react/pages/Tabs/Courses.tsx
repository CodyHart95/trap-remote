import {useState, useEffect} from "react";
import Messages from "../../../ipc/Messages";
import { List, ListItem, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classes from "./classes";
import EmptyTabBody from "./EmptyTabBody";

const Home = () => {
    const [courses, setCourses] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        interop.invoke(Messages.LoadCourses, null).then((courses: string[]) => {
            setCourses(courses);
        });
    }, []);

    const onAddCourse = () => {
        navigate("/addCourse");
    };

    const onEditCourse = (courseName: string) => {
        navigate(`/addCourse/${courseName}`);
    }

    const onDelete = (courseName: string) => {
        interop.invoke(Messages.DeleteCourse, courseName);
        const index = courses.findIndex(c => c === courseName);

        if(index > -1) {
            courses.splice(index, 1);
            setCourses([...courses]);
        }
    }

    const onStart = (courseName: string) => {
        navigate(`/start/${courseName}`);
    };

    return (
        <>
            {courses.length === 0 && <EmptyTabBody buttonText="Add Course" onClick={onAddCourse}/>}
            {courses.length > 0 && (
                <List sx={classes.list}>
                {courses.map(course => (
                    <ListItem key={course} sx={classes.listItem}>
                        <Typography>
                            {course}
                        </Typography>
                        <div>
                            <Button sx={{marginRight: "8px"}} variant="contained" onClick={() => onStart(course)}>Start</Button>
                            <Button onClick={() => onEditCourse(course)}>Edit</Button>
                            <Button onClick={() => onDelete(course)} color="error">Delete</Button>
                        </div>
                    </ListItem>
                ))}
            </List>
            )}
        </>
    )
};

export default Home;