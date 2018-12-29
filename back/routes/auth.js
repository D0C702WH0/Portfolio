const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../secure/jwtSecret');
const router = express.Router();
const models = require('../models');

  
  router.post('/signin', (req, res) => {
    const { password, email } = req.body;
    models.admin.findOne({where : {
      email
    }}).then(admin => {
      if (admin) {
        bcrypt.compare(password, admin.password, (err, match) => {
          if (err || !match) res.sendStatus(403)
          else {
            const tokenInfo = {
              id: admin.id,
              pseudo : admin.name,
            };
            const token = jwt.sign(tokenInfo, jwtSecret);
            res.header("Access-Control-Expose-Headers", "x-access-token");
            res.set("x-access-token", token);
            res.status(200);
            res.send(admin);
          }
        });
      } else {
        res.sendStatus(404)
      }    
    })
  })



module.exports = router;