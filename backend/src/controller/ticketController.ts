import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { ticketService } from "../services/ticketService";
import { responseHelper } from "../helpers/responseHelper";

export const ticketController = {
  bookTicket: (req: AuthRequest, res: Response) => {
    const { passengerName, route, seatNumber, departureTime, fare } = req.body;
    const userId = req.user?.id;

    if (!passengerName || !route || !seatNumber || !departureTime || fare === undefined) {
      return responseHelper.error(res, "Missing required fields", 400);
    }

    if (fare <= 0) {
      return responseHelper.error(res, "Fare must be a positive number", 400);
    }

    try {
      const result = ticketService.bookTicket({
        userId: userId!,
        passengerName,
        route,
        seatNumber,
        departureTime,
        fare
      });
      responseHelper.success(res, result, 201);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return responseHelper.error(res, "This seat is already booked for this route and time.", 409);
      }
      responseHelper.error(res, "Internal server error", 500);
    }
  },

  getAllTickets: (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    
    const tickets = ticketService.getAllTickets(role === 'ADMIN' ? undefined : userId);
    responseHelper.success(res, tickets);
  },

  getTicketsByRoute: (req: AuthRequest, res: Response) => {
    const { route } = req.query;
    const userId = req.user?.id;
    const role = req.user?.role;

    const tickets = ticketService.getTicketsByRoute(route as string, role === 'ADMIN' ? undefined : userId);
    responseHelper.success(res, tickets);
  },

  cancelTicket: (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    
    try {
      const result = ticketService.cancelTicket(Number(id), userId!, role!);
      responseHelper.success(res, result);
    } catch (error: any) {
      if (error.message === "Ticket not found") {
        return responseHelper.error(res, error.message, 404);
      }
      if (error.message === "You can only cancel your own tickets") {
        return responseHelper.error(res, error.message, 403);
      }
      if (error.message === "Only BOOKED tickets can be cancelled") {
        return responseHelper.error(res, error.message, 400);
      }
      responseHelper.error(res, "Internal server error", 500);
    }
  },

  getStatistics: (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    const stats = ticketService.getStatistics(role === 'ADMIN' ? undefined : userId);
    responseHelper.success(res, stats);
  }
};
