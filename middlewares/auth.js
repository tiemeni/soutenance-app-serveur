const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, config.JWT_SECRET, async (err, data) => {
      if (err) {
        res.locals.user = null;
        next();
      } else if (data) {
        const user = await User.findById(data.userId);
        if (user) {
          res.locals.user = user;
        } else {
          res.locals.user = null;
        }
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
const verifyTokenAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, config.JWT_SECRET, async (err, data) => {
      if (err) {
        res.locals.admin = null;
        next();
      } else if (data) {
        const admin = await Admin.findById(data.id);
        if (admin) {
          res.locals.admin = admin;
        } else {
          res.locals.admin = null;
        }
        next();
      }
    });
  } else {
    res.locals.admin = null;
    next();
  }
};

module.exports = { verifyToken, verifyTokenAdmin };
