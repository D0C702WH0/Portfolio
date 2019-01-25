require("dotenv").config();

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const getFileExtension = require("./getFileExtension");
const s3Password = process.env.AWS_KEY;
const s3Id = process.env.AWS_ID;

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

module.exports = multer({
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
