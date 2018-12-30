const express = require("express");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");
const jwtSecret = require("../secure/jwtSecret");
const router = express.Router();
const models = require("../models");
const getToken = require("../helpers/getToken");
const getFileExtension = require("../helpers/getFileExtension");

aws.config.update({
  secretAccessKey: "DOTENV",
  accessKeyId: "DOTENV"
});

var s3 = new aws.s3();

const storage = multerS3({
  s3: s3,
  bucket: "some-bucket",
  metadata: function(req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function(req, file, cb) {
    cb(null);
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
    fileSize: 3 * 1024 * 1024
  }
});

router.post("/", (req, res) => {
  const token = getToken(req);
  jwt.verify(token, jwtSecret, err => {
    if (!err) {
      // !!!!!AJOUTER AWS!!!!! //
      models.photo.create(req.body).then(photo => {
        res.status(201).send(photo);
      });
    } else {
      res.status(403);
    }
  });
});

module.exports = router;
