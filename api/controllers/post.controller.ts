import { Request, Response } from "express";

export const getPost = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Post - Get",
  });
};
export const createPost = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Post - Post",
  });
};
export const updatePost = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Post - Put",
  });
};
export const deletePost = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Post - Delete",
  });
};
