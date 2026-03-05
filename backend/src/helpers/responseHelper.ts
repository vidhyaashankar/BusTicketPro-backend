import { Response } from "express";

export const responseHelper = {
  success: (res: Response, data: any, status: number = 200) => {
    res.status(status).json(data);
  },

  error: (res: Response, message: string, status: number = 500) => {
    res.status(status).json({ error: message });
  }
};
