const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

const getDataFromImage = require("./apiRoutes/getDataFromImage");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/client/app.html"));
});

app.get("/app.css", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/app.css"));
});

app.get("/app.js", function(req, res) {
  res.sendFile(path.join(__dirname + "/client/app.js"));
});

app.post("/api/parseimage", (req, res) => {
    getDataFromImage(req, res);
});

app.listen(5000, () => {
  console.log("serving app on port 5000");
});
