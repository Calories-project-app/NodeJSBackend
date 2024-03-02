var createError = require("http-errors");
var express = require("express");
const ejs = require("ejs");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const config = require("./config/config");

initializeApp(config.firebaseConfig);

const app = express();
//route

const authRoutes = require("./routes/auth");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const foodHistoryRouter = require("./routes/food-history");
const waterTypeRouter = require("./routes/getWaterType");
const waterHistoryRouter = require("./routes/water-history");
const medalRoutes = require('./routes/medal');

mongoose.Promise = global.Promise;

mongoose
  .connect('mongodb+srv://admin:1234@cluster0.ohjbb2e.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log("Connect successfully"))
  .catch((err) => console.error(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", waterTypeRouter);
app.use("/food-history", foodHistoryRouter);
app.use("/water-history", waterHistoryRouter);
app.use('/medals', medalRoutes);
app.use("/get", waterTypeRouter);
app.use("/users", usersRouter);
app.use("/auth", authRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
