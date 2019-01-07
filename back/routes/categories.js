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
  })

  /// Allows to see all categories ///

  .get((req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        models.category.findAll().then(category => {
          res.status(200).send(category);
        });
      } else {
        res.sendStatus(403);
      }
    });
  })

  /// Allows to remove active status to a category ///

  .delete("/:id", (req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        models.category
          .update(
            {
              isActive: false
            },
            { where: { id: req.params.id } }
          )
          .then(category => {
            res.status(200).send(category);
          });
      } else {
        res.sendStatus(403);
      }
    });
  })

  /// Allows to get all pictures with the same category ///

  .get("/:id/pictures", (req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        models.category
          .findAll({
            where: {
              id: req.params.id
            },
            include: {
              model: photo
            }
          })
          .then(category => {
            res.status(200).send(category);
          });
      } else {
        res.sendStatus(403);
      }
    });
  });

module.exports = router;
