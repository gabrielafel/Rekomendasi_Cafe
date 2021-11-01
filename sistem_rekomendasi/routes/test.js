const express = require('express');

const router = express.Router();

//abis login pindah home
router.get("/", (req, res) =>
  res.render("pages/home", { })
);

router.get("/test", (req, res) => 
  res.render("pages/test"));

module.exports = router;