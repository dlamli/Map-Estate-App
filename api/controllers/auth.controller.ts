import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from "../lib/prisma.ts";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating user",
    })
  }
};
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) return res.status(401).json({
      message: 'Invalid credentials',
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET_KEY, { expiresIn: age })

    const { password: userPassword, ...userInfo } = user;

    return res.cookie("token", token, {
      httpOnly: true,
      maxAge: age,
      // secure: true
    }).status(200).json({
      userInfo
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error login user",
    })
  }

};
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({
    message: "Logout successfully",
  })
};
