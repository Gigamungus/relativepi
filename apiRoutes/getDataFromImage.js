
const getDataFromImage = (req, res) => {
    let data = req.body.image;
    console.log(data.substr(0, 100));
    
};

module.exports = getDataFromImage;
