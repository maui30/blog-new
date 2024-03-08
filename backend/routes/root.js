const express = require("express");
const router = express.Router();

router.route("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

module.exports = router;
