import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { authService } from "../services/authService";
import { validatePassword } from "../validators/passwordValidator";
import { responseHelper } from "../helpers/responseHelper";

export const authController = {
  register: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return responseHelper.error(res, "Missing required fields", 400);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return responseHelper.error(res, passwordValidation.error!, 400);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { token, userId } = await authService.register(name, email, hashedPassword);
      
      responseHelper.success(res, { 
        token, 
        user: { id: userId, name, email, role: 'USER' } 
      }, 201);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return responseHelper.error(res, "Email already exists", 409);
      }
      responseHelper.error(res, "Internal server error", 500);
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return responseHelper.error(res, "Missing required fields", 400);
    }

    try {
      const { token, user } = await authService.login(email, password);
      
      responseHelper.success(res, { 
        token, 
        user: { id: user.id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (error) {
      console.error("Login error:", error);
      responseHelper.error(res, "Internal server error", 500);
    }
  },

  me: async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return responseHelper.error(res, "No token provided", 401);

    const token = authHeader.split(" ")[1];
    try {
      const decoded = authService.verifyToken(token);
      const user = authService.getUserById(decoded.id);
      if (!user) return responseHelper.error(res, "User not found", 404);
      responseHelper.success(res, user);
    } catch (error) {
      responseHelper.error(res, "Invalid token", 401);
    }
  }
};
