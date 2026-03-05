import { Router } from "express";
import { ticketController } from "../controller/ticketController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/book", ticketController.bookTicket);
router.get("/all", ticketController.getAllTickets);
router.get("/byRoute", ticketController.getTicketsByRoute);
router.put("/cancel/:id", ticketController.cancelTicket);
router.get("/statistics", ticketController.getStatistics);

export default router;
