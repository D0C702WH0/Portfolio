require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const models = require("../models");
const getToken = require("../helpers/getToken");
const jwtSecret = process.env.JWT_SECRET;

router
  .route("/")

/// Allows to create a new category ///

  .post((req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin === true) {
        models.category.create(req.body).then(category => {
          res.status(201).send(category);
        });
      } else {
        res.sendStatus(403);
      }
    });
  });

module.exports = router;
