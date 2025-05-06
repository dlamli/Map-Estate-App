import "dotenv/config";
import express from "express";
import cors from 'cors';
import cookie from 'cookie-parser';

import postRoute from "./routes/post.route.ts";
import authRoute from "./routes/auth.route.ts";
import testRoute from "./routes/test.route.ts";
import userRoute from "./routes/user.route.ts";

const PORT = process.env.PORT || 8080;
const app = express();
// Middlewates
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookie())

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/test", testRoute);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}| http://localhost:${PORT}`);
});
