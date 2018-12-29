const express = require("express");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../secure/jwtSecret");
const router = express.Router();
const models = require("../models");
const getToken = require("../helpers/getToken");

router.post("/", (req, res) => {
  const token = getToken(req);
  jwt.verify(token, jwtSecret, err => {
    if (!err) {
      models.photo.create(req.body).then(photo => {
        res.status(201).send(photo);
      });
    } else {
      res.status(403);
    }

    // !!!!!AJOUTER AWS!!!!! //
  });
});

module.exports = router;
