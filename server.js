const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersCtrl = require("./routes/users");
const cookieParser = require("cookie-parser");
const productsCtrl = require("./routes/products");
const cartCtrl = require("./routes/carts");
const { verifyToken } = require("./middlewares/auth");
const { verifyTokenAdmin } = require("./middlewares/auth");
const { managePortal, login } = require("./controllers/portalController");
require("dotenv/config");

const server = express();

// Middlewares
server.use(
  cors({
    origin: [
      "http://localhost:4001",
      "http://localhost:4200",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    preflightContinue: "false",
  })
);
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Define routes
server.use(express.static("public"));
server.use("/api/users", usersCtrl);
server.use("/api/products", productsCtrl);
server.use("/api/cart", cartCtrl);
server.get("/jwt", verifyToken, (req, res) => {
  res.status(200).json(res.locals.user);
});
server.get("/jwtadmin", verifyTokenAdmin, (req, res) => {
  res.status(200).json(res.locals.admin);
});
server.use("/api/portal", managePortal);
server.post("/api/adminlogin", login);

// Connect to mongodb
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log("successfully connected to database");
});

// start server on port=4000
server.listen(4000, () => {
  console.log("Server started on http://localhost:4000");
});
