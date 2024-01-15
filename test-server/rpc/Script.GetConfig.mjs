import { getItem } from "../cache.mjs";

const getConfig = (req, res) => {
    const item = getItem(req.query.id);

    return res.status(200).send(item.config)
};

export default getConfig;