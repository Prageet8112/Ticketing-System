const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const TicketController = require('../controllers/ticketController');

router.get('/closed_status/:busNumber',TicketController.tickets_get_all_closed_tickets);
router.get('/open_status/:busNumber',TicketController.tickets_get_all_open_tickets);
router.get('/:ticketId',TicketController.tickets_get_ticket_details);
router.post('/', TicketController.tickets_create_ticket);
router.delete('/',checkAuth,TicketController.tickets_update_status_of_ticket);
router.patch('/ALL_OPEN/:busId',checkAuth,TicketController.tickets_open_all_tickets_of_bus);

module.exports = router;