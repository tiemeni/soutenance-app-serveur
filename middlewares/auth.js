const jwt = require("jsonwebtoken");
const User = require('../models/User')

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, config.JWT_SECRET, async (err, data) => {
      if (err) {
        res.locals.user = null
        next()
      } else if (data) {
        const user = await User.findById(data.userId)
        if (user) {
          data = {
            id_user: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email_address: user.email_address,
                phone_number: user.phone_number,
                adresse: user.adresse,
          }
          res.locals.user = user
        } else {
          res.locals.user = null
        }
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
};

module.exports = verifyToken;