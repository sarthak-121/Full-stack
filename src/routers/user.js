const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const auth = require("../middleware/auth");
const transport = require("../services/mail-transport");
const router = new express.Router();

const publicDirectoryPath = path.join(__dirname, "../../public/image");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicDirectoryPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString());
  },
});

const upload = multer({ storage: storage });

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const body = {
    username,
    email,
    password: bcrypt.hash(password, 12),
  };
  try {
    const user = new User(req.body);
    await User.init();
    await User.findEmail(email);
    await User.findUserName(username);
    await user.save();
    const access_token = jwt.sign(user._id.toJSON(), process.env.SECERET_TOKEN);
    res.status(201).send({ success: true, data: user, token: access_token });
  } catch (e) {
    res.status(400).send({ error: true, message: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCridentials(
      req.body.email,
      req.body.password
    );
    const access_token = jwt.sign(user._id.toJSON(), process.env.SECERET_TOKEN);
    res.send({ success: true, data: user, token: access_token });
  } catch (e) {
    res.status(400).send({ error: true, message: e.message });
  }
});

router.get("/forgot-password/:email", async (req, res) => {
  try {
    await User.findIfEmail(req.params.email);

    const tokenData = {
      email: req.params.email,
    };
    const token = jwt.sign(tokenData, process.env.SECERET_TOKEN, {
      expiresIn: "10m",
    });

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: req.params.email,
      subject: "Account Recovery",
      text: `To reset password click ${process.env.FRONT_END_DOMAIN}change-password/${token} .This link is valid for only 10 mins.`,
    };

    transport.sendMail(mailOptions, async (err, info) => {
      if (err) {
        res.status(400).send({
          error: true,
          message: err.message || "Could not send email, Try again.",
        });
      } else {
        console.log(info);
        res.send({ success: true, message: "Recovery link sent on mail" });
      }
    });
  } catch (e) {
    res.status(400).send({ error: true, message: e.message });
  }
});

router.post("/change-pass", async (req, res) => {
  const { password, token } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  console.log(hashedPassword);

  try {
    jwt.verify(token, process.env.SECERET_TOKEN, async (err, data) => {
      if (err) {
        res.status(400).send({ eroor: true, message: "Not a valid token" });
      } else {
        User.changePassword(data.email, hashedPassword);

        res.send({ success: true, message: "Password changed" });
      }
    });
  } catch (e) {
    res.status(400).send({ error: true, message: e.message || "Server error" });
  }
});

router.get("/people", auth, async (req, res) => {
  try {
    const users = await User.getUsers();
    res.send(users);
  } catch (e) {
    res.send(500).send(e);
  }
});

router.post("/setRequest", auth, async (req, res) => {
  try {
    await User.setRequest(req.body.sender, req.body.reciever);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/getRequest", auth, async (req, res) => {
  try {
    const request = await User.getRequests(req.body.username);
    res.send(request);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/acceptedReq", auth, async (req, res) => {
  try {
    const room = await User.acceptedRequest(req.body.user, req.body.username);
    res.status(200).send({ room });
  } catch (e) {
    res.status(500).send();
  }
});

router.post(
  "/profile-picture",
  auth,
  upload.single("profile_pic"),
  async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    await User.addProfilePicute(req.body.username, req.file.filename);
    res.send({ success: true, filename: req.file.filename });
  }
);

router.get("/friend-profile-picture/:username", auth, async (req, res) => {
  try {
    const filename = await User.getProfilePicture(req.params.username);
    res.send({ success: true, filename });
  } catch (e) {
    res.status(400).send({ error: true, message: e.message });
  }
});

// test router
router.get("/getmedata/:data", async (req, res) => {
  try {
    await User.justATest(req.params.data);
    res.send({
      data: req.params.data,
      working: "ok",
      status: "All systems go",
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
