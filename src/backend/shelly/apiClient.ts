import axios from "axios";
import { ShellyScriptConfig, ShellyScriptUpdateConfig } from "./types";

export const getStatus = async (ipAddress: string) => {
    const res = await sendRequest(`${ipAddress}/rpc/Shelly.GetStatus`);

    return res.data;
}

export const toggleSwitch = async (ipAddress: string, switchId: number) => {
    const res = await sendRequest(`${ipAddress}/rpc/Switch.Toggle`, { id: switchId });

    return res.data;
}

export const listScripts = async (ipAddress: string): Promise<ShellyScriptConfig[]> => {
    const res = await sendRequest(`${ipAddress}/rpc/Script.List`);
    console.log(res);
    return res.data?.scripts || [];
}

export const updateScriptConfig = async (ipAddress: string, scriptId: number, config: ShellyScriptUpdateConfig) => {
    const res = await sendRequest(`${ipAddress}/rpc/Script.SetConfig`, {
        id: scriptId,
        config
    });

    return res.data;
}

export const startScript = async (ipAddress: string, scriptId: number) => {
    const res = await sendRequest(`${ipAddress}/rpc/Script.Start`, { id: scriptId });

    return res.data;
}

export const createScript = async (ipAddress: string, scriptName: string) => {
    const res = await sendRequest(`${ipAddress}/rpc/Script.Create`, { name: scriptName })

    return res.data;
}

export const putScriptCode = async (ipAddress: string, scriptId: number, scriptCode: string) => {
    const uploadParts = scriptCode.match(/.{1,1024}/g);

    try {
        let append = false;
        for(const uploadPart of uploadParts){
            await sendRequest(`${ipAddress}/rpc/Script.PutCode`, {id: scriptId, code: uploadPart, append});
            append = true;
        }
    }
    catch(err) {
        console.log(err);
    }
}

const sendRequest = async (url: string, params?: any) => {
    if(params) {
        const paramString = Object.keys(params).map((key) => {
            if(typeof params[key] === "string") {
                return `${key}="${params[key]}"`;
            }

            if(typeof params[key] === "number" || typeof params[key] === "boolean") {
                return `${key}=${params[key]}`
            }

            const p = JSON.stringify(params[key]);
            return `${key}=${p}`;
        }).join("&");

        url = `${url}?${paramString}`
    }

    return await axios.get(url);
}