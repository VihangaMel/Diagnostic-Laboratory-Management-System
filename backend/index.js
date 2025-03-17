const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const routes = require("./src/routes/_index.router");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api/v1/", routes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is listnening on " + port);
});
