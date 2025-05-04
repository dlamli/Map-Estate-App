import "dotenv/config";
import express from "express";
import cookie from 'cookie-parser';

import postRoute from "./routes/post.route.ts";
import authRoute from "./routes/auth.route.ts";

const PORT = process.env.PORT || 8080;
const app = express();

// Middlewates
app.use(express.json());
app.use(cookie())

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}| http://localhost:${PORT}`);
});
