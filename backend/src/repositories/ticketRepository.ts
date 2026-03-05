import db from "../config/db";
import { Ticket } from "../models/Ticket";

export const ticketRepository = {
  create: (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt'>): number => {
    const { userId, passengerName, route, seatNumber, departureTime, fare } = ticketData;
    const stmt = db.prepare(`
      INSERT INTO tickets (userId, passengerName, route, seatNumber, departureTime, fare)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(userId, passengerName, route, seatNumber, departureTime, fare);
    return result.lastInsertRowid as number;
  },

  findAll: (userId?: number): Ticket[] => {
    if (userId !== undefined) {
      return db.prepare("SELECT * FROM tickets WHERE userId = ? ORDER BY createdAt DESC").all(userId) as Ticket[];
    }
    return db.prepare("SELECT * FROM tickets ORDER BY createdAt DESC").all() as Ticket[];
  },

  findByRoute: (route: string, userId?: number): Ticket[] => {
    if (userId !== undefined) {
      return db.prepare("SELECT * FROM tickets WHERE route = ? AND userId = ? ORDER BY createdAt DESC").all(route, userId) as Ticket[];
    }
    return db.prepare("SELECT * FROM tickets WHERE route = ? ORDER BY createdAt DESC").all(route) as Ticket[];
  },

  findById: (id: number): Ticket | undefined => {
    return db.prepare("SELECT * FROM tickets WHERE id = ?").get(id) as Ticket | undefined;
  },

  updateStatus: (id: number, status: Ticket['status']): void => {
    db.prepare("UPDATE tickets SET status = ? WHERE id = ?").run(status, id);
  },

  getStats: (userId?: number) => {
    let query;
    let params: any[] = [];

    if (userId === undefined) {
      query = `
        SELECT 
          SUM(CASE WHEN status != 'CANCELLED' THEN fare ELSE 0 END) as totalRevenue,
          COUNT(*) as totalTickets,
          SUM(CASE WHEN status = 'BOOKED' THEN 1 ELSE 0 END) as activeTickets,
          SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelledTickets,
          SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completedTickets
        FROM tickets
      `;
    } else {
      query = `
        SELECT 
          SUM(CASE WHEN status != 'CANCELLED' THEN fare ELSE 0 END) as totalRevenue,
          COUNT(*) as totalTickets,
          SUM(CASE WHEN status = 'BOOKED' THEN 1 ELSE 0 END) as activeTickets,
          SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelledTickets,
          SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completedTickets
        FROM tickets
        WHERE userId = ?
      `;
      params = [userId];
    }

    return db.prepare(query).get(...params) as any;
  }
};
