import path from "path";
import { existsSync} from "fs";
import fs from "fs/promises";
import { app } from "electron"
import Messages from "../ipc/Messages"
import { handle } from "./ipc";

interface DataStorage {
    courses: {
        [course: string]: Station[]
    };
    traps: Trap[];
    remotes: Remote[];
}

const storagePath = path.join(app.getAppPath(), "storage.json");

let data: DataStorage = {
    courses: {}
} as DataStorage;

export const initialize = () => {
    handle(Messages.AddStation, addStation);
    handle(Messages.UpdateStation, updateStation);
    handle(Messages.SaveCourse, saveCourse);
    handle(Messages.LoadCourses, loadCourses);
    handle(Messages.DeleteCourse, deleteCourse);
    handle(Messages.LoadStations, loadCourseStations);
    handle(Messages.LoadTraps, loadTraps);
    handle(Messages.SaveTrap, saveTrap);
    handle(Messages.DeleteTrap, deleteTrap);
    handle(Messages.LoadRemotes, loadRemotes);
    handle(Messages.GetRemote, getRemote);
    handle(Messages.SaveRemote, saveRemote);
    handle(Messages.DeleteRemote, deleteRemote);

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
    const dataString = JSON.stringify(data, null, 2);
    await fs.writeFile(storagePath, dataString);
}

const addStation = async (station: Station) => {
    if(!data.courses[station.course]?.length) {
        data.courses[station.course] = [];
    }

    data.courses[station.course].push(station);

    await saveData();
};

const updateStation = async (station: Station) => {
    if(!data.courses[station.course]) {
        return;
    }

    data.courses[station.course][station.number] = station;
    await saveData();
}

const saveCourse = async (course: Course) => {
    data.courses[course.name] = course.stations;

    await saveData();
}

const deleteCourse = async (courseName: string) => {
    delete data.courses[courseName];

    await saveData();
}

const loadCourses = () => {
    if(data.courses) {
        return Object.keys(data.courses);
    }

    return []
}

const loadCourseStations = (courseName: string) => data.courses[courseName] || [];

const loadTraps = () => data.traps || [];

const saveTrap = async (trap: Trap) => {
    if(!data.traps) {
        data.traps = [];
    }

    const trapIndex = data.traps.findIndex(d => d.name === trap.name);

    if(trapIndex > -1) {
        data.traps[trapIndex] = trap;
    }
    else {
        data.traps.push(trap);
    }

    await saveData();

    return data.traps;
}

const deleteTrap = async (trap: Trap) => {
    const trapIndex = data.traps.findIndex(d => d.name === trap.name);

    if(trapIndex > -1) {
        data.traps.splice(trapIndex);
        await saveData();
    }

    return data.traps || [];
}

const loadRemotes = () => data.remotes || [];

const getRemote = (remoteId: string) => {
    if(!data.remotes) {
        data.remotes = [];
    }

    let remote = data.remotes.find(r => r.name === remoteId);

    if(!remote) {
        remote = {
            name: "",
            buttonDefinitions: []
        }
    }

    return remote;
}

const saveRemote = async (remote: Remote) => {
    if(!data.remotes) {
        data.remotes = []
    }

    const remoteIndex = data.remotes.findIndex(r => r.name === remote.name);

    if(remoteIndex > -1) {
        data.remotes[remoteIndex] = remote;
    }
    else {
        data.remotes.push(remote);
    }

    await saveData();

    return data.remotes;
}

const deleteRemote = async (remote: Remote) => {
    const remoteIndex = data.remotes.findIndex(r => r.name === remote.name);

    if(remoteIndex > -1) {
        data.remotes.splice(remoteIndex);
        await saveData();
    }

    return data.remotes || [];
}
