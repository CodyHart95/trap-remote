import { getItem, setItem } from "../cache.mjs";

const setConfig = (req, res) => {
    const item = getItem(req.query.id);

    const config = JSON.parse(req.query.config ?? "{}");
    const needRestart = !item.config.enable && config.enable;

    item.config = req.query.config;

    setItem(req.query.id, item);

    return res.status(200).send({ restart_required: needRestart });
};

export default setConfig;