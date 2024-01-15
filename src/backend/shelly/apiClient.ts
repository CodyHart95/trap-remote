import axios from "axios";

export const getStatus = async (ipAddress: string) => {
    const res = await axios.get(`${ipAddress}/rpc/Shelly.GetStatus`);

    return res.data;
}

export const toggleSwitch = async (ipAddress: string, switchId: number) => {
    const res = await axios.get(`${ipAddress}/rpc/Switch.Toggle`, { params: { id: switchId } });

    return res.data;
}