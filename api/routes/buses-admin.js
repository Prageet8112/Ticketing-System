const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const BusController = require('../controllers/busController');
const schemaValidator = require('../middleware/schema-validator');

const validateRequest = schemaValidator(true,'buses');

router.post('/add_bus',checkAuth , validateRequest, BusController.buses_add_new_bus);
router.delete('/delete_bus/:registrationNumber',checkAuth , BusController.buses_delete_bus);


module.exports = router;