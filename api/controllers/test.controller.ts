import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const shouldBeLoggedIn = async (req: Request, res: Response) => {
  // const { userId } = req;

  res.status(200).json({ message: 'Authorized' });
};
export const shouldBeAdmin = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(401).json({ message: 'Token expired' });

    if (!payload.isAdmin) return res.status(401).json({ message: 'Unauthorized' });

    return res.status(200).json({ message: 'Authorized' });
  });
};  