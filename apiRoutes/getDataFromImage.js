const fs = require('fs-extra')
const base64Img = require("base64-img");
const vision = require("@google-cloud/vision");

// Creates a client
const client = new vision.ImageAnnotatorClient();











let count = 0;

const getDataFromImage = (req, res) => {
    let data = req.body.image;
    count++;
    base64Img.img(data, "tempDataStorage", `${count}`, (err, filepath) => {
        if (err) {
            console.log(err);
        } else {

            console.log("started working");
            // Performs label detection on the image file
            client
                .labelDetection(filepath)
                .then(results => {
                    console.log("got results");
                    const labels = results[0].labelAnnotations;

                    console.log("Labels:");
                    labels.forEach(label => console.log(label.description));
                })
                .catch(err => {
                    console.error("ERROR:", err);
                });



            fs.remove(filepath, err => {
                console.log("removed file");
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    

    res.send("working");
};

module.exports = getDataFromImage;
