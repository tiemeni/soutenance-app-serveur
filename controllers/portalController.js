var path = require("path");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.managePortal = (req, res) => {
  try {
    res.sendFile(path.resolve("public/portal.html"));
  } catch (e) {
    console.log(e);
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email }, (err, data) => {
    if (data) {
      if (data.password === password) {
        const id = data._id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ feedback: true });
      } else {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(400).json({ feedback: "Mauvais mot de pass" });
      }
    } else {
      res
        .status(400)
        .json({ feedback: "Vous ne possedez pas les credentiels d'admin" });
    }
  });
};
