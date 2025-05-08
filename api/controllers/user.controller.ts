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
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
}

export const profilePosts = async (req: Request, res: Response) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
}

export const savePost = async (req: Request, res: Response) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
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
