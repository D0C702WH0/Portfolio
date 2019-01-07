require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const models = require("../models");
const jwtSecret = process.env.JWT_SECRET;

router

  .post("/signup", (req, res) => {
    const { password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) res.sendStatus(500);
      else {
        const adminData = {
          ...req.body,
          password: hash,
          isAdmin:true
        };
        models.admin.create(adminData).then(admin => {
          res.status(200).send(admin);
        });
      }
    });
  })

  .post("/signin", (req, res) => {
    const { password, email } = req.body;
    models.admin
      .findOne({
        where: {
          email
        }
      })
      .then(admin => {
        if (admin) {
          bcrypt.compare(password, admin.password, (err, match) => {
            if (err || !match) res.sendStatus(403);
            else {
              const tokenInfo = {
                id: admin.id,
                name: admin.name,
                isAdmin: admin.isAdmin
              };
              const token = jwt.sign(tokenInfo, jwtSecret, { expiresIn: "1h" });
              res.header("Access-Control-Expose-Headers", "x-access-token");
              res.set("x-access-token", token);
              res.status(200);
              res.send(admin);
            }
          });
        } else {
          res.sendStatus(404);
        }
      });
  });

module.exports = router;
