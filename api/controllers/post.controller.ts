import { Request, Response } from "express";

import prisma from "../lib/prisma.ts";
import { create } from "domain";

export const getPost = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting posts",
    })
  }
};
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id }, include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
      }
    });

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting post by Id",
    })
  }
}

export const createPost = async (req: Request, res: Response) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail
        }
      },
    })
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating post",
    })
  }
};
export const updatePost = (req: Request, res: Response) => {
  try {

    res.status(200).json({
      message: "Post - Put",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating posts",
    })
  }
};
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await prisma.post.delete({ where: { id } });

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting posts",
    })
  }
};
