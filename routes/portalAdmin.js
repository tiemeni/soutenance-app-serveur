const router = require('express').Router()
const portalController = require('../controllers/portalController')

router.get('/', portalController.managePortal)



module.exports = router