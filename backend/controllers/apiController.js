exports.getData = (req, res) => {
    res.json({ message: 'GET request received' });
};

exports.postData = (req, res) => {
    const data = req.body;
    res.json({ message: 'POST request received', data });
};
