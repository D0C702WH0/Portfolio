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
const routerContact = require("./routes/contact");

app.use(
  cors({
    exposedHeaders: ["Content-Range", "X-Content-Range", "X-Total-Count"]
  })
);
// app.use((req, res, next) => {
//   res.header("Content-Range", "X-Total-Count");
//   next();
// });
app.use(bodyParser.urlencoded({ extended: true, limit:"100mb" }));
app.use(bodyParser.json({limit:"100mb"}));
app.use(morgan("dev"));

app.use("/auth", routerAuth);
app.use("/photo", routerPhoto);
app.use("/category", routerCategory);
app.use("/contact", routerContact);

models.sequelize
  .sync()
  .then(() =>
    app.listen(port, console.log(`server listening on port ${port}`))
  );
