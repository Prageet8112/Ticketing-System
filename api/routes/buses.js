const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const BusController = require('../controllers/busController');

router.get('/',checkAuth,BusController.buses_get_all);
router.get('/:busId',checkAuth,BusController.buses_get_bus_details);

module.exports = router;