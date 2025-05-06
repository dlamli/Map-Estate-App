import { Request, Response } from "express"
import bcrypt from 'bcrypt';

import prisma from "../lib/prisma.ts";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json(
      {
        message: "Error getting users"
      }
    )
  }
}
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return res.status(404).json(
      {
        message: "User not found"
      }
    )

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(
      {
        message: "Error getting user"
      }
    )
  }
}
export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tokenUserId = req.userId;
  const { password, avatar, ...body } = req.body;

  if (id !== tokenUserId) return res.status(403).json({ message: "Unauthorized" });

  let updatedPassword = null;

  try {
    if (password) {
      const salt = 10;
      updatedPassword = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...body,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      }
    });

    const { password: userPassword, ...userWithoutPassword } = updatedUser;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json(
      {
        message: "Error updating user"
      }
    )
  }
}
export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) return res.status(403).json({ message: "Unauthorized" });

  try {
    await prisma.user.delete({ where: { id } });

    res.status(200).json(
      {
        message: "User deleted successfully"
      }
    )
  } catch (error) {
    console.log(error);
    res.status(500).json(
      {
        message: "Error deleting user"
      }
    )
  }
}
