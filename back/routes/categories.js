require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const models = require("../models");
const getToken = require("../helpers/getToken");
const jwtSecret = process.env.JWT_SECRET;

router
  .route("/")

  /// Allows to create a new category as an admin///

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

  /// Allows to see all categories as an admin ///

  .get((req, res) => {
    console.log("VA DANS CATEGORIES");
    
  const token = req.headers.authorization ? getToken(req) : req.headers["x-access-token"];
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        console.log("RECUPERE DECODE");
        
        models.category.findAll().then(category => {
          res.status(200).send(category);
          console.log("CATEGORY", category);
          
        });
      } else {
        res.sendStatus(403);
      }
    });
  });

/// Allows to remove active status to a category as an admin ///

router.route("/:id")

.get((req, res) => {
  const token = req.headers.authorization
    ? getToken(req)
    : req.headers["x-access-token"];
  jwt.verify(token, jwtSecret, (err, decode) => {
    if (!err && decode.isAdmin === true) {
      models.category.findOne().then(category => {
        res.status(200).send(category);
      });
    } else {
      res.sendStatus(403);
    }
  });
})

.delete((req, res) => {
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
});

/// Allows to get all active pictures with the same category ///

router.get("/:id/pictures", (req, res) => {
  models.category
    .findAll({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: photo,
          where: { isActive: true }
        }
      ]
    })
    .then(category => {
      res.status(200).send(category);
    });
});

module.exports = router;
