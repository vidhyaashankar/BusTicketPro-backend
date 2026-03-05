import db from "../config/db";
import { User } from "../models/User";

export const userRepository = {
  findByEmail: (email: string): User | undefined => {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
  },

  findById: (id: number): User | undefined => {
    return db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(id) as User | undefined;
  },

  create: (name: string, email: string, passwordHash: string): number => {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(name, email, passwordHash);
    return result.lastInsertRowid as number;
  }
};
