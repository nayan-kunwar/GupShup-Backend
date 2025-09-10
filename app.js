import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGINS.split(","),
    credentials: true,
  },
});

app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`
app.use(
  cors({
    origin:
      process.env.CORS_ORIGINS === "*"
        ? "*" // This might give CORS error for some origins due to credentials set to true
        : process.env.CORS_ORIGINS?.split(","), // For multiple cors origin for production. Refer https://github.com/hiteshchoudhary/apihub/blob/a846abd7a0795054f48c7eb3e71f3af36478fa96/.env.sample#L12C1-L12C12
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); //  url: http://localhost:4000/images/abc.png | public get stripped out
app.use(cookieParser());
app.use(morgan("dev"));

//Routes Imports
import userRouter from "./src/routes/user.routes.js";
import chatRouter from "./src/routes/chat.routes.js";
import messageRouter from "./src/routes/message.routes.js";
import { errorHandler } from "./src/middlewares/error.middlewares.js";
import { initializeSocketIO } from "./src/socket/index.js";

// Routes Definitions
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat-app/chats", chatRouter);
app.use("/api/v1/chat-app/messages", messageRouter);

initializeSocketIO(io);

// common error handling middleware
app.use(errorHandler); // no need to wrap controllers with asyncHandler here as it's already being done in the routes

export { httpServer };
