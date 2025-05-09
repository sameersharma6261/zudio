const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataRoutes = require("./routes/dataRoutes");
// const twilio = require("twilio");
const axios = require("axios");
const User = require("./models/data");
const http = require("http");
const socketIo = require("socket.io");


// load enviromental variables
require("dotenv").config();

// initialize express
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// import routes (after initializing app)
app.use(express.urlencoded({ extended: true }));



// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error: ", err));

  
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(express.json({ limit: "200mb" })); // Reduced size to prevent crashes
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// API route
app.use("/api", dataRoutes);

// Schema and Model
const InfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  token: { type: Number, required: true },
});

const Info = mongoose.model("Info", InfoSchema);

// Schema
const displaySchema = new mongoose.Schema({
  backgroundImage: String,
  phoenixText: String,
  pText: String,
  royalPassText: String,
});
const DisplayModel = mongoose.model("Display", displaySchema);


// Twilio Credentials
const otpStore = {};
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE;
// const client = twilio(accountSid, authToken);



const MTALKZ_API_KEY = process.env.MTALKZ_API_KEY;
const TEMPLATE_ID_OTP = process.env.MTALKZ_TEMPLATE_ID_OTP;
const TEMPLATE_ID_MSG = process.env.MTALKZ_TEMPLATE_ID_MSG;

// Routes
app.post("/api/information", async (req, res) => {
  console.log("Data received:", req.body);
  const { name, mobile, email, token } = req.body;
  try {
    const newInfo = new User({ name, mobile, email, token });
    await newInfo.save();
    console.log("Data saved successfully:", newInfo);
    res.status(201).json({ message: "Data saved successfully!", newInfo });
  } catch (err) {
    console.log("Error saving data:", err);
    res.status(500).json({ message: "Error saving data", error: err });
  }
});

// Countdown Schema
const CountdownSchema = new mongoose.Schema({
  startTime: Number,
  duration: Number,
});
const Countdown = mongoose.model("Countdown", CountdownSchema);

// Start Countdown API
app.post("/start-countdown", async (req, res) => {
  const { duration, phoneNumber } = req.body;
  const startTime = Date.now();

  try {
    await Countdown.deleteMany({});
    const newCountdown = new Countdown({ startTime, duration });
    await newCountdown.save();

    // Emit countdown start event
    io.emit("countdown-start", { startTime, duration });

    // Twilio SMS Notification
    const countdownLink = `${process.env.REACT_APP_API_BASE_URL}/countdown`;
    await client.messages.create({
      body: `Countdown started! Track live here: ${countdownLink}`,
      from: process.env.TWILIO_PHONE,
      to: phoneNumber,
    });

    res.json({ message: "Countdown started", startTime, duration });
  } catch (error) {
    console.error("Error starting countdown:", error);
    res.status(500).json({ message: "Error starting countdown", error });
  }
});

// Get Current Countdown
app.get("/get-countdown", async (req, res) => {
  try {
    const countdown = await Countdown.findOne();
    res.json(countdown);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countdown", error });
  }
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// // Send OTP
// app.post("/send-otp", async (req, res) => {
//   const { mobile } = req.body;
//   const otp = Math.floor(1000 + Math.random() * 9000);
//   otpStore[mobile] = otp;

//   try {
//     if(process.env.IS_OTP_SERVICE_AVAILABLE==="true"){
//     await client.messages.create({
//       body: `Your OTP is ${otp}`,
//       from: twilioPhone,
//       to: `+91${mobile}`,
//     });
//   }else{
//     console.log(`OTP for ${mobile} is ${otp}`);
//   }

//     res.json({ message: "OTP sent successfully",phone:mobile, success: true, otp });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Error sending OTP", details: error.message });
//   }
// });



// // Verify OTP
// app.post("/verify-otp", (req, res) => {
//   const { mobile, otp } = req.body;

//   if (!otpStore[mobile]) {
//     return res
//       .status(400)
//       .json({ error: "No OTP found for this mobile number" });
//   }

//   if (parseInt(otp) === otpStore[mobile]) {
//     delete otpStore[mobile];
//     return res.json({ success: true, message: "OTP verified successfully" });
//   } else {
//     return res.status(400).json({ error: "Invalid OTP, please try again" });
//   }
// });





app.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
  otpStore[mobile] = otp;

  try {
    const message = `Hello user, welcome to Tobuu! Your OTP for account verification is: ${otp}. Enter this code to complete the process`;
    const params = {
      apikey: process.env.MTALKZ_API_KEY,
      senderid: "TOBUU",
      number: mobile,
      tempid: process.env.MTALKZ_TEMPLATE_ID_OTP,
      message: message,
      format: "json",
    };

    const response = await axios.post(
      "https://msgn.mtalkz.com/api",
      params
      // null,
    );

    console.log("MTalkz Response:", response.data);

    res.json({
      success: true,
      message: "OTP sent successfully",
      otp, // Optional: for testing only; remove in production
    });
  } catch (error) {
    console.error("OTP Send Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to send OTP",
      details: error.message,
    });
  }
});



