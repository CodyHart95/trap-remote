import { getItem, setItem, getLength } from "../cache.mjs";

const create = (req, res) => {
    let name = req.query.name
    const id = getLength() + 1
    if(!name) {
        name = `script_${id}`;
    }

    const item = getItem(req.query.id) ?? {};

    if(!item.config) {
        item.config = {
            name: "",
            id: id,
            enable: false
        }
    }

    item.config.name = name;
    setItem(id, item);

    return res.status(200).send({ id });
};

export default create;