import {useState, useEffect} from "react";
import Messages from "../../ipc/Messages";
import PageHeader from "../components/PageHeader";
import { List, ListItem, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const classes = {
    courseList: {
        overflow: "auto",
        height: "calc(100vh - 85px)"
    },
    courseListItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    }
}

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
            <PageHeader text="Courses" headerButton={courses && "Add Course"} onClick={onAddCourse}/>
            {!courses && <Button variant="contained" onClick={onAddCourse}>Add Course</Button>}
            {courses && (
                <List sx={classes.courseList}>
                {courses.map(course => (
                    <ListItem key={course} sx={classes.courseListItem}>
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