app.post("/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  if (!otpStore[mobile]) {
    return res.status(400).json({ error: "No OTP found for this number" });
  }

  if (parseInt(otp) === otpStore[mobile]) {
    delete otpStore[mobile];
    return res.json({ success: true, message: "OTP verified" });
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
});






// Retrieve Latest Token
app.get("/get-token", async (req, res) => {
  try {
    console.log("---------------------------------------");
    const now = new Date();
    const latestUser = await User.findOne({
      mobile: req.query.phone,
      updatedAt: { $gte: new Date(now.getTime() - 60 * 1000 * 5) },
    }).sort({ updatedAt: -1 });

    if (!latestUser) {
      return res.status(404).json({ message: "No token found" });
    }
    res.json({ token: latestUser.token });
  } catch (error) {
    console.error("Error fetching token:", error);
    res.status(500).json({ message: "Error fetching token", error });
  }
});









// // Send Message
// app.post("/send-message", async (req, res) => {
//   const { number } = req.body;

//   if (!number) {
//     return res.status(400).json({ error: "Number is required!" });
//   }

//   try {
//     const message = await client.messages.create({
//       // body: `🎉 Congratulations! your token number should be selected, now you can visit your counter, visit your countdown undertime  ${process.env.REACT_APP_API_BASE_URL}/countdown`,
//       body: `🎉 Congratulations! your token number should be selected, now you can visit your counter, visit your countdown undertime  ${process.env.REACT_APP_API_BASE_URL}/countdown`,
//       from: twilioPhone,
//       to: `+91${number}`,
//     });

//     res.json({
//       success: true,
//       message: "Message sent successfully!",
//       sid: message.sid,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ success: false, error: "Failed to send message." });
//   }
// });

app.post("/send-message", async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ error: "Number is required!" });
  }

  try {
    const params = {
      apikey: process.env.MTALKZ_API_KEY,
      senderid: "TOBUU",
      number,
      message: `Hello user, welcome to Tobuu! Your OTP for account verification is: https://zudio2.netlify.app/countdown. Enter this code to complete the process`,
      templateid: process.env.MTALKZ_TEMPLATE_ID_MSG,
      format: "json",
    };

    const response = await axios.post(
      "https://msgn.mtalkz.com/api",
      // null,
      params
    );

    res.json({
      success: true,
      message: "Message sent successfully!",
      mtalkz_response: response.data,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to send message." });
  }
});









// ✅ API to update or insert (fixing the duplicate route issue)
app.post("/api/display", async (req, res) => {
  try {
    let display = await DisplayModel.findOne();
    if (!display) {
      display = new DisplayModel(req.body);
    } else {
      Object.assign(display, req.body);
    }
    await display.save();
    res.status(200).json({ message: "Updated Successfully!", display });
  } catch (error) {
    console.error("Error updating:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ API to get saved data
app.get("/api/display", async (req, res) => {
  try {
    const data = await DisplayModel.findOne({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});



// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
