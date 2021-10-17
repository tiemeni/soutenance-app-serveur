const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

const router = express.Router();

// Function declaration
const isValid = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

// Get all users stored in database
router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(201).json(allUsers);
    } catch (error) {
        return res.json({ Error: error });
    }
});

// Update informations about one user
router.patch('/:id_user', async (req, res) => {
    try {
        if (req.body.first_name != null) {
            const userFound = await User.updateOne({ _id: req.params.id_user }, {
                $set: {
                    first_name: req.body.first_name
                }
            });
            return res.status(201).json(userFound);
        } else {
            return res.status(400).json({ 'Error': 'Missings parameters' });
        }
    } catch (error) {
        return res.json({ 'Error': error });
    }
});

// Remove user
router.delete('/:id_user', async (req, res) => {
    try {
        const deleteUser = await User.deleteOne({ _id: req.params.id_user });
        return res.status(201).json(deleteUser);
    } catch (error) {
        return res.json({ error: error });
    }
});

// Register
router.post('/register', (req, res) => {
    var { first_name, last_name, email_address, password, phone_number, adresse } = req.body;

    // check if all required paramaters exists
    if (last_name == null || email_address == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
    }

    //Check if email is correct
    if (!isValid(email_address)) {
        return res.status(403).json({ error: 'Email is invalid' });
    }

    //check if user already exist in database
    User.findOne({ $or: [{ email_address: email_address }] })
        .then((userFound) => {
            if (!userFound) {
                // Create user
                bcrypt.hash(password, 5, (err, cryptedPass) => {
                    const newUser = User.create({
                        first_name: first_name,
                        first_name: first_name,
                        last_name: last_name,
                        email_address: email_address,
                        password: cryptedPass,
                        phone_number: phone_number,
                        adresse: adresse,
                    })
                        .then((newUser) => {
                            return res.status(201).json({
                                id_user: newUser._id,
                                last_name: newUser.last_name,
                            });
                        })
                        .catch((err) => {
                            return res.status(500).json({ 
                                'error': "Cannot add user",
                                Message: error
                            });
                        })
                })

            } else {
                return res.status(409).json({ 'err': "user's already exist" });
            }
        })
        .catch((err) => {
            return res.status(500).json({ 
                'error': 'Unable to verify user',
                Message: error
            });
        })

});

// Login
router.post('/login', (req, res) => {
    var { email_address, password } = req.body;

    // check if all parameters are provided
    if (email_address == null || password == null) {
        return res.status(400).json({ error: req.body });
    }

    //Check if email is correct
    if (!isValid(email_address)) {
        return res.status(403).json({ error: 'Email is invalid' });
    }

    //Search user in database
    User.findOne({ $or: [{ email_address: email_address }] })
        .then((userFound) => {
            if (userFound) {
                //Get it
                bcrypt.compare(password, userFound.password, (err, isMatch) => {
                    if (isMatch) {
                        // return user
                        return res.status(201).json({
                            id_user: userFound._id,
                            first_name: userFound.first_name,
                            last_name: userFound.last_name,
                            email_address: userFound.email_address,
                            phone_number: userFound.phone_number,
                            adresse: userFound.adresse,
                            token: generateToken(userFound)
                        });
                    } else {
                        return res.status(403).json({ error: "Invalid password" });
                    }
                })
            } else {
                return res.status(404).json({ error: "User doesn't exist in our database" });
            }
        })
        .catch((err) => {
            return res.status(500).json({ 
                error: "Unable to verify user",
                Message: err
            });
        })
});

module.exports = router;