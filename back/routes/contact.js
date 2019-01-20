const express = require("express");
const router = express.Router();
const sendEmail = require("../helpers/sendEmail");
const contact = require("../helpers/emailTemplate/contact");

router.get("/", (req, res) => {
  sendEmail(contact(req.body.email, req.body.subject, req.body.text));
  res.sendStatus(200);
});

module.exports = router;
