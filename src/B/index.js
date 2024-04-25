const express = require("express");
const app = express();
const mongoose = require(`mongoose`);
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
var nodemailer = require("nodemailer");
const https = require("https");
const FtpClient = require("basic-ftp");
const stream = require("stream");
const DOANHTHU = require("./model/doanhthu");
const schedule = require("node-schedule");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const socketIO = require("socket.io");
dotenv.config();
const morgan = require("morgan");
morgan("common");
const sql = require("mssql");
const cors = require("cors");
const Staff = require("./model/staff");

const router = express.Router();
const {
  getStatechinhanhValue,
  uploadCloud,
} = require("./middleware/uploadimg");
// Hàm để tạo và thêm dữ liệu doanh thu vào MongoDB
const converToName = {
  ST00: "PTT",
  ST01: "D2",
  ST02: "CRM",
  ST03: "VHM",
  ST04: "CN",
  ST05: "EMT",
  ST06: "GGM",
  ST07: "BHD",
  ST08: "LT",
  ST09: "HVP",
  ST10: "RY",
  ST11: "IPH",
  // Thêm các ánh xạ khác nếu cầ
};
// const privateKey = fs.readFileSync("server.key", "utf8");
// const certificate = fs.readFileSync("server.cert", "utf8");
// const credentials = { key: privateKey, cert: certificate };

// const httpsServer = https.createServer(credentials, app);
const addDoanhThuData = async (storeID) => {
  try {
    // Tạo một đối tượng Date hiện tại
    const currentDate = new Date();

    // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const milliseconds = currentDate
      .getMilliseconds()
      .toString()
      .padStart(3, "0");

    // Tạo chuỗi datetime
    const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    const dateString = `${year}${month}${day}`;
    const newDoanhThu = new DOANHTHU({
      id: "DT-" + dateString + "-" + converToName[storeID],
      sotien: 0, // your amount calculation logic here,
      storeID,
      sotienThucte: 0,
      ListOfCreditors: [],
      Listdebtors: [], // your array of debtor IDs logic here,
      thoidiem: datetimeString,
      status: "OK",
    });

    await newDoanhThu.save();
    console.log(`Doanh Thu data added successfully for storeID: ${storeID}`);
  } catch (error) {
    console.error(`Error adding Doanh Thu data for storeID ${storeID}:`, error);
  }
};
// Lên lịch công việc chạy mỗi ngày lúc 00:01 giờ sáng
const job = schedule.scheduleJob("1 0 * * *", async () => {
  for (let i = 0; i <= 11; i++) {
    const storeID = `ST${i.toString().padStart(2, "0")}`;
    await addDoanhThuData(storeID);
  }
});

const RouterAuth = require("./Router/Auth");
const RouterStaff = require("./Router/Staff");
const RouterBranch = require("./Router/Branch");
const RouterAccess = require("./Router/access");
const RouterProduct = require("./Router/Product");
const RouterStore = require("./Router/Store");
const RouterPhieuStore = require("./Router/Phieustore");
const RouterOrders = require("./Router/Order");
const RouterBills = require("./Router/Bill");
const RouterDebtor = require("./Router/Debtor");
const RouterDoanhthu = require("./Router/Doanhthu");
const RouterNotifi = require("./Router/notifications");
const RouterProductp = require("./Router/ProductP");
const RouterTimekeeping = require("./Router/Timekeep");
const RouterStaffOff = require("./Router/StaffOff");
const { ok } = require("assert");
// const RouterPost = require("./Router/Post");
// const RouterMap = require("./Router/Map");
// const RouterColumns = require("./Router/columns");
// const RouterColumnOrder = require("./Router/columOrder");
const portRealtime = process.env.PORT || 3003;
app.use(bodyparser.json({ limit: "50mb" }));
const io = socketIO(
  app.listen(portRealtime, () => {
    console.log(`Sever Port realtime is running port ${portRealtime}`);
  })
);

io.on("connection", (socket) => {
  // Lắng nghe sự kiện khi client thay đổi nội dung
  socket.on("changeContent", (newContent) => {
    // Gửi thông báo đến tất cả client về sự thay đổi

    io.emit("updateContent", newContent);
  });
});
app.use(cors());
const ConnectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.Url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB has connect");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
ConnectDB();

