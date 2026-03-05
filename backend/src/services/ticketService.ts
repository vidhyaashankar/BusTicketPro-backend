import { ticketRepository } from "../repositories/ticketRepository";
import { Ticket } from "../models/Ticket";

export const ticketService = {
  bookTicket: (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt'>) => {
    const ticketId = ticketRepository.create(ticketData);
    return { id: ticketId, status: "BOOKED" };
  },

  getAllTickets: (userId?: number) => {
    return ticketRepository.findAll(userId);
  },

  getTicketsByRoute: (route: string, userId?: number) => {
    return ticketRepository.findByRoute(route, userId);
  },

  cancelTicket: (id: number, userId: number, role: string) => {
    const ticket = ticketRepository.findById(id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (role !== 'ADMIN' && ticket.userId !== userId) {
      throw new Error("You can only cancel your own tickets");
    }

    if (ticket.status !== 'BOOKED') {
      throw new Error("Only BOOKED tickets can be cancelled");
    }

    ticketRepository.updateStatus(id, 'CANCELLED');
    return { message: "Ticket cancelled successfully" };
  },

  getStatistics: (userId?: number) => {
    const stats = ticketRepository.getStats(userId);
    return {
      totalRevenue: stats.totalRevenue || 0,
      totalTickets: stats.totalTickets || 0,
      activeTickets: stats.activeTickets || 0,
      cancelledTickets: stats.cancelledTickets || 0,
      completedTickets: stats.completedTickets || 0
    };
  }
};
