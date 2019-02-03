let makes;
(() => {
  let makesArray = [
    "Acura",
    "Audi",
    "BMW",
    "Cadillac",
    "Chevrolet",
    "Chrysler",
    "Dodge",
    "Eagle",
    "Ferrari",
    "Ford",
    "Fiat",
    "GMC",
    "Honda",
    "Hummer",
    "Hyundai",
    "Infiniti",
    "Isuzu",
    "Jaguar",
    "Jeep",
    "Kia",
    "Lamborghini",
    "Land rover",
    "Lexus",
    "Lincoln",
    "Lotus",
    "Mazda",
    "Mercedes-benz",
    "Mercury",
    "Mitsubishi",
    "Nissan",
    "Oldsmobile",
    "Peugeot",
    "Porsche",
    "Buick",
    "Sabb",
    "Saturn",
    "Subaru",
    "Suzuki",
    "Toyota",
    "Volkswagon",
    "Volvo"
  ].map(make => {
    return make.toLowerCase();
  });

  makes = {};

  for (let make of makesArray) {
    makes[make] = true;
  }
})();

const fs = require("fs-extra");
const base64Img = require("base64-img");
const vision = require("@google-cloud/vision");
const http = require("http-call").HTTP;

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
      // Performs label detection on the image file
      client
        .labelDetection(filepath)
        .then(results => {
          //   const labels = results[0].labelAnnotations;

          parseCarInfo(
            results[0].labelAnnotations.reduce((acc, item) => {
              if (item.description) {
                acc.push(item.description.toLowerCase());
              }
              return acc;
            }, []),
            res
          );
        })
        .catch(err => {
          console.error("ERROR:", err);
        });

      fs.remove(filepath, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
};

const parseCarInfo = (results, res) => {
  let make;


  for (let detail of results) {
      for (let makeItem of Object.keys(makes)) {
          if (detail.indexOf(makeItem) !== -1) {
              make = detail;
              break;
          }
      }
  }

//   for (let detail of results) {
//     if (makes[detail]) {
//       make = detail;
//     }
//   }

  if (make) {
    const body = http
      .get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${make}/modelyear/2015?format=json`
      )
      .then(response => {
        let responseResults = response.body.Results;
        let model;

        for (let result of responseResults) {
          for (let mod of results) {
            if (
              result.Model_Name &&
              mod.indexOf(result.Model_Name.toLowerCase()) !== -1
            ) {
              model = mod;
            }
          }
        }
        if (model) {
          let response = {
            make: make,
            model: model
          };
          res.json(response);
        } else {
          console.log(results);
          res.json({ make });
        }
      });
  } else {
    console.log(results);
    res.json({ error: "image not understood" });
  }
};

const parseResponse = () => {
  console.log(this);
};

module.exports = getDataFromImage;
