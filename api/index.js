const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/song", require("./song"));
router.use("/playback", require("./playback"));
router.use("/spotify", require("./spotify"));
router.use("/active-playback", require("./active_playback_details"));

router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
