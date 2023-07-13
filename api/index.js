const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/song", require("./song"));
router.use("/playback", require("./playback"));
// router.use("/callback", require("./callback"));

router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
