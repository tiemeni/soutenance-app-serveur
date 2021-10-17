const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: (userData) =>  {
        return jwt.sign({
            userId: userData._id,
            isAdmin: userData.isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        });
    }
}