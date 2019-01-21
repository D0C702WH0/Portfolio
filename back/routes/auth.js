require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const models = require("../models");
const getToken = require("../helpers/getToken");
const jwtSecret = process.env.JWT_SECRET;
const validApiKey = process.env.API_KEY;

router

  /// Allows to create a new Admin ///

  .post("/signup", (req, res) => {
    const { APIKEY } = req.query;
    const { password } = req.body;
    if (APIKEY === validApiKey) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) res.sendStatus(500);
        else {
          const adminData = {
            ...req.body,
            password: hash,
            isAdmin: true
          };
          models.admin.create(adminData).then(admin => {
            res.status(200).send(admin);
          });
        }
      });
    } else {
      res.sendStatus(403);
    }
  })

  /// Allows the Admin to log in ///

  .post("/signin", async (req, res) => {
    const { password, username } = req.body;

    data = await models.admin.findOne({
      where: {
        email: username,
        isAdmin: 1
      }
    });

    if (data) {
      bcrypt.compare(password, data.password, (err, match) => {
        if (err || !match) res.sendStatus(403);
        else {
          const tokenInfo = {
            id: data.id,
            name: data.name,
            isAdmin: data.isAdmin
          };
          const token = jwt.sign(tokenInfo, jwtSecret, { expiresIn: "1h" });
          res.header("Access-Control-Expose-Headers", "x-access-token");
          res.set("x-access-token", token);
          res.status(200);
          res.send(data);
        }
      });
    } else {
      console.log("PROUT");

      res.sendStatus(404);
    }
  })

  /// Allows to see all Admins ///

  .get("/users", (req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        models.admin.findAll().then(admin => {
          res.status(200).send(admin);
        });
      } else {
        res.sendStatus(403);
      }
    });
  })

  /// Allows to remove access to an Admin ///

  .delete("/users/:id", (req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        models.admin
          .update(
            {
              isAdmin: false
            },
            { where: { id: req.params.id } }
          )
          .then(admin => {
            res.status(200).send(admin);
          });
      } else {
        res.sendStatus(403);
      }
    });
  });

module.exports = router;
