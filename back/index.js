const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const models = require("./models");
const routerAuth = require("./routes/auth");
const routerPhoto = require("./routes/photos");
const routerCategory = require("./routes/categories");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/auth", routerAuth);
app.use("/photo", routerPhoto);
app.use("/category", routerCategory);

models.sequelize
  .sync()
  .then(() =>
    app.listen(port, console.log(`server listening on port ${port}`))
  );
