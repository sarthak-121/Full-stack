const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  sended: [String],
  recieved: [String],
  friends: [
    {
      name: { type: String },
      room: { type: String },
    },
  ],
  test: [String],
  profile_picture: {
    type: String,
  },
});

userSchema.statics.findByCridentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  if (user.password === password) {
    return user;
  } else {
    console.log("working");
    throw new Error("Unable to login");
  }
};

userSchema.statics.findEmail = async (email) => {
  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User exist with current email");
  }
};

userSchema.statics.findUserName = async (username) => {
  const user = await User.findOne({ username });

  if (user) {
    throw new Error("User exist with current username");
  }
};

userSchema.statics.getUsers = async () => {
  const users = await User.find({}, { username: 1, _id: 0 });
  const userArray = [];
  users.forEach((user) => {
    userArray.push(user.username);
  });

  return userArray;
};

userSchema.statics.setRequest = async (sender, reciever) => {
  try {
    await User.updateOne(
      { username: sender },
      { $addToSet: { sended: reciever } }
    );
    await User.updateOne(
      { username: reciever },
      { $addToSet: { recieved: sender } }
    );
  } catch (e) {
    throw new Error("Unable to send request");
  }
};

userSchema.statics.getRequests = async (username) => {
  try {
    const data = await User.findOne(
      { username },
      { sended: 1, recieved: 1, _id: 0 }
    );
    return data;
  } catch (e) {
    throw new Error("unable to fetch requests");
  }
};

userSchema.statics.acceptedRequest = async (user, username) => {
  const key = user.concat(username);
  const encodedRoom = crypto.createHash("sha1").update(key).digest("hex");

  try {
    await User.updateOne({ username }, { $pull: { recieved: user } });
    await User.updateOne(
      { username },
      { $addToSet: { friends: { name: user, room: encodedRoom } } }
    );

    await User.updateOne({ username: user }, { $pull: { sended: username } });
    await User.updateOne(
      { username: user },
      { $addToSet: { friends: { name: username, room: encodedRoom } } }
    );

    return encodedRoom;
  } catch (e) {
    throw new Error("server not working");
  }
};

userSchema.statics.addProfilePicute = async (username, filename) => {
  try {
    await User.updateOne({ username }, { $set: { profile_picture: filename } });
  } catch (e) {
    throw new Error({
      error: true,
      title: "Something went wrong",
      message: e.message,
    });
  }
};

userSchema.statics.getProfilePicture = async (username) => {
  try {
    const data = await User.findOne(
      { username },
      { profile_picture: 1, _id: 0 }
    );
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

userSchema.statics.justATest = async (data) => {
  await User.updateMany(
    {},
    {
      $addToSet: {
        test: data,
      },
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
