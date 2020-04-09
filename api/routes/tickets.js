const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const TicketController = require('../controllers/ticketController');
const schemaValidator = require('../middleware/schema-validator');

const validateTicket = schemaValidator(true,'tickets');

router.post('/', checkAuth , validateTicket ,TicketController.tickets_create_ticket);
router.get('/closed_status/:busNumber',checkAuth, TicketController.tickets_get_all_closed_tickets);
router.get('/open_status/:busNumber',checkAuth , TicketController.tickets_get_all_open_tickets);
router.get('/:ticketId',checkAuth ,TicketController.tickets_get_ticket_details);

module.exports = router;