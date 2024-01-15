import { getItem } from "../cache.mjs";

const getStatus = (req, res) => {
    const item = getItem(req.query.id);

    return res.status(200).send({ output: item?.state === "on" })
};

export default getStatus;