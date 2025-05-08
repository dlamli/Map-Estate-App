import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import prisma from "../lib/prisma.ts";

export const getPost = async (req: Request, res: Response) => {
  const { query } = req;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bathroom: Number(query.bathroom) || undefined,
        bedroom: Number(query.bedroom) || undefined,
        price: {
          gte: Number(query.minPrice) || 0,
          lte: Number(query.maxPrice) || 10000000,
        }
      }
    });

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
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
      }
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const token = req.cookies?.token;
    let isSaved = false;

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const saved = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: payload.id,
            postId: post.id
          }
        }
      });

      if (saved) {
        isSaved = true;
      }
    }

    return res.status(200).json({ ...post, isSaved });
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
