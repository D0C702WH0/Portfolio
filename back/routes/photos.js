require("dotenv").config();
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const express = require("express");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const router = express.Router();
const models = require("../models");
const getToken = require("../helpers/getToken");
const getFileExtension = require("../helpers/getFileExtension");
const s3Password = process.env.AWS_KEY;
const s3Id = process.env.AWS_ID;
const jwtSecret = process.env.JWT_SECRET;

aws.config.update({
  secretAccessKey: s3Password,
  accessKeyId: s3Id
});

const s3 = new aws.S3();

const storage = multerS3({
  s3: s3,
  acl: "public-read",
  bucket: "sideprojectbp",
  metadata: function(req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function(req, file, cb) {
    cb(null, `${Date.now()}.${getFileExtension(file.mimetype)}`);
  }
});

const upload = multer({
  dest: "tmp/",
  storage,
  fileFilter: (req, file, cb) => {
    if (
      !(
        file.mimetype.includes("image/png") ||
        file.mimetype.includes("image/jpg") ||
        file.mimetype.includes("image/jpeg")
      )
    ) {
      cb(new Error("Mauvais format de fichier"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router
  .route("/")

  /// Allows to get all pictures, active or not, as an admin, including their categories///

  .get((req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (!err && decode.isAdmin && decode.isAdmin === true) {
        models.photo
          .findAndCountAll({
            include: [
              {
                model: models.category
              }
            ]
          })
          .then(photo => {
            console.log(photo);

            res.status(200).send(photo);
          });
      } else {
        res.sendStatus(403);
      }
    });
  })

  /// Allows to post a new photo as an admin ///

  .post(upload.single("photo"), (req, res) => {
    console.log(req.file);

    const token = getToken(req);
    const photo = {
      ...req.body,
      path: req.file.location
    };

    jwt.verify(token, jwtSecret, (err, decode) => {
      if (
        !err &&
        req.file.location &&
        decode.isAdmin &&
        decode.isAdmin === true
      ) {
        models.photo.create(photo).then(pix => {
          models.category
            .findAll({
              where: {
                id: {
                  [op.or]: req.body.categories.split(",")
                }
              }
            })
            .then(categories => {
              console.log(categories, pix);

              pix
                .setCategories(categories)
                .then(() => res.status(200).send("ok"));
            });
        });
      } else {
        res.sendStatus(403);
      }
    });
  });

/// Allows to remove active status to a photo as an admin ///

router.delete("/:id", (req, res) => {
  const token = getToken(req);
  jwt.verify(token, jwtSecret, (err, decode) => {
    if (!err && decode.isAdmin && decode.isAdmin === true) {
      models.photo
        .update(
          {
            isActive: false
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
