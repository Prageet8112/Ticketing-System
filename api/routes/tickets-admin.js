const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const TicketController = require('../controllers/ticketController');

router.delete('/',checkAuth,TicketController.tickets_update_status_of_ticket);
router.patch('/ALL_OPEN/:busId',checkAuth,TicketController.tickets_open_all_tickets_of_bus);

module.exports = router;