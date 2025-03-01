const express = require("express");
const router = express.Router({ mergeParams: true });

router.post("/", (req, res) => {
    res.send("Create a review");
});

module.exports = router;
