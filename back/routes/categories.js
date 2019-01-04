const express = require("express");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../secure/jwtSecret");
const router = express.Router();
const models = require("../models");
const getToken = require("../helpers/getToken");

router
  .route("/")

  .post((req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin == 1) {
        models.category.create(req.body).then(category => {
          res.status(201).send(category);
        });
      } else {
        res.status(403);
      }
    });
  });

module.exports = router;
