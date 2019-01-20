const express = require("express");
const router = express.Router();
const sendEmail = require("../helpers/sendEmail");
const contact = require("../helpers/emailTemplate/contact");

router.get("/", (req, res) => {
  sendEmail(contact(req.email, req.subject, req.text));
});

module.exports = router;
