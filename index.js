const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(cors());

// Mount on API
app.use("/api", require("./api"));
app.use(bodyParser.json());

// const syncDB = () => db.sync({force: true});
const syncDB = () => db.sync({ force: true });

const serverRun = () => {
  app.listen(process.env.PORT, () => {
    console.log(`Live on port: http://localhost:${process.env.PORT}/`);
  });
};

syncDB();
serverRun();

module.exports = app;