app.use("/Auth", RouterAuth);
app.use("/Staff", RouterStaff);
app.use("/Branch", RouterBranch);
app.use("/checkaccess", RouterAccess);
app.use("/product", RouterProduct);
app.use("/store", RouterStore);
app.use("/phieustore", RouterPhieuStore);
app.use("/order", RouterOrders);
app.use("/bills", RouterBills);
app.use("/debtors", RouterDebtor);
app.use("/doanhthu", RouterDoanhthu);
app.use("/notifi", RouterNotifi);
app.use("/productp", RouterProductp);
app.use("/timekeep", RouterTimekeeping);
app.use("/staffoff", RouterStaffOff);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // * cho phép truy cập từ tất cả các nguồn
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post(
  "/uploadtest",
  getStatechinhanhValue,
  uploadCloud.single("file"),
  async (req, res) => {
    const filedata = req.file;
    console.log("filedata " + filedata);
    if (!req.file) {
      res.json("NOT OK");
      // next(new Error("No file uploaded!"));
      return;
    }

    res.json("ok");
  }
);
// app.post("/uploadtest", uploadCloud.single("file"), (req, res, next) => {
//   // console.log("req " + req.file);
//   // if (!req.file) {
//   //   next(new Error("No file uploaded!"));
//   //   return;
//   // }

//   // res.json({ secure_url: req.file });
//   res.json("ok")
// });

app.get("/", (req, res) => {
  res.send("Hello World! back end ");
});
const config = {
  user: "sa",
  password: "0902824971Aa-",
  server: "115.79.193.90",
  database: "WiseEyeMix3",
  port: 1433, // Thay đổi cổng tại đây
  options: {
    encrypt: true,
    trustServerCertificate: true, // Thiết lập trustServerCertificate thành true
  },
};

app.post("/api/search", async (req, res) => {
  try {
    // Kết nối đến cơ sở dữ liệu
    const { dateF, dateT } = req.body;

    // Kiểm tra nếu param1 và param2 tồn tại
    if (!dateF || !dateT) {
      return res.status(400).json({ error: "Tham số không hợp lệ" });
    }

    const convertedStartDate = new Date(dateF).toISOString().slice(0, 10);
    const convertedEndDate = new Date(dateT).toISOString().slice(0, 10);

    await sql.connect(config);

    // Thực hiện truy vấn SQL với các tham số đã được chuyển đổi
    const result =
      await sql.query(`SELECT A.UserEnrollNumber, TimeStr, TimeDate, UserEnrollName 
                                    FROM CheckInOut A 
                                    INNER JOIN UserInfo B ON A.UserEnrollNumber = B.UserEnrollNumber 
                                    WHERE TimeDate BETWEEN '${convertedStartDate}' AND '${convertedEndDate}'`);

    // Trả về dữ liệu dưới dạng JSON
    res.json(result.recordset);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Đóng kết nối sau khi hoàn thành
    await sql.close();
  }
});

// Tạo API endpoint GET để lấy dữ liệu từ bảng abc
app.get("/api/sql", async (req, res) => {
  try {
    // Kết nối đến cơ sở dữ liệu
    await sql.connect(config);

    // Thực hiện truy vấn SQL để lấy dữ liệu từ bảng abc
    const result = await sql.query(
      "SELECT A.UserEnrollNumber , TimeStr, TimeDate , UserEnrollName FROM CheckInOut A INNER JOIN UserInfo B ON A.UserEnrollNumber = B.UserEnrollNumber;"
    );

    // Trả về dữ liệu dưới dạng JSON
    res.json(result.recordset);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Đóng kết nối sau khi hoàn thành
    await sql.close();
  }
});

// // Đường dẫn lưu trữ hình ảnh

// // Cấu hình Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // Xử lý yêu cầu POST đến /api/upload
// app.post("/api/upload", upload.single("image"), (req, res) => {
//   const uploadedImagePath = path.join(uploadDir, req.file.filename);
//   console.log("Image uploaded:", uploadedImagePath);
//   res.json({ message: "Image uploaded successfully" });
// });

