import { Request, Response } from "express"
import bcrypt from 'bcrypt';

import prisma from "../lib/prisma.ts";

export const getChats = async (req: Request, res: Response) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId]
        }
      }
    });


    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(
      {
        message: "Error getting chats"
      }
    )
  }
}
export const getChatById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id,
        userIDs: {
          hasSome: [tokenUserId],
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    await prisma.chat.update({
      where: {
        id
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        }
      }
    })

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
}
export const readChat = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id,
        userIDs: {
          hasSome: [tokenUserId],
        }
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        }
      }
    })
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
}

export const addChat = async (req: Request, res: Response) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId]
      }
    })

    res.status(200).json({ newChat });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
}
