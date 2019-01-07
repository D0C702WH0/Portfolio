require("dotenv").config();
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
        file.mimetype.includes("image/jpg")
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
  
  /// Allows to post a new photo ///

  .post(upload.single("photo"), (req, res) => {
  const token = getToken(req);
  jwt.verify(token, jwtSecret, (err, decode) => {

    if (!err && req.file && decode.isAdmin && decode.isAdmin === true) {
      models.photo
        .create(
          req.body.concat({
            path: req.files[0].location
          })
        )
        .then(photo => {
          res.status(201).send(photo);
        });
    } else {
      res.sendStatus(403);
    }
  });
});

module.exports = router;