const storage = multer.memoryStorage(); // Lưu trữ hình ảnh trong bộ nhớ

const upload = multer({ storage: storage });

const getUniqueFilename = (basePath, mchinhanh, originalFilename) => {
  let filename = originalFilename;
  let counter = 1;

  // Kiểm tra sự tồn tại của tệp tin trong thư mục
  while (fs.existsSync(`${basePath}/${mchinhanh}/${filename}`)) {
    // Nếu tồn tại, thêm chữ "C" vào đầu tên tệp tin
    filename = `C${originalFilename}`;
    counter++;

    // Nếu tên tệp tin có thêm số thứ tự, thêm số vào cuối
    if (counter > 1) {
      filename = `C${counter}${originalFilename}`;
    }
  }

  return filename;
};

app.post("/Image/", upload.single("image"), (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    console.log("imageBuffer " + imageBuffer);
    // Lưu trữ hình ảnh vào bất kỳ nơi nào bạn muốn, ví dụ: MongoDB, file system, ...
    // Ở đây tôi giả sử bạn lưu vào thư mục 'uploads' với tên là 'uploadedImage.png'
    // Bạn cần xác định phương thức lưu trữ dựa trên yêu cầu của bạn.
    const imageName = req.body.name; // Lấy giá trị name từ yêu cầu
    const mchinhanh = req.body.chinhanh;
    // Ví dụ lưu trữ trong thư mục uploads

    fs.writeFileSync("uploads/uploadedImage.png", imageBuffer);

    res.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
function generateRandomString() {
  // Hàm để tạo số ngẫu nhiên trong khoảng từ min đến max (bao gồm cả max)
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Hàm để tạo một ký tự chữ cái ngẫu nhiên
  const getRandomLetter = () => String.fromCharCode(getRandomNumber(65, 90)); // Từ A đến Z

  // Tạo chuỗi gồm 2 chữ cái và 8 số ngẫu nhiên
  const randomString =
    getRandomLetter() +
    getRandomLetter() +
    getRandomNumber(10000000, 99999999).toString();

  return randomString;
}

app.post("/api/checkname", async (req, res) => {
  try {
    const { filename, type, machinhanh } = req.body;

    // Kết nối đến máy chủ FTP
    const client = new FtpClient.Client();
    client.ftp.verbose = true;
    await client.access({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      secure: false, // Nếu máy chủ sử dụng FTPS, đặt giá trị true
    });
    try {
      await client.cd("qtht");
      await client.cd(type);
      await client.cd(machinhanh);
      const fileListing = await client.list();
      let namefile = filename;
      let fileExists = false;
      while (!fileExists) {
        // Kiểm tra xem tên tệp cần kiểm tra có trong danh sách không
        const check = fileListing.some((file) => file.name === namefile);
        if (check) {
          namefile = generateRandomString() + ".png";
        } else {
          fileExists = true;
        }
      }
      if (fileExists) {
        res.status(200).json(namefile);
      }
    } catch (error) {
      console.log("lỗi 1 " + error);
    }
  } catch (error) {
    console.log("_lỗi");
  }
});

app.post("/api/upload", async (req, res) => {
  try {
    const { filename, content, type, machinhanh } = req.body;
    // Chuyển đổi base64 thành buffer

    // Kết nối đến máy chủ FTP
    const client = new FtpClient.Client();
    client.ftp.verbose = true;
    await client.access({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      secure: false, // Nếu máy chủ sử dụng FTPS, đặt giá trị true
    });

    try {
      await client.cd("qtht");
      await client.cd(type);
      await client.cd(machinhanh);
      const base64Buffer = Buffer.from(
        content.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      // Tạo ReadableStream từ buffer
      const readableStream = new stream.PassThrough();
      readableStream.end(base64Buffer);

      await client.uploadFrom(readableStream, filename);
    } catch (error) {
      console.log("lỗi " + error);
    }
    console.log("File uploaded successfully");

    // Đóng kết nối
    client.close();

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Sever is running port ${port}`);
});
