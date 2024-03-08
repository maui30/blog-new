require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logger");
const cors = require("cors");
const corsOption = require("./config/corsOption");

const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(cors(corsOption));

app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "Publc")));

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
