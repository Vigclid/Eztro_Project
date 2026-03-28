require("dotenv").config();

import express from "express";
import errorHandler from "./src/middlewares/errorHandlers";
import router from "./src/routes/index.routes";
import { notFoundEndpointsHandler } from "./src/middlewares/notFoundEndpointsHandlers";
import cors from "cors";
import loggerMiddleware from "./src/middlewares/loggerMiddleware";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db";
import http from "http";
import { initSocketGateway } from "./src/core/socket/socket.gateway";

const app = express();
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ limit: "4mb", extended: true }));
app.use(cookieParser());
// CORS
const isProduction = process.env.NODE_ENV === "production";
const clientOrigin = isProduction ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;
// Support multiple dev origins for mobile app and web app
const allowedOrigins = [
  clientOrigin, 
  "http://localhost:3000",  // Mobile app web version
  "http://localhost:5173",  // Vite web app
  "https://h5.zdn.vn"
].filter(Boolean) as string[];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
// const httpsOptions = {
//   key: fs.readFileSync(path.join(__dirname, "./bin/key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "./bin/cert.pem")),
// };

// Dùng logger để log HTTP request vào winston
app.use(loggerMiddleware);

// DB Connectors
connectDB();

//ROUTE
app.use("/", router);

// Middlewares
app.use(notFoundEndpointsHandler);
app.use(errorHandler);
// PORT and Starting Server
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
// WEBSOCKET
initSocketGateway(server);
server.listen(PORT, () => {});
// https.createServer(httpsOptions, app).listen(PORT, () => {
//   console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
// });