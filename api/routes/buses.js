const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const BusController = require('../controllers/busController');

router.get('/',BusController.buses_get_all);
router.get('/:registrationNumber',BusController.buses_get_bus_by_id);
router.post('/',checkAuth , BusController.buses_add_new_bus);
router.delete('/:registrationNumber',checkAuth , BusController.buses_delete_bus);

module.exports = router;