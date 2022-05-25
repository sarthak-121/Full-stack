const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const auth = require("../middleware/auth");
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
  try {
    const user = new User(req.body);
    await User.init();
    await user.save();
    const access_token = jwt.sign(user._id, process.env.SECERET_TOKEN);
    res.status(201).send({ success: true, data: user, token: access_token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCridentials(
      req.body.email,
      req.body.password
    );
    const access_token = jwt.sign(user._id, process.env.SECERET_TOKEN);
    res.send({ success: true, data: user, token: access_token });
  } catch (e) {
    res.status(400).send({ error: true, message: e.message });
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
