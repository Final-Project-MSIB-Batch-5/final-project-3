const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Final Project 3");
});
app.use(routes);

module.exports = app;
