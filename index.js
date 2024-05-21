const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const socketIO = require("socket.io");

const app = express();
const router = express.Router();
const routes = require("./routes");

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

const uri = process.env.MONGO_CONNECTION_STRING;
const port = process.env.SERVER_PORT || 3000;
const host = process.env.HOST || "localhost";

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, referrer"
  );
  next();
});

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log("Tin nhắn từ client:", message);
    // Gửi tin nhắn lại cho tất cả các client
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    // console.log("Người dùng đã ngắt kết nối");
  });
});

// Middleware để gắn Socket.IO vào các yêu cầu
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Thiết lập các route
app.use(router);

// Khởi động server
server.listen(port, host, () => {
  console.log(`Server đang chạy tại http://${host}:${port}`);
  dbConnectionTest();
  routes(app);
});

// Hàm kiểm tra kết nối cơ sở dữ liệu
const dbConnectionTest = () => {
  console.log("Đang kiểm tra kết nối cơ sở dữ liệu...");
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Lỗi kết nối:"));
  db.once("open", () => {
    console.log("Kết nối cơ sở dữ liệu thành công");
    db.close;
    console.log("Đóng kết nối cơ sở dữ liệu!");
  });
};
