import { getItem } from "../cache.mjs";
import ErrorResponse from "../ErrorResponse.mjs";

const evaluate = (req, res) => {
    const item = getItem(req.query.id);

    if(!item.running) {
        return res.status(500).send(new ErrorResponse("Script not running"));
    }

    const F = new Function(item.code);

    try {
        const result = F();
        return res.status(200).send({ result })
    }
    catch(err) {
        return res.status(500).send(new ErrorResponse(err.message));
    }
};

export default evaluate;