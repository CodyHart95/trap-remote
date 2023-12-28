import path from "path";
import { existsSync} from "fs";
import fs from "fs/promises";
import { app, ipcMain } from "electron"
import Messages from "../ipc/Messages"

interface DataStorage {
    courses: {
        [course: string]: Station[]
    }
}

const storagePath = path.join(app.getAppPath(), "storage.json");

let data: DataStorage = {
    courses: {}
} as DataStorage;

export const initialize = () => {
    ipcMain.handle(Messages.AddStation, (_, station: Station) => addStation(station));
    ipcMain.handle(Messages.UpdateStation, (_, station: Station) => updateStation(station));
    ipcMain.handle(Messages.SaveCourse, (_, course) => saveCourse(course));
    ipcMain.handle(Messages.LoadCourses, () => loadCourses());
    ipcMain.handle(Messages.DeleteCourse, (_, courseName: string) => deleteCourse(courseName));
    ipcMain.handle(Messages.LoadStations, (_, courseName: string) =>  loadCourseStations(courseName));

    loadData();
};

const loadData = async () => {
    if(existsSync(storagePath)) {
        const dataString = await fs.readFile(storagePath, "utf-8");
        data = JSON.parse(dataString)
        return data;
    }

    return {};
}

const saveData = async () => {
    const dataString = JSON.stringify(data);
    await fs.writeFile(storagePath, dataString);
}

const addStation = async (station: Station) => {
    if(!data.courses[station.course]?.length) {
        data.courses[station.course] = [];
    }

    data.courses[station.course].push(station);

    saveData();
};

const updateStation = async (station: Station) => {
    if(!data.courses[station.course]) {
        return;
    }

    data.courses[station.course][station.number] = station;
}

const saveCourse = async (course: Course) => {
    data.courses[course.name] = course.stations;

    await saveData();
}

const deleteCourse = async (courseName: string) => {
    delete data.courses[courseName];

    await saveData();
}

const loadCourses = async () => {
    if(data.courses) {
        return Object.keys(data.courses);
    }

    return []
}

const loadCourseStations = async (courseName: string) => data.courses[courseName] || [];
