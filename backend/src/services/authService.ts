import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authService = {
  register: async (name: string, email: string, passwordHash: string) => {
    const userId = userRepository.create(name, email, passwordHash);
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });
    return { token, userId };
  },

  login: async (email: string, password?: string) => {
    let user = userRepository.findByEmail(email);
    
    // If user doesn't exist, create a dummy one for now as requested
    if (!user) {
      const dummyName = email.split('@')[0];
      const hashedPassword = await bcrypt.hash(password || "dummy-pass", 10);
      const userId = userRepository.create(dummyName, email, hashedPassword);
      user = { id: userId, name: dummyName, email, role: 'USER' };
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    return { token, user };
  },

  verifyToken: (token: string) => {
    return jwt.verify(token, JWT_SECRET) as any;
  },

  getUserById: (id: number) => {
    return userRepository.findById(id);
  }
};
