import ErrorResponse from "../ErrorResponse.mjs";
import { getItem } from "../cache.mjs";

const start = (req, res) => {
    const item = getItem(req.query.id);

    if(item.running) {
        return res.status(200).send({ was_running: true })
    }

    if(!item.code) {
        return res.status(500).send(new ErrorResponse("Script has no code to execute"));
    }

    item.running = true;

    return res.status(200).send({ was_running: false });

};

export default start;