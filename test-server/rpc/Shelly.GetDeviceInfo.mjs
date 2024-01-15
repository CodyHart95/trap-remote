const getDeviceInfo = (req, res) => {

    return res.status(200).send({
        id: "test-server-shelly",
        mac: "somemacaddress",
        model: "some model number",
        gen: 2
    });
};

export default getDeviceInfo;