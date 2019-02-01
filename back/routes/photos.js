require("dotenv").config();
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const express = require("express");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const router = express.Router();
const models = require("../models");
const getToken = require("../helpers/getToken");
const s3Password = process.env.AWS_KEY;
const s3Id = process.env.AWS_ID;
const jwtSecret = process.env.JWT_SECRET;
const bucket = process.env.BUCKET
aws.config.update({
  secretAccessKey: s3Password,
  accessKeyId: s3Id
});

const s3 = new aws.S3({ params: { Bucket: bucket } });

router
  .route("/")

  /// Allows to get all pictures, active or not, as an admin, including their categories///

  .get((req, res) => {
    const token = req.headers["x-access-token"];
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        console.log("OFFSET", req.query._start);

        models.photo
          .findAndCountAll({
            offset: req.query._start,
            limit: 10,
            include: [
              {
                model: models.category
              }
            ]
          })
          .then(photo => {
            res
              .status(200)
              .header("Content-Range", `photo 0-10/${photo.count}`)
              .header("X-Total-Count", photo.count)
              .send(photo.rows);
          });
      }
      /// Allows to get all active pictures and associated categories for non Admin ///
      else if (!token) {
        models.photo
          .findAndCountAll({
            offset: req.query.start,
            limit: 10,
            where: { isActive: true },
            include: [
              {
                model: models.category
              }
            ]
          })
          .then(photo => {
            res
              .status(200)
              .header("Content-Range", `photo 0-10/${photo.count}`)
              .header("X-Total-Count", photo.count)
              .send(photo.rows);
          });
      } else {
        res.sendStatus(403);
      }
    });
  })

  /// Allows to post a new photo as an admin ///

  .post((req, res) => {
    const token = req.headers["x-access-token"];
    buf = new Buffer(
      req.body.photo[0].src.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    var Data = {
      Key: req.body.photo[0].title,
      Body: buf,
      ContentEncoding: "base64",
      ACL: "public-read"
    };
    s3.upload(Data, function(err, data) {
      if (err) {
        console.log(`Error uploading data: ${err} `);
      } else {
        jwt.verify(token, jwtSecret, (err, decode) => {
          if (
            !err &&
            data.Location &&
            decode.isAdmin &&
            decode.isAdmin === true
          ) {
            const photo = {
              id: null,
              isActive: req.body.isActive,
              description: req.body.description,
              name: req.body.name,
              path: data.Location
            };

            models.photo.create(photo).then(pix => {
              models.category
                .findAll({
                  where: {
                    id: {
                      [op.or]: req.body.id
                    }
                  }
                })
                .then(categories => {
                  pix
                    .setCategories(categories)
                    .then(() => res.status(200).send("ok"));
                });
            });
          } else {
            res.sendStatus(403);
          }
        });
      }
    });
  });

router
  .route("/:id")

  .get((req, res) => {
    const token = req.headers.authorization
      ? getToken(req)
      : req.headers["x-access-token"];
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin === true) {
        models.photo.findOne().then(photo => {
          res.status(200).send(photo);
        });
      } else {
        res.sendStatus(403);
      }
    });
  })
  /// Allows to change active status to a photo as an admin ///

  .put((req, res) => {
    const token = req.headers.authorization
      ? getToken(req)
      : req.headers["x-access-token"];
    const toggleActive = req.body.isActive;
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        models.photo
          .update(
            {
              isActive: toggleActive
            },
            { where: { id: req.params.id } }
          )
          .then(photo => {
            res.status(200).send(photo);
          });
      } else {
        res.sendStatus(403);
      }
    });
  });

module.exports = router;
