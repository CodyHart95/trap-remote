import { getItem } from "../cache.mjs";
import ErrorResponse from "../ErrorResponse.mjs";

const putCode = (req, res) => {
    const existingItem = getItem(req.query.id);

    if(!existingItem) {
        return res.status(404).send(new ErrorResponse("Failed to find script"));
    }

    if(req.query.append) {
        existingItem.code += req.query.code;
    }
    else {
        existingItem.code = req.query.code;
    }

    return res.status(200).send({ len: existingItem.code.length });
};

export default putCode;