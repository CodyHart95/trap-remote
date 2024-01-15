import { getItem, setItem } from "../cache.mjs";

const set = (req, res) => {
    let switchItem = getItem(req.query.id);

    if (!switchItem) {
        switchItem = {
            state: "off"
        }
    }

    const newState = switchItem.state === "on" ? "off" : "on";
    switchItem.state = newState;

    console.log(newState);

    setItem(req.query.id, switchItem);

    return res.status(200).send({ was_on: newState === "off"})
};

export default set;